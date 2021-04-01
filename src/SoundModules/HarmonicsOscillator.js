import Module from "./Module";
import {sampleRate} from "./vars";
import OscillatorOperator from "./operators/OscillatorOperator";

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
};

/** 
 * @typedef {Object} OscillatorOptions
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [phase]
 * @property {"sin"|"cos"|"ramp"|"noise"|"offset"} [shape]
 */
/**
 * @class HarmonicsOscillator 
 * @extends Module
 */
class HarmonicsOscillator extends Module{
    /**
     * @param {OscillatorOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        super(settings);

        let operator = new OscillatorOperator();

        this.hasInput("frequency");
        this.hasInput("amplitude");
        this.hasInput("bias");

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
                //this one is just to get the error right away.
                //the shape is actually set in the recalculate to ensure
                //sync
                operator.setShape(to);
                this.changed({
                    shape: to
                });
                this.cacheObsolete();
            }catch(e){
                throw e;
            }
            return this;
        };
        
        this.setPhase = (to) => {
            return this.set({
                phase: to
            });
        };
        
        this.recalculate = (recursion = 0) => {
            const lengthSamples = settings.length * sampleRate;
            this.cachedValues = new Float32Array(lengthSamples);

            operator.setShape(settings.shape);
            operator.setPhase(settings.phase);
            
            const freqInputValues = this.inputs.frequency.getValues(recursion);
            const ampInputValues = this.inputs.amplitude.getValues(recursion);
            const biasInputValues = this.inputs.bias.getValues(recursion);
            
            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || 0) + settings.frequency;
                const amp = (ampInputValues[a] || 0) + settings.amplitude;
                const bias = (biasInputValues[a] || 0) + settings.bias;
                this.cachedValues[a] = operator.calculateSample(freq, amp, bias);
            }

            // this.changed({ cachedValues: this.cachedValues });
            //return this.cachedValues;
        };
    }
}

export default HarmonicsOscillator;