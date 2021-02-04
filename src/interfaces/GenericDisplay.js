import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path } from "../scaffolding/elements";

import Lane from "./components/Lane";
import Module from "../models/Module";
import WaveDisplay from "./components/WaveDisplay";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";

class GenericDisplay extends WaveLane{

    /** @param {Object<String,Model|string|number>} options */
    constructor(options){
        const {model} = options;
        const settings=typicalLaneSettings(model);
        Object.assign(settings,options);
        const translator=new ValuePixelTranslator(settings);
        super(translator,settings);
        //lane has a contents sprite.
        const contents=this.contents;

        model.triggerInitialState();
    }
};

export default GenericDisplay;
