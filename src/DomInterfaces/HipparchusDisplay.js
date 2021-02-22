import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/elements";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Hipparchus from "../SoundModules/Hipparchus";
import round from "../utils/round";
import WaveDisplay from "./components/WaveDisplay";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";

/**
 * @namespace DomInterface.HipparchusDisplay
 */

/** 
 * @class HipparchusDisplay
 * @extends WaveLane
 */
class HipparchusDisplay extends WaveLane{
    /** @param {Object<String,Model|string|number>} options */
    constructor (options){
        const model = options.model;
        const settings=typicalLaneSettings(model);
        //plave for defaults
        settings.name="Hipparchus";
        Object.assign(settings,options);

        const translator=new ValuePixelTranslator(settings);

        super(translator,settings);

        this.addKnob("rotation").setMinMax(0,2);
        this.addKnob("gain").setMinMax(0,2);
        

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);


    }
};

export default HipparchusDisplay;
