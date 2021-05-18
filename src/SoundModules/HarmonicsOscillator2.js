
import Output from "./io/Output";
import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import OscillatorOperator from "./operators/OscillatorOperator";
import Input from "./io/Input";

/**
 * @namespace SoundModules.HarmonicsOscillator2
 */

/** 
 * @typedef {Object} HarmonicsOscillator2Options
 * @property {number} [amplitude]
 * @property {number} [frequency]
 * @property {number} [harmonics]
 * @property {number} [falloff]
 * @property {number} [length]
 * @property {number} [distance]
 * @property {number} [phase]
 * @property {"sin"|"cos"|"ramp"|"noise"|"offset"} [shape]
 */

/**
 * @class HarmonicsOscillator2 
 * @extends Module
 */
class HarmonicsOscillator2 extends Module{
    /**
     * @param {HarmonicsOscillator2Options} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {
            amplitude:1,
            frequency:110,
            harmonics:5,
            falloff:1,
            length:1,
            distance:1,
            phase:0,
            shape:"sin",
        };
        Object.assign(settings, userSettings);
        let first = true;
        super(settings);

        /** @type {Array<OscillatorOperator>} */
        const operators = [];
        const falloffFunction = HarmonicsOscillator2.falloffFunction;

        this.inputs.frequency = new Input(this);
        this.inputs.distance = new Input(this);
        this.inputs.amplitude = new Input(this);

        const output = this.outputs.main = new Output(this);

        
        
        this.setFrequency = (to) => {
            return this.set({
                frequency: to
            });
        };

        this.setAmplitude = (to) => {
            return this.set({
                amplitude: to
            });
        };
        
        this.setShape = (to) => {
            try{
                //this one is just to get the error right away.
                //the shape is actually set in the recalculate to ensure
                //sync
                operators.map(o=>o.setShape(to));
                this.set({
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

        this.getHarmonicFrequencyMultiplier = (n,distance)=>{
            const {harmonics} = settings;
            return Math.pow(2,Math.round(n - harmonics / 2) * distance);
        }
        

        this.recalculate = async (recursion = 0) => {
            
            const lengthSamples = settings.length * sampleRate;
            output.cachedValues = new Float32Array(lengthSamples);
            while(operators.length < settings.harmonics){
                operators.push(new OscillatorOperator({sampleRate}));
            }

            operators.map((operator)=>{
                operator.setShape(settings.shape);
                operator.setPhase(settings.phase);
            });
            
            const [
                freqInputValues,
                distanceInputValues,
                ampInputValues,
            ] = await Promise.all([
                this.inputs.frequency.getValues(recursion),
                this.inputs.distance.getValues(recursion),
                this.inputs.amplitude.getValues(recursion),
            ]);
            
            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || 0) + settings.frequency;
                const distance = (distanceInputValues[a] || 0) + settings.distance;
                const amp = (ampInputValues[a] || 0) + settings.amplitude;
                const ampDividedHarmonics = amp/settings.harmonics;

                operators.map((operator,index)=>{
                    const fMult = this.getHarmonicFrequencyMultiplier(index,distance);
                    const falloff = falloffFunction(index / operators.length,settings.falloff);
                    output.cachedValues[a] += operator.calculateSample(
                        freq * fMult,
                        ampDividedHarmonics * falloff, 0
                    );
                });
            }
        };
    }
}

const twoPi = 2 * Math.PI;
/**
 * @param {number} index
 * number from 0 to 1 representing distance from the harmonic with highest volume
 */
HarmonicsOscillator2.falloffFunction = (index,ff) => {
    return (2 - Math.cos(ff * index * twoPi))/2;
}

export default HarmonicsOscillator2;