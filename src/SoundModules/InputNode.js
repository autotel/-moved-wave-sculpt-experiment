import Module from "./Module";

/** @param {Module} owner */
class InputNode {
    constructor(owner) {
        this.isInputNode=true;
        /** @type {undefined | Module} */
        this.input = undefined;
        this.owner = owner;
        /** @returns {Float32Array} */
        this.getValues = (recursion) => {
            // if(!this.input) throw new Error("requested getValues from nonconnected input");
            if (this.input)
                return this.input.getValues(recursion);
            return [];
        };
        
        this.getValue = (sampleNumber) => {
            if(sampleNumber<0) return 0;
            if (this.input){
                if(this.input.cachedValues[sampleNumber]){
                    this.input.cachedValues[sampleNumber];
                }else{
                    this.input.cachedValues[this.input.cachedValues.length - 1];
                }
            }
            return 0;
        }
        this.cacheObsolete = owner.cacheObsolete;
    }
}
export default InputNode;

