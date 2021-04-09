
import Output from "./io/Output";
import Module from "./common/Module";
import Input from "./io/Input";

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

        this.inputs.a = new Input(this);
        this.inputs.b = new Input(this);
        this.inputs.c = new Input(this);
        this.inputs.d = new Input(this);

        const output = this.outputs.main = new Output(this);
        
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

            output.cachedValues = new Float32Array(result.map((n)=>{
                if(n>1) return 1;
                if(n<-1) return -1;
                if(isNaN(n)) return 0;
                if(n>max) max = n;
                if(n<min) min = n;
                return n;
            }));

            if(settings.normalize && max!==0 && min!==0){
                let mult = 1/Math.min(Math.abs(min),max);

                output.cachedValues = output.cachedValues.map((n)=>{
                    return n * mult;
                });
            }
            
            if(settings.amplitude != 1){
                output.cachedValues = output.cachedValues.map((n)=>{
                    return n * amplitude;
                });
            }

            return output.cachedValues;
            
        };
    }
}

export default Mixer;