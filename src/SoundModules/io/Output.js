
import { sampleRate, maxRecursion } from "../common/vars";
import Input from "./Input";
import Module from "../common/Module";
import Model from "../../dom-model-gui/Model";
import getMyNameInObject from "../../utils/getMyNameInObject";

/**
 * @callback OnAudioChangedCallback
 */
/**
 * @typedef {Object} OutputSettings
 */
class Output extends Model{
    /** 
     * @param {Module} ownerModule module from where I get the sound
     */ 
    constructor (ownerModule) {
        super({});

        this.owner=ownerModule;
        this.name;

        setTimeout(()=>{
            /** @type {string} */
            this.name = getMyNameInObject(this,ownerModule.outputs)||"";
            if(!this.name) throw new Error("Input not found in module's outputs object");
        },0);

        this.cachedValues = new Float32Array(0);

        /**
         * inputs to which I send sound
         * @type {Set<Input>} 
         */
        let myInputs = new Set();

        /**
         * @type {false|Promise<Float32Array>}
         */
        let currentPromise = false;

        /** @param {Input|Module} to */
        this.connectTo=(to)=>{
            if(to instanceof Input){
                myInputs.add(to);
                to.myConnectedOutput=this;
                ownerModule.changed({connections:true});
                return;
            }else if(to.inputs && to.inputs.main instanceof Input){
                this.connectTo(to.inputs.main);
                return;
            }
            throw new Error("you can only connect to Inputs or Modules");
        };

        /**
         * @callback ForEachConnectedInputCallback
         * @param {Input} connectedInput //input to which I am connected.
         */
        /**
         * @param {ForEachConnectedInputCallback} callback*/
        this.forEachConnectedInput=(callback)=>{
            myInputs.forEach(callback);
        }

        /** 
         * @function disconnect disconnect this module from an input node. The module will not cause effects in the other module's input any more.
         * @param {Input | false } input if not given, it will disconnect all the modules to which this module outputs
         */
        this.disconnect = (input = false) => {
            if(input){
                input.myConnectedOutput=false;
                myInputs.delete(input);
                this.changed({
                    connections:myInputs,
                });
            }else{
                if(!input){
                    console.warn(myInputs);
                    throw new Error("For some reason a value in MyInputs is of wrong type: "+myInputs);
                }
                myInputs.forEach((input)=>this.disconnect(input));
            }
        }

        this.isConnected=()=>myInputs.size>0;

        /** @returns {Promise<Float32Array>} */
        this.getValues = async (recursion) => {
            if (recursion > maxRecursion)
                throw (new Error("max recursion reached"));
            if (ownerModule.cacheStillValid) {
                return (this.cachedValues);
            }else{
                await ownerModule.requestRecalculation(recursion);
                return this.cachedValues;
            }
        };

        this.propagateCacheChanged = () => {
            this.forEachConnectedInput((input)=>{
                input.owner.cacheObsolete();
            });
        }

    }
}
export default Output;