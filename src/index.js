//DOM gui
import Draggable from "./DomInterfaces/components/Draggable";
import PatchDisplay from "./DomInterfaces/PatchDisplay";
import Canvas from "./scaffolding/Canvas";
import TimeZoomer from "./DomInterfaces/TimeZoomer";
import SoundDownloader from "./scaffolding/SoundDownloader";
import RustProcessor from "./rust/RustProcessor";
import pat1 from "./patches/drummaker";

//other interfaces
import SoundPlayer from "./scaffolding/SoundPlayer";
import LiveCodingInterface from "./LiveCodingInterface"

//atches etc
import drummaker2 from "./patches/drummaker2";
import Ghost from "./Ghost";

const ghost = new Ghost();

window.ghost=ghost;

const rustProcessor = RustProcessor.get();

rustProcessor.onReady((rustProcessor) => {
    console.log("1+2=", rustProcessor.add(1, 2));
    console.log("sine", rustProcessor.arrGenSin(0.5, 2));
});

const drawBoard = new Canvas();
drawBoard.element.classList.add("drawboard");
const navBoard = new Canvas();
navBoard.element.classList.add("nav");


const webInspectorInterface = new LiveCodingInterface({
    drawBoard
});


const patchDisplay = new PatchDisplay(drawBoard);

const timeZoomer = new TimeZoomer();
navBoard.add(timeZoomer);

const player = new SoundPlayer();
const downloader = new SoundDownloader();

webInspectorInterface.onModuleCreated((newModule, newInterface, count) => {
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    downloader.appendModule(newModule);
    drawBoard.add(newInterface);
});

drawBoard.add(patchDisplay);

Draggable.setCanvas();

//pre-run a live-coded patch
window.demos = {
    "drummaker": () => pat1(webInspectorInterface),
    "drumaker2":()=> drummaker2(webInspectorInterface),
    "wiwu":()=>{
        create(possibleModules.HarmonicsOscillator,'harmosc');
create(possibleModules.EnvelopeGenerator,'timbrenv');
create(possibleModules.Oscillator,'osclltr2');
create(possibleModules.MixerTesselator,'mxrltr3.');
modules['harmosc'].connectTo(modules['mxrltr3.'].inputs.a);
modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval2);
modules['osclltr2'].connectTo(modules['harmosc'].inputs.frequency);
modules['harmosc'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': 105.55555555555564,
  'phase': 0,
  'shape': 'sin',
  'interval1': 0,
  'interval2': 1,
  'interval3': 0,
  'interval4': 0,
  'interval0': 0
});
modules['timbrenv'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1.93,
  'points': [
    [
      19,
      -11.325735319544375
    ],
    [
      85,
      9.455989716159985
    ]
  ],
  'loop': true
});
modules['osclltr2'].set({
  'amplitude': 34.28,
  'bias': 0,
  'length': 1,
  'frequency': 1,
  'phase': 0,
  'shape': 'sin'
});
modules['mxrltr3.'].set({
  'amplitude': 1,
  'levela': 0.6399999999999999,
  'levelb': 0.25,
  'levelc': 0.5,
  'leveld': 0.5
});
modules['harmosc'].getInterface().autoZoom();
modules['timbrenv'].getInterface().autoZoom();
modules['osclltr2'].getInterface().autoZoom();
modules['mxrltr3.'].getInterface().autoZoom();
    },
    "kik": () => {
        create(possibleModules.Oscillator, 'osc1');
        create(possibleModules.EnvelopeAttackRelease, 'env1');
        create(possibleModules.EnvelopeAttackRelease, 'env2');
        modules['env1'].connectTo(modules['osc1'].inputs.amplitude);
        modules['env2'].connectTo(modules['osc1'].inputs.frequency);
        modules['osc1'].set({
            'amplitude': 0,
            'bias': 0,
            'length': 1,
            'frequency': 1.7777777777777781,
            'phase': 0,
            'shape': 'sin',
        });
        modules['env1'].set({
            'attack': 0.026961451247165532,
            'release': 0.337437641723356,
            'amplitude': 0.457793034018502,
            'attackShape': 1,
            'releaseShape': 0.42000000000000015
        });
        modules['env2'].set({
            'attack': 0.011111111111111112,
            'release': 0.20002267573696147,
            'amplitude': 200.27912293593687,
            'attackShape': 0.6799999999999999,
            'releaseShape': 4.880000000000001
        });
        setTimeout(() => {
            modules['osc1'].getInterface().autoZoom();
            modules['env1'].getInterface().autoZoom();
            modules['env2'].getInterface().autoZoom();
        }, 200);
    },
    "nicetimbres": () => {


        const randomnum = ()=> Math.round(Math.random() * 10 - 5) / 10

        create(possibleModules.HarmonicsOscillator,'harmosc');
        create(possibleModules.EnvelopeGenerator,'timbrenv');
        
        // modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval2);
        // modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval3);

        modules['harmosc'].set({
          'amplitude': 1,
          'bias': 0,
          'length': 0.2,
          'frequency': 110,
          'phase': 0,
          'shape': 'sin',
          'interval1': 0,
          'interval2': randomnum(),
          'interval3': randomnum(),
          'interval4': 0,
        });
        modules['timbrenv'].set({
          'amplitude': 1,
          'bias': 0,
          'length': 2,
          'points': [
            [
              0,
              randomnum()
            ],
            [
              88200,
              randomnum()
            ]
          ],
          'loop': false,
        });
        setTimeout(()=>{
            modules['harmosc'].getInterface().autoZoom();
            modules['timbrenv'].getInterface().autoZoom();
        },100);
    }
}

let hashBefore = window.location.hash;
const hashchange = () => {
    if (window.location.hash) {
        let hashval = window.location.hash.slice(1);
        if (window.demos[hashval]) {
            console.log("trying load of", hashval);
            window.demos[hashval]();
        }
    } else {
        if (hashBefore) {

        }
    }
}

window.addEventListener('DOMContentLoaded', hashchange);

window.addEventListener("hashchange", hashchange);

window.onpopstate = () => window.location.reload();


setTimeout(() => {
    //prevent an anoying message casted by the current dev server.
    window.socket = () => { }
}, 500);