//DOM gui
import drawBoard from "./scaffolding/drawBoard";
import Draggable from "./DomInterfaces/components/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";

//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import WebInspectorInterface from "./LiveCodingInterface"

const webInspectorInterface=new WebInspectorInterface();


const patchDisplay = new PatchDisplay();
drawBoard.add(patchDisplay);

const player=new SoundPlayer();

webInspectorInterface.onModuleCreated((newModule,newInterface,count)=>{
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    drawBoard.add(newInterface);
});

Draggable.setCanvas(drawBoard.element);

//pre-run a live-coded patch
// import drumpat from "./patches/drumpat";
import drumpat from "./patches/filterTester";

drumpat(webInspectorInterface);