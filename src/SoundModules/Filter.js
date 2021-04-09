
import Output from "./io/Output";
import Module from "./common/Module";
import Comb from "./operators/Comb"
import HpBoxcar from "./operators/HpBoxcar"
import HpNBoxcar from "./operators/HpNBoxcar"
import LpBoxcar from "./operators/LpBoxcar"
import LpNBoxcar from "./operators/LpNBoxcar"
import LpMoog from "./operators/LpMoog"
import Operator from "./operators/Operator"
import Pinking from "./operators/Pinking"
import voz from "../utils/valueOrZero";
import Input from "./io/Input";

//todo: find more interesting filters. Eg. https://www.musicdsp.org/en/latest/Filters/index.html
/**
 * @namespace SoundModules.Filter
 */
/** @typedef {"none"
 *      |"LpBoxcar"
 *      |"HpBoxcar"
 *      |"LpMoog"
 *      |"Pinking"
 * } filterType */

/** 
 * @typedef {Object} FilterSettings
 * @property {number} [frequency]
 * @property {number} [gain]
 * @property {number} [reso]
 * @property {filterType} [type]
 * @property {0|1|2|3|4} [order]
 * @property {boolean} [saturate]
 */

/**
 * @typedef {Object} CommonFilterProperties
 * @property {number} frequency
 * @property {number} reso 
 * @property {number} gain 
 * @property {number} order 
*/


const filterProtos={
    none:Operator,
    LpMoog,
    LpBoxcar,
    LpNBoxcar,
    HpBoxcar,
    HpNBoxcar,
    Comb,
    Pinking
}




/** @type {FilterSettings} */
const defaultSettings={
    gain:1,
    reso:0.2,
    type:"LpMoog",
    order:1,
    frequency:100,
    saturate:false,
};


/**
 * @class Filter 
 * @extends Module
 */
class Filter extends Module{
    /**
     * @param {FilterSettings} userSettings
     */
    constructor(userSettings = {}) {

        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.inputs.main = new Input(this);
        this.inputs.frequency = new Input(this);
        this.inputs.gain = new Input(this);
        this.inputs.reso = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setOrder = (to) => {
            return this.set({
                order: to
            });
        };
        this.setFrequency = (to) => {
            return this.set({
                frequency: to
            });
        };
        /** @param {filterType} to */
        this.setType = (to) => {
            if(!filterProtos[to]){
                return Object.keys(filterProtos);
            }

            return this.set({
                type: to
            });
        };

        this.recalculate = async (recursion = 0) => {
            
            //create an interface for the filter
            let filter = new filterProtos[settings.type]();
            const order = settings.order;
            const frequencies = await this.inputs.frequency.getValues(recursion);
            const gains = await this.inputs.gain.getValues(recursion);
            const resos = await this.inputs.reso.getValues(recursion);
            const inputValues=await this.inputs.main.getValues(recursion);
            
            output.cachedValues = new Float32Array(inputValues.length);

            filter.reset();

            output.cachedValues = inputValues.map((inputValue,sampleNumber)=>filter.calculateSample(
                inputValue,
                voz(frequencies[sampleNumber]) + settings.frequency,
                voz(resos[sampleNumber]) + settings.reso,
                voz(gains[sampleNumber]) + settings.gain,
                order,settings.saturate
            ));

            //return output.cachedValues;
        };
    }
}

export default Filter;