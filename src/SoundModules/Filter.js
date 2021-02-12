import Module from "./Module";
import {sampleRate} from "./vars";

//todo: add these filters: https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
/**
 * @namespace SoundModules.Filter
 */
/** @typedef {"none"|"minimal"|"pinking"|"moog"} filterType */

/** 
 * @typedef {Object} FilterSettings
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [gain]
 * @property {number} [bandwidth]
 * @property {filterType} [type]
 * @property {0|1|2|3|4} [order]
 */

/**
 * @typedef {Object} CommonFilterProperties
 * @property {number} frequency
 * @property {number} bandwidth 
 * @property {number} gain 
 * @property {number} order 
*/

class base{
    constructor(){
        this.calculateSample=(sample,frequency,bandwidth,gain,order)=>{
            return sample;
        }
    }
}

//just average, only takes sample into account
class boxcar extends base{
    constructor(){
        super();
        let lastOutput = 0;
        this.calculateSample=(sample,frequency,bandwidth,gain,order)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            return output * gain;
        }
    }
}
//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
class pinking extends base{
    constructor(){
        super();

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        this.calculateSample=(sample,frequency,bandwidth,gain,order)=>{
            let outSample=0;
            b0 = 0.99886 * b0 + sample * 0.0555179;
            b1 = 0.99332 * b1 + sample * 0.0750759;
            b2 = 0.96900 * b2 + sample * 0.1538520;
            b3 = 0.86650 * b3 + sample * 0.3104856;
            b4 = 0.55000 * b4 + sample * 0.5329522;
            b5 = -0.7616 * b5 - sample * 0.0168980;
            outSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + sample * 0.5362;
            outSample *= gain;
            b6 = sample * 0.115926;
            return outSample;
        }
    }
}

//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
class moog extends base{
    constructor(){
        super();
        var in1, in2, in3, in4, out1, out2, out3, out4;
        in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
        this.calculateSample=(sample,frequency,bandwidth,gain,order)=>{
            let f = frequency * 1.16;
            let fb = gain * (1.0 - 0.15 * f * f);
            let outSample=0;
            sample -= out4 * fb;
            sample *= 0.35013 * (f*f)*(f*f);
            out1 = sample + 0.3 * in1 + (1 - f) * out1; // Pole 1
            in1 = sample;
            out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
            in2 = out1;
            out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
            in3 = out2;
            out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
            in4 = out3;
            outSample = out4;
        }
    }
}

const filterProtos={
    none:base,moog,boxcar,pinking
}




/** @type {FilterSettings} */
const defaultSettings={
    gain:1,
    bandwidth:0.2,
    length:1,
    type:"moog",
    order:1,
    frequency:100,
};

const voz=(val)=>val?val:0;

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
        
        let phaseAccumulator = 0;

        super(settings);

        this.hasInput("main");
        this.hasInput("frequency");
        this.hasInput("gain");
        this.hasInput("bandwidth");

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
        /** @param {filterType} */
        this.setType = (to) => {
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
            const frequencies = this.inputs.frequency.getValues();
            const gains = this.inputs.gain.getValues();
            const bandwidths = this.inputs.bandwidth.getValues();
            
            this.cachedValues = [];
            const inputValues=this.inputs.main.getValues();

            this.cachedValues = inputValues.map((inputValue,spl)=>filter.calculateSample(
                inputValue,
                voz(frequencies[spl]) + settings.frequency,
                voz(bandwidths[spl]) + settings.bandwidth,
                voz(gains[spl]) + settings.gain,
                order
            ));
        
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Filter;