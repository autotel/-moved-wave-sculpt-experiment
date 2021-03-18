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

import pat1 from "./patches/rotator";
import pat2 from "./patches/goodstart";
import pat3 from "./patches/reverb1";
import pat4 from "./patches/delay";
import pat5 from "./patches/drumpat";
import pat6 from "./patches/filterTester";

window.demos = {
    "rotator": ()=>pat1(webInspectorInterface),
    "drumpat2": ()=>pat2(webInspectorInterface),
    "reverb1": ()=>pat3(webInspectorInterface),
    "delay": ()=>pat4(webInspectorInterface),
    "drumpat": ()=>pat5(webInspectorInterface),
    "filterTester": ()=>pat6(webInspectorInterface),
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
        // if(hashBefore){
        //     window.location.reload();
        // }
    }
}

window.addEventListener('DOMContentLoaded', hashchange);

window.addEventListener("hashchange",hashchange);