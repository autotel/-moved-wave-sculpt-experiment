import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/elements";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Oscillator from "../SoundModules/Oscillator";
import round from "../utils/round";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";
import Canvas from "../scaffolding/Canvas";

/**
 * @namespace DomInterface.OscillatorDisplay
 */

/** 
 * @class OscillatorDisplay
 * @extends WaveLane
 */
class OscillatorDisplay extends WaveLane{
    /**
     * @param {object} options
     * @param {Oscillator} options.model
     * @param {Canvas} options.drawBoard
     **/
    constructor (options){
        const {model,drawBoard} = options;
        const settings=typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Oscillator";
        Object.assign(settings,options);

        const translator=new ValuePixelTranslator(settings);

        super(translator,settings);

        const frequencyKnob = this.addKnob("frequency");
        const phaseKnob = this.addKnob("phase").setMinMax(0,1);
        const amplitudeKnob = this.addKnob("amplitude");
        const biasKnob = this.addKnob("bias");
        const lengthKnob = this.addKnob("length");
        // const xToFrequency = (x)=>{
        //     const pixelRange=settings.width;
        //     return Math.pow(2,(x/pixelRange)*15);
        // }
        const xToFrequency = (x)=>{
            const period = translator.xToSeconds(x);
            const freq = 1/period;
            return freq;
        }
        const freqToX = (freq)=>{
            const period = 1/freq;
            const x = translator.secondsToX(period);
            return x;
        }

        const yToAmplitude = translator.yToAmplitude;

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);


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

        let pixFreqOnDragStart;

        contents.add(frequencyHandle);

        frequencyDraggable.setPosition({x:0,y:0});

        frequencyDraggable.dragStartCallback=(mouse)=>{
            frequencyHandle.set("r",1);
        }
        frequencyDraggable.dragEndCallback=(mouse)=>{
            frequencyHandle.set("r",10);
        }

        model.onUpdate((changes)=>{
            if(
                changes.frequency!==undefined ||
                changes.amplitude!==undefined
            ){
                readoutText.set("text",
                    `${
                        round(model.settings.frequency,4)
                    }Hz; ${
                        round(model.settings.amplitude,4)
                    }U ${
                        model.settings.frequency>(settings.rangeSamples/10)?"(ALIASED)":""
                    }`);
            }
        });

        model.triggerInitialState();
    }
};

export default OscillatorDisplay;
