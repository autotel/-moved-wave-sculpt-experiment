import { sampleRate } from "../vars";


let rng=seedrandom();



import seedrandom from "seedrandom";
import Operator from "./Operator";

class OscillatorOperator extends Operator{



    constructor(){
        super();

        let phaseAccumulator = 0;
        const accumulatePhase = (frequency) => {
            phaseAccumulator += frequency / sampleRate;
            //for noise, lets us have always the same noise. Frequency will be the seed
            rng=seedrandom(frequency);
        };
        
        /** set phase and reset the oscillator state */
        this.setPhase = (phase) => {
            phaseAccumulator = phase;
        }

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
                return amplitude * bias;
            }, 
        };
        
        let currentOscFunction = shapes.sin;
        
        this.setShape = (to) => {
            if(shapes[to]){
                currentOscFunction=shapes[to];
            }else{
                throw new Error(
                    "could not set oscillator operator shape to "+to+"."
                    + " try either of these: "
                    + Object.keys(shapes).join(", ")
                );
            }
        }

        this.reset=()=>{}

        /**
         * calculate an individual sample
         * it has the side effect of accumulating phase by
         * increments of 1/samplerate.
         * 
         * @param {number} freq
         * @param {number} amp
         * @param {number} bias
         * */
        this.calculateSample=(freq,amp,bias)=>{
            return currentOscFunction(freq,amp,bias);
        }
    }
}

export default OscillatorOperator;