import Module from "./Module";
import {sampleRate} from "./vars";
import OscillatorOperator from "./operators/OscillatorOperator";
import voz from "../utils/valueOrZero";

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

        /** this needs revision */
        function frequencyGetter (n,order1val,order2val,order3val,order4val,baseFrequency){
            let order1 = baseFrequency + (n * order1val);
            let order2 = baseFrequency * (n * order2val);
            let order3 = Math.pow(baseFrequency,(n * order3val));
            let order4 = Math.pow((n * order4val),baseFrequency);
            return order1+order2+order3+order4;
        }

        let operators = [
            new OscillatorOperator(),
            new OscillatorOperator(),
            new OscillatorOperator(),
            new OscillatorOperator(),
            new OscillatorOperator(),
        ];

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
                //this one is just to get the error right away.
                //the shape is actually set in the recalculate to ensure
                //sync
                operators.forEach((op)=>op.setShape(to));
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
        
        this.recalculate = async(recursion = 0) => {
            const lengthSamples = settings.length * sampleRate;
            this.cachedValues = new Float32Array(lengthSamples);

            operators.forEach((op)=>op.setShape(settings.shape));
            operators.forEach((op)=>op.setPhase(settings.phase));


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
            
            for (let a = 0; a < lengthSamples; a++) {
                const freq = voz(freqInputValues[a]) + settings.frequency;
                const amp = voz(ampInputValues[a]) + settings.amplitude;
                const bias = voz(biasInputValues[a]) + settings.bias;
                
                const interval1 = voz(interval1Values[a]) + settings.interval1;
                const interval2 = voz(interval2Values[a]) + settings.interval2;
                const interval3 = voz(interval3Values[a]) + settings.interval3;
                const interval4 = voz(interval4Values[a]) + settings.interval4;

                const frequencies = operators.map(
                    (operator,operatorNumber)=>frequencyGetter(
                        operatorNumber,
                        interval1,
                        interval2,
                        interval3,
                        interval4,
                        freq
                    )
                );
    
                operators.forEach((operator,operatorNumber)=>{
                    //sinusoidal roloff, should be somehow customizable. also it needs revision
                    //after I can implement the workers I'd like to be able to mix each oscillator independently
                    const ampMultiplier = (Math.sin(Math.PI * operatorNumber / operators.length)+1) / 14.3;
                    this.cachedValues[a] += operator.calculateSample(
                        frequencies[operatorNumber], amp * ampMultiplier, bias
                    );
                });
            }

            // this.changed({ cachedValues: this.cachedValues });
            //return this.cachedValues;
        };
    }
}

export default HarmonicsOscillator;