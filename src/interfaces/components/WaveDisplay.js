import { Path } from "../../scaffolding/elements";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import VerticalZoom from "./VerticalZoom";

class WaveDisplay extends Path{
    /** @param {ValuePixelTranslator} translator */
    constructor(translator) {

        const settings=translator.settings;

        super({
            d: `M ${0},${settings.height / 2}
            Q ${0},${settings.height / 2} ${settings.width},${settings.height / 2}`,
            fill: "transparent",
            stroke: "black"
        });
        

        const superSet = this.set;

        this.set = (...p) => {
            const {
                rangeAmplitude
            }=settings;

            if (p[0] == "wave") {
                const theWave = p[1];
                let str = `M ${0},${settings.height / 2}`;
                
                // let valsPerPixel = ;
                
                let topOffset = settings.height / 2;
                let prevTop = topOffset;
                //todo: take whichever has less: pixels or samples.
                //when multi samples per pixel, use max and a filled area
                //otherwise, it's a line
                for (let pixelNumber = 0; pixelNumber < settings.width; pixelNumber++) {
                    const top = translator.amplitudeToY(
                        theWave[
                            translator.xToSampleNumber(pixelNumber)
                        ]
                    );

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
