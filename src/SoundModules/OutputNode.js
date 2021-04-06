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

        /** @type {Float32Array} */
        this.cachedValues = new Float32Array([0]);

        this.getValues = owner.getValues;
        
        this.cacheObsolete = owner.cacheObsolete;
    }
}
export default OutputNode;

