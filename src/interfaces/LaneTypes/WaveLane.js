import Lane from "../components/Lane";
import Module from "../../models/Module";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import WaveDisplay from "../components/WaveDisplay";
import VerticalZoom from "../components/VerticalZoom";

class WaveLane extends Lane{

    /** @param {Module} model */
    constructor(model,translator,options){
        const settings=typicalLaneSettings(model);
        //plave for defaults
        settings.name="Wave";
        Object.assign(settings,options);
        
        super({
            width:settings.width,x:0,y:0,
            name:settings.name
        });

        const contents=this.contents;

        const waveDisplay=new WaveDisplay(translator);
        contents.add(waveDisplay);
        
        const zoom = new VerticalZoom(translator);
        contents.add(zoom);
        zoom.changeCallback=()=>{
            waveDisplay.set("wave",model.cachedValues);
        }

        model.onUpdate((changes)=>{
            if(changes.cachedValues){
                waveDisplay.set("wave",changes.cachedValues);
            }
        });
    }
}
export default WaveLane;