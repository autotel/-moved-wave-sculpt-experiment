import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path } from "../scaffolding/elements";

import Lane from "./components/Lane";
import Module from "../models/Module";
import WaveDisplay from "./components/WaveDisplay";

/** @param {Module} model */
class GenericDisplay extends Lane{
    constructor(model){
        const mySettings={
            width:800,height:100,
        }

        super({
            width:mySettings.width,x:0,y:0,
            name:"wave display"
        });

        //lane has a contents sprite.
        const contents=this.contents;


        const waveDisplay=new WaveDisplay(mySettings);
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
