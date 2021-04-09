import Module from "./common/Module";
import { sampleRate } from "./common/vars";
import BasicDelay from "./operators/BasicDelay";
import voz from "../utils/valueOrZero";
import Input from "./io/Input";
import Output from "./io/Output";

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

        this.inputs.main = new Input(this);
        this.inputs.feedback = new Input(this);
        this.inputs.time = new Input(this);

        const output = this.outputs.main = new Output(this);

        let operator = new BasicDelay();
        
        this.recalculate = async (recursion = 0) => {

            operator.reset();
            
            let inputValues = await this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);

            output.cachedValues = new Float32Array(inputValues.length);
            
            inputValues.forEach((value,sampleNumber)=>{
                output.cachedValues[sampleNumber] = 0;
                
                let currentTimeLevel = voz(timeLevels[sampleNumber]) + delayInSamples;
                
                if(sampleNumber>currentTimeLevel){
                    let timeAgo=sampleNumber - currentTimeLevel;
                    value += (output.cachedValues[timeAgo] + inputValues[timeAgo])
                        * (settings.feedback + voz(feedbackLevels[sampleNumber]));
                }

                output.cachedValues[sampleNumber]+=operator.calculateSample(value,currentTimeLevel);
            });

            //mix dry and wet
            output.cachedValues.forEach((val,sampleNumber)=>{

                output.cachedValues[sampleNumber] = output.cachedValues[sampleNumber] * settings.wet 
                    + inputValues[sampleNumber] * settings.dry;
                
            });
        };
    }
}

export default Delay;