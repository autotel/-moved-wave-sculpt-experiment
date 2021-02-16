import { Path } from "../../scaffolding/elements";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";


class WaveDisplay extends Path{
    /** @param {ValuePixelTranslator} translator */
    constructor(translator) {

        const settings=translator.settings;

        super({
            d: `M ${0},${settings.height / 2}
            L ${0},${settings.height / 2} ${settings.width},${settings.height / 2}`,
            fill: "transparent",
            stroke: "black"
        });
        

        const superSet = this.set;

        this.set = (what,value) => {
            const {
                rangeAmplitude
            }=settings;

            if (what == "wave") {
                const theWave = value;
                let str = `M ${0},${settings.height / 2}`;
                
                let end = Math.min(
                    settings.width,
                    translator.sampleNumberToX(theWave.length)
                );
                //todo: take whichever has less: pixels or samples.
                //when multi samples per pixel, use max and a filled area
                //otherwise, it's a line
                for (let pixelNumber = 0; pixelNumber < end; pixelNumber++) {
                    const index=translator.xToSampleNumber(pixelNumber);
                    const top = translator.amplitudeToY(theWave[index]);
                    str += `L ${pixelNumber},${top}`;
                }

                str += `L ${end},${translator.amplitudeToY(0)}`;
                str += `L ${0},${translator.amplitudeToY(0)} `;
                str += `z`;

                superSet('d',str);
            }
        };
    }
}
export default WaveDisplay;
