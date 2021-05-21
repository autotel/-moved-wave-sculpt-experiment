import { SVGGroup, Circle, Path } from "../../dom-model-gui/GuiComponents/SVGElements";
import Clickable from "../../dom-model-gui/Interactive/Clickable";

class SmallDeleteButton extends SVGGroup {
    constructor(userProps) {
        const properties = {
            x:0,y:0
        }
        
        Object.assign(properties, userProps);
        
        super(userProps);
        
        this.addClass("small-delete-button");
        const clickCallbacks = [];
        this.onClick = (clickCallback) => clickCallbacks.push(clickCallback);
        
        const circle = new Circle({r:7,cx:0,cy:0});

        const zs = 3;
         
        let crossString = "";
        crossString += `M ${-zs} ${-zs} `;
        crossString += `L ${zs} ${zs} `;
        crossString += `M ${-zs} ${zs} `;
        crossString += `L ${zs} ${-zs} `;
        const cross = new Path({ d: crossString });

        this.add(circle, cross);
        
        let clickable = new Clickable(this);
        clickable.clickCallback = () => clickCallbacks.forEach(c => c());

    }
}

export default SmallDeleteButton;