import Module from "./Module";
import {sampleRate} from "./vars";
const Fili = require('fili');


/**
 * @namespace SoundModules.Filter
 */
/** @typedef {"IIR.lowpass.butterworth" 
 *          | "IIR.highpass.butterworth"
 *          | "IIR.bandpass.butterworth"
 *          | "IIR.bandstop.butterworth"
 * } filterType */

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

/** @param {CommonFilterProperties} filterProperties */
function FilterInterface(filterProperties){
    this.calculateFunction=(samples)=>{
        return samples;
    }
}

/** @param {CommonFilterProperties} filterProperties */
function FiliFilterInterface(filterProperties){
    FilterInterface.call(this,filterProperties);
    //setup filter
    this.iirCalculator = new Fili.CalcCascades();
    // let availableFilters = this.iirCalculator.available();
    // console.log(availableFilters);
    /*  0: "fromPZ"
        1: "lowpassMZ"
        2: "lowpassBT"
        3: "highpassBT"
        4: "lowpass"
        5: "highpass"
        6: "allpass"
        7: "bandpassQ"
        8: "bandpass"
        9: "bandstop"
        10: "peak"
        11: "lowshelf"
        12: "highshelf"
        13: "aweighting"
*/
    
}

const filterProtos={
    IIR:{
        lowpass:{},
        highpass:{},
        bandpass:{},
        bandstop:{},
    },
    FIR:{
        lowpass:{},
        highpass:{},
        bandpass:{},
        bandstop:{},
    },
}

//todo: cover all the filters available in the library
/** @param {CommonFilterProperties} filterProperties */
filterProtos.IIR.lowpass.butterworth=function(filterProperties){
    FiliFilterInterface.call(this),filterProperties;
    var iirCalculator = new Fili.CalcCascades();
    var iirFilterCoeffs = iirCalculator.lowpass({
        order: filterProperties.order, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: sampleRate, // sampling frequency
        Fc: filterProperties.frequency, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: filterProperties.bandwidth, // bandwidth only for bandstop and bandpass filters - optional
        gain: filterProperties.gain, // gain for peak, lowshelf and highshelf
        preGain: false // adds one constant multiplication for highpass and lowpass
        // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    this.calculateFunction=(arr)=>iirFilter.multiStep(arr);
}

/** @param {CommonFilterProperties} filterProperties */
filterProtos.IIR.highpass.butterworth=function(filterProperties){
    FiliFilterInterface.call(this),filterProperties;
    var iirCalculator = new Fili.CalcCascades();
    var iirFilterCoeffs = iirCalculator.highpass({
        order: filterProperties.order, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: sampleRate, // sampling frequency
        Fc: filterProperties.frequency, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: filterProperties.bandwidth, // bandwidth only for bandstop and bandpass filters - optional
        gain: filterProperties.gain, // gain for peak, lowshelf and highshelf
        preGain: false // adds one constant multiplication for highpass and lowpass
        // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    this.calculateFunction=(arr)=>iirFilter.multiStep(arr);
}

/** @param {CommonFilterProperties} filterProperties */
filterProtos.IIR.bandpass.butterworth=function(filterProperties){
    FiliFilterInterface.call(this),filterProperties;
    var iirCalculator = new Fili.CalcCascades();
    var iirFilterCoeffs = iirCalculator.bandpass({
        order: filterProperties.order, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: sampleRate, // sampling frequency
        Fc: filterProperties.frequency, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: filterProperties.bandwidth, // bandwidth only for bandstop and bandpass filters - optional
        gain: filterProperties.gain, // gain for peak, lowshelf and highshelf
        preGain: false // adds one constant multiplication for highpass and lowpass
        // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    this.calculateFunction=(arr)=>iirFilter.multiStep(arr);
}
/** @param {CommonFilterProperties} filterProperties */
filterProtos.IIR.bandstop.butterworth=function(filterProperties){
    FiliFilterInterface.call(this),filterProperties;
    var iirCalculator = new Fili.CalcCascades();
    var iirFilterCoeffs = iirCalculator.bandstop({
        order: filterProperties.order, // cascade 3 biquad filters (max: 12)
        characteristic: 'butterworth',
        Fs: sampleRate, // sampling frequency
        Fc: filterProperties.frequency, // cutoff frequency / center frequency for bandpass, bandstop, peak
        BW: filterProperties.bandwidth, // bandwidth only for bandstop and bandpass filters - optional
        gain: filterProperties.gain, // gain for peak, lowshelf and highshelf
        preGain: false // adds one constant multiplication for highpass and lowpass
        // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
    });
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    this.calculateFunction=(arr)=>iirFilter.multiStep(arr);
}


/** @type {FilterSettings} */
const defaultSettings={
    gain:1,
    bandwidth:0.2,
    length:1,
    type:"IIR.lowpass.butterworth",
    order:1,
    frequency:100,
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
        
        let phaseAccumulator = 0;

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
            /** @type {CommonFilterProperties} */
            let filterProperties = {
                gain:settings.gain,
                bandwidth:settings.bandwidth,
                frequency:settings.frequency,
                order:settings.order
            }
            let filterTypeParts = settings.type.split(".");
            
            //create an interface for the filter
            let filter = new filterProtos[
                filterTypeParts[0]
            ][
                filterTypeParts[1]
            ][
                filterTypeParts[2]
            ](filterProperties);

            // var iirCalculator = new Fili.CalcCascades();

            // var availableFilters = iirCalculator.available();

            // var iirFilterCoeffs = iirCalculator.lowpass({
            //     order: 3, // cascade 3 biquad filters (max: 12)
            //     characteristic: 'butterworth',
            //     Fs: 1000, // sampling frequency
            //     Fc: 100, // cutoff frequency / center frequency for bandpass, bandstop, peak
            //     BW: 1, // bandwidth only for bandstop and bandpass filters - optional
            //     gain: 0, // gain for peak, lowshelf and highshelf
            //     preGain: false // adds one constant multiplication for highpass and lowpass
            //     // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
            // });

            // var filter = new Fili.IirFilter(iirFilterCoeffs);


            this.cachedValues = [];
            //only one input, thus we need not to add or anything
            this.eachInput((input) => {
                const inputValues = input.getValues(recursion)
                inputValues.map((v)=>{if(isNaN(v))throw new Error("NAN")});
                // console.log(inputValues);
                // console.log(filter);
                this.cachedValues = filter.calculateFunction(inputValues).map((v)=>isNaN(v)?0:v)
                // this.cachedValues = filter.multiStep(inputValues);
            });
            
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Filter;