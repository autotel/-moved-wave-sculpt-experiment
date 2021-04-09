import Operator from "./Operator"
import { sampleRate } from "../common/vars";
import saturate1 from "../../utils/saturate1";
//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
//https://www.musicdsp.org/en/latest/Filters/26-LpMoog-vcf-variation-2.html#id2
//todo: frequency and gain are off.
class LpMoog extends Operator{
    constructor(){
        super();
        let msgcount = 0;
        let in1, in2, in3, in4, out1, out2, out3, out4
        in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
        
        this.reset=()=>{
            in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
            msgcount=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency<0) frequency=0;
            let f = (frequency / sampleRate) * 1.16;
            
            let af = 1-f;
            let sqf = f*f;

            let fb = reso * (1.0 - 0.15 * sqf);

            let outSample=0;
            sample -= out4 * fb;
            sample *= 0.35013 * (sqf)*(sqf);

            out1 = sample + 0.3 * in1 + af * out1; // Pole 1
            in1 = sample;
            out2 = out1 + 0.3 * in2 + af * out2; // Pole 2
            in2 = out1;
            out3 = out2 + 0.3 * in3 + af * out3; // Pole 3
            in3 = out2;
            out4 = out3 + 0.3 * in4 + af * out4; // Pole 4
            in4 = out3;

            outSample = out4 * gain;
            // if(msgcount<20){
            //     msgcount++
            //     console.log({
            //         in1, in2, in3, in4, out1, out2, out3, out4,
            //         sample,frequency,reso,reso,order,
            //         f,fb,outSample
            //     });
            // }else if(msgcount==20){
            //     msgcount++
            //     console.log("omitting the rest...");
            // }
            // if(isNaN(frequency)) throw new Error("frequency is NaN");
            // if(isNaN(reso)) throw new Error("reso is NaN");
            // if(isNaN(fb)) throw new Error("fb is NaN");
            // if(isNaN(sample)) throw new Error("sample is NaN");
            // if(isNaN(in1)) throw new Error("in1 is NaN");
            // if(isNaN(out1)) throw new Error("out1 is NaN "+in1);
            // if(isNaN(out2)) throw new Error("out2 is NaN");
            // if(isNaN(out3)) throw new Error("out3 is NaN");
            // if(isNaN(out4)) throw new Error("out4 is NaN");
            // if(isNaN(outSample)) throw new Error("outSample is NaN");

            return saturate?saturate1(outSample):outSample;
        }
    }
}
export default LpMoog;