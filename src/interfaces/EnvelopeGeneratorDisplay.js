import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/elements";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Oscillator from "../SoundModules/Oscillator";
import round from "../utils/round";
import WaveDisplay from "./components/WaveDisplay";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import VerticalZoom from "./components/VerticalZoom";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";
import GenericDisplay from "./GenericDisplay";

/**
 * @namespace Interfaces.EnvelopeGeneratorDisplay
 */
/** 
 * @class EnvelopeGeneratorDisplay
 * @extends WaveLane
 */
class EnvelopeGeneratorDisplay extends WaveLane{
    /** @param {Object<String,Model|string|number>} options */
    constructor (options){
        const model = options.model;
        const settings=typicalLaneSettings(model);
        //plave for defaults
        settings.name="Envelope";
        Object.assign(settings,options);

        const translator=new ValuePixelTranslator(settings);

        super(translator,settings);

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);


        //TODO: some knob or text field
        const handles=[
            new Circle({r:10}),
            new Circle({r:10}),
            new Circle({r:10}),
            new Circle({r:10}),
            new Circle({r:10}),
        ];

        handles.map((handle)=>handle.point = [0,0]);
        handles.map((handle)=>{
            const frequencyDraggable=new Draggable(handle.domElement);

            //TODO: more elegant way
            
            frequencyDraggable.positionChanged=(pos)=>{
                handle.attributes.cx=pos.x;
                handle.attributes.cy=pos.y;
                handle.update();
                handle.point=[
                    translator.xToSampleNumber(pos.x),
                    translator.yToAmplitude(pos.y)
                ];
                model.setPoints(handles.map((handleEach)=>handleEach.point));
            }
            contents.add(handle);
    
    
            frequencyDraggable.setPosition(new Vector2());
    
            // frequencyDraggable.dragStartCallback=(mouse)=>{
            //     handles[].set("r",1);
            // }
            // frequencyDraggable.dragEndCallback=(mouse)=>{
            //     handles[].set("r",10);
            // }
        });

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

export default EnvelopeGeneratorDisplay;
