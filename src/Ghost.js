import Module from "./SoundModules/common/Module";
var perlin = require('perlin-noise');

//using lpf and seeded random, we can get smooth changing random number. 
const ContinuousRandomGenerator = function(){
    const w = 480;
    const h = 480;
    let currentIndex = 0;
    let currentNoise = perlin.generatePerlinNoise(w, h);

    this.reSeed=(seed)=>{
        currentNoise = perlin.generatePerlinNoise(w, h);
    }
    this.get=()=>{
        // return currentNoise[currentIndex++];
        return Math.random();
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