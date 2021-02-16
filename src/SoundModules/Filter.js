import Module from "./Module";
import {sampleRate} from "./vars";


//todo: find more interesting filters. Eg. https://www.musicdsp.org/en/latest/Filters/index.html
/**
 * @namespace SoundModules.Filter
 */
/** @typedef {"none"
 *      |"lp_boxcar"
 *      |"hp_boxcar"
 *      |"lp_moog"
 *      |"pinking"
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

function saturate1(val){
    if(val>1) val=1; 
    if(val<-1) val=-1;
    return val;
}

class base{
    constructor(){
        this.reset=()=>{}
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            return saturate?saturate1(sample):sample;
        }
    }
}

//just average, only takes sample into account
class lp_boxcar extends base{
    constructor(){
        super();
        let lastOutput = 0;

        this.reset=()=>{
            lastOutput=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            output*=gain;
            
            return saturate?saturate1(output):output;
        }
    }
}
//just average, only takes sample into account
class hp_boxcar extends base{
    constructor(){
        super();
        let lastOutput = 0;

        this.reset=()=>{
            lastOutput=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            output=(sample - output) * gain
            return saturate?saturate1(output):output;
        }
    }
}


//boxcar, but utilizing any amount of steps in series. 
//note the sample weighting function, which I decided arbitrarily. It could have been linear ramp.
//not working!
class lp_nboxcar extends base{
    constructor(){
        super();
        
        let lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
        let dc=0;

        this.reset=()=>{
            lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
            dc=0;
        }

        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency < 0) frequency=0;
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            let weightb = 1-weighta;

            let resoScaled = (reso / 10);
            
            let currentIn=sample + (1 - lastOutputs[order-1]) * resoScaled;

            for(let pole=0; pole<order; pole++){
                lastOutputs[pole] = currentIn * weighta + lastOutputs[pole] * weightb;
                currentIn = lastOutputs[pole];
            }
            let output=currentIn * gain;
            return saturate?saturate1(output):output;
        }
    }
}

class hp_nboxcar extends lp_boxcar{
    constructor(){
        super();
        let superCSample = this.calculateSample;
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let output = sample * gain - superCSample(sample,frequency,reso,gain,order,false);
            return saturate?saturate1(output):output;

        }
    }
}

//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
class pinking extends base{
    constructor(){
        super();

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        this.reset=()=>{
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let outSample=0;
            b0 = 0.99886 * b0 + sample * 0.0555179;
            if(order>1) b1 = 0.99332 * b1 + sample * 0.0750759;
            if(order>2) b2 = 0.96900 * b2 + sample * 0.1538520;
            if(order>3) b3 = 0.86650 * b3 + sample * 0.3104856;
            if(order>4) b4 = 0.55000 * b4 + sample * 0.5329522;
            if(order>5) b5 = -0.7616 * b5 - sample * 0.0168980;
            outSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + sample * 0.5362;
            outSample *= gain;
            b6 = sample * 0.115926;
            return saturate?saturate1(outSample):outSample;
        }
    }
}

//I havent checked that this is actually a comb filter
class comb extends base{
    constructor(){
        super();

        let delayBuf=[];
        
        this.reset=()=>{
            delayBuf=[];
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            reso *= 0.5;
            gain *= 0.5;
            frequency /= 4;

            let period = sampleRate/frequency;
            
            let delayedSample = 0;
            
            if(delayBuf.length>period){
                delayedSample = delayBuf.shift();
            }

            sample *= reso;
            sample += delayedSample * reso;
            delayBuf.push(sample);
            
            let outSample = sample * gain;
            return saturate?saturate1(outSample):outSample;
        }
    }
}

//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
//https://www.musicdsp.org/en/latest/Filters/26-lp_moog-vcf-variation-2.html#id2
//todo: frequency and gain are off.
class lp_moog extends base{
    constructor(){
        super();
        let msgcount = 0;
        let in1, in2, in3, in4, out1, out2, out3, out4
        in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
        
        this.reset=()=>{
            in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
            msgcount=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency<0) frequency=0;
            let f = (frequency / sampleRate) * 1.16;
            
            let af = 1-f;
            let sqf = f*f;

            let fb = gain * (1.0 - 0.15 * sqf);

            let outSample=0;
            sample -= out4 * fb;
            sample *= 0.35013 * (sqf)*(sqf);

            out1 = sample + 0.3 * in1 + af * out1; // Pole 1
            in1 = sample;
            out2 = out1 + 0.3 * in2 + af * out2; // Pole 2
            in2 = out1;
            out3 = out2 + 0.3 * in3 + af * out3; // Pole 3
            in3 = out2;
            out4 = out3 + 0.3 * in4 + af * out4; // Pole 4
            in4 = out3;

            outSample = out4;
            // if(msgcount<20){
            //     msgcount++
            //     console.log({
            //         in1, in2, in3, in4, out1, out2, out3, out4,
            //         sample,frequency,reso,gain,order,
            //         f,fb,outSample
            //     });
            // }else if(msgcount==20){
            //     msgcount++
            //     console.log("omitting the rest...");
            // }
            // if(isNaN(frequency)) throw new Error("frequency is NaN");
            // if(isNaN(gain)) throw new Error("gain is NaN");
            // if(isNaN(fb)) throw new Error("fb is NaN");
            // if(isNaN(sample)) throw new Error("sample is NaN");
            // if(isNaN(in1)) throw new Error("in1 is NaN");
            // if(isNaN(out1)) throw new Error("out1 is NaN "+in1);
            // if(isNaN(out2)) throw new Error("out2 is NaN");
            // if(isNaN(out3)) throw new Error("out3 is NaN");
            // if(isNaN(out4)) throw new Error("out4 is NaN");
            // if(isNaN(outSample)) throw new Error("outSample is NaN");

            return saturate?saturate1(outSample):outSample;
        }
    }
}

const filterProtos={
    none:base,
    lp_moog,
    lp_boxcar,
    lp_nboxcar,
    hp_boxcar,
    hp_nboxcar,
    comb,
    pinking
}




/** @type {FilterSettings} */
const defaultSettings={
    gain:1,
    reso:0.2,
    length:1,
    type:"lp_moog",
    order:1,
    frequency:100,
    saturate:false,
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
            const resos = this.inputs.reso.getValues();
            
            this.cachedValues = [];
            const inputValues=this.inputs.main.getValues();

            filter.reset();

            this.cachedValues = inputValues.map((inputValue,spl)=>filter.calculateSample(
                inputValue,
                voz(frequencies[spl]) + settings.frequency,
                voz(resos[spl]) + settings.reso,
                voz(gains[spl]) + settings.gain,
                order,settings.saturate
            ));
        
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Filter;