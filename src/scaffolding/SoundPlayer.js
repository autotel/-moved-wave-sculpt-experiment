//TODO: exact coordination between the channels 
import Module from "../SoundModules/common/Module";
import { sampleRate, audioContext } from "../SoundModules/common/vars";
import Lane from "../DomInterfaces/components/Lane";
import { Rectangle, Path, SVGGroup } from "../dom-model-gui/GuiComponents/SVGElements";
import Output from "../SoundModules/io/Output";

const MagicPlayer = function(myOutput) {
    //playing position in the original module, from where we source sound
    let sourcePlayhead=0;
    //how long each period
    var bufferSize = 2048;

    let playing = false;

    this.play=()=>playing=true;
    this.stop=()=>playing=false;

    //get a curve to fade in/out old and new "peeked" buffer (click prevention)
    const fadeCurveFunction = (v) => {
        return (1-Math.cos(Math.PI * v))/2;
    }
    this.setOutput=(newOutput)=>{
        myOutput=newOutput;
    }
    //makes a slice from the module's buffer in a circular way
    const getCircularSlice=(start,length)=>{
        let returnBuffer = [];
        if(myOutput){
            start %= myOutput.cachedValues.length;
            let sliceStart = start;
            let sliceEnd = (start+length) % myOutput.cachedValues.length

            returnBuffer = Array.from(
                myOutput.cachedValues
            ).slice(
                start,
                start+length
            );

            //if the current period will reach beyond the length of audio loop
            if(sliceEnd<sliceStart){
                let append = Array.from(
                    myOutput.cachedValues
                ).slice(
                    0,
                    sliceStart-sliceEnd
                );
                returnBuffer = returnBuffer.concat(append);
            }
        }
        return returnBuffer;
    }
    //the foreseen period, in the state it was on the last period
    /** @type {false|Array<number>} */
    let peekedPeriod = false;
    let interpolationSpls = bufferSize;

    var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
    node.channelInterpretation
    node.onaudioprocess = function(e) {
        
        //make a copy of the buffer for this period. This will let us interpolate,
        //preventing the clicks caused by buffer changes while playing.
        //note that the frequency response of the interpolation changes 
        //in function of the bufferSize selection.
        let currentBuffer = getCircularSlice(sourcePlayhead,bufferSize);
        // var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            
            if(playing && myOutput){
                let nowWeight = fadeCurveFunction(i/interpolationSpls);
                if(nowWeight>1) nowWeight=1;
                let nextWeight = 1-nowWeight;
                //current sonic contents fading in...
                output[i] = currentBuffer[i] * nowWeight;
                if(peekedPeriod){
                    //and the previously expected sonic contents fading out.
                    //clipped, for security.
                    output[i] += Math.min(1,peekedPeriod[i] * nextWeight);
                }
            }else{
                output[i]=0;
            }
        }
        sourcePlayhead += bufferSize;
        if(myOutput) sourcePlayhead %= myOutput.cachedValues.length;

        //peek into next period, so that in next lap we interpolate
        peekedPeriod = getCircularSlice(sourcePlayhead,bufferSize);
    }
    this.node=node;
};


class SoundPlayer{
    constructor(){
        /** @type {AudioBufferSourceNode|false} */
        var source=false;
        const myGain = audioContext.createGain();
        myGain.gain.value=1;
        myGain.connect(audioContext.destination);

        const pannerLeft = audioContext.createStereoPanner();
        const pannerRight = audioContext.createStereoPanner();

        pannerLeft.pan.value=-1;
        pannerRight.pan.value=1;

        pannerLeft.connect(myGain);
        pannerRight.connect(myGain);

        const magicPlayerLeft = new MagicPlayer(false);
        const magicPlayerRight = new MagicPlayer(false);

        magicPlayerLeft.node.connect(pannerLeft);
        magicPlayerRight.node.connect(pannerRight);

        let position={
            x:-15,
            y:-10,
            width:30,
            height:20,
            spacing:5,
        }

        const everyPlayButton=[];
        /** @param {Module} module */
        this.appendModule = (module)=>{
            console.log("module appended to player");
            //rect
            let c1=`${position.x}, ${position.y}`;
            let c2=`${position.x + position.width}, ${position.y}`;
            let c3=`${position.x + position.width}, ${position.y + position.height}`;
            let c4=`${position.x}, ${position.y + position.height}`;
            let triW = position.width / 5;
            let triH = position.width / 5;
            let triStartX = position.x + position.width/2 - triW/2;
            let triStartY = position.y + position.height/2 - triH/2;
            //tri
            let c5=`${triStartX}, ${triStartY}`;
            let c6=`${triStartX + triW}, ${triStartY + triH / 2}`;
            let c7=`${triStartX}, ${triStartY + triH}`;

            const playButton = new SVGGroup();

            let path = new Path({
                d: `M ${c1}
                    L ${c2} 
                    L ${c3} 
                    L ${c4}
                    z
                    M ${c5}
                    L ${c6}
                    L ${c7}
                    z`,
            });


            playButton.add(path);

            playButton.domElement.setAttribute("class","button play");
            everyPlayButton.push(playButton);

            module.getInterface().appendToControlPanel(
                playButton,
                position.width + 10
            );
            
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
                        otherButton.removeClass("active");
                    });
                }else{

                    everyPlayButton.map((otherButton)=>{
                        otherButton.removeClass("active");
                    });

                    console.log("play");
                    playButton.addClass("active");
                    this.setModule(module,true);

                }

            });
            
        }

        /** @param {Module} module */
        this.setModule = (module,start=false)=>{
            if(module.outputs.l && module.outputs.r){
                magicPlayerLeft.setOutput(module.outputs.l);
                magicPlayerRight.setOutput(module.outputs.r);
            }else{
                try{
                    let defo=module.getDefaultOutput();
                    magicPlayerLeft.setOutput(defo);
                    magicPlayerRight.setOutput(defo);
                }catch(e){
                    console.warn("module doesn't have default output",module);
                }
            }
            if(start){
                magicPlayerLeft.play();
                magicPlayerRight.play();
            }
        }

        // this.updateBuffer = ()=>{
        //     if(!buffer) return;
        //     if(!myOutput) return;
        //     //not possible for now
        // }

        // /** @type {AudioBuffer|false} */
        // let buffer=false;

        this.stop = ()=>{
            magicPlayerLeft.stop();
            magicPlayerRight.stop();
        }
    }
}
export default SoundPlayer;