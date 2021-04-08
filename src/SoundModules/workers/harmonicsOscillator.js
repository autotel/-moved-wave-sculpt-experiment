
import OscillatorOperator from "../operators/OscillatorOperator";
import voz from "../../utils/valueOrZero";

/** 
 * @typedef {Object} HarmonicsOscillatorOptions
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [phase]
 * @property {number} [interval1]
 * @property {number} [interval2]
 * @property {number} [interval3]
 * @property {number} [interval4]
 * @property {"sin"|"cos"|"ramp"|"noise"|"offset"} [shape]
 */

/** this needs revision */
function frequencyGetter(n, order1val, order2val, order3val, order4val, baseFrequency) {
    let order1 = baseFrequency + (n * order1val);
    let order2 = baseFrequency * (n * order2val);
    let order3 = Math.pow(baseFrequency, (n * order3val));
    let order4 = Math.pow((n * order4val), baseFrequency);
    return order1 + order2 + order3 + order4;
}

self.onmessage = ({data}) => {


    // self.postMessage({
    //     log: "start harmonicsOscillator thread",
    // });
    const {
        settings,
        sampleRate,

        freqInputValues,
        ampInputValues,
        biasInputValues,
        mixCurveInputValues,

        interval1Values,
        interval2Values,
        interval3Values,
        interval4Values,
    } = data;

    // self.postMessage({
    //     log: data,
    // });


    let operators = [
        new OscillatorOperator({sampleRate}),
        new OscillatorOperator({sampleRate}),
        new OscillatorOperator({sampleRate}),
        new OscillatorOperator({sampleRate}),
        new OscillatorOperator({sampleRate}),
    ];

    const lengthSamples = settings.length * sampleRate;
    const audioArray = new Float32Array(lengthSamples);

    operators.forEach((op) => op.setShape(settings.shape));
    operators.forEach((op) => op.setPhase(settings.phase));

    for (let a = 0; a < lengthSamples; a++) {
        const freq = voz(freqInputValues[a]) + settings.frequency;
        const amp = voz(ampInputValues[a]) + settings.amplitude;
        const bias = voz(biasInputValues[a]) + settings.bias;
        const mixCurve = voz(mixCurveInputValues[a]) + settings.mixCurve;

        const interval1 = voz(interval1Values[a]) + settings.interval1;
        const interval2 = voz(interval2Values[a]) + settings.interval2;
        const interval3 = voz(interval3Values[a]) + settings.interval3;
        const interval4 = voz(interval4Values[a]) + settings.interval4;

        const frequencies = operators.map(
            (operator, operatorNumber) => frequencyGetter(
                operatorNumber,
                interval1,
                interval2,
                interval3,
                interval4,
                freq
            )
        );

        operators.forEach((operator, operatorNumber) => {
            const ampMultiplier = (Math.sin(mixCurve * Math.PI * operatorNumber / operators.length) + 1) / 14.3;
            audioArray[a] += operator.calculateSample(
                frequencies[operatorNumber], amp * ampMultiplier, bias
            );
        });
    }

    self.postMessage({
        audioArray
    });
};
