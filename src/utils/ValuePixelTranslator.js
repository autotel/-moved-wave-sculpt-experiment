import Module from "../models/Module";

class ValuePixelTranslator {
    /**
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

        this.yToAmplitude = (y) => {
            const {
                rangeAmplitude,height,
                centerAmplitude
            } = settings;
            return  ((1+centerAmplitude) - y * (rangeAmplitude / height));
        };
        this.xToTime = (x) => {
            return 1 - 2 * x;
        };
    }
}
export default ValuePixelTranslator;