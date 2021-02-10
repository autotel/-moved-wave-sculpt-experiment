import drawBoard from "./scaffolding/drawBoard";

import Oscillator from "./SoundModules/Oscillator";
import Mixer from "./SoundModules/Mixer";
import Delay from "./SoundModules/Delay";
import EnvelopeGenerator from "./SoundModules/EnvelopeGenerator";
import Chevyshev from "./SoundModules/Chebyshev";

import GenericDisplay from "./interfaces/GenericDisplay";
import Draggable from "./interfaces/components/Draggable";
import OscillatorDisplay from "./interfaces/OscillatorDisplay";
import PatchDisplay from "./interfaces/PatchDisplay";
import EnvelopeGeneratorDisplay from "./interfaces/EnvelopeGeneratorDisplay";
import Filter from "./SoundModules/Filter";
import SoundPlayer from "./scaffolding/SoundPlayer";
import MixerTesselator from "./SoundModules/MixerTesselator";

let p=0;

Draggable.setCanvas(drawBoard.element);

const player=new SoundPlayer();

const patchDisplay = new PatchDisplay();
drawBoard.add(patchDisplay);

const instancedModules = {};

/** @param {string|false} name */
function create(Which,name=false){
    let protoname=Which.name;

    if(!name) name=protoname+" "+p;

    const newm=new Which();
    patchDisplay.appendModules(newm);
    let theInterface;
    switch (protoname){
        case "Oscillator":
            theInterface=new OscillatorDisplay({model:newm,name});
            break;
        case "EnvelopeGenerator":
            theInterface=new EnvelopeGeneratorDisplay({model:newm,name});
            break;
        default:
            theInterface=new GenericDisplay({model:newm,name});
    }

    player.appendModule(newm);
    theInterface.handyPosition(p);
    drawBoard.add(theInterface);
    instancedModules[name]=(newm);
    p++;
    return newm;
}

let mixer = create(MixerTesselator,"main");

let oscillator1 = create(Oscillator,"ramp").setShape("ramp");
let oscillator2 = create(Oscillator,"sine").setShape("sin");
let envelope = create(EnvelopeGenerator);
let filter = create(Filter);
let delay=create(Delay);

filter.setType("IIR.highpass.butterworth");
filter.setFrequency(4);
// let envelope2 = create(EnvelopeGenerator);
// let chebyshev = create(Chevyshev).setOrder(3);

console.log(mixer.inputs);

// oscillator1.connectTo(filter.inputs.main);
envelope.connectTo(filter.inputs.main);
filter.connectTo(oscillator1.inputs.frequency);
filter.connectTo(oscillator2.inputs.frequency);
oscillator2.connectTo(mixer.inputs.b);

console.log(`use command "let myModule = create(<module>,<myName>)", where module is any of the prototypes contained in the "modules" object, and myname is a custom name you wish to give to this module. Type "modules" and then press enter to get the list of them.
Then type "myModule" and tab, to see the available methods.
`);
console.log(`instanced modules are present in instancedModules array`);

window.modules={
    Oscillator,
    Mixer,
    MixerTesselator,
    Delay,
    EnvelopeGenerator,
    Chevyshev,
    Filter,
};

window.create=create;
window.instancedModules=instancedModules;

