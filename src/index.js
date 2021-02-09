import drawBoard from "./scaffolding/drawBoard";
import Oscillator from "./models/Oscillator";
import Mixer from "./models/Mixer";
import GenericDisplay from "./interfaces/GenericDisplay";
import Draggable from "./interfaces/components/Draggable";
import OscillatorDisplay from "./interfaces/OscillatorDisplay";
import PatchDisplay from "./interfaces/PatchDisplay";
import EnvelopeGenerator from "./models/EnvelopeGenerator";
import EnvelopeGeneratorDisplay from "./interfaces/EnvelopeGeneratorDisplay";
import Chevyshev from "./models/Chebyshev";
import Delay from "./models/Delay";

let p=0;

Draggable.setCanvas(drawBoard.element);

const patchDisplay = new PatchDisplay();
drawBoard.add(patchDisplay);

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
    theInterface.handyPosition(p);
    drawBoard.add(theInterface);

    p++;
    return newm;
}

let oscillator1 = create(Oscillator).setShape("ramp");
let oscillator2 = create(Oscillator).setShape("sin");
let envelope = create(EnvelopeGenerator);
let delay=create(Delay);
// let envelope2 = create(EnvelopeGenerator);
// let chebyshev = create(Chevyshev).setOrder(3);
let mixer = create(Mixer);

// envelope2.connectTo(oscillator1.inputs.frequency);
oscillator1.connectTo(mixer.inputs.b);
envelope.connectTo(delay.inputs.main);
delay.connectTo(oscillator1.inputs.frequency);

console.log(create);
