//DOM gui
import Draggable from "./DomInterfaces/components/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";
import Canvas from "./scaffolding/Canvas";
import TimeZoomer from "./DomInterfaces/TimeZoomer";

const drawBoard=new Canvas();
drawBoard.element.classList.add("drawboard");
const navBoard=new Canvas();
navBoard.element.classList.add("nav");


//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import WebInspectorInterface from "./LiveCodingInterface"

const webInspectorInterface=new WebInspectorInterface();


const patchDisplay = new PatchDisplay();

const timeZoomer = new TimeZoomer();
navBoard.add(timeZoomer);

const player=new SoundPlayer();

webInspectorInterface.onModuleCreated((newModule,newInterface,count)=>{
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    drawBoard.add(newInterface);
});

drawBoard.add(patchDisplay);

Draggable.setCanvas();

//pre-run a live-coded patch
// import drumpat from "./patches/rotator";
import drumpat from "./patches/goodstart";
// import drumpat from "./patches/reverb1";
// import drumpat from "./patches/delay";
// import drumpat from "./patches/drumpat";
// import drumpat from "./patches/filterTester";

drumpat(webInspectorInterface);