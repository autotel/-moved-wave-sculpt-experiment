import Operator from "./Operator";
import saturate1 from "../../utils/saturate1";
import { sampleRate } from "../vars";
/**
 * boxcar, but utilizing any amount of steps in series. 
 * note the sample weighting function, which I decided arbitrarily. It could have been linear ramp.
 * not working! it produces undesired bias
 */
class LpNBoxcar extends Operator{
    constructor(){
        super();
        
        let lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
        let dc=0;

        this.reset=()=>{
            lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
            dc=0;
        }

        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency < 0) frequency=0;
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            let weightb = 1-weighta;

            let resoScaled = (reso / 10);
            
            let currentIn=sample + (1 - lastOutputs[order-1]) * resoScaled;

            for(let pole=0; pole<order; pole++){
                lastOutputs[pole] = currentIn * weighta + lastOutputs[pole] * weightb;
                currentIn = lastOutputs[pole];
            }
            let output=currentIn * gain;
            return saturate?saturate1(output):output;
        }
    }
}

export default LpNBoxcar;