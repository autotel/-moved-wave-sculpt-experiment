import Lane from "../components/Lane";
import Module from "../../SoundModules/Module";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import WaveDisplay from "../components/WaveDisplay";
import VerticalZoom from "../components/VerticalZoom";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import { Circle, Line, Path, Text } from "../../scaffolding/elements";
import Hoverable from "../components/Hoverable";
import round from "../../utils/round";
import requireParameter from "../../utils/requireParameter";
/**
 * @typedef {Object} WaveLaneOptions
 * @property {Module} model
 * @property {string} [name]
 */
class WaveLane extends Lane{
    /**
     * @param {import("../components/Lane").LaneOptions} options
     */
    constructor(options, valuePixelTranslator = false){
        const {model,drawBoard}=options;
        requireParameter(model,"model");
        requireParameter(drawBoard,"drawBoard");
        const settings=typicalLaneSettings(model,drawBoard);
        
        const translator = valuePixelTranslator?valuePixelTranslator:(new ValuePixelTranslator(settings));

        //plave for defaults
        settings.name="Wave";
        Object.assign(settings,options);
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

            model.cachedValues.forEach((v)=>{
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
    }
}
export default WaveLane;