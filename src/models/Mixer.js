import Module from "./Module";

const defaultSettings={
    amplitude:0.25
};

function Mixer(userSettings={}){

    //apply default settings for all the settings user did not provide
    const settings={}
    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    const {amplitude}=settings;
    Module.call(this,settings);
    this.calculate=(recursion = 0)=>{
        console.log("mixer calculate");
        this.inputs.forEach((input)=>{
            const inputValues = input.getValues(recursion);
            inputValues.map((val,index)=>{
                const currentVal=this.cachedValues[index]!==undefined?this.cachedValues[index]:0;
                this.cachedValues[index] += currentVal * amplitude;
            });
        });

        this.changed({cachedValues:this.cachedValues});
    }
}

export default Mixer;