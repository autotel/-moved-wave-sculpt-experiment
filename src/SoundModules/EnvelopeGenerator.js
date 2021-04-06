import Module from "./Module";
import { sampleRate } from "./vars";

/**
 * @namespace SoundModules.EnvelopeGenerator
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} EnvelopeGeneratorSettings
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {Array<EnvelopePoint>} [points]
 * @property {boolean} [loop]
 */

/** @type {EnvelopeGeneratorSettings} */
const defaultSettings = {
    amplitude: 1,
    bias: 0,
    length: 1,
    points: [],
    loop: false,
};

/**
 * @class EnvelopeGenerator 
 * @extends Module
 */
class EnvelopeGenerator extends Module {
    /**
     * @param {EnvelopeGeneratorSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        let phaseAccumulator = 0;
        const accumulatePhase = (frequency) => {
            phaseAccumulator += frequency / sampleRate;
        };


        super(settings);

        this.setFrequency = (to) => {
            return this.set({
                frequency: to
            });
        };
        this.setLength = (to) => {
            return this.set({
                length: to
            });
        }
        this.setPoints = (points) => {
            return this.set({
                points
            });
        };
        this.addPoint = (point=[0,0]) => {
            return this.set({
                points: settings.points.push(point)
            });
        };
        const sortPointsByTime = () => {
            settings.points.sort((a, b) => a[0] - b[0]);
            this.changed({ points: settings.points });
        }
        const getInterpolation = (position, pointa, pointb) => {
            const distancea = position - pointa[0];
            const distanceb = pointb[0] - position;
            const distancet = pointb[0] - pointa[0];
            const ret = (pointa[1] * distanceb + pointb[1] * distancea) / distancet;
            // const ret=(
            //     pointa[1] * distancet / 4000
            // );
            if (isNaN(ret)) return 0;
            // return position / 44100;
            // return pointa[1]+pointb[1] * position / 44100;
            return ret;
        }
        this.recalculate = async (recursion = 0) => {
            const lengthSamples = settings.length * sampleRate;
            
            this.cachedValues = new Float32Array(lengthSamples);

            sortPointsByTime();
            /** @returns {EnvelopePoint|false} */
            const getNextPoint = (spl) => {

                /** @type {EnvelopePoint|false} */
                let selected = false;
                for (let pnum = 0; pnum < settings.points.length; pnum++) {
                    const point = settings.points[pnum];
                    selected = point;
                    if (point[0] > spl) return selected;
                };
                return false;
            }


            let nextPoint = getNextPoint(0);
            let currentPoint = [0, 0];

            for (let splN = 0; splN < lengthSamples; splN++) {
                if (nextPoint) {
                    this.cachedValues[splN] = getInterpolation(splN, currentPoint, nextPoint);
                    if (splN >= nextPoint[0]) {
                        currentPoint = nextPoint;
                        nextPoint = getNextPoint(splN);
                    }
                } else {
                    if(settings.loop){
                        //currentPoint is now last point, and indicates length of the loop
                        this.cachedValues[splN] = this.cachedValues[splN % currentPoint[0]];
                    }else{
                        this.cachedValues[splN] = currentPoint[1]; //this.cachedValues[splN % currentPoint[0]];
                    }

                }
            }

            //return this.cachedValues;
        };
    }
}

export default EnvelopeGenerator;