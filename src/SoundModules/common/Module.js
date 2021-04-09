import Model from "../../scaffolding/Model";
import measureExec from "../../utils/measureExec";
import promiseDebounce from "../../utils/promiseDebounceFunction";
import Lane from "../../DomInterfaces/components/Lane";
import Input from "../io/Input";
import Output from "../io/Output";

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

        /** @type {Object<string, Input>} */
        this.inputs = {};
        /** @type {Object<string, Output>} */
        this.outputs = {};
        
        /** @type {Set<Lane>} */
        this.interfaces=new Set();
        /** @returns {Lane|undefined} */
        this.getInterface = ()=>this.interfaces.values().next().value;
        
        /**
         * @callback eachInputCallback
         * @param {Input} input
         * @param {number} index
         * @param {string} name
         */
        /**
         * @function eachInput run a callback function for each of the InputNodes. This saves the trouble of iterating each input. This function is intended to be called only from within the recalculate function.
         * @param {eachInputCallback} callback
         * @returns {Array<Promise>|Array} 
         */
        this.eachInput = (callback) => {
            return Object.keys(this.inputs).map((inputName, index) => {
                const input = this.inputs[inputName];
                return callback(input, index, inputName);
            }).filter((v)=>v!==undefined);
        };

        /**
         * @callback eachOutputCallback
         * @param {Output} output
         * @param {number} index
         * @param {string} name
         */
        /**
         * @function eachInput run a callback function for each of the InputNodes. This saves the trouble of iterating each input. This function is intended to be called only from within the recalculate function.
         * @param {eachOutputCallback} callback
         * @returns {Array<Promise>|Array} 
         */
        this.eachOutput = (callback) => {
            return Object.keys(this.outputs).map((inputName, index) => {
                const output = this.outputs[inputName];
                return callback(output, index, inputName);
            }).filter((v)=>v!==undefined);
        }
        
        this.getDefaultOutput = () => {
            const firstOutputName = Object.keys(this.outputs)[0];
            if(firstOutputName){
                return this.outputs[firstOutputName]
            }else{
                throw new Error("Could not get first output of tis module");
            }
        }
        
        /** 
         * @function connectTo connect the first output of this module
         * @param {Input} to */
        this.connectTo = (to) => {
            this.getDefaultOutput().connectTo(to);
        };

        /** 
         * @function disconnect disconnect this module from an input node. The module will not cause effects in the other module's input any more.
         * @param {Output | false } output if not given, it will disconnect all the modules to which this module outputs
         * @param {Input | false } fromInput if not given, it will disconnect all the modules to which this module outputs
         */
        this.disconnect = (output = false, fromInput=false) => {
            if(output){
                output.disconnect(fromInput);
            }else{
                this.eachOutput((output)=>{
                    if(!output){
                        console.warn(this.outputs);
                        throw new Error("For some reason an input is of wrong type: "+output);
                    }
                    this.disconnect(output)
                });
            }
        };

        this.cacheStillValid=false;
        
        this.cacheIsValid=()=>{
            this.cacheStillValid=true;
            this.changed({
                cacheStillValid:this.cacheStillValid
            });
        }

        this.cacheObsolete=()=>{
            this.cacheStillValid=false;
            this.changed({
                cacheStillValid:this.cacheStillValid
            });
            
            this.requestRecalculation();
        }

        const superSet = this.set;
        this.set=(changes = {})=>{
            superSet(changes);
            this.cacheObsolete();
            return this;
        }

        /** @param {number} recursion must be passed to any input's getValues call*/
        this.recalculate = async (recursion) => {}
        
        /**
         * used to get the values from the module, or to cause the module to recalculate its values.
         * @returns {Promise<Float32Array>} the sound array, sample by sample.
         * The samples will get recalculated if it's useCache flag is set to true. Otherwise, this function will return the cached samples.
         * The user can also get the cached samples by simply getting the `cachedValues` property from the output, in which case one might
         *  get outdated samples.
         */
        this.requestRecalculation = promiseDebounce(async(recursion = 0)=>{
            // console.log("RR",this.name,recursion);
            await this.recalculate(recursion + 1);
            this.cacheIsValid();
            //if my cache changes, it means all my output modules need recalculation
            this.eachOutput((output) => output.propagateCacheChanged());
        },2);

        
        let measureCalculationTime = false;

        /** 
         * Calculate the output samples, filling the cachedValues property om each pertinent Output
         * @param {number} recursion
         * @returns {Promise} the recalc result 
         */
        this.recalculate = async (recursion = 0) => {
        };

        this.measureCalculationTime = () => {
            if(measureCalculationTime) return false;
            let originalRecalculateFn = this.recalculate;
            this.recalculate = async(...p) => {
                let inter = measureExec(()=>originalRecalculateFn(...p));
                console.log(inter);
                return inter;
            }
        }

        /**
         * Trigger all the model change functions, so that any other object listening to this model's properties get the initial status of the module.
         */
        this.triggerInitialState = () => {
            this.cacheObsolete();
        };
    }
}
export default Module;