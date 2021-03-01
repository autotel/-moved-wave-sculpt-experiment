import Operator from "./Operator";
import saturate1 from "../../utils/saturate1";
//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
class Pinking extends Operator{
    constructor(){
        super();

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        this.reset=()=>{
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let outSample=0;
            b0 = 0.99886 * b0 + sample * 0.0555179;
            if(order>1) b1 = 0.99332 * b1 + sample * 0.0750759;
            if(order>2) b2 = 0.96900 * b2 + sample * 0.1538520;
            if(order>3) b3 = 0.86650 * b3 + sample * 0.3104856;
            if(order>4) b4 = 0.55000 * b4 + sample * 0.5329522;
            if(order>5) b5 = -0.7616 * b5 - sample * 0.0168980;
            outSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + sample * 0.5362;
            outSample *= gain;
            b6 = sample * 0.115926;
            return saturate?saturate1(outSample):outSample;
        }
    }
}
export default Pinking;