//DOM gui
import Draggable from "./DomInterfaces/components/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";
import Canvas from "./scaffolding/Canvas";
import TimeZoomer from "./DomInterfaces/TimeZoomer";
import RustProcessor from "./rust";

const nativeProcessor = new RustProcessor();

nativeProcessor.onReady((nativeProcess)=>{
    console.log("1+2=",nativeProcess.add(1,2));
    console.log("sine",nativeProcess.arrGenSin(0.5,2));
});

const drawBoard=new Canvas();
drawBoard.element.classList.add("drawboard");
const navBoard=new Canvas();
navBoard.element.classList.add("nav");


//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import LiveCodingInterface from "./LiveCodingInterface"

const webInspectorInterface=new LiveCodingInterface({
    drawBoard,
    nativeProcessor
});


const patchDisplay = new PatchDisplay(drawBoard);

const timeZoomer = new TimeZoomer();
navBoard.add(timeZoomer);

const player=new SoundPlayer();
const downloader = new SoundDownloader();

webInspectorInterface.onModuleCreated((newModule,newInterface,count)=>{
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    downloader.appendModule(newModule);
    drawBoard.add(newInterface);
});

drawBoard.add(patchDisplay);

Draggable.setCanvas();

//pre-run a live-coded patch

import pat1 from "./patches/drummaker";

import SoundDownloader from "./scaffolding/SoundDownloader";

window.demos = {
    "drummaker": ()=>pat1(webInspectorInterface),
}

let hashBefore = window.location.hash;
const hashchange=()=>{
    if(window.location.hash){
        let hashval = window.location.hash.slice(1);
        if(window.demos[hashval]){
            console.log("trying load of",hashval);
            window.demos[hashval]();
        }
    }else{
        if(hashBefore){
            
        }
    }
}

window.addEventListener('DOMContentLoaded', hashchange);

window.addEventListener("hashchange",hashchange);

window.onpopstate = ()=>window.location.reload();


setTimeout(()=>{
    //prevent an anoying message casted by the current dev server.
    window.socket=()=>{}
},500);