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
        this.myConnectedOutput = false;

        /** @returns {Promise<Float32Array>} */
        this.getValues = async (recursion) => {
            if (this.myConnectedOutput)
                return await this.myConnectedOutput.getValues(recursion);
            return new Float32Array(0);
        };

        this.getOwner=()=>ownerModule;
        

        // this.cacheObsolete = ownerModule.cacheObsolete;
    }
}
export default Input;