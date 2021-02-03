import { Path } from "../../scaffolding/elements";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";

/** @param {ValuePixelTranslator} translator */
class WaveDisplay extends Path{
    constructor(translator) {
        
        super({
            d: `M ${0},${translator.height / 2}
        Q ${0},${translator.height / 2} ${translator.width},${translator.height / 2}`,
            fill: "transparent",
            stroke: "black"
        });

        const superSet = this.set;

        this.set = (...p) => {
            if (p[0] == "wave") {
                const theWave = p[1];
                let str = `M ${0},${translator.height / 2}`;
                let valsPerPixel = Math.floor(theWave.length / translator.width);
                let pixelsPerVal = translator.width / theWave.length;
                let topOffset = translator.height / 2;
                let prevTop = topOffset;
                //todo: take whichever has less: pixels or samples.
                //when multi samples per pixel, use max and a filled area
                //otherwise, it's a line
                for (let pixelNumber = 0; pixelNumber < translator.width; pixelNumber++) {
                    const top = 0.5 * translator.height * theWave[pixelNumber * valsPerPixel] + topOffset;
                    if (pixelNumber > 0)
                        str += `Q ${pixelNumber - 1},${prevTop} ${pixelNumber},${top}`;
                    prevTop = top;
                }
                p = ['d', str];
            }
            superSet(...p);
        };
    }
}
export default WaveDisplay;
