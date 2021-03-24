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
 * @class Draggable
 * 
 * thing that can be dragged. It does not implement actual updating of position,
 * as it doesn't assume the object to have certain properties for position or 
 * certain render methods. The user must implement by using dragCallback function
 * override
 *  @constructor 
 *  @param {HTMLElement|SVGElement} domElement */
function Draggable(domElement){

    const position = new Vector2();
    const dragStartPosition = position.clone();

    domElement.addEventListener("mouseenter",(evt)=>{
        Draggable.mouse.isHovering=this;
        domElement.classList.add("active");
    });
    
    domElement.addEventListener("mouseleave",(evt)=>{
        if(!Draggable.mouse.selected.has(this)){
            domElement.classList.remove("active");
        }
        Draggable.mouse.isHovering=false;
    });

    /** do not override */
    this._drag=(mouse)=>{
        position.set(dragStartPosition);
        position.add(mouse.dragDelta);
        
        this.dragCallback(mouse);
        this.positionChanged({
            x:position.x,
            y:position.y,
            delta:mouse.dragDelta,
            localDragOffset:dragStartPosition,
            start:{
                x:dragStartPosition.x,
                y:dragStartPosition.y,
            }
        });
    }
    this._dragStart=(mouse)=>{

        dragStartPosition.set(position);
        
        this.dragStartCallback(mouse);
    }
    this._dragEnd=(...p)=>{
        domElement.classList.remove("active");
        this.dragEndCallback(...p);
    }

    /** override */
    this.dragCallback=(mouse)=>{
    }
    this.dragStartCallback=(mouse)=>{
    }
    this.dragEndCallback=(mouse)=>{
    }

    /**
     * @typedef {MiniVector} DragPosition
     * @property {MiniVector} start
     * @property {MiniVector} delta
     **/
    
    /** @param {DragPosition} newPosition */
    this.positionChanged=(newPosition)=>{

    }

    /** @param {Vector2|MiniVector} newPosition */
    this.setPosition=(newPosition, callback=true)=>{
        position.set(newPosition);
        if(callback) this.positionChanged(newPosition);
    }

    domElement.classList.add("draggable");
}

class Mouse extends Vector2{
    constructor(){
        super();
        /** @type {boolean} */
        this.pressed=false;
        /** @type {Set<Draggable>} */
        this.selected=new Set();
        /** @type {false|Draggable} */
        this.isHovering=false;
        this.dragStartPosition=new Vector2();
        this.dragDelta=new Vector2();
    }
}

Draggable.mouse = new Mouse();
/** @param {Node} canvas */
Draggable.setCanvas=(canvas=document)=>{
    const mouse = Draggable.mouse;

    canvas.addEventListener("mousemove",(evt)=>{
        evt.preventDefault();
        // @ts-ignore
        mouse.x=evt.clientX;
        // @ts-ignore
        mouse.y=evt.clientY;
        mouse.dragDelta = Vector2.sub(mouse,mouse.dragStartPosition);
        if(mouse.pressed){
           if(mouse.selected.size){
               mouse.selected.forEach((draggable)=>{ draggable._drag(mouse) });
           } 
        }
    });

    canvas.addEventListener("mousedown", (evt)=>{
        evt.preventDefault();
        mouse.pressed=true;
        //@ts-ignore
        mouse.dragStartPosition.set({x:evt.clientX,y:evt.clientY});
        // @ts-ignore
        if(evt.button==0){
            //to implement multi element seletion, you would do changes here
            if(mouse.isHovering){
                mouse.selected.clear();
                mouse.selected.add(mouse.isHovering);
                mouse.selected.forEach((draggable)=>{ draggable._dragStart(mouse) });
            }
        }
    });

    canvas.addEventListener("mouseup", (evt)=>{
        mouse.pressed=false;
        if(mouse.selected.size){
            mouse.selected.forEach((draggable)=>{ draggable._dragEnd(mouse) });
            mouse.selected.clear();
        }
    });

}
export default Draggable;