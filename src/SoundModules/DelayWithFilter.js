import Module from "./Module";
import { sampleRate } from "./vars";
import BasicDelay from "./operators/BasicDelay";
import voz from "../utils/valueOrZero";

import Comb from "./operators/Comb"
import HpBoxcar from "./operators/HpBoxcar"
import HpNBoxcar from "./operators/HpNBoxcar"
import LpBoxcar from "./operators/LpBoxcar"
import LpNBoxcar from "./operators/LpNBoxcar"
import LpMoog from "./operators/LpMoog"
import Operator from "./operators/Operator"
import Pinking from "./operators/Pinking"
import saturate1 from "../utils/saturate1";

/**
 * @namespace SoundModules.DelayWithFilter
 */

/** @typedef {"none"
 *      |"LpBoxcar"
 *      |"HpBoxcar"
 *      |"LpMoog"
 *      |"Pinking"
 * } filterType */

/** 
 * @typedef {Object} FilterSettings
 * @property {number} [length]
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

const defaultSettings={
    feedback:0.5,
    time:0.2, //seconds
    dry:1,
    wet:0.5,
    gain:1,
    reso:0.2,
    length:1,
    type:"LpMoog",
    order:1,
    frequency:100,
    saturate:false,
};

/**
 * @class DelayWithFilter
 * @extends Module
 */
class DelayWithFilter extends Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);

        super(settings);

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");
        this.hasInput("frequency");
        this.hasInput("gain");
        this.hasInput("reso");


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

        let delayOperator = new BasicDelay();
        
        this.recalculate = async(recursion = 0) => {
            //filter setup
            let filter = new filterProtos[settings.type]();
            const order = settings.order;
            const frequencies = await this.inputs.frequency.getValues(recursion);
            const gains = await this.inputs.gain.getValues(recursion);
            const resos = await this.inputs.reso.getValues(recursion);
            const inputValues = await this.inputs.main.getValues(recursion);
            
            this.cachedValues = new Float32Array(inputValues.length);

            filter.reset();
            
            //delay setup
            delayOperator.reset();
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);
            
            inputValues.forEach((value,sampleNumber)=>{
                this.cachedValues[sampleNumber] = 0;
                
                let currentTimeLevel = Math.floor(
                    voz(timeLevels[sampleNumber]) * sampleRate + delayInSamples
                );

                value = filter.calculateSample(
                    value,
                    voz(frequencies[sampleNumber]) + settings.frequency,
                    voz(resos[sampleNumber]) + settings.reso,
                    voz(gains[sampleNumber]) + settings.gain,
                    order,settings.saturate
                );

                if(sampleNumber>currentTimeLevel){
                    let timeAgo=sampleNumber - currentTimeLevel;
                    value += (this.cachedValues[timeAgo])
                        * (settings.feedback + voz(feedbackLevels[sampleNumber]));
                    if(this.settings.saturate) value = saturate1(value);
                }

                this.cachedValues[sampleNumber]+=delayOperator.calculateSample(value,currentTimeLevel);
                
            });

            //mix dry and wet
            this.cachedValues.forEach((val,sampleNumber)=>{

                this.cachedValues[sampleNumber] = this.cachedValues[sampleNumber] * settings.wet 
                    + inputValues[sampleNumber] * settings.dry;
                
            });

            // this.changed({ cachedValues: this.cachedValues });
            //return this.cachedValues;
        };
    }
}

export default DelayWithFilter;