import Operator from "./Operator";
//just average, only takes sample into account
class BasicDelay extends Operator{
    constructor(){
        super();
        this.delayCache;

        this.reset=()=>{
            this.delayCache=[];
        }

        this.calculateSample=(sample,lengthSamples)=>{
            let len = this.delayCache.push(sample);
            if(len > lengthSamples){
                this.delayCache.splice(0,this.delayCache.length-lengthSamples);
            }
            return this.delayCache[0];
        }
        
        this.reset();
    }
}

export default BasicDelay;