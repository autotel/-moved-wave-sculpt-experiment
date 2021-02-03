import drawBoard from "./scaffolding/drawBoard";
import Oscillator from "./models/Oscillator";
import Mixer from "./models/Mixer";
import GenericDisplay from "./interfaces/GenericDisplay";
import Draggable from "./interfaces/components/Draggable";
import OscillatorDisplay from "./interfaces/OscillatorDisplay";



Draggable.setCanvas(drawBoard.element);

let offset = new Oscillator({
    shape:"offset"
});
let oscillator1 = new Oscillator();
let oscillator2 = new Oscillator();
let mixer = new Mixer();

let interface1 = new GenericDisplay(mixer);
let interface2 = new OscillatorDisplay(oscillator1,{name:"Modulator"});
let interface3 = new OscillatorDisplay(oscillator2);
let interface4 = new OscillatorDisplay(offset,{name:"Bias",});


([interface1,interface2,interface3,interface4]).map((i)=>drawBoard.add(i));

offset.connectTo(oscillator1.inputs.bias);
oscillator1.connectTo(oscillator2.inputs.frequency);
oscillator2.connectTo(mixer.inputs.b);

setTimeout(mixer.recalculate,2000);