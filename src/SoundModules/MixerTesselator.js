import Module from "./Module";

/**
 * @namespace SoundModules.MixerTesselator
 */

const defaultSettings={
    amplitude:0.5
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

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            let result=[];
            let first = true;
            this.eachInput((input) => {
                const inputValues = input.getValues(recursion);
                inputValues.map((val, index) => {
                    const currentVal = result[index] ? result[index] : 0;
                    result[index] = (val + currentVal) * amplitude;
                    // if(isNaN(result[index])){
                    //     throw new Error(`is NaN ${result[index]} += (${val} + ${currentVal}) * ${amplitude}`);
                    // }
                });
            });
            
            let lengthSamples=result.length;
            let half = Math.floor(lengthSamples/2);
            
            this.cachedValues = result.map((v,i)=>{ 
                let awindow = Math.cos(2 * Math.PI * i/lengthSamples) / 2 + 0.5;
                let window = 1 - awindow; 
                if(i>half){
                    return v * window + result[i - half] * awindow
                }else if(i<half){
                    return v * window + result[i + half] * awindow
                }else{
                    return v;
                }
            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default MixerTesselator;