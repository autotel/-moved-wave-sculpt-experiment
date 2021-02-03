import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path } from "../scaffolding/elements";

import Lane from "./components/Lane";
import Module from "../models/Module";
import WaveDisplay from "./components/WaveDisplay";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";

/** @param {Module} model */
class GenericDisplay extends Lane{
    constructor(model){
        const settings=typicalLaneSettings(model);
        const translator=new ValuePixelTranslator(settings);

        super({
            width:settings.width,x:0,y:0,
            name:"wave display"
        });

        //lane has a contents sprite.
        const contents=this.contents;


        const waveDisplay=new WaveDisplay(translator);
        contents.add(waveDisplay);

        model.onUpdate(function(changes){
            if(changes.cachedValues){
                waveDisplay.set("wave",changes.cachedValues);
            }
        });
        model.triggerInitialState();
    }
};

export default GenericDisplay;
