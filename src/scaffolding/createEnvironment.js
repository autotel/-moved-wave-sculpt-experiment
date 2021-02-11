import drawBoard from "../scaffolding/drawBoard";

import Oscillator from "../SoundModules/Oscillator";
import Mixer from "../SoundModules/Mixer";
import Delay from "../SoundModules/Delay";
import EnvelopeGenerator from "../SoundModules/EnvelopeGenerator";
import Chevyshev from "../SoundModules/Chebyshev";

import GenericDisplay from "../DomInterfaces/GenericDisplay";
import Draggable from "../DomInterfaces/components/Draggable";
import OscillatorDisplay from "../DomInterfaces/OscillatorDisplay";
import PatchDisplay from "../DomInterfaces/PatchDisplay";
import EnvelopeGeneratorDisplay from "../DomInterfaces/EnvelopeGeneratorDisplay";
import Filter from "../SoundModules/Filter";
import SoundPlayer from "../scaffolding/SoundPlayer";
import MixerTesselator from "../SoundModules/MixerTesselator";

let p=0;

Draggable.setCanvas(drawBoard.element);

const player=new SoundPlayer();

const patchDisplay = new PatchDisplay();
drawBoard.add(patchDisplay);

export const instancedModules = {};

/** @param {string|false} name */
export function create(Which,name=false){
    let protoname=Which.name;

    if(!name) name=protoname+" "+p;

    const newm=new Which();
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
    patchDisplay.appendModules(newm);

    player.appendModule(newm);
    theInterface.handyPosition(p);
    drawBoard.add(theInterface);
    instancedModules[name]=(newm);
    p++;
    return newm;
}

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
