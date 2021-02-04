import drawBoard from "./scaffolding/drawBoard";
import Oscillator from "./models/Oscillator";
import Mixer from "./models/Mixer";
import GenericDisplay from "./interfaces/GenericDisplay";
import Draggable from "./interfaces/components/Draggable";
import OscillatorDisplay from "./interfaces/OscillatorDisplay";
import PatchDisplay from "./interfaces/PatchDisplay";



Draggable.setCanvas(drawBoard.element);

let oscillator3 = new Oscillator({
    shape:"cos"
});
let oscillator1 = new Oscillator();
let oscillator2 = new Oscillator();
let mixer = new Mixer();

let interface1 = new GenericDisplay({
    model:mixer
});
let interface2 = new OscillatorDisplay({
    model:oscillator1,name:"Modulator"
});
let interface3 = new OscillatorDisplay({
    model:oscillator2
});
let interface4 = new OscillatorDisplay({
    model:oscillator3,
    name:"Modulator 2"
});
const patchDisplay = new PatchDisplay();

([interface1,interface2,interface3,interface4,patchDisplay]).map((i)=>drawBoard.add(i));

oscillator3.connectTo(oscillator1.inputs.frequency);
oscillator1.connectTo(oscillator2.inputs.bias);
oscillator2.connectTo(mixer.inputs.b);


patchDisplay.appendModules(oscillator3,oscillator1,oscillator2,mixer);
