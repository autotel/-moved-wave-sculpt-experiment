
//only for type:
import { Component } from "./elements";

function Canvas(){
    // const element = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    const element =  document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    this.element = element;
    // element.setAttribute('viewBox',"0 0 100 100");
    // element.setAttribute('width',"100");
    // element.setAttribute('height',"100");
    document.body.appendChild(element);
    /** @param {Component} elem */
    this.add=(elem)=>{
        element.appendChild(elem.domElement);
    }
}

export default Canvas;