import Sprite from "../../scaffolding/Sprite";
import { Line, Rectangle, Path, Group, Text } from "../../scaffolding/elements";
import Draggable from "./Draggable";
import Vector2 from "../../scaffolding/Vector2";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import Model from "../../scaffolding/Model";
import Module from "../../SoundModules/Module";
import InputNode from "../../SoundModules/InputNode";
import Hoverable from "./Hoverable";
import Knob from "./Knob";
const VectorTypedef = require("../../scaffolding/Vector2");

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */

/**
 * @typedef {MiniVector} LaneOptions
 * @property {Module} model
 * @property {string} name
 * @exports LaneOptions
 */


/**
 * @class Lane
 * @extends Group
 * */
class Lane extends Group{
    /**
     * @param {LaneOptions} options
     */
    constructor(options) {
        
        const {model} = options;
        const settings = typicalLaneSettings(model);

        settings.handleHeight=10;
        
        super(options);

        this.domElement.classList.add("lane"),

        this.autoZoom = () => {}
        
        Object.assign(settings, options);
        // this.settings=settings;
        
        /** @type {function[]} */
        const movedCallbacks=[];
        /** @param {function} callback */
        this.onMoved=(callback)=>{
            movedCallbacks.push(callback);
        }

        const handleMoved=()=>{
            movedCallbacks.map((cb)=>cb());
        }

        model.interfaces.add(this);

        const handleRect = new Rectangle({
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.handleHeight,
            fill: "transparent",
        });
        handleRect.domElement.classList.add("lane-handle");

        //position this lane at a distance from top, proportional to it's height,
        this.handyPosition=(posNumber)=>{
            draggable.setPosition({
                y:posNumber * (settings.height + settings.handleHeight + 5)
            });
            handleMoved();
            return this;
        }

        let knobsCount = 0;
        /** @param {string} parameterName */
        this.addParameterKnob=(parameterName)=>{
            const newKnob = new Knob({x:options.width - 50 * knobsCount++ - 70, y: 80});
            newKnob.setToModuleParameter(model,parameterName);
            this.contents.add(newKnob);
            return newKnob;
        }
        
        const draggable = new Draggable(handleRect.domElement);
        draggable.setPosition(settings);
        draggable.positionChanged = (newPosition) => {
            settings.y=newPosition.y;
            this.set("y",newPosition.y);
            handleMoved();
            return;


            // handleRect.attributes.x = settings.x;
            handleRect.attributes.y = settings.y;
            handleRect.update();
            
            // this.contents.attributes.x = settings.x;
            this.contents.attributes.y = settings.y + settings.handleHeight;
            this.contents.update();
            handleMoved();
        };
        
        this.add(handleRect);

        this.contents = new Group({
            x: settings.x, y: settings.y,
            width: settings.width, height: settings.height,
            name: "contents"
        });

        //add graphs to input and output
        //TODO: encapsulate
        this.add(this.contents);
        /** @typedef {{x:number,y:number,input:InputNode,absolute:MiniVector}} inputPosition */
        /** @type {Object<String,inputPosition>|undefined} */
        let inputPositions;
        /** @returns {Object<String,inputPosition>} */
        this.getInputPositions=()=>{
            // if(!inputPositions) {
                inputPositions={};
                Object.keys(model.inputs).map((inputName,index)=>{
                    const newInputPosition={
                        x:settings.width + 10,
                        y:settings.height - index * 20 - 10,
                        absolute:{},
                        input:model.inputs[inputName],
                    };
                    newInputPosition.absolute.x=newInputPosition.x + settings.x;
                    newInputPosition.absolute.y=newInputPosition.y + settings.y + 10;
                    inputPositions[inputName] = newInputPosition;
                });
            // }
            return inputPositions;
        }

        this.getOutputPosition=()=>{
            let ret = {
                x:settings.width+10,
                y:0,
            }
            ret.absolute={
                x:ret.x + settings.x,
                y:ret.y + settings.y + 5,
            };
            return ret;
        };
        
        
        /** @param {inputPosition} inputPosition */
        const InputGraph=function(inputPosition,name,num,container){
            const optxt = new Text({
                x: inputPosition.x + 10, y: inputPosition.y + 5,
                text:name,
            });
            container.add(optxt);
            const rect = new Rectangle({
                x: inputPosition.x - 5,
                y: inputPosition.y - 5,
                width: 10,
                height: 10,
            });
            container.add(rect);
        }


        /** @param {MiniVector} position */
        const OutputGraph=function(position,container){

            const rect = new Rectangle({
                x: position.x,
                y: position.y - settings.handleHeight,
                width: 80,
                height: 10,
            });
            container.add(rect);

        }

        this.getInputPositions()
        Object.keys(inputPositions).map((a,b)=>{
            new InputGraph(inputPositions[a],a,b,this.contents)
        });
        const myOutputGraph = new OutputGraph(this.getOutputPosition(),this.contents);


        const title = new Text({
            x: 10, y: 0,
            text: settings.name
        });
        this.contents.add(title);
    }
};

export default Lane;