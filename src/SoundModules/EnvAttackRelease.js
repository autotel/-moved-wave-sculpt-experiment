
import Output from "./io/Output";
import Module from "./common/Module";
import { sampleRate } from "./common/vars";
const shapes = {};

shapes.exponential = (position,shape) => Math.pow(position,shape);

/**
 * @namespace SoundModules.Module
 */

const defaultSettings={
    attack:0.1,
    release:0.9,
    amplitude:1,
    attackCurve:"exponential",
    attackShape:1,
    releaseCurve:"exponential",
    releaseShape:1,
};

/**
 * @class EnvelopeAttackRelease
 * @extends Module
 */
class EnvelopeAttackRelease extends Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        const { amplitude } = settings;
        super(settings);

        this.randomize = (
            maxAmplitude = 1, minAmplitude = 0, totalTime = 1
        ) => {
            let attack = Math.random() / 3;
            let release = totalTime - attack;

            let maxRange = maxAmplitude-minAmplitude;

            let amplitude = (Math.random() * maxRange) + minAmplitude;

            let attackShape = Math.random() * 10 - 5;
            let releaseShape = Math.random() * 10 - 5;

            this.set({
                attack,
                release,
                amplitude,
                attackCurve:"exponential",
                attackShape,
                releaseCurve:"exponential",
                releaseShape,
            });
        }

        const output = this.outputs.main = new Output(this);
        
        this.recalculate = async(recursion = 0) => {
            
            let envLength = settings.attack + settings.release;
            let envLengthSpls = Math.floor(sampleRate * envLength);
            let attackSpls = Math.floor(sampleRate * settings.attack);
            let releaseSpls = Math.floor(sampleRate * settings.release);
            let shapeFunction = shapes.exponential;

            output.cachedValues = new Float32Array(envLengthSpls);

            delete settings.attackCurve;
            delete settings.releaseCurve;
            
            //attack phase
            for(let sampleNumber = 0; sampleNumber < attackSpls; sampleNumber++){
                let position = sampleNumber / attackSpls;
                output.cachedValues[sampleNumber] = shapeFunction(position, settings.attackShape) * settings.amplitude;
            }
            //release phase
            for(let stageSampleNumber = 0; stageSampleNumber < releaseSpls; stageSampleNumber++){
                let position = 1 - stageSampleNumber / releaseSpls;
                let sampleNumber = stageSampleNumber + attackSpls;
                output.cachedValues[sampleNumber] = shapeFunction(position, settings.releaseShape) * settings.amplitude;
            }
        };
    }
}

export default EnvelopeAttackRelease;