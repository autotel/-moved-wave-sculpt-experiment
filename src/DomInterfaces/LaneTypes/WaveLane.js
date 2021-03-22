import Lane from "../components/Lane";
import Module from "../../SoundModules/Module";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import WaveDisplay from "../components/WaveDisplay";
import VerticalZoom from "../components/VerticalZoom";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";

/**
 * @typedef {Object} WaveLaneOptions
 * @property {Module} model
 * @property {string} [name]
 */
class WaveLane extends Lane{
    /**
     * @param {ValuePixelTranslator} translator
     * @param {import("../components/Lane").LaneOptions} options
     */
    constructor(translator,options){
        const {model,drawBoard}=options;
        const settings=typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Wave";
        Object.assign(settings,settings);
        super(translator,options);
        

        const contents=this.contents;

        const waveDisplay=this.waveDisplay = new WaveDisplay(translator);
        waveDisplay.domElement.classList.add("wave-display");
        waveDisplay.domElement.classList.add("no-mouse");
        contents.add(waveDisplay);
        

        const zoom = new VerticalZoom(translator);


        this.autoZoom = () => {
            this.normalizeView();
        }

        zoom.domElement.addEventListener('dblclick',()=>{
            this.normalizeView();
        });
        
        contents.add(zoom);

        new Array().map

        translator.onChange((changes)=>{
            waveDisplay.set("wave",model.cachedValues);
        });

        // zoom.changeCallback=()=>{
        // }

        model.onUpdate((changes)=>{
            if(changes.cachedValues){
                waveDisplay.set("wave",changes.cachedValues);
            }
        });

        // drawBoard.size.onChange(()=>{
            // waveDisplay.set("width",drawBoard.size.width);
        // });

        /**
         * handy function that sets the ValuePixelTranslator (i.e. zoom/pan) 
         * in such a way that the whole range of the contents are visible and maximized 
         */ 
        this.normalizeView=(centered=true)=>{
            //find level range in the audio
            //non zero initial value prevents infinite zoom
            let maxValue = 0;
            let minValue = 0;

            model.cachedValues.map((v)=>{
                if(v>maxValue) maxValue=v;
                if(v<minValue) minValue=v;
            });

            if(centered){
                maxValue = Math.abs(maxValue);
                minValue = Math.abs(minValue);
                let biggest=maxValue;
                if(minValue>biggest) biggest=minValue;
                maxValue=biggest;
                minValue=-biggest;
            }

            if(maxValue === minValue && minValue === 0){
                translator.coverVerticalRange(-1,1);
            }else{
                translator.coverVerticalRange(minValue,maxValue);
            }
        }
    }
}
export default WaveLane;