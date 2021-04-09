
import Output from "./io/Output";
import Module from "./common/Module";
import { sampleRate } from "./common/vars";
import voz from "../utils/valueOrZero";
import Input from "./io/Input";

/**
 * @namespace SoundModules.Module
 */

const defaultSettings={
    feedback:0.5,
    diffusion:0.06,
    time:0.1, //seconds
    dry:0.5,
    wet:0.5,
};

/* 
a simple delay tap.
todo: in order to produce a network of delays, I need to also
implement some way for one reverb to send it's output to another
reverb, also producing feebdack loops
*/
class ReverbTap{
    constructor(){

        //delay reflection time start
        //in other words, wait this time before starting reverberating
        this.time = 100 / 1000;
        //how many consecutive taps are produced
        //in other words, how many times (*splrate) it reverberates 
        this.diffusion = 10 / 1000;

        let timeSpls;
        let difussionSpls;

        this.reset=()=>{
            this.pastSamples=[];
            timeSpls = Math.floor(this.time * sampleRate);
            difussionSpls = Math.floor(this.diffusion * sampleRate);
            console.log({timeSpls,difussionSpls});
        }

        this.calculateSample=(level, pastSamples)=>{
            let ret = 0;
            const pastSamplesEnd = pastSamples.length - timeSpls;
            const pastSamplesStart = pastSamplesEnd - difussionSpls;
            if(pastSamplesStart > 0){
                //get the correct samples at teh array start
                for(let tapN=pastSamplesStart; tapN < pastSamplesEnd; tapN++){
                    ret += pastSamples[tapN] * level;
                }
                // ret/=sampleRate;
            }
            return ret;
        }

        this.reset();
    }

}

/**
 * @class NaiveReverb
 * @extends Module
 */
class NaiveReverb extends Module{
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
        
        const tap1 = new ReverbTap();
        
        this.recalculate = async (recursion = 0) => {

            let delayCache = [];
            
            let inputValues = await this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = await this.inputs.feedback.getValues(recursion);
            let timeLevels = await this.inputs.time.getValues(recursion);
            
            tap1.time = settings.time;
            tap1.diffusion = settings.diffusion;
            tap1.reset();


            output.cachedValues = new Float32Array(inputValues.length);
            
            inputValues.forEach((value,sampleNumber)=>{
                output.cachedValues[sampleNumber]=0;
                
                if(isNaN(value)) value = 0;
                delayCache.push(value);

                
                if(settings.wet>0){
                    output.cachedValues[sampleNumber] += tap1.calculateSample(
                        settings.feedback + voz(feedbackLevels[sampleNumber]),
                        delayCache
                    ) * settings.wet;
                }
                
                if(settings.feedback>0){
                    delayCache[delayCache.length-1] += output.cachedValues[sampleNumber] * settings.feedback;
                }


                if(settings.dry>0){
                    output.cachedValues[sampleNumber] += value * settings.dry;
                }
            });
        };
    }
}

export default NaiveReverb;