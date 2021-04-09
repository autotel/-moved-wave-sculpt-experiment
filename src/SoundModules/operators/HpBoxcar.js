import Operator from "./Operator";
import saturate1 from "../../utils/saturate1";
import { sampleRate } from "../common/vars";

//just average, only takes sample into account
class HpBoxcar extends Operator{
    constructor(){
        super();
        let lastOutput = 0;

        this.reset=()=>{
            lastOutput=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            output=(sample - output) * gain
            return saturate?saturate1(output):output;
        }
    }
}

export default HpBoxcar;