import Module from "./Module";
import {sampleRate} from "./vars";
import voz from "../utils/valueOrZero";
/**
 * @namespace SoundModules.Sampler
 */

const defaultSettings={
    amplitude:1,
    playRate:0,
    length:1,
    originalFrequency:440,
    playbackFrequency:440,
    sample:new Float32Array(),
};

/** 
 * @typedef {Object} SamplerOptions
 * @property {number} [amplitude]
 * @property {number} [playRate]
 * @property {number} [length]
 * @property {number} [originalFrequency]
 * @property {number} [frequency]
 * @property {Float32Array} [sample]
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

        this.hasInput("playRate");
        this.hasInput("frequency");
        this.hasInput("amplitude");

        function playrateToFrequency(playRate,originalFrequency){
            if(!playRate) return 0;
            return playRate * originalFrequency;
        }
        function frequencyToPlayrate(frequency,originalFrequency){
            if(!frequency) return 0;
            return frequency / originalFrequency;
        }

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
        this.setPlayRate = (to) => {
            return this.set({
                playRate: to,
            });
        };


        /** @param {number} to */
        this.setAmplitude = (to) => {
            return this.set({
                amplitude: to
            });
        };
        
        /** @param {Float32Array} to */
        this.setSample = (to) => {
            return this.set({
                sample: to,
            });
        };

        this.beforeUpdate((changes,settings)=>{
            console.log("beforeUpdate",changes);
            if(changes.originalFrequency!==undefined){
                changes.frequency=playrateToFrequency(settings.playRate,changes.originalFrequency)
            }else if(changes.frequency!==undefined){
                changes.playRate = frequencyToPlayrate(changes.frequency,settings.originalFrequency);
            }else if(changes.playRate!==undefined){
                changes.frequency = playrateToFrequency(changes.playRate,settings.originalFrequency);
            }
            if(changes.sample){
                changes.length = Math.floor(changes.sample.length / sampleRate);
            }
        });

        const getSample = (floatIndex)=>{
            let integerPart = Math.floor(floatIndex);
            let inversePart = 1-integerPart;
            let floatPart = floatIndex - integerPart;
            let nextSample = voz(this.settings.sample[integerPart+1]);
            let nowSample = this.settings.sample[integerPart];
            return nowSample;// * inversePart + nextSample * floatPart;
        }

        this.recalculate = async (recursion = 0) => {
            //TODO: antialiasing

            const lengthSamples = settings.sample.length;

            const [
                playRateInputValues,
                freqInputValues,
                ampInputValues,
            ] = await Promise.all([
                this.inputs.playRate.getValues(recursion),
                this.inputs.frequency.getValues(recursion),
                this.inputs.amplitude.getValues(recursion),
            ]);
            
            let lastFrequencyValue = 0;
            let lastPlayRateValue = 0;
            let lastAmpValue = 0;

            let samplePositionAccumulator = 0;

            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || lastFrequencyValue) + settings.frequency;
                const amp = (ampInputValues[a] || lastAmpValue) + settings.amplitude;
                let playRate = (playRateInputValues[a] || lastPlayRateValue) * settings.playRate;

                playRate *= frequencyToPlayrate(freq);

                samplePositionAccumulator += playRate;

                this.cachedValues[a] = getSample(samplePositionAccumulator);
            }
            return this.cachedValues;
        };
    }
}

export default Sampler;