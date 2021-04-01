import Module from "./Module";
import { sampleRate } from "./vars";
import BasicDelay from "./operators/BasicDelay";
import voz from "../utils/valueOrZero";

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

        let operator = new BasicDelay();
        
        this.recalculate = (recursion = 0) => {

            operator.reset();
            
            let inputValues = this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);

            this.cachedValues = new Float32Array(inputValues.length);
            
            inputValues.forEach((value,sampleNumber)=>{
                this.cachedValues[sampleNumber] = 0;
                
                let currentTimeLevel = voz(timeLevels[sampleNumber]) + delayInSamples;
                
                if(sampleNumber>currentTimeLevel){
                    let timeAgo=sampleNumber - currentTimeLevel;
                    value += (this.cachedValues[timeAgo] + inputValues[timeAgo])
                        * (settings.feedback + voz(feedbackLevels[sampleNumber]));
                }

                this.cachedValues[sampleNumber]+=operator.calculateSample(value,currentTimeLevel);
            });

            //mix dry and wet
            this.cachedValues.forEach((val,sampleNumber)=>{

                this.cachedValues[sampleNumber] = this.cachedValues[sampleNumber] * settings.wet 
                    + inputValues[sampleNumber] * settings.dry;
                
            });

            // this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Delay;