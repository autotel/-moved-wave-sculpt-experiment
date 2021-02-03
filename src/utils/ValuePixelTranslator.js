import Module from "../models/Module";

class ValuePixelTranslator {
    /**
     * reference to settings objects, which may be changed at runtime
     * causing changes in the scale in this object.
     * @param {{
     *  rangeAmplitude:number,
     *  rangeSamples:number,
     *  centerAmplitude:number,
     *  centerSample:number,
     *  width:number,
     *  height:number,
     *  model:Module,
     * }} settings
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
            return  (amplitude * height - centerAmplitude * height ) / rangeAmplitude + center;
        };

        /** pixel number to sample number */
        this.xToSampleNumber = (x) => {
            return Math.floor(settings.rangeSamples * x / settings.width);
        };

        /** sample number to pixel number */
        this.sampleNumberToX = (sampleNumber) => {
            return Math.floor(settings.width * sampleNumber / settings.rangeSamples);
        };
    }
}
export default ValuePixelTranslator;