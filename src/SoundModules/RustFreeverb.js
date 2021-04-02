import Module from "./Module";
import {sampleRate} from "./vars";
import requireParameter from "../utils/requireParameter";

/**
 * @namespace SoundModules.RustFreeverb
 */

/** 
 * @typedef {Object} RustFreeverbSettings
 * @property {number} [frequency]
 * @property {number} [dampening_inverse]
 * @property {number} [dampening]
 * @property {number} [feedback]
 */

/** @type {RustFreeverbSettings} */
const defaultSettings={
    frequency:5,
    dampening_inverse:0.5,
    dampening:0.5,
    feedback:0.9,
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


        this.hasInput("main");

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
                
                worker = new Worker(new URL('./workers/rustFreeverb.js', import.meta.url));;

                worker.onmessage = ({ data }) => {
                    console.log("rust freeverb received",data);

                    if(data.audioArray){
                        this.cachedValues=data.audioArray;
                        this.changed({ cachedValues: this.cachedValues });
                        this.signalWorkReady();
                        resolve(data.audioArray);
                        worker=false;
                    }
                    if(data.log){
                        console.log(data.log);
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