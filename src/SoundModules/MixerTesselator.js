import Module from "./Module";
import voz from "../utils/valueOrZero";

/**
 * @namespace SoundModules.MixerTesselator
 */

const defaultSettings={
    amplitude:1,
    window:true,
    normalize:false,
    levela:0.5,
    levelb:0.5,
    levelc:0.5,
    leveld:0.5,
};
/**
 * mixes channels and also tesselates them using sine shaped window.
 * this removes clicks upon loop
 * @class MixerTesselator
 * @extends Module
 */
class MixerTesselator extends Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        
        super(settings);

        this.hasInput("a");
        this.hasInput("b");
        this.hasInput("c");
        this.hasInput("d");

        this.recalculate = async (recursion = 0) => {
            let result=[];
            await Promise.all(
                this.eachInput(async (input,inputno,inputName) => {
                    const inputValues = await input.getValues(recursion);
                    inputValues.forEach((val, index) => {
                        if(!result[index]) result[index]=0;
                        result[index] += (val) * amplitude * settings["level"+inputName];
                    });
                })
            );
                
            let lengthSamples=result.length;
            let half = Math.floor(lengthSamples/2);
            let max=0;
            let min=0;
            this.cachedValues = new Float32Array(result.map((v,i)=>{
                let awindow,window;
                if(settings.window){
                    awindow = Math.cos(2 * Math.PI * i/lengthSamples) / 2 + 0.5;
                    window = 1 - awindow;
                }else{
                    awindow = 0.5;
                    window=0.5;
                }


                if(v>max) max = v;
                if(v<min) min = v;

                if(i>half){
                    return v * window + result[i - half] * awindow
                }else if(i<half){
                    return v * window + result[i + half] * awindow
                }else{
                    return v;
                }
            }));


            if(settings.normalize && max!==0 && min!==0){
                let mult = 1/Math.min(Math.abs(min),max);

                this.cachedValues = this.cachedValues.map((n)=>{
                    return n * mult;
                });
            }
            
        };
    }
}

export default MixerTesselator;