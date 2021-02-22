import Module from "./Module";
import {sampleRate} from "./vars";
import seedrandom from "seedrandom";

/**
 * @namespace SoundModules.Oscillator
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
 * @class Oscillator 
 * @extends Module
 */
class Oscillator extends Module{
    /**
     * @param {OscillatorOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        let phaseAccumulator = 0;
        const accumulatePhase = (frequency) => {
            phaseAccumulator += frequency / sampleRate;
        };
        
        let rng=seedrandom();

        const shapes = {
            sin: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.sin(phaseAccumulator * Math.PI * 2) * amplitude
                    + bias;
            },
            cos: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.cos(phaseAccumulator * Math.PI * 2) * amplitude
                    + bias;
            },
            ramp: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (phaseAccumulator % 1 - 0.5) * amplitude
                    + bias;
            },
            square: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (((phaseAccumulator % 1 ) > 0.5)?1:-1) * amplitude
                    + bias;
            },
            noise: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (rng() - 0.5) * amplitude
                    + bias;
            },
            offset: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return amplitude + bias;
            }, 
        };

        super(settings);

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
            settings.shape = to;
            this.changed({
                shape: to
            });
            this.cacheObsolete();
            return this;
        };
        
        this.setPhase = (to) => {
            return this.set({
                phase: to
            });
        };
        
        this.recalculate = (recursion = 0) => {
            phaseAccumulator = settings.phase;
            this.cachedValues=[];
            const lengthSamples = settings.length * sampleRate;
            if (!shapes[settings.shape])
            throw new Error(`
                Wave shape function named ${settings.shape}, does not exist. 
                Try: ${Object.keys(shapes).join()}
            `);
            
            const freqInputValues = this.inputs.frequency.getValues(recursion);
            const ampInputValues = this.inputs.amplitude.getValues(recursion);
            const biasInputValues = this.inputs.bias.getValues(recursion);
            
            //for noise, lets us have always the same noise. Frequency will be the seed
            rng=seedrandom(settings.frequency);

            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || 0) + settings.frequency;
                const amp = (ampInputValues[a] || 0) + settings.amplitude;
                const bias = (biasInputValues[a] || 0) + settings.bias;
                this.cachedValues[a] = shapes[settings.shape](freq, amp, bias);
            }

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Oscillator;