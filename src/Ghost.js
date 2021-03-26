import Module from "./SoundModules/Module";
import seedrandom from "seedrandom";
import LpBoxcar from "./SoundModules/operators/LpBoxcar";

const randomNumberGenerator=seedrandom("lhad");
//using lpf and seeded random, we can get smooth changing random number. 
const ContinuousRandomGenerator = function(){
    const lowPass = new LpBoxcar();
    lowPass.reset(randomNumberGenerator());
    this.get=()=>{
        return lowPass.calculateSample(
            randomNumberGenerator(),
            1/200,0,1,1,true
        );
    }
}

/**
 * @typedef {Array<number>} Range
 * @typedef {Object<string,Range>} LatentSpace
 */
/**
 * @typedef {Object} ModuleLatentSpace
 * @property {LatentSpace} ChangeableParameterList.latentSpace
 * @property {Module} ChangeableParameterList.module
 * @property {ContinuousRandomGenerator} ChangeableParameterList.rng
 */



class Ghost {
    constructor() {
        

        /**
         * @param {Module} module to changte
         * @param {LatentSpace} latentSpace what parameters to change and their ranges
         * @example ghost.add(osc1,{frequency:[90,480]})
         */

        /** @type {Array<ModuleLatentSpace>} */
        const changeableParameters = [];
        this.add = (module, latentSpace) => {
            const rng = new ContinuousRandomGenerator();
            changeableParameters.push({
                module,latentSpace,rng
            });
        }
        
        this.generateRandom = () => {
            changeableParameters.forEach((mls)=>{
                let settings = {}
                const rng = mls.rng;
                Object.keys(mls.latentSpace).forEach((key)=>{
                    /** @type {number} */
                    let settingRange = mls.latentSpace[key][1] - mls.latentSpace[key][0];
                    settings[key] = rng.get() * settingRange + mls.latentSpace[key][0]
                });
                mls.module.set(settings);
            });
        }
    }
}
export default Ghost;