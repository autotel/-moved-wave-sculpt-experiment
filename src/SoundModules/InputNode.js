import Module from "./Module";

/** @param {Module} owner */
class InputNode {
    constructor(owner) {
        this.isInputNode=true;
        /** @type {undefined | Module} */
        this.input = undefined;
        this.owner = owner;
        /** @returns {Promise<Float64Array>} */
        this.getValues = async (recursion) => {
            // if(!this.input) throw new Error("requested getValues from nonconnected input");
            if (this.input)
                return await this.input.getValues(recursion);
            return new Float64Array(0);
        };
        
        this.cacheObsolete = owner.cacheObsolete;
    }
}
export default InputNode;

