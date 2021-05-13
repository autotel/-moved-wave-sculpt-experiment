import Model from "../dom-model-gui/Model";
import { sampleRate } from "../SoundModules/common/vars";

/**
 * @export @typedef {{
*  rangeAmplitude:number,
*  rangeSamples:number,
*  centerAmplitude:number,
*  firstSample:number,
*  width:number,
*  height:number,
*  module:Model,
* }} ValuePixelTranslatorParams
*/
/**
 * @export @typedef {Object} ValuePixelChanges 
 * @param {number} [rangeAmplitude]
 * @param {number} [centerAmplitude]
 * @param {number} [width]
 * @param {number} [height]
 * @param {Model} [module]
 * }} 
*/
    
class ValuePixelTranslator {
    /**
     * reference to settings objects, which may be changed at runtime
     * causing changes in the scale in this object.
     * @param {ValuePixelTranslatorParams} settings
    */
    constructor(settings) {
        const module = settings.module;
        const moduleSettings = module.settings;
        this.settings=settings;
        
        let changedListeners = [];
        /**
         * @param {Function}  callback
         */
        this.onChange = (callback)=>{
            changedListeners.push(callback);
            ValuePixelTranslator.onChange(callback);
        }

        /** if you manually change some parameters, call this after, so that it can trigger the listeners accordingly. */
        this.handleChanged = (changes)=>{
            changedListeners.map((cb)=>cb(changes));
        }

        /**
         * Use this to change parameters such as zoom, center etc. and call any listener.
         * Also, call this without argument to just call the callbacks; for example when you need to get the initial state represented.
         * @param {ValuePixelChanges} settings 
         */
        this.change=(settings={})=>{
            Object.assign(this.settings,settings);
            this.handleChanged(settings);
        }

        /**
         * handy function to set the zoom/pan in such way that maxValue translates to maxPixel
         */
        this.coverVerticalRange=(minValue,maxValue)=>{
            const range=maxValue-minValue;
            this.change({
                rangeAmplitude: range,
                centerAmplitude: minValue + (range/2),
            });
        };

        /** pixel number to amplitude */
        this.yToAmplitude = (y) => {
            const {
                rangeAmplitude,height,
                centerAmplitude
            } = settings;
            const center=height/2;
            return  (centerAmplitude) - (y - center) * (rangeAmplitude / height);
        };

        /** amplitude to pixel number */
        this.amplitudeToY = (amplitude) => {
            const {
                rangeAmplitude,height,
                centerAmplitude
            } = settings;
            const center=height/2;
            return  ( centerAmplitude * height - amplitude * height ) / rangeAmplitude + center;
        };

        /** pixel number to sample number */
        this.xToSampleNumber = (x) => {
            let sampleNumber =  Math.floor(
                ValuePixelTranslator.shared.rangeSamples  * x / settings.width
            );
            return sampleNumber + ValuePixelTranslator.shared.firstSample;
        };

        /** sample number to pixel number */
        this.sampleNumberToX = (sampleNumber) => {
            sampleNumber -= ValuePixelTranslator.shared.firstSample;
            return Math.floor(settings.width * sampleNumber / ValuePixelTranslator.shared.rangeSamples);
        };

        /** convert pixel number into time in seconds */
        this.xToSeconds = (x)=>{
            return this.xToSampleNumber(x) / sampleRate;
        }
        /** convert time in seconds into pixel number  */
        this.secondsToX = (time)=>{
            return this.sampleNumberToX(time * sampleRate);
        }
    }
}

ValuePixelTranslator.shared = {
    rangeSamples:sampleRate,
    firstSample:0,
}


ValuePixelTranslator.changedListeners = [];
/**
 * @param {Function}  callback
 */
ValuePixelTranslator.onChange = (callback)=>{
    ValuePixelTranslator.changedListeners.push(callback);
}
/** if you manually change some parameters, call this after, so that it can trigger the listeners accordingly. */
ValuePixelTranslator.handleChanged = (changes)=>{
    ValuePixelTranslator.changedListeners.map((cb)=>cb(changes));
}
/**
 * Use this to change parameters such as zoom, center etc. and call any listener.
 * Also, call this without argument to just call the callbacks; for example when you need to get the initial state represented.
 * @param {ValuePixelChanges} settings 
 */
ValuePixelTranslator.change=(settings={})=>{
    Object.assign(ValuePixelTranslator.shared,settings);
    ValuePixelTranslator.handleChanged(settings);
}


export default ValuePixelTranslator;