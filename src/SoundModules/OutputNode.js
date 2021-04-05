import Module from "./Module";
import InputNode from "./InputNode";

/** @param {Module} owner */
class OutputNode {
    /** @param {Module} owner */
    constructor(owner) {
        this.isOutputNode=true;
        /** @type {Set<InputNode>} */
        this.outputs = new Set();
        this.owner = owner;

        /** @type {Float64Array} */
        this.cachedValues = new Float64Array([0]);

        this.getValues = owner.getValues;
        
        this.cacheObsolete = owner.cacheObsolete;
    }
}
export default OutputNode;

