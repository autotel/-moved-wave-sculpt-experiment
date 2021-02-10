import Model from "../scaffolding/Model";
import { sampleRate } from "../SoundModules/vars";

class ValuePixelTranslator {
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
     * 
     * reference to settings objects, which may be changed at runtime
     * causing changes in the scale in this object.
     * @param {ValuePixelTranslatorParams} settings
    */
    constructor(settings) {
        const model = settings.model;
        const modelSettings = model.settings;
        this.settings=settings;

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