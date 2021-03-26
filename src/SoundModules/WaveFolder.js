import Module from "./Module";
import {sampleRate} from "./vars";

/**
 * @namespace SoundModules.WaveFolder
 */

/** 
 * @typedef {Object} WaveFolderSettings
 * @property {number} [bias]
 * @property {number} [amplitude]
 * @property {number} [fold]
 */

/** @type {WaveFolderSettings} */
const defaultSettings={
    amplitude:1,
    bias:0,
    fold:1,
};
//TODO: only third order is producing anything useful
/**
 * @class WaveFolder 
 * @extends Module
 */
class WaveFolder extends Module{
    /**
     * @param {WaveFolderSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.hasInput("main");
        this.hasInput("fold");

        this.setPreamp = (to) => {
            return this.set({amplitude:to});
        };
        this.setBias = (to) => {
            return this.set({bias:to});
        };
        this.setCeiling = (to) => {
            return this.set({fold:to});
        };

        const actualModulo = (a,m) => ((a%m)+m)%m;       


        this.recalculate = (recursion = 0) => {
            const {
                amplitude, bias, fold,
            } = settings;
            

            const inputValues = this.inputs.main.getValues(recursion);
            const foldValues = this.inputs.fold.getValues(recursion);
            
            let currentFoldEnvelope = 0;

            this.cachedValues = inputValues.map((val,sampleNumber)=>{
                if(foldValues[sampleNumber] !== undefined) currentFoldEnvelope = foldValues[sampleNumber];
                
                const currentFold = fold + currentFoldEnvelope;
                const halffold = currentFold/2;

                const result = (
                    actualModulo(
                        ( val + currentFold + bias),
                        currentFold
                    ) - halffold
                ) / currentFold;
                return result * amplitude;
            });
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default WaveFolder;