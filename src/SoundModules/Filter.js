import Module from "./Module";

import Comb from "./operators/Comb"
import HpBoxcar from "./operators/HpBoxcar"
import HpNBoxcar from "./operators/HpNBoxcar"
import LpBoxcar from "./operators/LpBoxcar"
import LpNBoxcar from "./operators/LpNBoxcar"
import LpMoog from "./operators/LpMoog"
import Operator from "./operators/Operator"
import Pinking from "./operators/Pinking"
import voz from "../utils/valueOrZero";

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

        this.hasInput("main");
        this.hasInput("frequency");
        this.hasInput("gain");
        this.hasInput("reso");

        this.setOrder = (to) => {
            settings.order = to;
            this.changed({
                order: to
            });
            this.cacheObsolete();
            return this;
        };
        this.setFrequency = (to) => {
            settings.frequency = to;
            this.changed({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };
        /** @param {filterType} to */
        this.setType = (to) => {
            if(!filterProtos[to]){
                return Object.keys(filterProtos);
            }

            settings.type = to;
            this.changed({
                type: to
            });
            this.cacheObsolete();
            return this;
        };

        this.recalculate = (recursion = 0) => {
            
            //create an interface for the filter
            let filter = new filterProtos[settings.type]();
            const order = settings.order;
            const frequencies = this.inputs.frequency.getValues(recursion);
            const gains = this.inputs.gain.getValues(recursion);
            const resos = this.inputs.reso.getValues(recursion);
            const inputValues=this.inputs.main.getValues(recursion);
            
            this.cachedValues = new Float32Array(inputValues.length);

            filter.reset();

            this.cachedValues = inputValues.map((inputValue,sampleNumber)=>filter.calculateSample(
                inputValue,
                voz(frequencies[sampleNumber]) + settings.frequency,
                voz(resos[sampleNumber]) + settings.reso,
                voz(gains[sampleNumber]) + settings.gain,
                order,settings.saturate
            ));
        
            // this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Filter;