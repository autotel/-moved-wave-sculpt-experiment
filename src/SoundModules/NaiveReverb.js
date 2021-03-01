import Module from "./Module";
import { sampleRate } from "./vars";
import voz from "../utils/valueOrZero";

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

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");

        const tap1 = new ReverbTap();
        
        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];

            let delayCache = [];
            
            let inputValues = this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);
            
            tap1.time = settings.time;
            tap1.diffusion = settings.diffusion;
            tap1.reset();
            
            inputValues.map((value,sampleNumber)=>{
                this.cachedValues[sampleNumber]=0;
                
                if(isNaN(value)) value = 0;
                delayCache.push(value);

                
                if(settings.wet>0){
                    this.cachedValues[sampleNumber] += tap1.calculateSample(
                        settings.feedback + voz(feedbackLevels[sampleNumber]),
                        delayCache
                    ) * settings.wet;
                }
                
                if(settings.feedback>0){
                    delayCache[delayCache.length-1] += this.cachedValues[sampleNumber] * settings.feedback;
                }


                if(settings.dry>0){
                    this.cachedValues[sampleNumber] += value * settings.dry;
                }
            });
            
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default NaiveReverb;