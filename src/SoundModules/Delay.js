import Module from "./Module";
import { sampleRate } from "./vars";

/**
 * @namespace SoundModules.Module
 */

const defaultSettings={
    feedback:0.5,
    time:0.2, //seconds
    dry:1,
    wet:0.5,
};

/**
 * @class Delay
 * @extends Module
 */
class Delay extends Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        super(settings);

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");

        
        this.recalculate = (recursion = 0) => {

            this.cachedValues = [];
            let delayCache = [];
            
            let inputValues = this.inputs.main.getValues();
            let delayInSamples = Math.floor(sampleRate * settings.time);
            
            inputValues.map((value,sampleNumber)=>{
                let len = delayCache.push(value);

                if(!this.cachedValues[sampleNumber]) this.cachedValues[sampleNumber]=0;
                
                if(settings.dry>0){
                    this.cachedValues[sampleNumber] += value * settings.dry;
                }
                if(len > delayInSamples){
                    this.cachedValues[sampleNumber] += delayCache.shift() * settings.wet;

                }
                if(settings.feedback > 0){
                    delayCache[len - 2] += this.cachedValues[sampleNumber] * settings.feedback;
                }

            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Delay;