//css
// import "./index.scss";//won't work

//DOM gui
import Draggable from "./dom-model-gui/Interactive/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";
import {SVGCanvas, SVGGroup} from "./dom-model-gui/GuiComponents/SVGElements";
import TimeZoomer from "./DomInterfaces/TimeZoomer";
import SoundDownloader from "./scaffolding/SoundDownloader";
import RustProcessor from "./rust/RustProcessor";

//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import LiveCodingInterface from "./LiveCodingInterface"

//atches etc
import Ghost from "./Ghost";
import { Div } from "./dom-model-gui/GuiComponents/DOMElements";
import LiveCodingInterfaceGuiHelper from "./LiveCodingInterface/GuiHelper";
import demoLibrary from "./demoLibrary";

const ghost = new Ghost();

window.ghost=ghost;

const rustProcessor = RustProcessor.get();

rustProcessor.onReady((rustProcessor) => {
    console.log("1+2=", rustProcessor.add(1, 2));
    console.log("sine", rustProcessor.arrGenSin(0.5, 2));
});

const drawBoard = new SVGCanvas({width:"100%",height:"10000px"});
const navBoard = new SVGCanvas({width:"100%"});
drawBoard.addClass("drawboard");
navBoard.addClass("nav");
document.body.appendChild(drawBoard.domElement);
document.body.appendChild(navBoard.domElement);


const liveCodingInterface = new LiveCodingInterface({
    drawBoard
});

const buttonsBoard = new Div();
const liveCodingInterfaceGuiHelper = new LiveCodingInterfaceGuiHelper({liveCodingInterface});
buttonsBoard.add(liveCodingInterfaceGuiHelper);
document.body.appendChild(liveCodingInterfaceGuiHelper.domElement);

const patchDisplay = new PatchDisplay(drawBoard);

const timeZoomer = new TimeZoomer();
navBoard.add(timeZoomer);

const player = new SoundPlayer();
const downloader = new SoundDownloader();

const lanesGroup = new SVGGroup();
lanesGroup.addClass("lanes-group");

liveCodingInterface.onModuleCreated((newModule, newInterface, count) => {
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    downloader.appendModule(newModule);
    lanesGroup.add(newInterface);
});

drawBoard.add(lanesGroup,patchDisplay);

Draggable.setCanvas();



demoLibrary();

setTimeout(() => {
    //prevent an anoying message casted by the current dev server.
    window.socket = () => { }

}, 500);