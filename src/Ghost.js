import Module from "./SoundModules/Module";
import seedrandom from "seedrandom";
import LpBoxcar from "./SoundModules/operators/LpBoxcar";

const randomNumberGenerator=seedrandom("lhad");
//using lpf and seeded random, we can get smooth changing random number. 
const ContinuousRandomGenerator = function(){
    const lowPass = new LpBoxcar();
    lowPass.setSampleRate(1);
    lowPass.reset(randomNumberGenerator());
    this.get=()=>{
        return lowPass.calculateSample(
            randomNumberGenerator(),
            1/20,0,1,1,true
        );
    }
}

/**
 * @typedef {Object} Tweakable
 * @property {Module} module
 * @property {String} key
 * @property {number} min
 * @property {number} range
 * @property {ContinuousRandomGenerator} noiseGen low-passed noise generator
 */



class Ghost {
    constructor() {
        

        /**
         * @param {Module} module to changte
         * @param {string} settingKey what parameter to change
         * @param {number} minimum value
         * @param {number} maximum value
         * @example ghost.add(osc1,"frequency",90,480)
         */

        /** @type {Array<Tweakable>} */
        const changeableParameters = [];
        this.add = (module, settingKey,minimum,maximum) => {
            changeableParameters.push({
                module,
                key:settingKey,
                min:minimum,
                range:maximum-minimum,
                noiseGen:new ContinuousRandomGenerator(),
            });
        }
        
        this.generateRandom = () => {
            changeableParameters.forEach((changeable)=>{
                const normalValue = changeable.noiseGen.get();
                const mappedValue = normalValue * changeable.range + changeable.min;
                // console.log({
                //     normalValue,
                //     mappedValue,
                // });
                let setObj = {};
                setObj[changeable.key] = mappedValue;
                changeable.module.set(setObj);
            });
        }
    }
}
export default Ghost;