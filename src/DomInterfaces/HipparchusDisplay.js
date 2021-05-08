import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path, Text } from "../scaffolding/GraphicElements";
import Lane from "./components/Lane";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import Hipparchus from "../SoundModules/Hipparchus";
import round from "../utils/round";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";
import Canvas from "../scaffolding/Canvas";

/**
 * @namespace DomInterface.HipparchusDisplay
 */

/** 
 * @class HipparchusDisplay
 * @extends WaveLane
 */
class HipparchusDisplay extends WaveLane{
    /**
     * @param {object} options
     * @param {Hipparchus} options.module
     * @param {Canvas} options.drawBoard
     **/
    constructor (options){
        const {module,drawBoard} = options;
        const settings=typicalLaneSettings(module,drawBoard);
        //plave for defaults
        settings.name="Hipparchus";
        Object.assign(settings,options);

        super(options);

        this.addKnob("rotation").setMinMax(0,2);
        this.addKnob("rightOffset").setMinMax(-1,1);
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
