import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path } from "../scaffolding/elements";
import Interface from "../scaffolding/Interface";
import Lane from "./components/Lane";
import Module from "../models/Module";

/** @param {Module} model */
function GenericDisplay(model){
    const mySettings={
        width:800,height:100,
    }

    Lane.call(this,{
        width:mySettings.width,x:0,y:0,
        name:"envelope lane"
    });

    //lane has a contents sprite.
    const contents=this.contents;

    Interface.call(this);

    const oscLine = new Path({
        d:`M ${0},${mySettings.height/2}
        Q ${0},${mySettings.height/2} ${mySettings.width},${mySettings.height/2}`,
        fill:"transparent",
        stroke:"black"
    });
    
    contents.add(oscLine);
    
    this.update=function(changes){
        if(changes.cachedValues){
            const {cachedValues}=changes;
            let str = `M ${0},${mySettings.height/2}`;
            let valsPerPixel=Math.floor(cachedValues.length/mySettings.width);
            let pixelsPerVal=mySettings.width/cachedValues.length;
            let topOffset = mySettings.height/2;
            let prevTop = topOffset;
            //todo: take whichever has less: pixels or samples.
            //when multi samples per pixel, use max and a filled area
            //otherwise, it's a line
            for(let pixelNumber=0; pixelNumber<mySettings.width; pixelNumber++){
                const top = 0.5 * mySettings.height * cachedValues[pixelNumber * valsPerPixel] + topOffset;
                if(pixelNumber>0) str +=`Q ${pixelNumber-1},${prevTop} ${pixelNumber},${top}`;
                prevTop=top;
            }
            oscLine.set('d',str);
            
        }
    }
    model.triggerInitialState();
};

export default GenericDisplay;