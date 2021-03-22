import { Line, Rectangle, Path, Group, Text, Component } from "../../scaffolding/elements";
import Draggable from "./Draggable";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import Module from "../../SoundModules/Module";
import InputNode from "../../SoundModules/InputNode";
import Knob from "./Knob";
import Toggle from "./Toggle";
import Canvas from "../../scaffolding/Canvas";
import placements from "../config/placement";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";

const sizes = placements;

const VectorTypedef = require("../../scaffolding/Vector2");

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */

/**
 * @typedef {Object} LaneOptions
 * @property {number} [x] 
 * @property {number} [y] 
 * @property {number} [width]
 * @property {number} [height]
 * @property {Module} model
 * @property {string} [name]
 * @property {Canvas} drawBoard
 * @exports LaneOptions
 */


/**
 * @class Lane
 * @extends Group
 * */
class Lane extends Group {
    /**
     * @param {ValuePixelTranslator} translator
     * @param {LaneOptions} options
     */
    constructor(translator,options) {

        const { model, drawBoard } = options;
        const settings = typicalLaneSettings(model,drawBoard);
        Object.assign(settings, options);

        super(settings);

        this.domElement.classList.add("lane"),

            this.autoZoom = () => { }

        // this.settings=settings;

        /** @type {function[]} */
        const movedCallbacks = [];
        /** @param {function} callback */
        this.onMoved = (callback) => {
            movedCallbacks.push(callback);
        }

        const handleMoved = () => {
            movedCallbacks.map((cb) => cb());
        }

        model.interfaces.add(this);

        const handleRect = new Rectangle({
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.height,
            fill: "transparent",
        });

        handleRect.domElement.classList.add("lane-handle");

        //position this lane at a distance from top, proportional to it's height,
        this.handyPosition = (posNumber) => {
            draggable.setPosition({
                y: posNumber * (settings.height + 5)
            });
            handleMoved();
            return this;
        }

        let controlsCount = 0;

        const widthPerControl = 40;
        const controlPanelTop = 10;
        const controlPanelRight = 30;
        const controlPanelHeight = 70;
        const controlsCenterTop = 26;
        const controlPanelBackground = new Rectangle();
        const controlPanel = new Group();

        let controlPanelAppended = false;
        const updateControlsBg = () => {
            if (controlsCount > 0 && !controlPanelAppended) {
                this.contents.add(controlPanel);
                controlPanel.add(controlPanelBackground);
                controlPanelAppended = true;
            }
            const cc1 = controlsCount + 1;
            controlPanel.attributes.class="control-panel";
            controlPanel.attributes.width = controlPanelWidth;
            controlPanel.attributes.x = options.width - controlPanelWidth - controlPanelRight;
            controlPanel.attributes.y = controlPanelTop;
            controlPanel.attributes.height = controlPanelHeight;

            controlPanelBackground.attributes.class="background";
            controlPanelBackground.attributes.width=controlPanel.attributes.width;
            controlPanelBackground.attributes.height=controlPanel.attributes.height;

            controlPanel.update();
            controlPanelBackground.update();
        }
        let controlPanelWidth = 20;
        
        /** @param {Component} component */
        this.appendToControlPanel = (component,width=widthPerControl) => {
            controlsCount++;
            updateControlsBg();

            controlPanelWidth += width/2;
            component.attributes.x= controlPanelWidth;
            component.attributes.y= controlsCenterTop;
            controlPanelWidth += width/2;

            component.update();
            controlPanel.add(component);
        }
        /** @param {string} parameterName */
        this.addKnob = (parameterName) => {
            const newControl = new Knob();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(model, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }
        /** @param {string} parameterName */
        this.addToggle = (parameterName) => {
            const newControl = new Toggle();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(model, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }


        const draggable = new Draggable(handleRect.domElement);
        draggable.setPosition(settings);
        draggable.positionChanged = (newPosition) => {
            settings.y = newPosition.y;
            this.set("y", newPosition.y);
            handleMoved();
            return;

            // handleRect.attributes.x = settings.x;
            handleRect.attributes.y = settings.y;
            handleRect.update();

            // this.contents.attributes.x = settings.x;
            this.contents.attributes.y = settings.y;
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
        const inputPositions={};
        /** @returns {Object<String,inputPosition>} */
        this.getInputPositions = () => {
            Object.keys(model.inputs).map((inputName, index) => {
                const newInputPosition = {
                    x: settings.width + 10,
                    y: settings.height - index * 20 - 10,
                    absolute: {},
                    input: model.inputs[inputName],
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                if(inputPositions[inputName]) delete inputPositions[inputName];
                inputPositions[inputName] = newInputPosition;
            });
            // }
            return inputPositions;
        }

        this.getOutputPosition = () => {
            let ret = {
                x: settings.width + 10,
                y: 0,
            }
            ret.absolute = {
                x: ret.x + settings.x,
                y: ret.y + settings.y + 5,
            };
            return ret;
        };


        const InputGraph = function (inputPositions, name, container) {
            const inputPosition = inputPositions[name];
            const optxt = new Text({
                x: inputPosition.x + 10, y: inputPosition.y + 5,
                text: name,
            });
            container.add(optxt);
            const rect = new Rectangle({
                x: inputPosition.x - 5,
                y: inputPosition.y - 5,
                width: 10,
                height: 10,
            });
            container.add(rect);
            this.updatePosition = () =>{

                optxt.set("x",inputPositions[name].x + 10);
                rect.set("x",inputPositions[name].x - 5);
            }
        }

        const OutputGraph = function (parent,container) {
            let position=parent.getOutputPosition();
            const rect = new Rectangle({
                x: position.x,
                y: position.y,
                width: 80,
                height: 10,
            });

            container.add(rect);
            this.updatePosition=()=>{
                position=parent.getOutputPosition();
                rect.set("x",position.x);
            }
        }

        this.getInputPositions();
        const myInputGraphs = Object.keys(inputPositions).map((name)=>{
            return new InputGraph(inputPositions, name, this.contents)
        });
        const myOutputGraph = new OutputGraph(this,this.contents);


        const updateSize = () => {
            const newWidth = drawBoard.size.width - sizes.patcher.width;
            settings.width = newWidth;
            translator.change({
                width:newWidth
            });

            this.getInputPositions();
            myInputGraphs.forEach((ig)=>ig.updatePosition());
            myOutputGraph.updatePosition();
        }

        translator.onChange(()=>{
            const newWidth=translator.settings.width;
            handleRect.set("width",newWidth);

            controlPanel.set(
                "x",
                newWidth - controlPanelWidth - controlPanelRight
            );
        });

        drawBoard.size.onChange(()=>updateSize());

        const title = new Text({
            x: 10, y: 0,
            text: settings.name
        });

        this.contents.add(title);
    }
};

export default Lane;