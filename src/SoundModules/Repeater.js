import Module from "./Module";
import { sampleRate } from "./vars";

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
 * @property {boolean} [loop]
 * @property {number} [gain]
 */

/** @type {RepeaterOptions} */
const defaultSettings = {
    length: 1,
    points: [],
    loop: false,
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
        
        this.hasInput("main");

        this.setLength = (to) => {
            return this.set({
                length: to
            });
        }
        this.setPoints = (pointsList) => {
            settings.points = pointsList;
            this.changed({
                points: settings.points
            });
            // console.log(pointsList);
            this.cacheObsolete();
            return this;
        };

        const sortPointsByTime = () => {
            settings.points.sort((a, b) => a[0] - b[0]);
            this.changed({ points: settings.points });
        }

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];

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

            const lengthSamples = settings.length * sampleRate;

            let inputSamples = this.inputs.main.getValues();

            let nextPoint = getNextPoint(0);
            let currentPoint = [0, 0];

            for (let splN = 0; splN < lengthSamples; splN++) {
                if (nextPoint) {
                    if (splN >= nextPoint[0]) {
                        currentPoint = nextPoint;
                        nextPoint = getNextPoint(splN);
                    }
                }

                this.cachedValues[splN] = inputSamples[
                    splN - currentPoint[0]
                ] * settings.gain * currentPoint[1];
            }

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

export default Repeater;