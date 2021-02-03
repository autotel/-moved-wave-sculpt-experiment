import Sprite from "../scaffolding/Sprite";
import { Circle, Line, Path } from "../scaffolding/elements";
import Interface from "../scaffolding/Interface";
import Lane from "./components/Lane";
import Module from "../models/Module";
import WaveDisplay from "./components/WaveDisplay";

/** @param {Module} model */
function GenericDisplay(model){
    const mySettings={
        width:800,height:100,
    }

    Lane.call(this,{
        width:mySettings.width,x:0,y:0,
        name:"wave display"
    });

    //lane has a contents sprite.
    const contents=this.contents;

    Interface.call(this);

    const waveDisplay=new WaveDisplay(mySettings);
    contents.add(waveDisplay);

    model.onUpdate(function(changes){
        if(changes.cachedValues){
            waveDisplay.set("wave",changes.cachedValues);
        }
    });
    model.triggerInitialState();
};

export default GenericDisplay;
