import Vector2 from "../../scaffolding/Vector2"
const VectorTypedef = require("../../scaffolding/Vector2");

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */


/**
 * @typedef {Node} NodeWithClassList
 * @property {Set<string>} classList
 * @exports NodeWithClassList
 */



/**
 * @class Clickable
 * 
 * thing that can be dragged. It does not implement actual updating of position,
 * as it doesn't assume the object to have certain properties for position or 
 * certain render methods. The user must implement by using dragCallback function
 * override
 *  @constructor 
 *  @param {HTMLElement|SVGElement} domElement */
function Clickable(domElement){


    this.clickCallback=(mouse)=>{
    }
    this.releaseCallback=()=>{
    }

    domElement.addEventListener('mousedown',()=>this.clickCallback());
    domElement.addEventListener('mouseup',()=>this.releaseCallback());

    domElement.classList.add("clickable");
}

export default Clickable;