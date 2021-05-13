import Lane from "../components/Lane";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import WaveDisplay from "../components/WaveDisplay";
import VerticalZoom from "../components/VerticalZoom";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import { Text } from "../../dom-model-gui/GuiComponents/SVGElements";
import Hoverable from "../../dom-model-gui/Interactive/Hoverable";
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

        const translator = valuePixelTranslator?valuePixelTranslator:(new ValuePixelTranslator(settings));

        //defaults
        Object.assign(settings,options);
        super(translator,options);
        
        const outputs = Object.keys(module.outputs).map((opname)=>module.outputs[opname]);        

        const contents=this.contents;
        
        const waveDisplays=outputs.map((output)=>{
            let waveDisplay=new WaveDisplay(translator);
            waveDisplay.addClass("wave-display");
            waveDisplay.addClass("no-mouse");
            contents.add(waveDisplay);
            return waveDisplay;
        });
        

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
            waveDisplays.forEach((waveDisplay,index)=>{
                waveDisplay.set("wave",
                    outputs[index].cachedValues
                );
            });
        });

        module.onUpdate((changes)=>{
            if(changes.cacheStillValid == true){
                waveDisplays.forEach((waveDisplay,index)=>{
                    waveDisplay.set("wave",
                        outputs[index].cachedValues
                    );
                });
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

            outputs[0].cachedValues.forEach((v)=>{
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
            let levelHere = outputs[0].cachedValues[
                sampleNumberHere
            ];
            let yhere=translator.amplitudeToY(levelHere);
            if(isNaN(levelHere)) levelHere=translator.amplitudeToY(0);
            hoverText.attributes.y=yhere;
            //position.x - x;
            hoverText.attributes.x=position.x;// - x;
            hoverText.attributes.text=round(levelHere,2)+", "+sampleNumberHere;
            hoverText.update();
        }
        hoverable.mouseEnterCallback=(position)=>{
            hoverText.addClass("active");
        }
        hoverable.mouseLeaveCallback=(position)=>{
            hoverText.removeClass("active");
        }
        contents.add(hoverText);
    }
}
export default WaveLane;