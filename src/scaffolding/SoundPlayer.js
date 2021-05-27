//TODO: exact coordination between the channels 
import Module from "../SoundModules/common/Module";
import { sampleRate, audioContext } from "../SoundModules/common/vars";
import Lane from "../DomInterfaces/components/Lane";
import { Rectangle, Path, SVGGroup } from "../dom-model-gui/GuiComponents/SVGElements";


/**
 * the bit where module is passed meaninglessly all around needs to be refactored
 actually, I fukd up because I forgot how it was suposed to work.
 there is one player for every module, but now the last module created is the only one that can be played :P
 */
class SoundPlayer {
    constructor() {
        /** @type {AudioBufferSourceNode|false} */
        var source = false;
        const myGain = audioContext.createGain();
        myGain.gain.value = 1;
        myGain.connect(audioContext.destination);

        /** @type {AudioWorkletNode|false} */
        let magicPlayer = false;

        audioContext.audioWorklet.addModule('MagicPlayer.js').then(() => {
            console.log("MaqicPlayer audio worklet");
            magicPlayer = new AudioWorkletNode(audioContext, 'magic-player');

            // setInterval(() => magicPlayer.port.postMessage('yuiim'), 1000);
            magicPlayer.port.onmessage = (e) => console.log(e.data)
            magicPlayer.connect(myGain);
        });
        /*
        audioContext.audioWorklet.addModule("ping-pong-processor.js").then(()=>{
            const pingPongNode = new AudioWorkletNode(audioContext, 'ping-pong-processor')
            // send the message containing 'ping' string
            // to the AudioWorkletProcessor from the AudioWorkletNode every second
            setInterval(() => pingPongNode.port.postMessage('ping-pong-processor'), 1000)
            pingPongNode.port.onmessage = (e) => console.log(e.data)
            // pingPongNode.connect(audioContext.destination)
        });
        */
        let position = {
            x: -15,
            y: -10,
            width: 30,
            height: 20,
            spacing: 5,
        }
        const updateBufferIfCurrentModuleIs = (module) => {
            if(currentlyPlayingModule===module) this.updateBuffer();
        }

        /** @type {Module|false} module */
        let currentlyPlayingModule = false;

        const everyPlayButton = [];
        /** @param {Module} module */
        this.appendModule = (module) => {
            console.log("module appended to player");
            //rect
            let c1 = `${position.x}, ${position.y}`;
            let c2 = `${position.x + position.width}, ${position.y}`;
            let c3 = `${position.x + position.width}, ${position.y + position.height}`;
            let c4 = `${position.x}, ${position.y + position.height}`;
            let triW = position.width / 5;
            let triH = position.width / 5;
            let triStartX = position.x + position.width / 2 - triW / 2;
            let triStartY = position.y + position.height / 2 - triH / 2;
            //tri
            let c5 = `${triStartX}, ${triStartY}`;
            let c6 = `${triStartX + triW}, ${triStartY + triH / 2}`;
            let c7 = `${triStartX}, ${triStartY + triH}`;

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

            playButton.domElement.setAttribute("class", "button play");
            everyPlayButton.push(playButton);

            module.getInterface().appendToControlPanel(
                playButton,
                position.width + 10
            );

            module.onUpdate((changes) => {
                console.log(changes);
                updateBufferIfCurrentModuleIs(module);
            });

            playButton.domElement.addEventListener('mousedown', (evt) => {
                if (playButton.domElement.classList.contains("active")) {

                    console.log("stop");
                    this.stop();

                    everyPlayButton.map((otherButton) => {
                        otherButton.removeClass("active");
                    });
                } else {

                    everyPlayButton.map((otherButton) => {
                        otherButton.removeClass("active");
                    });


                    currentlyPlayingModule = module;

                    console.log("play", currentlyPlayingModule.name);
                    playButton.addClass("active");

                    this.updateBuffer();
                    this.play();
                }

            });


        }


        this.updateBuffer = () => {
            if (!currentlyPlayingModule) return;
            if (!magicPlayer) return;

            if (currentlyPlayingModule.outputs.l && currentlyPlayingModule.outputs.r) {

                magicPlayer.port.postMessage({
                    audio: [
                        Array.from(currentlyPlayingModule.outputs.l.cachedValues),
                        Array.from(currentlyPlayingModule.outputs.r.cachedValues),
                    ]
                });
            } else {
                try {
                    let defOutput = currentlyPlayingModule.getDefaultOutput();

                    magicPlayer.port.postMessage({
                        audio: [
                            Array.from(defOutput.cachedValues),
                            Array.from(defOutput.cachedValues),
                        ]
                    });
                } catch (e) {
                    console.warn("module doesn't have default output", currentlyPlayingModule);
                }
            }
        }

        this.play = () => {
            if (!magicPlayer) return;
            this.updateBuffer();
            magicPlayer.port.postMessage({
                play: true
            });
        }
        this.stop = () => {
            if (!magicPlayer) return;
            magicPlayer.port.postMessage({
                stop: true
            });
        }
    }
}
export default SoundPlayer;