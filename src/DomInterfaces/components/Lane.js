import { Line, Rectangle, Path, SVGGroup, Text, SVGCanvas } from "../../dom-model-gui/GuiComponents/SVGElements";
import Draggable from "../../dom-model-gui/Interactive/Draggable";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import Module from "../../SoundModules/common/Module";
import Knob from "../../dom-model-gui/GuiComponents/Knob";
import Toggle from "../../dom-model-gui/GuiComponents/Toggle";
import placements from "../config/placement";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import SoundLoaderDecoder from "./SoundLoaderDecoder";
import Input from "../../SoundModules/io/Input";
import Output from "../../SoundModules/io/Output";
import ConnectorGraph from "./ConnectorGraph";
import { SVGElementsArray } from "../../dom-model-gui/GuiComponents/ElementsArray";
import Component from "../../dom-model-gui/GuiComponents/Component";

const sizes = placements;

const VectorTypedef = require("../../dom-model-gui/utils/Vector2");

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
 * @property {SVGCanvas} drawBoard
 * @exports LaneOptions
 */


/**
 * @class Lane
 * @extends SVGGroup
 * */
class Lane extends SVGGroup {
    /**
     * @param {ValuePixelTranslator} translator
     * @param {LaneOptions} options
     */
    constructor(translator,options) {

        const { module, drawBoard } = options;
        const settings = typicalLaneSettings(module,drawBoard);
        Object.assign(settings, options);

        super(settings);


        this.addClass("lane");

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

        handleRect.addClass("lane-handle");

        //add a class to cause visual feedback while the module is processsing.
        module.onUpdate((changes)=>{
            if(changes.cacheStillValid === true){
                this.removeClass("working");
            }
            if(changes.cacheStillValid === false){
                this.addClass("working");
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
        const controlPanel = new SVGGroup();

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
            newControl.setToModelParameter(module, parameterName);
            return newControl;
        }
        /** @param {string} parameterName */
        this.addToggle = (parameterName) => {
            const newControl = new Toggle();
            this.appendToControlPanel(newControl);
            newControl.setToModelParameter(module, parameterName);
            return newControl;
        }

        /** @param {string} parameterName */
        this.addSoundDecoder = (parameterName) => {
            const newControl = new SoundLoaderDecoder();
            this.appendToControlPanel(newControl);
            newControl.setToModelParameter(module, parameterName);
            return newControl;
        }


        const draggable = new Draggable(handleRect.domElement);
        draggable.setPosition(settings);
        draggable.positionChanged = (newPosition) => {
            settings.y = newPosition.y;
            this.set({"y": newPosition.y});
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

        this.contents = new SVGGroup({
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
        
        const outputsArrayContainer = new SVGElementsArray(
            ConnectorGraph,{}
        );

        const inputsArrayContainer = new SVGElementsArray(
            ConnectorGraph,{}
        );
        
        /** @type {Array<NodePosition>|undefined} */

        const inputInfo=[];
        
        /** @returns {Array<NodePosition>} */
        
        this.getInputInfo = () => {
            const cols = 5;
            module.eachInput((input, index) => {
                let col = index % cols;
                let row = Math.floor(index / cols)
                const newInputPosition = {
                    x: settings.width + (col * 20) + 30,
                    y: row * 20 + 15,
                    absolute: {},
                    input,name:input.name,
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                if(! inputInfo[index]) inputInfo[index] = newInputPosition;
                Object.assign(inputInfo[index],newInputPosition);
            });
            return inputInfo;
        }

        /** @type {Array<NodePosition>|undefined} */

        const outputInfo=[];
        
        /** @returns {Array<NodePosition>} */
        
        this.getOutputInfo = () => {
            const cols = 5;
            module.eachOutput((output, index) => {
                let col = index % cols;
                let row = Math.floor(index / cols)
                const newInputPosition = {
                    x: settings.width + (col * 20) + 30,
                    y: settings.height - row * 20 - 10,
                    absolute: {},
                    output,name:output.name,
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                if(! outputInfo[index]) outputInfo[index] = newInputPosition;
                Object.assign(outputInfo[index],newInputPosition);
            });
            return outputInfo;
        }

        this.getConnectorGraphs = () => [
            ... outputsArrayContainer.instancesList,
            ... inputsArrayContainer.instancesList
        ];

        this.add(inputsArrayContainer,outputsArrayContainer);

        const updateSize = () => {
            const newWidth = drawBoard.size.width - sizes.patcher.width;
            settings.width = newWidth;
            translator.change({
                width:newWidth
            });
            this.set({width:newWidth});
            this.contents.set({width:newWidth});

            this.domElement.setAttribute("width", (newWidth+sizes.patcher.width)+"px");

            outputsArrayContainer.displayArray(this.getOutputInfo());
            inputsArrayContainer.displayArray(this.getInputInfo());
        }

        // updateSize();

        translator.onChange(()=>{
            const newWidth=translator.settings.width;
            handleRect.set({"width":newWidth});

            controlPanel.set({
                "x":
                newWidth - controlPanelWidth - controlPanelRight
            });
        });

        drawBoard.size.onChange(()=>updateSize());
        setTimeout(updateSize,1);

        const title = new Text({
            x: 10, y: 16,
            text: settings.name
        });

        this.contents.add(title);
        module.triggerInitialState();
    }
};

export default Lane;