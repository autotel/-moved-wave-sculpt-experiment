
import Output from "./io/Output";
import Module from "./common/Module";
import { sampleRate } from "./common/vars";
import Input from "./io/Input";

/**
 * @namespace SoundModules.Hipparchus
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} HipparchusOptions
 * @property {number} [gain]
 * @property {number} [rotation] rotation in ratio, zero equals 0 degrees and 1 equals 180 degrees
 * @property {number} [rightOffset] how much more rotation to give to the right channel
 */

/** @type {HipparchusOptions} */
const defaultSettings = {
    rotation: 0,
    rightOffset: 0.5,
    gain:1,
};

//from Vectoidal

/**
 * convert x,y into th,r polar coords around 0,0
 * @param {{x:number,y:number}} cartesian
 * @param {number?} dcOffset
 * @returns {{th:number,r:number}} polar
 */
const cartesianToPolar=({x,y},dcOffset=0)=>{
    return{
        r:Math.sqrt(x*x+y*y)-dcOffset,
        th:Math.atan2(y,x)
    }
};
const polarToCartesian=({th,r},dcOffset=0)=>{
    return {
        x:Math.cos(th)*(r+dcOffset),
        y:Math.sin(th)*(r+dcOffset)
    }
}
/**
 * convert th,r into x,y coords around 0,0. 
 * X is not calculated and set to 0
 * @param {{th:number,r:number}} polar
 * @param {number?} dcOffset
 * @returns {{x:0,y:number}} 
 */
const polarToCartesianAndSquashX=({th,r},dcOffset=0)=>{
    return {
        x:0,
        y:Math.sin(th)*(r+dcOffset)
    }
}

const voz=(val)=>val?val:0;

/**
 * @class Hipparchus 
 * @extends Module
 */
class Hipparchus extends Module {
    /**
     * @param {HipparchusOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);
        
        this.inputs.x = new Input(this);
        this.inputs.y = new Input(this);
        this.inputs.rotation = new Input(this);

        const left = this.outputs.l = new Output(this);
        const right = this.outputs.r = new Output(this);

        this.setAngle = (to) => {
            return this.set({
                rotation: to
            });
        }
        this.setGain = (to) => {
            return this.set({
                gain: to
            });
        }


        this.recalculate = async (recursion = 0) => {

            let gain = settings.gain;
            let xIn = await this.inputs.x.getValues(recursion);
            let yIn = await this.inputs.y.getValues(recursion);
            let rotationIn = await this.inputs.rotation.getValues(recursion);

            left.cachedValues = new Float32Array(xIn.length);
            right.cachedValues = new Float32Array(xIn.length);

            xIn.forEach((x,sampleNumber)=>{
                let y = voz(yIn[sampleNumber]);
                let rotationSample = voz(rotationIn[sampleNumber]);

                let polarRotationLeft = (
                        rotationSample + settings.rotation
                    )  * Math.PI;
                
                let polarRotationRight = (
                        rotationSample + settings.rotation + settings.rightOffset
                    )  * Math.PI;
                    
                const polarLeft = cartesianToPolar({x,y},0);
                polarLeft.th += polarRotationLeft;
                const resultLeft = polarToCartesianAndSquashX(polarLeft).y;

                const polarRight = cartesianToPolar({x,y},0);
                polarRight.th += polarRotationRight;
                const resultRight = polarToCartesianAndSquashX(polarRight).y;

                left.cachedValues[sampleNumber] = resultLeft * gain;
                right.cachedValues[sampleNumber] = resultRight * gain;

            });
            //return output.cachedValues;
        };
    }
}

export default Hipparchus;