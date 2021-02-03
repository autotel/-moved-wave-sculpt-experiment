import Module from "./Module";
import {sampleRate} from "./vars";

const defaultSettings={
    amplitude:1,
    bias:0,
    length:0.2,
    frequency:220,
    shape:"sin",
};

function Oscillator(userSettings={}){
    //apply default settings for all the settings user did not provide
    const settings={};

    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    let first=true;

    let phaseAccumulator=0;

    const accumulatePhase = (frequency)=>{
        phaseAccumulator+=frequency / sampleRate;
    }
    
    const shapes={
        sin:(sampleNumber,frequency,amplitude)=>{
            accumulatePhase(frequency);
            return Math.sin(phaseAccumulator + Math.PI * 2) * amplitude
                + settings.bias
        },
        cos:(sampleNumber,frequency,amplitude)=>{
            accumulatePhase(frequency);
            return Math.cos(phaseAccumulator + Math.PI * 2) * amplitude
                + settings.bias
        },
        //TODO: more shapes
    }

    Module.call(this,settings);

    this.hasInput("frequency");
    this.hasInput("amplitude");
    
    this.setFrequency=(to)=>{
        settings.frequency=to;
        this.changed({
            frequency:to
        });
        this.inputChanged();
    }
    
    this.setAmplitude=(to)=>{
        settings.amplitude=to;
        this.changed({
            amplitude:to
        });
        this.inputChanged();
    }
    
    this.recalculate=(recursion = 0)=>{
        phaseAccumulator=0;
        const lengthSamples = settings.length*sampleRate;
        if(!shapes[settings.shape]) throw new Error(
            `Wave shape function named ${settings.shape}, does not exist`
        );
        
        const freqInputValues=this.inputs.frequency.getValues();
        const ampInputValues=this.inputs.amplitude.getValues();
        
        for(let a=0; a<lengthSamples; a++){
            const freq = (freqInputValues[a]||0) + settings.frequency;
            const amp = (ampInputValues[a]||0) + settings.amplitude;
            this.cachedValues[a]=shapes[settings.shape](a,freq,amp);
        }

        this.changed({cachedValues:this.cachedValues});
    }

}

export default Oscillator;