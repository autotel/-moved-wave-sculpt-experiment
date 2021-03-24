//DOM gui
import Draggable from "./DomInterfaces/components/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";
import Canvas from "./scaffolding/Canvas";
import TimeZoomer from "./DomInterfaces/TimeZoomer";

import('./rust/pkg/').then((lib) => {
    // lib is the wasm library you can now use.
    console.log(`2 + 2 = ${lib.add(2, 2)}`)
})

const drawBoard=new Canvas();
drawBoard.element.classList.add("drawboard");
const navBoard=new Canvas();
navBoard.element.classList.add("nav");


//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import LiveCodingInterface from "./LiveCodingInterface"

const webInspectorInterface=new LiveCodingInterface({drawBoard});


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

import pat1 from "./patches/rotator";
import pat2 from "./patches/goodstart";
import pat3 from "./patches/reverb1";
import pat4 from "./patches/delay";
import pat5 from "./patches/drumpat";
import pat6 from "./patches/filterTester";
import pat7 from "./patches/multireso";
import pat8 from "./patches/wave1";
import SoundDownloader from "./scaffolding/SoundDownloader";

window.demos = {
    "rotator": ()=>pat1(webInspectorInterface),
    "drumpat2": ()=>pat2(webInspectorInterface),
    "reverb1": ()=>pat3(webInspectorInterface),
    "delay": ()=>pat4(webInspectorInterface),
    "drumpat": ()=>pat5(webInspectorInterface),
    "filterTester": ()=>pat6(webInspectorInterface),
    "multireso": ()=>pat7(webInspectorInterface),
    "wavefolder": ()=>pat8(webInspectorInterface),
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