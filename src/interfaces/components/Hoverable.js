import Vector2 from "../../scaffolding/Vector2"

/**
 * thing that can be dragged. It does not implement actual updating of position,
 * as it doesn't assume the object to have certain properties for position or 
 * certain render methods. The user must implement by using dragCallback function
 * override
 */

/**
 * @typedef {Object} HasClassList
 * @property {Set<string>} classList
 * @typedef {Node & HasClassList} NodeWithClassList
 * @exports NodeWithClassList
 */

/** @param {HTMLElement|SVGElement} domElement */
function Hoverable(domElement){

    const position = new Vector2();

    domElement.addEventListener("mouseenter",(evt)=>{
        domElement.classList.add("active");
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseEnterCallback(position);
    });
    
    domElement.addEventListener("mouseleave",(evt)=>{
        domElement.classList.remove("active");
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseLeaveCallback(position);
    });

    domElement.addEventListener("mousemove",(evt)=>{
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseMoveCallback(position);
    });


    this.mouseEnterCallback=(position)=>{
    }
    this.mouseLeaveCallback=(position)=>{
    }
    this.mouseMoveCallback=(position)=>{
    }

    /** @param {Vector2|{x:number,y:number}} newPosition */
    this.setPosition=(newPosition)=>{
        position.set(newPosition);
        this.positionChanged(newPosition);
    }

    domElement.classList.add("draggable");
}

export default Hoverable;