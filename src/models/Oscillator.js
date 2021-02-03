import Module from "./Module";
import {sampleRate} from "./vars";

const defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    frequency:220,
    shape:"sin",
};

class Oscillator extends Module{
    /**
     * @param {{
     * amplitude?:number,
     * bias?:number,
     * length?:number,
     * frequency?:number,
     * shape?:"sin"|"cos"|"offset"
     * }} userSettings
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
        const shapes = {
            sin: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.sin(phaseAccumulator + Math.PI * 2) * amplitude
                    + bias;
            },
            cos: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.cos(phaseAccumulator + Math.PI * 2) * amplitude
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
            this.inputChanged();
        };
        this.setAmplitude = (to) => {
            settings.amplitude = to;
            this.changed({
                amplitude: to
            });
            this.inputChanged();
        };
        
        this.recalculate = (recursion = 0) => {
            phaseAccumulator = 0;
            const lengthSamples = settings.length * sampleRate;
            if (!shapes[settings.shape])
                throw new Error(`Wave shape function named ${settings.shape}, does not exist`);
            
            const freqInputValues = this.inputs.frequency.getValues();
            const ampInputValues = this.inputs.amplitude.getValues();
            const biasInputValues = this.inputs.bias.getValues();

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