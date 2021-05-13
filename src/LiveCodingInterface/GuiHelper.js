import { Div }  from "../dom-model-gui/GuiComponents/DOMElements";
import LiveCodingInterface from "./index";

class LiveCodingInterfaceGuiHelper extends Div{
    /** @param {Object} props 
     * @param {LiveCodingInterface} props.liveCodingInterface
     **/
    constructor({liveCodingInterface}){
        super();
        this.domElement.setAttribute("style","z-index: 10;position: absolute;");
        let parent = this;
        Object.keys(
            liveCodingInterface.possibleModules
        ).forEach(function(modulename){
            const Constructor = liveCodingInterface.possibleModules[modulename];
            let newDiv = new Div();
            newDiv.addClass("button");
            
            let abbrname = modulename.toLowerCase().slice(0,3);
            newDiv.domElement.innerHTML="+" + modulename;
            parent.add(newDiv);
            newDiv.domElement.addEventListener("click",()=>{
                liveCodingInterface.create(Constructor,abbrname);
            });
        });
        
    }
}
export default LiveCodingInterfaceGuiHelper;