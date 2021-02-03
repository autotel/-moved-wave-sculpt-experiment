import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/elements";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Oscillator from "../models/Oscillator";
import round from "../utils/round";
import WaveDisplay from "./components/WaveDisplay";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";

class OscillatorDisplay extends Lane{
    /** @param {Oscillator} model */
    constructor (model){

        const translator=new ValuePixelTranslator({
        centerValue:0,range:2, width:800, height:100,
        model
        })

        super({
            width:translator.width,x:0,y:0,
            name:"Oscillator"
        });

        const xToFrequency = (x)=>{
            return x;
        }
        const yToAmplitude = translator.yToAmplitude;

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new Text({
            class:"freq-times-amp",
            x:10, y:translator.height/2,
            text:"---",
        });

        contents.add(readoutText);

        const waveDisplay=new WaveDisplay(translator);
        contents.add(waveDisplay);

        //TODO: some knob or text field
        const frequencyHandle = new Circle({r:10});

        const frequencyDraggable=new Draggable(frequencyHandle.domElement);

        frequencyDraggable.positionChanged=(newPosition)=>{
            frequencyHandle.attributes.cx=newPosition.x;
            frequencyHandle.attributes.cy=newPosition.y;
            frequencyHandle.update();
            model.setFrequency(xToFrequency(newPosition.x));
            model.setAmplitude(yToAmplitude(newPosition.y));
        }

        contents.add(frequencyHandle);

        frequencyDraggable.setPosition(new Vector2(translator));

        frequencyDraggable.dragStartCallback=(mouse)=>{
            frequencyHandle.set("r",1);
        }
        frequencyDraggable.dragEndCallback=(mouse)=>{
            frequencyHandle.set("r",10);
        }


        model.onUpdate((changes)=>{
            if(changes.cachedValues){
                waveDisplay.set("wave",changes.cachedValues);
            }
            if(
                changes.frequency!==undefined ||
                changes.amplitude!==undefined
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
    }
};

export default OscillatorDisplay;
