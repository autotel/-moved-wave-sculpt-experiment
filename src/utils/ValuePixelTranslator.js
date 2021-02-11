import Model from "../scaffolding/Model";
import { sampleRate } from "../SoundModules/vars";

/**
 * @export @typedef {{
*  rangeAmplitude:number,
*  rangeSamples:number,
*  centerAmplitude:number,
*  centerSample:number,
*  width:number,
*  height:number,
*  model:Model,
* }} ValuePixelTranslatorParams
*/
/**
 * @export @typedef {Object} ValuePixelChanges 
 * @param {number} [rangeAmplitude]
 * @param {number} [rangeSamples]
 * @param {number} [centerAmplitude]
 * @param {number} [centerSample]
 * @param {number} [width]
 * @param {number} [height]
 * @param {Model} [model]
 * }} 
*/
    
class ValuePixelTranslator {
    /**
     * reference to settings objects, which may be changed at runtime
     * causing changes in the scale in this object.
     * @param {ValuePixelTranslatorParams} settings
    */
    constructor(settings) {
        const model = settings.model;
        const modelSettings = model.settings;
        this.settings=settings;
        
        Object.seal(this.settings);
        let changedListeners = [];
        /**
         * @param {Function}  callback
         */
        this.onChange = (callback)=>{
            changedListeners.push(callback);
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
            return Math.floor(settings.rangeSamples * x / settings.width);
        };

        /** sample number to pixel number */
        this.sampleNumberToX = (sampleNumber) => {
            return Math.floor(settings.width * sampleNumber / settings.rangeSamples);
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
export default ValuePixelTranslator;