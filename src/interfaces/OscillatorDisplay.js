import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/elements";
import Interface from "../scaffolding/Interface";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Oscillator from "../models/Oscillator";
import round from "../utils/round";
/** @param {Oscillator} model */
function OscillatorDisplay(model){
    const mySettings={
        width:800,height:100,
    }

    Lane.call(this,{
        width:mySettings.width,x:0,y:0,
        name:"Oscillator"
    });

    //lane has a contents sprite.
    const contents=this.contents;

    Interface.call(this);

    function xToFrequency(x){
        return x;
    }
    function yToAmplitude(y){
        return 1 - 2 * y / mySettings.height;
    }

    const readoutText =  new Text({
        class:"freq-times-amp",
        x:10, y:mySettings.height/2,
        text:"---",
    });

    contents.add(readoutText);

    const oscLine = new Path({
        d:`M ${0},${mySettings.height/2}
        Q ${0},${mySettings.height/2} ${mySettings.width},${mySettings.height/2}`,
        fill:"transparent",
        stroke:"black"
    });
    
    contents.add(oscLine);

    //TODO: some knob or text field
    const frequencyHandle = new Circle({
        r:10
    });

    const frequencyDraggable=new Draggable(frequencyHandle.domElement);

    frequencyDraggable.positionChanged=(newPosition)=>{
        frequencyHandle.attributes.cx=newPosition.x;
        frequencyHandle.attributes.cy=newPosition.y;
        frequencyHandle.update();
        model.setFrequency(xToFrequency(newPosition.x));
        model.setAmplitude(yToAmplitude(newPosition.y));
    }

    contents.add(frequencyHandle);
    
    frequencyDraggable.setPosition(new Vector2(mySettings));

    frequencyDraggable.dragStartCallback=(mouse)=>{
        frequencyHandle.set("r",1);
    }
    frequencyDraggable.dragEndCallback=(mouse)=>{
        frequencyHandle.set("r",10);
    }

    model.onUpdate((modelChanges)=>{
        console.log(modelChanges);
        if(modelChanges.cachedValues){
            const {cachedValues}=modelChanges;
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
        if(
            modelChanges.frequency!==undefined ||
            modelChanges.amplitude!==undefined 
        ){
            readoutText.set("text",
                `${
                    round(model.settings.frequency,4)
                }Hz; ${
                    round(model.settings.amplitude,4)
                }`);
        }

    });
    model.triggerInitialState();
};

export default OscillatorDisplay;