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
                    this.updateBuffer();
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
            if(start) this.restart();
        }
        this.updateBuffer = ()=>{
            if(!buffer) return;
            if(!myModule) return;
            //not possible for now
        }
        /** @type {AudioBuffer|false} */
        let buffer=false;
        this.restart = ()=>{
            this.stop();
            if(!myModule) return;

            buffer = new AudioBuffer({
                length: myModule.cachedValues.length,
                sampleRate: sampleRate,
                numberOfChannels: 1,
            });

            buffer.getChannelData(0).set(myModule.cachedValues);
            source = new AudioBufferSourceNode(audioContext, {buffer});
            if(!source) throw new Error("failed to make source");
            source.connect(myGain);
            source.loop = true;
            source.start(0);
        }

        this.stop = ()=>{
            if(source){
                try{
                    source.disconnect();
                    source.stop();
                }catch(e){
                    console.warn("problem stopping source:",e);
                }
            }
        }
    }
}
export default SoundPlayer;