import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import Output from "./io/Output";
import Input from "./io/Input";

/**
 * @namespace SoundModules.SigmoidDistortion
 */

/** 
 * @typedef {Object} SigmoidDistortionSettings
 * @property {number} [preamp]
 * @property {number} [amplitude]
 * @property {number} [curve]
 */

/** @type {SigmoidDistortionSettings} */
const defaultSettings={
    amplitude:1,
    preamp:1,
    curve:1,
};
//TODO: only third order is producing anything useful
/**
 * @class SigmoidDistortion 
 * @extends Module
 */
class SigmoidDistortion extends Module{
    /**
     * @param {SigmoidDistortionSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.inputs.main = new Input(this);
        this.inputs.curve = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setPreamp = (to) => {
            return this.set({preamp:to});
        };
        this.setCurve = (to) => {
            return this.set({curve:to});
        };

        const sigmoid = (v,s) => 2/(1+Math.pow(Math.pow(s,2),v)) - 1;       

        this.recalculate = async(recursion = 0) => {
            const {
                amplitude, preamp, curve,
            } = settings;

            const inputValues = await this.inputs.main.getValues(recursion);
            const curveValues = await this.inputs.curve.getValues(recursion);
            
            let currentCurve = 0;

            output.cachedValues = inputValues.map((val,sampleNumber)=>{
                if(curveValues[sampleNumber] !== undefined) currentCurve = curveValues[sampleNumber];

                currentCurve += curve;

                const result = (
                    (sigmoid(
                        val * preamp, currentCurve
                    ) )
                ) * amplitude;
                return result * amplitude;
            });
        };
    }
}

export default SigmoidDistortion;