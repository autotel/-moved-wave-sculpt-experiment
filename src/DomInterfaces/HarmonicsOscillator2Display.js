import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import { SVGElementsArray, SVGListElement } from "../dom-model-gui/GuiComponents/ElementsArray";
import { Line, Text } from "../dom-model-gui/GuiComponents/SVGElements";
import HarmonicsOscillator2 from "../SoundModules/HarmonicsOscillator2";
import times from "../utils/times";
import round from "../dom-model-gui/utils/round";
import Model from "../dom-model-gui/Model";
import Knob from "../dom-model-gui/GuiComponents/Knob";
const vectorTypes = require("../dom-model-gui/utils/Vector2");
/** @typedef {vectorTypes.MiniVector} MiniVector */

/**
 * @namespace DomInterface.HarmonicsOscillator2Display
 */

const frequencyToPosX = (f,centerFreq) => {
    return Math.log2(f/centerFreq);
}
const posXToFrequency = (posx) => {
    return Math.pow(2,posx);
}

let c = 0;
class HarmonicLine extends SVGListElement{
    /**
     * @param {Object} props
     * @param {HarmonicsOscillator2} props.module
     * @param {number} props.width
     * @param {number} props.height
     */
    constructor({width,height,module}){
        super();

        let shown = false;
        console.log("harmonicLine",{width,height,module});
        const line = new Line();
        const text = new Text();
        const halfHeight = height / 2;

        this.hide = () => {
            if(!shown) return;
            shown=false;
            this.remove(line);
            this.remove(text);
        }

        this.show = () => {
            if(shown) return;
            shown=true;
            this.add(line);
            this.add(text);
        }

        this.set=({number,width})=>{
            let halfWidth = width / 2;
            const frequency = module.getHarmonicFrequencyMultiplier(
                number, module.settings.distance
            );
            let x = halfWidth + (Math.log2(frequency) * width / 5);
            let x1=x;

            console.log({x,number,width});

            let y1=height - HarmonicsOscillator2.falloffFunction(
                number / module.settings.harmonics,
                module.settings.falloff
            ) * halfHeight;
            
            let x2=x;
            let y2=height;
            
            Object.assign(line.attributes,{
                x1,y1,x2,y2,
            });
            line.update();
            Object.assign(text.attributes,{
                x:x1,y:y1,text:round(frequency,3),
            });
            text.update();
        }
    }
}

class FrequencyLine extends SVGListElement{
    constructor({width,height}){
        super();
        const line = new Line();
        this.hide = () => {
            this.remove(line);
        }
        this.show = () => {
            this.add(line);
        }
        this.set=(settings)=>{
            let x = frequencyToPosX(settings.frequency);
            let x1=x;
            let y1=0;
            let x2=x;
            let y2=height;
            Object.assign(line.attributes,{
                x1,y1,x2,y2,
            });
        }
    }
}

/** 
 * @class HarmonicsOscillator2Display
 * @extends WaveLane
 */
class HarmonicsOscillator2Display extends WaveLane{
    /** @param {import("./components/Lane").LaneOptions} options */
    constructor(options){
        const {module,drawBoard} = options;
        const settings=typicalLaneSettings(module,drawBoard);
        Object.assign(settings,options);
        super(settings);
        

        Object.keys(module.settings).forEach((settingName,settingNumber)=>{
            const settingValue = module.settings[settingName];
            const settingType = typeof settingValue;
            if(settingType === "number"){
                this.addKnob(settingName);
            }else if(settingType === "boolean"){
                this.addToggle(settingName);
            }else if(settingValue.constructor && settingValue.constructor.name === "Float32Array"){
                this.addSoundDecoder(settingName);
            }
        });

        const extraControlSettings={fine:0};
        const additionalControls = new Model(extraControlSettings);

        let fineKnob = new Knob();
        fineKnob.setToModelParameter(additionalControls,"fine");
        this.appendToControlPanel(fineKnob);

        additionalControls.onUpdate((changes)=>{
            //note that using !== undefined would cause an infinite recursion loop 
            if(changes.fine){
                module.set({
                    distance:module.settings.distance + changes.fine / 100
                });
            };
        });

        let harmonicLines = new SVGElementsArray(
            HarmonicLine,
            {   
                module,
                width:settings.width,
                height:settings.height
            }
        );

        module.onUpdate((changes)=>{
            if(
                changes.harmonics 
                || changes.falloff
                || changes.distance
            ){
                let harmarray = [];
                times(
                    number=>harmarray.push({number,width:settings.width}),
                    module.settings.harmonics
                );
                harmonicLines.displayArray(harmarray);
            }
        });

        let referenceLines = new SVGElementsArray(
            FrequencyLine,
            {   
                module,
                width:options.width,
                height:options.height
            }
        );

        this.add(harmonicLines,referenceLines);

        module.onUpdate((changes)=>{
            if(
                changes.harmonics 
                || changes.falloff
                || changes.distance
            ){
                let harmarray = [];
                times(number=>harmarray.push({
                    number:Math.pow(2,number)
                },5));
                referenceLines.displayArray(harmarray);
            }
        });

        module.triggerInitialState();
    }
};

export default HarmonicsOscillator2Display;
