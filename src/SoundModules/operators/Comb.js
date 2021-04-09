import Operator from "./Operator";
import saturate1 from "../../utils/saturate1";
import { sampleRate } from "../common/vars";
//I havent checked that this is actually a comb filter
class Comb extends Operator{
    constructor(){
        super();

        let delayBuf=[];
        
        this.reset=()=>{
            delayBuf=[];
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            reso *= 0.5;
            gain *= 0.5;
            frequency /= 4;

            let period = sampleRate/frequency;
            
            let delayedSample = 0;
            
            if(delayBuf.length>period){
                delayedSample = delayBuf.shift();
            }

            sample *= reso;
            sample += delayedSample * reso;
            delayBuf.push(sample);
            
            let outSample = sample * gain;
            return saturate?saturate1(outSample):outSample;
        }
    }
}
export default Comb;