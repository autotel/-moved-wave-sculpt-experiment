/** @typedef {import("../PatchDisplay").NodePosition} NodePosition */

import { Rectangle, Text } from "../../dom-model-gui/GuiComponents/SVGElements";
import Hoverable from "../../dom-model-gui/Interactive/Hoverable";
import { SVGListElement } from "../../dom-model-gui/GuiComponents/ElementsArray";

/** @param  {NodePosition} pos */

class ConnectorGraph extends SVGListElement{
    constructor () {
        super();
        const outputText = new Text();
        const showText=()=> this.add(outputText);
        const hideText=()=> this.remove(outputText);
        const rect = new Rectangle();
        const hoverable = new Hoverable(rect);
        hoverable.mouseEnterCallback=()=>showText();
        hoverable.mouseLeaveCallback=()=>hideText();
        this.add(rect);
        this.set = ({x,y,name}) =>{
            Object.assign(rect.attributes,{
                x: x - 5,
                y: y - 5,
                width: 10,
                height: 10,
            });
            rect.update();
            Object.assign(outputText.attributes,{
                x: x - 20, y: y +3,
                "text-anchor":"end",
                transform:"rotate(90deg)",
                text: name||"out",
            });
            outputText.update();  
        }
    }
}

export default ConnectorGraph;