import drawBoard from "./scaffolding/drawBoard";
import BoringCircle from "./interfaces/BoringCircle";
import Oscillator from "./models/Oscillator";
import Mixer from "./models/Mixer";
import GenericDisplay from "./interfaces/GenericDisplay";
import Draggable from "./interfaces/components/Draggable";
import OscillatorDisplay from "./interfaces/OscillatorDisplay";



Draggable.setCanvas(drawBoard.element);

let oscillator1 = new Oscillator();
let oscillator2 = new Oscillator();
let mixer = new Mixer();

let interface1 = new GenericDisplay(mixer);
let interface2 = new OscillatorDisplay(oscillator1);
let interface3 = new OscillatorDisplay(oscillator2);

([interface1,interface2,interface3]).map((i)=>drawBoard.add(i));

oscillator1.connectTo(mixer);
oscillator2.connectTo(mixer);