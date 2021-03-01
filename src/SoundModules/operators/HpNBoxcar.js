import LpBoxcar from "./LpBoxcar";
import saturate1 from "../../utils/saturate1";
class HpNBoxcar extends LpBoxcar{
    constructor(){
        super();
        let superCSample = this.calculateSample;
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let output = sample * gain - superCSample(sample,frequency,reso,gain,order,false);
            return saturate?saturate1(output):output;

        }
    }
}

export default HpNBoxcar;