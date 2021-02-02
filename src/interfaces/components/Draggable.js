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

/** @param {Node} domElement */
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
        this.positionChanged(position);
    }
    this._dragStart=(mouse)=>{

        dragStartPosition.set(
            Vector2.sub(position,mouse)
        );

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
        // console.log("dragStart",mouse);
    }
    this.dragEndCallback=(mouse)=>{
        // console.log("dragEnd",mouse);
    }
    /** @param {Vector2} newPosition */
    this.positionChanged=(newPosition)=>{

    }

    /** @param {Vector2} newPosition */
    this.setPosition=(newPosition)=>{
        position.set(newPosition);
        this.positionChanged(newPosition);
    }

    domElement.classList.add("draggable");
}

Draggable.mouse={};
/** @param {Node} canvas */
Draggable.setCanvas=(canvas=document)=>{
    const mouse = Draggable.mouse = new(function(){
        Vector2.call(this);

        /** @type {boolean} */
        this.pressed=false;
        /** @type {Set<Draggable>} */
        this.selected=new Set();
        /** @type {false|Draggable} */
        this.isHovering=false;
        this.dragStartPosition=new Vector2();
        this.dragDelta=new Vector2();

    })();



    canvas.addEventListener("mousemove",(evt)=>{
        mouse.x=evt.clientX;
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