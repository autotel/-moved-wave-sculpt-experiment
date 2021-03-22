import { Circle, Line, Path, Text } from "../scaffolding/elements";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Hoverable from "./components/Hoverable";
import round from "../utils/round";

/**
 * @namespace DomInterface.GenericDisplay
 */
/** 
 * @class GenericDisplay
 * @extends WaveLane
 */
class GenericDisplay extends WaveLane{

    /** @param {import("./components/Lane").LaneOptions} options */
    constructor(options){
        const {model,drawBoard} = options;
        const settings=typicalLaneSettings(model,drawBoard);
        Object.assign(settings,settings);
        const translator=new ValuePixelTranslator(settings);
        super(translator,settings);
        //lane has a contents sprite.
        const contents=this.contents;
        
        const hoverText=new Text();
        hoverText.attributes.class="hover-text";

        const hoverable=new Hoverable(this.domElement);

        hoverable.mouseMoveCallback=(position)=>{
            const sampleNumberHere = translator.xToSampleNumber(
                position.x
            );
            let levelHere = model.cachedValues[
                sampleNumberHere
            ];
            let yhere=translator.amplitudeToY(levelHere);
            if(isNaN(levelHere)) levelHere=translator.amplitudeToY(0);
            hoverText.attributes.y=yhere;
            //position.x - settings.x;
            hoverText.attributes.x=position.x - settings.x;
            hoverText.attributes.text=round(levelHere,2)+", "+sampleNumberHere;
            hoverText.update();
        }
        hoverable.mouseEnterCallback=(position)=>{
            hoverText.domElement.classList.add("active");
        }
        hoverable.mouseLeaveCallback=(position)=>{
            hoverText.domElement.classList.remove("active");
        }
        contents.add(hoverText);

        model.triggerInitialState();
    }
};

export default GenericDisplay;
