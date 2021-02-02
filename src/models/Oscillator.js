import Module from "./Module";
import {sampleRate} from "./vars";

const defaultSettings={
    amplitude:1,
    bias:0,
    length:1.2,
    frequency:220,
    shape:"sin",
};

function Oscillator(userSettings={}){
    //apply default settings for all the settings user did not provide
    const settings={};

    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    let first=true;
    const shapes={
        sin:(sampleNumber)=>{
            return Math.sin(
                Math.PI * 2 
                * settings.frequency * sampleNumber
                / sampleRate
            ) * settings.amplitude
            + settings.bias
        },
        cos:(sampleNumber)=>{
            return Math.cos(
                Math.PI * 2 * 
                settings.frequency * sampleNumber
                / sampleRate
            ) * settings.amplitude
            + settings.bias
        },
        //TODO: more shapes
    }

    Module.call(this,settings);
    
    this.setFrequency=(to)=>{
        settings.frequency=to;
        this.changed({
            frequency:to
        });
        this.calculate();
    }
    
    this.setAmplitude=(to)=>{
        settings.amplitude=to;
        this.changed({
            amplitude:to
        });
        this.calculate();
    }
    
    this.calculate=(recursion = 0)=>{

        const lengthSamples = settings.length*sampleRate;

        if(!shapes[settings.shape]) throw new Error(`Wave shape function named ${settings.shape}, does not exist`);
        

        for(let a=0; a<lengthSamples; a++){
            this.cachedValues[a]=shapes[settings.shape](a);
        }

        this.changed({cachedValues:this.cachedValues});
    }

}

export default Oscillator;