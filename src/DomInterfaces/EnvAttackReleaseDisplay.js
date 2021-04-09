
import { Circle, Text } from "../scaffolding/elements";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";
import round from "../utils/round";
import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Model from "../scaffolding/Model";
import EnvAttackRelease from "../SoundModules/EnvAttackRelease";
const vectorTypes = require("../scaffolding/Vector2");
/** @typedef {vectorTypes.MiniVector} MiniVector
/**
 * @namespace DomInterface.EnvAttackReleaseDisplay
 */
/** 
 * @class EnvAttackReleaseDisplay
 * @extends WaveLane
 */
class EnvAttackReleaseDisplay extends WaveLane{
    /** @param {import("./components/Lane").LaneOptions} options */
    constructor (options){

        const {module,drawBoard} = options;
        const settings=typicalLaneSettings(module,drawBoard);
        //plave for defaults
        settings.name="Envelope";
        Object.assign(settings,options);

        const translator=new ValuePixelTranslator(settings);
        super(settings,translator);

        this.addKnob("attack").setMinMax(0,1000);
        this.addKnob("release").setMinMax(0,1000);
        this.addKnob("amplitude");
        this.addKnob("attackShape");
        this.addKnob("releaseShape");

        //lane has a contents sprite.
        const contents=this.contents;

        //note that we use seconds in these handles,
        //as opposed to envGenerrator whose points are based on sample number
        class Handle extends Circle {
            constructor(settings){
                let circleSettings = {r:10};
                Object.apply(circleSettings,settings);
                super(circleSettings);
                
                const draggable = this.draggable = new Draggable(this.domElement);
                
                /** @param {MiniVector} pos */
                draggable.positionChanged=(pos)=>{
                    this.handleGuiChangedPoint(pos);
                }

                let activated=false;
                
                /**
                 * change handle position visually and propagate the result to the module. 
                 * @param {MiniVector} pos
                 **/
                this.handleGuiChangedPoint = (pos) =>{
                    
                }
                /**
                 * update the handle's point coordinates and cause
                 * this change to be reflected visually
                 */
                this.handleModelChangedPoint = () => {
                    this.update();
                }

                this.activate = ()=>{ 
                    if(!activated) contents.add(this);
                    activated=true;
                }
                this.deactivate = ()=>{
                    if(activated)contents.remove(this);
                    activated=false;
                }
            }
        }
        
        const handles=[
            new Handle(),
            new Handle(),
        ];

        handles[0].handleGuiChangedPoint = function(pos){
            module.set({
                attack: translator.xToSeconds(pos.x),
                amplitude: translator.yToAmplitude(pos.y),
            });
            
        }
        handles[1].handleGuiChangedPoint = function(pos){
            module.set({
                release: translator.xToSeconds(pos.x) - module.settings.attack,
            });
        }

        handles[0].handleModelChangedPoint = function(){
            let pos = {
                x:translator.secondsToX(module.settings.attack),
                y:translator.amplitudeToY(module.settings.amplitude),
            }
            this.draggable.setPosition(pos,false);
            this.attributes.cx=pos.x;
            this.attributes.cy=pos.y;
            this.update();
        }

        handles[1].handleModelChangedPoint = function(){
            let pos = {
                x:translator.secondsToX(module.settings.release + module.settings.attack),
                y:translator.amplitudeToY(0),
            }
            this.draggable.setPosition(pos,false);
            this.attributes.cx=pos.x;
            this.attributes.cy=pos.y;
            this.update();
        }
        
        handles.map((handle)=>{
            handle.activate();
        });

        function updatePointsPositions({
            attack,
            release,
            amplitude,
        }){
            if(attack){
                handles[0].handleModelChangedPoint();
                handles[1].handleModelChangedPoint();
            }
            if(amplitude){
                handles[0].handleModelChangedPoint();
            }
            if(release){
                handles[1].handleModelChangedPoint();
            }
        }

        //helps moving points according to zoom level
        translator.onChange((changes)=>{
            updatePointsPositions(module.settings);
            handles.forEach((handle)=>handle.handleModelChangedPoint());
        });
        
        //let us represent changes in the module graphically
        module.onUpdate((changes)=>{
            updatePointsPositions(changes);
        });

        module.triggerInitialState();
    }
};

export default EnvAttackReleaseDisplay;
