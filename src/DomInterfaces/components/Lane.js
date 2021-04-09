import { Line, Rectangle, Path, Group, Text, Component } from "../../scaffolding/elements";
import Draggable from "./Draggable";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import Module from "../../SoundModules/common/Module";
import Knob from "./Knob";
import Toggle from "./Toggle";
import Canvas from "../../scaffolding/Canvas";
import placements from "../config/placement";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import SoundLoaderDecoder from "./SoundLoaderDecoder";
import Input from "../../SoundModules/io/Input";
import Output from "../../SoundModules/io/Output";

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
 * @property {Module} module
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

        const { module, drawBoard } = options;
        const settings = typicalLaneSettings(module,drawBoard);
        Object.assign(settings, options);

        super(settings);


        this.domElement.classList.add("lane");

        // this.autoZoom = () => { }

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


        const handleRect = new Rectangle({
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.height,
            fill: "transparent",
        });

        handleRect.domElement.classList.add("lane-handle");

        //add a class to cause visual feedback while the module is processsing.
        module.onUpdate((changes)=>{
            if(changes.cacheStillValid!==undefined){
                if(changes.cacheStillValid){
                    this.domElement.classList.remove("working");
                }else{
                    this.domElement.classList.add("working");
                }
            }
        });

        module.interfaces.add(this);

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
            newControl.setToModuleParameter(module, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }
        /** @param {string} parameterName */
        this.addToggle = (parameterName) => {
            const newControl = new Toggle();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(module, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }

        /** @param {string} parameterName */
        this.addSoundDecoder = (parameterName) => {
            const newControl = new SoundLoaderDecoder();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(module, parameterName);
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

        /**
         * @typedef {Object} NodePosition
         * @property {string} NodePosition.name
         * @property {number} NodePosition.x
         * @property {number} NodePosition.y
         * @property {MiniVector} NodePosition.absolute
         * //either:
         * @property {Input} [NodePosition.input]
         * @property {Output} [NodePosition.output]
         **/
        
        /** @type {Array<NodePosition>|undefined} */

        const inputPositions=[];
        
        /** @returns {Array<NodePosition>} */
        
        this.getInputPositions = () => {
            module.eachInput((input, index) => {
                const newInputPosition = {
                    x: settings.width + 10,
                    y: settings.height - index * 20 - 10,
                    absolute: {},
                    input,name:input.name,
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                inputPositions.push(newInputPosition);
            });
            return inputPositions;
        }

        /** @type {Array<NodePosition>|undefined} */

        const outputPositions=[];
        
        /** @returns {Array<NodePosition>} */
        
        this.getOutputPositions = () => {
            module.eachOutput((output, index) => {
                const newInputPosition = {
                    x: settings.width + 0,
                    y: settings.height - index * 20 - 10,
                    absolute: {},
                    output,name:output.name,
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                outputPositions.push(newInputPosition);
            });
            return outputPositions;
        }

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

        const OutputGraph = function (outputPositions, name, container) {
            const outputPosition = outputPositions[name];
            const optxt = new Text({
                x: outputPosition.x + 10, y: outputPosition.y + 5,
                text: name,
            });
            container.add(optxt);
            const rect = new Rectangle({
                x: outputPosition.x - 5,
                y: outputPosition.y - 5,
                width: 10,
                height: 10,
            });
            container.add(rect);
            this.updatePosition = () =>{

                optxt.set("x",outputPositions[name].x + 10);
                rect.set("x",outputPositions[name].x - 5);
            }
        }

        this.getInputPositions();
        const myInputGraphs = Object.keys(inputPositions).map((name)=>{
            return new InputGraph(inputPositions, name, this.contents)
        });

        this.getOutputPositions();
        const myOutputGraphs = Object.keys(outputPositions).map((name)=>{
            return new OutputGraph(outputPositions, name, this.contents)
        });


        const updateSize = () => {
            const newWidth = drawBoard.size.width - sizes.patcher.width;
            settings.width = newWidth;
            translator.change({
                width:newWidth
            });
            this.set({width:newWidth});
            this.contents.set({width:newWidth});

            this.domElement.setAttribute("width", (newWidth+sizes.patcher.width)+"px");
            // this.domElement.attributes["width"] = newWidth;
            // this.domElement.style["width"] = newWidth+"px";
            this.getInputPositions();
            myInputGraphs.forEach((ig)=>ig.updatePosition());
            myOutputGraphs.forEach((ig)=>ig.updatePosition());
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
            x: 10, y: 16,
            text: settings.name
        });

        this.contents.add(title);
        module.triggerInitialState();
    }
};

export default Lane;