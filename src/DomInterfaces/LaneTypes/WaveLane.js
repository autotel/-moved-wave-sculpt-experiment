import Lane from "../components/Lane";
import Module from "../../SoundModules/common/Module";
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
 * @property {Module} module
 * @property {string} [name]
 */
class WaveLane extends Lane{
    /**
     * @param {import("../components/Lane").LaneOptions} options
     * @param {ValuePixelTranslator|false} valuePixelTranslator
     */
    constructor(options, valuePixelTranslator = false){
        const {module,drawBoard}=options;
        requireParameter(module,"module");
        requireParameter(drawBoard,"drawBoard");
        const settings=typicalLaneSettings(module,drawBoard);

        const defaultModuleOutput = module.getDefaultOutput();
        
        const translator = valuePixelTranslator?valuePixelTranslator:(new ValuePixelTranslator(settings));

        //defaults
        name="Wave";
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
            //TODO: display every wave, and not just the wave of the default output.
            waveDisplay.set("wave",
                defaultModuleOutput.cachedValues
            );
        });

        defaultModuleOutput.onUpdate((changes)=>{
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

            defaultModuleOutput.cachedValues.forEach((v)=>{
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
            let levelHere = defaultModuleOutput.cachedValues[
                sampleNumberHere
            ];
            let yhere=translator.amplitudeToY(levelHere);
            if(isNaN(levelHere)) levelHere=translator.amplitudeToY(0);
            hoverText.attributes.y=yhere;
            //position.x - x;
            hoverText.attributes.x=position.x - x;
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