import Module from "../SoundModules/Module";
import { sampleRate, audioContext } from "../SoundModules/vars";
import Lane from "../interfaces/components/Lane";
import { Rectangle } from "./elements";


class SoundPlayer{
    constructor(){


        /** @type {AudioBufferSourceNode|false} */
        var source=false;
        const myGain = audioContext.createGain();
        myGain.gain.value=0.6;
        myGain.connect(audioContext.destination);
        
        /** @type {Module|false} */
        let myModule = false;
        let playing = false;

        let magicPlayerPlayhead=0;
        var bufferSize = 4096;

        var magicPlayer = (function() {
            var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                let playhead=magicPlayerPlayhead;
                // var input = e.inputBuffer.getChannelData(0);
                var output = e.outputBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    if(playing && myModule){
                        playhead %= myModule.cachedValues.length;
                        output[i] = myModule.cachedValues[playhead];
                    }else{
                        output[i]=0;
                    }
                    playhead++;
                }
                magicPlayerPlayhead += bufferSize;
            }
            return node;
        })();

        magicPlayer.connect(myGain);


        let position={
            x:720,
            y:70,
            width:30,
            height:20,
            spacing:5,
        }
        const everyPlayButton=[];
        /** @param {Module} module */
        this.appendModule = (module)=>{
            console.log("module appended to player");
            const playButton = new Rectangle({
                x:position.x, 
                y:position.y, 
                width:position.width,
                height:position.height
            });

            playButton.domElement.setAttribute("class","button play");
            everyPlayButton.push(playButton);
            module.getInterface().contents.add(playButton);

            module.onUpdate((changes)=>{
                if(changes.cachedValues){
                    // this.updateBuffer();
                }
            });
            
            playButton.domElement.addEventListener('mousedown',(evt)=>{
                if(playButton.domElement.classList.contains("active")){

                    console.log("stop");
                    this.stop();
                    
                    everyPlayButton.map((otherButton)=>{
                        otherButton.domElement.classList.remove("active");
                    });
                }else{

                    everyPlayButton.map((otherButton)=>{
                        otherButton.domElement.classList.remove("active");
                    });

                    console.log("play");
                    playButton.domElement.classList.add("active");
                    this.setModule(module,true);

                }

            });
            
        }

        /** @param {Module} module */
        this.setModule = (module,start=false)=>{
            myModule=module;
            if(start) playing=true;
        }

        // this.updateBuffer = ()=>{
        //     if(!buffer) return;
        //     if(!myModule) return;
        //     //not possible for now
        // }

        // /** @type {AudioBuffer|false} */
        // let buffer=false;

        this.stop = ()=>{
            playing=false;
        }
    }
}
export default SoundPlayer;