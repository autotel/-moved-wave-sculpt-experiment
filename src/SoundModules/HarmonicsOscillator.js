import Module from "./Module";
import {sampleRate} from "./vars";
import OscillatorOperator from "./operators/OscillatorOperator";
import voz from "../utils/valueOrZero";

const workerUrl = "";

/**
 * @namespace SoundModules.HarmonicsOscillator
 */

const defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    frequency:2,
    phase:0,
    shape:"sin",
    interval1:0,
    interval2:0,
    interval3:0,
    interval4:0,
};

/** 
 * @typedef {Object} HarmonicsOscillatorOptions
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [phase]
 * @property {number} [interval1]
 * @property {number} [interval2]
 * @property {number} [interval3]
 * @property {number} [interval4]
 * @property {"sin"|"cos"|"ramp"|"noise"|"offset"} [shape]
 */
/**
 * @class HarmonicsOscillator 
 * @extends Module
 */
class HarmonicsOscillator extends Module{
    /**
     * @param {HarmonicsOscillatorOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        super(settings);

        this.hasInput("frequency");
        this.hasInput("amplitude");
        this.hasInput("bias");

        this.hasInput("interval1");
        this.hasInput("interval2");
        this.hasInput("interval3");
        this.hasInput("interval4");

        this.setFrequency = (to) => {
            settings.frequency = to;
            this.changed({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };

        this.setAmplitude = (to) => {
            settings.amplitude = to;
            this.changed({
                amplitude: to
            });
            this.cacheObsolete();
            return this;
        };
        
        this.setShape = (to) => {
            try{
                this.changed({
                    shape: to
                });
                this.cacheObsolete();
            }catch(e){
                throw e;
            }
            return this;
        };
        /** @type {Worker|false} */
        let worker = false;
        this.setPhase = (to) => {
            return this.set({
                phase: to
            });
        };
        this.recalculate = async(recursion = 0) => {
            const [
                freqInputValues,
                ampInputValues,
                biasInputValues,
                interval1Values,
                interval2Values,
                interval3Values,
                interval4Values,
            ] = await Promise.all([
                this.inputs.frequency.getValues(recursion),
                this.inputs.amplitude.getValues(recursion),
                this.inputs.bias.getValues(recursion),

                this.inputs.interval1.getValues(recursion),
                this.inputs.interval2.getValues(recursion),
                this.inputs.interval3.getValues(recursion),
                this.inputs.interval4.getValues(recursion),
            ]);
            
            console.log("post");
            this.signalWorkStarted();

            if(worker) {
                worker.terminate();
                worker=false;
            }


            worker = new Worker(new URL('./workers/harmonicsOscillator.js', import.meta.url));;
            


            return await new Promise((resolve,reject)=>{
                worker.onmessage = ({ data }) => {
                    console.log("received",data);

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
                    freqInputValues,
                    ampInputValues,
                    biasInputValues,
                    interval1Values,
                    interval2Values,
                    interval3Values,
                    interval4Values,
                });
            });



        };
    }
}

export default HarmonicsOscillator;