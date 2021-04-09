import Output from "./Output";
import Module from "../common/Module";
import getMyNameInObject from "../../utils/getMyNameInObject";

class Input {
    /** 
     * @param {Module} ownerModule
     */
    constructor (ownerModule) {
        this.owner=ownerModule;

        setTimeout(()=>{
            /** @type {string} */
            this.name = getMyNameInObject(this,ownerModule.inputs)||"";
            if(!this.name) throw new Error("Input not found in module's inputs object");
        },0);

        /**
         * input from which I get sound
         * @type {false|Output} 
         */
        let myOutput = false;

        /** @returns {Promise<Float32Array>} */
        this.getValues = async (recursion) => {
            if (myOutput)
                return await myOutput.getValues(recursion);
            return new Float32Array(0);
        };

        this.getOwner=()=>ownerModule;
        
        /** @param {Output|false} ifMatches */
        this.disconnect=(ifMatches=false)=>{
            if(ifMatches){
                if(myOutput!==ifMatches) return;
            }
            myOutput=false;
        }

        this.cacheObsolete = ownerModule.cacheObsolete;
    }
}
export default Input;