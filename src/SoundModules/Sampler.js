import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import voz from "../utils/valueOrZero";
import Input from "./io/Input";
import Output from "./io/Output";
/**
 * @namespace SoundModules.Sampler
 */

const defaultSettings={
    amplitude:1,
    length:1,
    originalFrequency:1,
    frequency:1,
    startOffset:0,
    sample:new Float32Array(),
};

/** 
 * @typedef {Object} SamplerOptions
 * @property {number} [amplitude]
 * @property {number} [length]
 * @property {number} [originalFrequency]
 * @property {number} [frequency]
 * @property {number} [startOffset]
 * @property {Array<Float32Array>} [sample]
 */
/**
 * @class Sampler 
 * @extends Module
 */
class Sampler extends Module{
    /**
     * @param {SamplerOptions} userSettings
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

        const left = this.outputs.l = new Output(this);
        const right = this.outputs.r = new Output(this);


        /** @param {number} to */
        this.setOriginalFrequency = (to) => {
            return this.set({
                originalFrequency:to,
            });
        };

        /** @param {number} to */
        this.setFrequency = (to) => {
            return this.set({
                frequency: to,
            });
        };

        /** @param {number} to */
        this.setAmplitude = (to) => {
            return this.set({
                amplitude: to
            });
        };
        
        /** @param {Array<Float32Array>} to */
        this.setSample = (to) => {
            return this.set({
                sample: to,
            });
        };

        function calculateLength (frequency,originalFrequency,lengthSamples){
            return  (originalFrequency/frequency)
            * lengthSamples / sampleRate
        }
        this.onUpdate((changes)=>{
            if(changes.originalFrequency){
                // this.set({
                //     length:calculateLength(
                //         settings.frequency,
                //         changes.originalFrequency,
                //         settings.sample.length
                //     )
                // })
            }else if(changes.frequency!==undefined){
                // this.set({
                //     length:calculateLength(
                //         changes.frequency,
                //         settings.originalFrequency,
                //         settings.sample.length
                //     )
                // })
            }else if(changes.sample!==undefined){
                console.log("sample change");
                this.set({
                    length:calculateLength(
                        settings.frequency,
                        settings.originalFrequency,
                        changes.sample[0].length
                    )
                })
            }
        });

        const getSample = (floatIndex,channelNo=0)=>{
            if(!this.settings.sample[channelNo]) return 0;
            let integerPart = Math.floor(floatIndex);
            let floatPart = floatIndex - integerPart;
            let inverseFloatPart = 1-floatPart;
            let nextSample = voz(settings.sample[channelNo][integerPart+1]);
            let nowSample = voz(settings.sample[channelNo][integerPart]);
            return nowSample * inverseFloatPart + nextSample * floatPart;
        }


        this.recalculate = async (recursion = 0) => {
            const lengthSamples = Math.floor(settings.length * sampleRate);

            const [
                freqInputValues,
                ampInputValues,
            ] = await Promise.all([
                this.inputs.frequency.getValues(recursion),
                this.inputs.amplitude.getValues(recursion),
            ]);
            
            let lastFrequencyValue = 0;
            let lastAmpValue = 0;

            let samplePositionAccumulator = settings.startOffset * sampleRate;
            
            const maxLen = Math.max(0,lengthSamples);

            left.cachedValues = new Float32Array(maxLen);
            right.cachedValues = new Float32Array(maxLen);

            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || lastFrequencyValue) + settings.frequency;
                const amp = (ampInputValues[a] || lastAmpValue) + settings.amplitude;

                samplePositionAccumulator +=  freq / settings.originalFrequency;

                left.cachedValues[a] = getSample(samplePositionAccumulator,0) * amp;
                right.cachedValues[a] = getSample(samplePositionAccumulator,1) * amp;
            }
        };
    }
}

export default Sampler;