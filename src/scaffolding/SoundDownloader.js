import Module from "../SoundModules/common/Module";
import { sampleRate, audioContext } from "../SoundModules/common/vars";
import { Path, SVGGroup } from "../dom-model-gui/GuiComponents/SVGElements";
import Wav from "../utils/asanoboy-makewav";


class SoundDownloader{
    constructor(){
        
        /** @type {Module|false} */
        let myModule = false;
        let defaultModuleOutput;

        let position={
            x:0,
            y:0,
            width:20,
            height:20,
            spacing:5,
        }

        const everyPlayButton=[];
        /** @param {Module} module */
        this.appendModule = (module)=>{
            console.log("module appended to downloader");

            defaultModuleOutput = module.getDefaultOutput();
        
            let topLine = position.y - position.height / 2;
            let bottomLine = position.y + position.height / 2;
            let leftLine = position.x - position.width / 2;
            let rightLine = position.x + position.width / 2;

            let innerLeftLine = position.x - position.width / 4;
            let innerRightLine = position.x + position.width / 4;
            let arrowMiddleLine = position.y + position.height / 10;

            //arrow
            let c1=`${innerLeftLine}, ${topLine}`;
            let c2=`${innerRightLine}, ${topLine}`;
            let c3=`${innerRightLine}, ${arrowMiddleLine}`;
            let c4=`${rightLine}, ${arrowMiddleLine}`;

            let c5=`${position.x}, ${bottomLine}`;

            let c6=`${leftLine}, ${arrowMiddleLine}`;
            let c7=`${innerLeftLine}, ${arrowMiddleLine}`;
            let c8=`${innerLeftLine}, ${topLine}`;

            const downloadButton = new SVGGroup();

            let path = new Path({
                d: `M ${c1}
                    L ${c2} 
                    L ${c3} 
                    L ${c4}
                    L ${c5}
                    L ${c6}
                    L ${c7}
                    L ${c8}
                    z`,
            });

            downloadButton.add(path);

            downloadButton.domElement.setAttribute("class","button download");
            everyPlayButton.push(downloadButton);
            module.getInterface().appendToControlPanel(
                downloadButton, position.width +10
            );
            
            downloadButton.domElement.addEventListener('mousedown',(evt)=>{
                downloadButton.addClass("active");
                this.download(module);
            });

            downloadButton.domElement.addEventListener('mousedown',(evt)=>{
                downloadButton.removeClass("active");
            });
            
        }
        /** 
         * @param {Array<Float32Array>} buffers
         * @returns {Float32Array}
         **/
        const interleave = (buffers) => {
            let length = 0;
            buffers.forEach((buff)=>length+=buff.length);
            const newBuffer = new Float32Array(length);
            const numberOfChannels=buffers.length;
            buffers.forEach((buffer,bufferNumber)=>{
                buffer.forEach((num,sampleNumber)=>{
                    newBuffer[(sampleNumber*numberOfChannels)+bufferNumber]=num;
                });
            });
            return newBuffer;
        }

        let downloadNo = 0;
        /** @param {Module} module */
        this.download=(module)=>{
            
            function namedDownload(blob, filename) {
                var a = document.createElement('a');
                a.download = filename;
                a.href = blob;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            
            let wav;
            let channels = [];

            if(module.outputs.l && module.outputs.r){
                channels = [
                    module.outputs.l.cachedValues,
                    module.outputs.r.cachedValues,
                ];
                wav = new Wav({sampleRate, channels: 2});
            }else{
                channels = [
                    module.getDefaultOutput().cachedValues,
                ];
                wav = new Wav({sampleRate, channels: 1});
            }
            

            wav.setBuffer(interleave(channels));
            const link = wav.getDownload();

            namedDownload(link,
                "soundsculpt-"
                + module.name
                + "-"
                + (downloadNo++)
            );
        }
    }
}
export default SoundDownloader;