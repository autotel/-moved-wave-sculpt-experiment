import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import Output from "./io/Output";
import Input from "./io/Input";

/**
 * @namespace SoundModules.VoltsPerOctaveToHertz
 */

/** 
 * @typedef {Object} VoltsPerOctaveToHertzSettings
 * @property {number} [center]
 * @property {number} [preamp]
 */

/** @type {VoltsPerOctaveToHertzSettings} */
const defaultSettings={
    preamp:1,
    center:80,
};
//TODO: only third order is producing anything useful
/**
 * @class VoltsPerOctaveToHertz 
 * @extends Module
 */
class VoltsPerOctaveToHertz extends Module{
    /**
     * @param {VoltsPerOctaveToHertzSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.inputs.main = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setPreamp = (to) => {
            return this.set({preamp:to});
        };
        this.setCenter = (to) => {
            return this.set({center:to});
        };

        const voltsPerOctaveToHertz = (v,center) => center * Math.pow(2,v);       

        this.recalculate = async(recursion = 0) => {
            const {
                preamp, center
            } = settings;
            
            //note: can be optimized parallelizing these, but it only
            //takes effect if is worker
            const inputValues = await this.inputs.main.getValues(recursion);

            output.cachedValues = inputValues.map((val)=>{
                const result = voltsPerOctaveToHertz(
                        ( val * preamp),
                        center
                    );
                return result;
            });
        };
    }
}

export default VoltsPerOctaveToHertz;