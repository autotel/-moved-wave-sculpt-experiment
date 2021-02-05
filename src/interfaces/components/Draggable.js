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
    /** @param {{
     * x:number,
     * y:number,
     * delta:{
     *     x:number,
     *     y:number,
     * },
     * start:{
     *     x:number,
     *     y:number,
     * }
     * }} newPosition */
    this.positionChanged=(newPosition)=>{

    }

    /** @param {Vector2|{x:number,y:number}} newPosition */
    this.setPosition=(newPosition)=>{
        position.set(newPosition);
        this.positionChanged(newPosition);
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

Draggable.mouse = new Mouse();;
/** @param {Node} canvas */
Draggable.setCanvas=(canvas=document)=>{
    const mouse = Draggable.mouse;

    canvas.addEventListener("mousemove",(evt)=>{
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