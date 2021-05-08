import Module from "../../SoundModules/common/Module";
import { SVGGroup, Text, Path } from "../../scaffolding/GraphicElements";
import round from "../../utils/round";
import Draggable from "./Draggable";
import abbreviate from "../../utils/stringAbbreviator";
import { audioContext } from "../../SoundModules/common/vars";
import Clickable from "./Clickable";

let defaultSoundLoaderDecoderOptions = {
    x: 0, y:0,
    width:20,height:20,
    name:"soundLoaderDecoder",
    class:"soundLoaderDecoder",
    abbreviatedName:undefined,
}

class SoundLoaderDecoder extends SVGGroup{
    constructor(userOptions){
        const options = {};
        Object.assign(options,defaultSoundLoaderDecoderOptions);
        Object.assign(options,userOptions);
        super(options);

        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');

        let filePath="";
        let fileName="";

        fileSelector.addEventListener('change', (event) => {
            console.log("file changed");
            let file = fileSelector.files[0];
            //TODO: resample when source sample rate is different than context samplerate
            if(file){
                const reader = new FileReader();
                reader.onload = function (e) {
                    const arrayBuffer = e.target.result;
                    console.log(e.target.result);
                    if(typeof arrayBuffer != "string"){
                        audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                            const numberOfChannels = audioBuffer.numberOfChannels;
                            //TODO: not just discarding other channels
                            const channelData = audioBuffer.getChannelData(0);
                            
                            filePath=file.name;
                            handleChanged({
                                sampleArray:channelData,
                                filePath
                            });
                        });
                    }else{
                        throw new Error("file decoding problem: expected arrayBuffer but got string");
                    }
                };
                reader.readAsArrayBuffer(file)
            }else{
                throw new Error("no files[0]");
            }
        });

        const selectFile = () => {
            //open dialog
            fileSelector.click();
        }
        


        let nameText = new Text({
            x:0,
            y: options.height + 5,
            'text-anchor':'middle'
        });
        let valueText = new Text({
            x:0,
            y: options.height + 15,
            'text-anchor':'middle'
        });

        this.add(nameText);
        this.add(valueText);


        let soundLoaderDecoderShape = new Path();
        
        soundLoaderDecoderShape.domElement.classList.add("upload");
        soundLoaderDecoderShape.domElement.classList.add("button");
        this.add(soundLoaderDecoderShape);


        const clickable = new Clickable(this.domElement);

        clickable.clickCallback=()=>selectFile();
        clickable.mouseEnterCallback=()=>{
            valueText.set("text", fileName);
            this.domElement.classList.add("active");
        }
        clickable.mouseLeaveCallback=()=>{
            valueText.set("text", abbreviate(fileName,8));
            this.domElement.classList.remove("active");
        }
        
        const remakePath=()=>{
            
            let topLine = options.y + options.height / 2;
            let bottomLine = options.y - options.height / 2;

            let leftLine = options.x - options.width / 2;
            let rightLine = options.x + options.width / 2;

            let innerLeftLine = options.x - options.width / 4;
            let innerRightLine = options.x + options.width / 4;
            let arrowMiddleLine = options.y + options.height / 10;

            //arrow
            let c1=`${innerLeftLine}, ${topLine}`;
            let c2=`${innerRightLine}, ${topLine}`;
            let c3=`${innerRightLine}, ${arrowMiddleLine}`;
            let c4=`${rightLine}, ${arrowMiddleLine}`;

            let c5=`${options.x}, ${bottomLine}`;

            let c6=`${leftLine}, ${arrowMiddleLine}`;
            let c7=`${innerLeftLine}, ${arrowMiddleLine}`;
            let c8=`${innerLeftLine}, ${topLine}`;


            soundLoaderDecoderShape.set(
                "d",
                `M ${c1}
                L ${c2} 
                L ${c3} 
                L ${c4}
                L ${c5}
                L ${c6}
                L ${c7}
                L ${c8}
                z`,
            );
        }

        remakePath();

        const changeCallbacks=[];
        
        /** abbreviated name functionality */
        
        const abbreviateText=()=>{
            if(!options.abbreviatedName){
                options.abbreviatedName=abbreviate(options.name);
            }
            nameText.set("text",options.abbreviatedName+"[load]");
        }
        const deAbbreviateText=()=>{
            nameText.set("text",`[${options.name}]`);
        }
        
        abbreviateText();

        this.value=0;
        /** @param {Function} cb */
        this.onChange=(cb)=>{
            changeCallbacks.push(cb);
        }

        const handleChanged=(changes)=> changeCallbacks.map((cb)=>cb(changes));
        
        this.updateGraphic=()=>{
            fileName = filePath.split("/").pop();
            valueText.set("text", abbreviate(fileName,8));
        }
        
        /** 
         * @param {Module} module
         * @param {string} parameterName
         */
        this.setToModuleParameter=(module,parameterName)=>{
            
            let propertyObject = {};
            propertyObject=module.settings;
            options.name=parameterName;
            this.value=propertyObject[parameterName];

            options.abbreviatedName=undefined;
            abbreviateText();
            
            this.onChange(({sampleArray})=>{
                propertyObject[parameterName] = sampleArray;
                module.set(propertyObject);
            });

            module.onUpdate((changes)=>{
                if(changes[parameterName]){
                    this.value=changes[parameterName];
                    this.updateGraphic();
                }
            });
            switch (parameterName){
                case "frequency":
                    this.setDeltaCurve("frequency");
                    this.setMinMax(0,22000);
                break;
                case "order":
                    this.setDeltaCurve("integer");
                    this.setMinMax(0,10);
                break;

                case "time":
                case "length":
                    this.setMinMax(0,5);
                break;
            }

            this.updateGraphic();
        }

        this.setMinMax=(min,max)=>{
            if(max<=min) console.warn("max<=min",min,max);
            options.min=min;
            options.max=max;
            remakePath();
            return this;
        }
        /**
         * @param {"integer"|"frequency"|"gain"|"channelvol"|"integer"|"periodseconds"} deltaCurve
         **/
        this.setDeltaCurve=(deltaCurve)=>{
            options.deltaCurve=deltaCurve;
            return this;
        }
    }
}

export default SoundLoaderDecoder;