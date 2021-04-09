
import Output from "./io/Output";import Module from "./common/Module";
import {sampleRate} from "./common/vars";
import requireParameter from "../utils/requireParameter";
import RustProcessor from "../rust/RustProcessor";
import Input from "./io/Input";

/**
 * @namespace SoundModules.RustComb
 */

/** 
 * @typedef {Object} RustCombSettings
 * @property {number} [frequency]
 * @property {number} [dampening_inverse]
 * @property {number} [dampening]
 * @property {number} [feedback]
 */

/** @type {RustCombSettings} */
const defaultSettings={
    frequency:5,
    dampening_inverse:0.5,
    dampening:0.5,
    feedback:0.9,
};

/**
 * @class RustComb an example that utilizes Rust to process the audio
 * @extends Module
 */
class RustComb extends Module{
    /**
     * @param {RustCombSettings} userSettings
     */
    constructor(userSettings) {
        const rustProcessor = RustProcessor.get();
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.inputs.main = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setFrequency = (to) => {
            return this.set({frequency:to});
        };
        this.setInverseDampening = (to) => {
            return this.set({dampening_inverse:to});
        };
        this.setDampening = (to) => {
            return this.set({dampening:to});
        };
        this.setFeedback = (to) => {
            return this.set({feedback:to});
        };
   

        this.recalculate = async (recursion = 0) => {
            await rustProcessor.wait(); 

            let {
                frequency,
                dampening_inverse,
                dampening,
                feedback,
            } = settings;

            const inputValues = await this.inputs.main.getValues(recursion);

            if (frequency == 0) frequency = 0.1/sampleRate;

            output.cachedValues = new Float32Array(
                rustProcessor.arrCombFilter(
                    inputValues,frequency,dampening_inverse,dampening,feedback
                )
            );
            //return output.cachedValues;
        };
    }
}

export default RustComb;