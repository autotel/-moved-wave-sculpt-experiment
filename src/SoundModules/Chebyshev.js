import Module from "./common/Module";
import Input from "./io/Input";
import Output from "./io/Output";

/**
 * @namespace SoundModules.Chebyshev
 */

/** 
 * @typedef {Object} ChebyshevSettings
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {0|1|2|3|4} [order]
 */

/** @type {ChebyshevSettings} */
const defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    order:3,
};
//TODO: only third order is producing anything useful
/**
 * @class Chebyshev 
 * @extends Module
 */
class Chebyshev extends Module{
    /**
     * @param {ChebyshevSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
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

        this.inputs.main = new Input(this);
        
        const output = this.outputs.main = new Output(this);

        this.setOrder = (to) => {
            return this.set({
                order: to
            });
        };

        this.recalculate = async (recursion = 0) => {
            const inputValues = await this.inputs.main.getValues(recursion);
            output.cachedValues = inputValues.map(orders[settings.order]);
        };
    }
}

export default Chebyshev;