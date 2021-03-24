import {maxRecursion} from "./vars";
import Model from "../scaffolding/Model";
import InputNode from "./InputNode";
import measureExec from "../utils/measureExec";

let count = 0;

/**
 * @namespace SoundModules
 */

/**
 * @class Module
 * @extends Model
 */
class Module extends Model{
    constructor(settings) {
        // Model.call(this, settings);
        super(settings);
        this.unique = count ++;
        this.name = this.constructor.name + "-" + this.unique;
        /** @type {Float32Array} */
        this.cachedValues = new Float32Array([0]);
        /** @type {Object<string, InputNode>} */
        this.inputs = {};
        /** @type {Set<InputNode>} */
        this.outputs = new Set();

        /**
         * @function hasInput defines an input for this module. This function is intended to be called only within a child's constructor. After an input has been created with this module, it will be possible for other modules to connect to this input, and for the module to get values from it.
         * @param inputName
         */
        this.hasInput = (inputName) => {
            this.inputs[inputName] = new InputNode(this);
        };
        /**
         * @callback eachInputCallback
         * @param {InputNode} input
         * @param {number} index
         * @param {string} name
         */
        /**
         * @function eachInput run a callback function for each of the InputNodes. This saves the trouble of iterating each input. This function is intended to be called only from within the recalculate function.
         * @param {eachInputCallback} callback
         */
        this.eachInput = (callback) => {
            Object.keys(this.inputs).forEach((inputName, index) => {
                const input = this.inputs[inputName];
                if (input.input)
                    callback(input, index, inputName);
            });
        };

        this.eachOutput = (callback) => {
            this.outputs.forEach(callback);
        }

        /** 
         * @function connectTo connect the output of this module to one input of another module. The module's produced samples will affect the inputNode's owner according to the module's recalculate function
         * @param {InputNode} inputNode */
        this.connectTo = (inputNode) => {
            if(!(inputNode && inputNode.isInputNode)) throw new Error("you can only connect to InputNodes");
            if(inputNode.input) inputNode.input=undefined;
            inputNode.input = this;
            this.outputs.add(inputNode);
            this.changed({
                outputs:this.outputs,
            });
        };
        /** 
         * @function disconnect disconnect this module from an input node. The module will not cause effects in the other module's input any more.
         * @param {InputNode | false } inputNode if not given, it will disconnect all the modules to which this module outputs
         */
        this.disconnect = (inputNode = false) => {
            if(inputNode){
                if (inputNode.input) {
                    inputNode.input=undefined;
                }
                this.outputs.delete(inputNode);
                this.changed({
                    outputs:this.outputs,
                });
            }else{
                this.eachOutput(this.disconnect);
            }
        };
        
        this.set=(changes = {})=>{
            Object.assign(this.settings,changes);
            this.changed(changes);
            this.cacheObsolete();
            return this;
        }

        let useCache = false;

        /**
         * Call this function to set the `useCache` flag to true, therefore indicating the module that it's samples cache needs no recalculation.
         * This function is probably not needed anywhere else than within `Module`'s source file.
         */
        this.useCache = () => {
            useCache = true;
            this.changed({ useCache });
        };
        /**
         * Call this function to set the `useCache` flag to false, therefore indicating the module that it's sample cache needs to be calculated again. If one parameter is changed in the module, for example, one might want to call this function.
         * Note that any module might trigger recalculation on any of it's input modules, when it requests their samples.
         * @param {boolean} calculate indicates whether to recalculate the cache right away. @default true
         */ 
        this.cacheObsolete = (calculate = true) => {
            useCache = false;
            this.changed({ useCache });
            if(calculate) this.getValues(0);
        };
        /**
         * used to get the values from the module, or to cause the module to recalculate its values.
         * @returns {Float32Array} the sound array, sample by sample.
         * The samples will get recalculated if it's useCache flag is set to true. Otherwise, this function will return the cached samples.
         * The user can also get the cached samples by simply getting the `cachedValues` property, in which case one might get outdated samples.
         */
        this.getValues = (recursion = 0) => {
            if (recursion > maxRecursion)
                throw new Error("max recursion reached");
            if (!useCache) {
                this.recalculate(recursion + 1);
                this.changed({ cachedValues: this.cachedValues });
                this.useCache();
                //if my cache changes, it means all my output modules need recalculation
                this.outputs.forEach((outputModule) => outputModule.cacheObsolete());
            }
            return this.cachedValues;
        };

        
        let measureCalculationTime = false;

        /** 
         * Calculate the output samples, filling the cachedValues property. This function is extended by each different Module with their own calculation function
         *  this.recalculate has to fill the this.cachedValues array
         */
        this.recalculate = (recursion = 0) => {
            this.cachedValues = new Float32Array([0]);
            this.changed({ cachedValues: this.cachedValues });
        };

        this.measureCalculationTime = () => {
            if(measureCalculationTime) return false;
            let originalRecalculateFn = this.recalculate;
            this.recalculate = (...p) => {
                let inter = measureExec(()=>originalRecalculateFn(...p));
                console.log(inter);
                return inter;
            }
        }

        /**
         * Trigger all the model change functions, so that any other object listening to this model's properties get the initial status of the module.
         */
        this.triggerInitialState = () => {
            this.getValues();
            this.changed({ useCache });
        };
    }
}
export default Module;