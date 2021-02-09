import { Path } from "../../scaffolding/elements";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import VerticalZoom from "./VerticalZoom";
import Hoverable from "./Hoverable";

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
                let lastLevel = 0;
                let topOffset = settings.height / 2;
                let prevTop = topOffset;
                //todo: take whichever has less: pixels or samples.
                //when multi samples per pixel, use max and a filled area
                //otherwise, it's a line
                for (let pixelNumber = 0; pixelNumber < settings.width; pixelNumber++) {
                    const index=translator.xToSampleNumber(pixelNumber);
                    if(index>=theWave.length){
                        //value gets "frozen"
                        str += `Q ${settings.width},${prevTop} ${settings.width},${prevTop}`;
                        break;
                    }

                    const levelNow=theWave[index];
                    
                    lastLevel=levelNow;
                    
                    const top = translator.amplitudeToY(
                        lastLevel
                    );

                    if (pixelNumber > 0)
                        str += `Q ${pixelNumber - 1},${prevTop} ${pixelNumber},${top}`;
                    prevTop = top;
                }

                str += `Q ${settings.width},${prevTop} ${settings.width},${translator.amplitudeToY(0)}`;
                str += `Q ${settings.width},${translator.amplitudeToY(0)} ${0},${translator.amplitudeToY(0)} `;
                str += `z`;

                p = ['d', str];
            }
            superSet(...p);
        };
    }
}
export default WaveDisplay;
