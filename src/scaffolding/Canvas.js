
//only for type:
import { Component } from "./elements";

function Canvas(){
    // const element = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    const element =  document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    this.element = element;
    // element.setAttribute('viewBox',"0 0 1000 1000");
    element.setAttribute('width',"100%");
    element.setAttribute('height',"1000px");
    document.body.appendChild(element);
    /** @param {{domElement:Node}} elem */
    this.add=(elem)=>{
        element.appendChild(elem.domElement);
    }
}

export default Canvas;