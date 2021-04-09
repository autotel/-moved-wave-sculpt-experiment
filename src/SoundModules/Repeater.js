
import Output from "./io/Output";
import Module from "./common/Module";
import { sampleRate } from "./common/vars";
import Input from "./io/Input";

/**
 * @namespace SoundModules.Repeater
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} RepeaterOptions
 * @property {number} [length]
 * @property {Array<EnvelopePoint>} [points]
 * @property {boolean} [monophonic]
 * @property {number} [gain]
 */

/** @type {RepeaterOptions} */
const defaultSettings = {
    length: 1,
    points: [],
    monophonic:false,
    gain:1,
};

/**
 * @class Repeater 
 * @extends Module
 */
class Repeater extends Module {
    /**
     * @param {RepeaterOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);
        
        this.inputs.main = new Input(this);

        const output = this.outputs.main = new Output(this);
        
        this.setLength = (to) => {
            return this.set({
                length: to
            });
        }
        this.setPoints = (pointsList) => {
            return this.set({
                points: settings.points
            });
        };
        this.addPoint = (point=[0,0]) => {
            return this.set({
                points: settings.points.concat([point])
            });
        }

        const sortPointsByTime = () => {
            settings.points.sort((a, b) => a[0] - b[0]);
            this.changed({ points: settings.points });
        }

        this.recalculate = async (recursion = 0) => {

            const lengthSamples = settings.length * sampleRate;
            output.cachedValues = new Float32Array(lengthSamples);
            
            sortPointsByTime();

            let inputSamples = await this.inputs.main.getValues(recursion);
            let currentPoint=false;

            for (let splN = 0; splN < lengthSamples; splN++) {
                settings.points.forEach((runningPoint)=>{
                    let localSample = splN - runningPoint[0];
                    if(localSample>-1 && localSample < inputSamples.length){
                        if(settings.monophonic){ 
                            currentPoint=runningPoint;
                            localSample = splN - currentPoint[0];
                            output.cachedValues[splN] = inputSamples[localSample] * currentPoint[1];
                        
                        }else{
                            output.cachedValues[splN] += inputSamples[localSample] * runningPoint[1];
                        }
                    }
                });
                output.cachedValues[splN] *= settings.gain;
            }
        };
    }
}

export default Repeater;