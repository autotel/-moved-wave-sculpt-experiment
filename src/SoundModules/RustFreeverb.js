import Module from "./Module";
import {sampleRate} from "./vars";
import NativeProcess from "../scaffolding/NativeProcess";
import requireParameter from "../utils/requireParameter";

/**
 * @namespace SoundModules.RustFreeverb
 */

/** 
 * @typedef {Object} RustFreeverbSettings
 * @property {number} [frequency]
 * @property {number} [dampening_inverse]
 * @property {number} [dampening]
 * @property {number} [feedback]
 * @property {NativeProcess} nativeProcessor
 */

/** @type {RustFreeverbSettings} */
const defaultSettings={
    frequency:5,
    dampening_inverse:0.5,
    dampening:0.5,
    feedback:0.9,
    nativeProcessor:undefined,
};

/**
 * @class RustFreeverb an example that utilizes Rust to process the audio
 * @extends Module
 */
class RustFreeverb extends Module{
    /**
     * @param {RustFreeverbSettings} userSettings
     */
    constructor(userSettings) {
        requireParameter(userSettings.nativeProcessor,"nativeProcessor");
        const nativeProcessor = userSettings.nativeProcessor;
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.hasInput("main");

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

        const actualModulo = (a,m) => ((a%m)+m)%m;       

        this.recalculate = (recursion = 0) => {
            if(!nativeProcessor.ready){
                nativeProcessor.onReady(()=>{
                    this.recalculate(recursion);
                });
                return;
            }

            let {
                frequency,
                dampening_inverse,
                dampening,
                feedback,
            } = settings;

            const inputValues = this.inputs.main.getValues(recursion);

            if (frequency == 0) frequency = 0.1/sampleRate;

            this.cachedValues = new Float32Array(
                nativeProcessor.freeverb(
                    inputValues
                )
            );
            
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default RustFreeverb;