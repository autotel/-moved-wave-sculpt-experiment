import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import requireParameter from "../utils/requireParameter";

import Output from "./io/Output";
import Input from "./io/Input";
import createWorker from "../utils/createWorker";
/**
 * @namespace SoundModules.RustFreeverb
 */

/** 
 * @typedef {Object} RustFreeverbSettings
 * @property {number} [feedback]
 * 
 * @property {number} [dampening]
 * @property {boolean} [freeze]
 * @property {number} [wet]
 * @property {number} [width]
 * @property {number} [dry]
 * @property {number} [roomSize]
 * @property {number} [LROffset]
 */

/** @type {RustFreeverbSettings} */
const defaultSettings={
    dampening:1,
    freeze:false,
    wet:1,
    width:1,
    dry:1,
    roomSize:1,
    LROffset:1,
};
/**
 * @class RustFreeverb an example that utilizes Rust to process the audio
 * @extends Module
 */
class RustFreeverb extends Module{
    /**
     * @param {RustFreeverbSettings} userSettings
     */
    constructor(userSettings) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        /** @type {Worker|false} */
        let worker = false;

        this.inputs.main = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setFrequency = (to) => {
            return this.set({frequency:to});
        };
        this.setInverseDampening = (to) => {
            return this.set({dampening_inverse:to});
        };
        this.setDampening = (to) => {
            return this.set({dampening:to});
        };
        this.setFeedback = (to) => {
            return this.set({feedback:to});
        };

        const actualModulo = (a,m) => ((a%m)+m)%m;       

        this.recalculate = async(recursion = 0) => {
            console.log("rust freverb start recalculation");
            
            const inputValues = await this.inputs.main.getValues(recursion);
            console.log("rust freverb values received");
            
            return await new Promise((resolve,reject)=>{
                if(worker) {
                    worker.terminate();
                    worker=false;
                }
                
                worker = createWorker('./workers/rustFreeverb.js');

                worker.onmessage = ({ data }) => {

                    if(data.audioArray){

                        console.log("rust freeverb audio",data);
                        output.cachedValues=data.audioArray;
                        resolve(data.audioArray);
                        worker=false;
                    }
                    if(data.log){
                        console.log("rust worker log",data.log);
                    }
                };

                worker.postMessage({
                    settings:Object.assign({},settings),
                    sampleRate,
                    inputValues,
                });
            });

        };
    }
}

export default RustFreeverb;