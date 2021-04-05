import Module from "./Module";

/**
 * @namespace SoundModules.Mixer
 */

const defaultSettings={
    amplitude:1,
    levela:0.25,
    levelb:0.25,
    levelc:0.25,
    leveld:0.25,
    normalize:false,
    saturate:true,
};
/**
 * @class Mixer
 * @extends Module
 */
class Mixer extends Module{
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
            let first = true;

            let max = 0;
            let min = 0;
            
            await Promise.all(
                this.eachInput(async(input,inputno,inputName) => {
                    const inputValues = await input.getValues(recursion);
                    inputValues.forEach((val, index) => {
                        if(!result[index]) result[index]=0;
                        result[index] += (val) *  settings["level"+inputName];
                    });
                })
            );

            this.cachedValues = new Float64Array(result.map((n)=>{
                if(n>1) return 1;
                if(n<-1) return -1;
                if(isNaN(n)) return 0;
                if(n>max) max = n;
                if(n<min) min = n;
                return n;
            }));

            if(settings.normalize && max!==0 && min!==0){
                let mult = 1/Math.min(Math.abs(min),max);

                this.cachedValues = this.cachedValues.map((n)=>{
                    return n * mult;
                });
            }
            
            if(settings.amplitude != 1){
                this.cachedValues = this.cachedValues.map((n)=>{
                    return n * amplitude;
                });
            }

            return this.cachedValues;
            
        };
    }
}

export default Mixer;