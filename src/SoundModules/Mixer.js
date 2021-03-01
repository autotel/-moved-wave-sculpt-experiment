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
        
        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            let result=[];
            let first = true;
            this.eachInput((input,inputno,inputName) => {
                const inputValues = input.getValues(recursion);
                inputValues.map((val, index) => {
                    if(!result[index]) result[index]=0;
                    result[index] += (val) * amplitude * settings["level"+inputName];
                });
            });
            
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Mixer;