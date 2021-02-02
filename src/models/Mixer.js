import Module from "./Module";

const defaultSettings={
    amplitude:0.5
};

function Mixer(userSettings={}){

    //apply default settings for all the settings user did not provide
    const settings={}
    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    const {amplitude}=settings;
    Module.call(this,settings);

    this.hasInput("a");
    this.hasInput("b");
    this.hasInput("c");
    this.hasInput("d");
    
    this.recalculate=(recursion = 0)=>{
        this.cachedValues=[];
        let first=true;
        this.eachInput((input)=>{
            const inputValues = input.getValues(recursion);
            inputValues.map((val,index)=>{
                const currentVal=this.cachedValues[index]?this.cachedValues[index]:0;
                this.cachedValues[index] = (val + currentVal) * amplitude;
                // if(isNaN(this.cachedValues[index])){
                //     throw new Error(`is NaN ${this.cachedValues[index]} += (${val} + ${currentVal}) * ${amplitude}`);
                // }
            });
        });

        this.changed({cachedValues:this.cachedValues});
    }
}

export default Mixer;