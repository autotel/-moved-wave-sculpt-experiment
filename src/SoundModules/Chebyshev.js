import Module from "./Module";
import {sampleRate} from "./vars";

/**
 * @namespace SoundModules.Chevyshev
 */

/** 
 * @typedef {Object} ChevyshevSettings
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {0|1|2|3|4} [order]
 */

/** @type {ChevyshevSettings} */
const defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    order:3,
};
/**
 * @class Chevyshev 
 * @extends Module
 */
class Chevyshev extends Module{
    /**
     * @param {ChevyshevSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        let phaseAccumulator = 0;

        //todo: lookup table
        //todo: auto nth order
        const orders=[
            (x)=>1,                                 //0
            (x)=>x,                                 //1
            (x)=>2 * Math.pow(x,2) - 1,             //2
            (x)=>4 * Math.pow(x,3) - 3 * x,         //3
            (x)=>8 * Math.pow(x,4) - 8 * x * x + 1, //4
        ];

        super(settings);

        this.hasInput("main");

        this.setOrder = (to) => {
            settings.order = to;
            this.changed({
                order: to
            });
            this.cacheObsolete();
            return this;
        };

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            //only one input, thus we need not to add or anything
            this.eachInput((input) => {
                const inputValues = input.getValues(recursion);
                this.cachedValues = inputValues.map(orders[settings.order]);
            });
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Chevyshev;