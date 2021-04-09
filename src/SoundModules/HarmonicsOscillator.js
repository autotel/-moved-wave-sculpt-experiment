
import Output from "./io/Output";
import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import OscillatorOperator from "./operators/OscillatorOperator";
import voz from "../utils/valueOrZero";
import Input from "./io/Input";
import createWorker from "../utils/createWorker";

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
    mixCurve:1,
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
 * @property {number} [mixCurve]
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

        this.inputs.frequency = new Input(this);
        this.inputs.amplitude = new Input(this);
        this.inputs.bias = new Input(this);
        this.inputs.mixCurve = new Input(this);

        this.inputs.interval1 = new Input(this);
        this.inputs.interval2 = new Input(this);
        this.inputs.interval3 = new Input(this);
        this.inputs.interval4 = new Input(this);


        const output = this.outputs.main = new Output(this);


        this.setFrequency = (to) => {
            return this.set({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };

        this.setAmplitude = (to) => {
            return this.set({
                amplitude: to
            });
        };
        
        this.setShape = (to) => {
            return this.set({
                shape: to
            });
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
                mixCurveInputValues,

                interval1Values,
                interval2Values,
                interval3Values,
                interval4Values,
            ] = await Promise.all([
                this.inputs.frequency.getValues(recursion),
                this.inputs.amplitude.getValues(recursion),
                this.inputs.bias.getValues(recursion),
                this.inputs.mixCurve.getValues(recursion),

                this.inputs.interval1.getValues(recursion),
                this.inputs.interval2.getValues(recursion),
                this.inputs.interval3.getValues(recursion),
                this.inputs.interval4.getValues(recursion),
            ]);
                        
            
            return await new Promise((resolve,reject)=>{
                
                if(worker) {
                    worker.terminate();
                    worker=false;
                }

                worker = createWorker('./workers/harmonicsOscillator.js');
                
                worker.onmessage = ({ data }) => {

                    if(data.audioArray){
                        this.cachedValues=data.audioArray;
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
                    mixCurveInputValues,

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