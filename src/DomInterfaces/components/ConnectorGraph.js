/** @typedef {import("../PatchDisplay").NodePosition} NodePosition */

import { Rectangle, Text } from "../../dom-model-gui/GuiComponents/SVGElements";
import Hoverable from "../../dom-model-gui/Interactive/Hoverable";
import { SVGListElement } from "../../dom-model-gui/GuiComponents/ElementsArray";
import Output from "../../SoundModules/io/Output";
import Input from "../../SoundModules/io/Input";
import Clickable from "../../dom-model-gui/Interactive/Clickable";
import Mouse from "../../dom-model-gui/Interactive/Mouse";

/**
 * @callback PatchStartCallback
 * @param {Object} props
 * @property {ConnectorGraph} props.from
 * @property {ConnectorGraph} props.to
 */
/**
 * @callback PatchEndCallback
 * @param {Object} props
 * @property {ConnectorGraph} props.from
 */

class GuiConnector {
    constructor() {
        /** @type {Array<PatchStartCallback>} */
        const patchStartListeners = [];
        /** @type {Array<PatchEndCallback>} */
        const patchEndListeners = [];
        /** @type {ConnectorGraph|undefined} */
        let connectionActionStartOutputGraph = undefined;
        

        /** @param {ConnectorGraph} connectorGraph */
        this.startPatchAction = connectorGraph => {
            console.log("connect ",connectorGraph.output.name,"...");
            if(connectionActionStartOutputGraph){
                connectionActionStartOutputGraph.removeClass("active");
            }
            connectionActionStartOutputGraph=connectorGraph;
            connectionActionStartOutputGraph.addClass("active");

            patchStartListeners.map(callback=>callback({
                from:connectionActionStartOutputGraph,
            }));
        };

        this.endPatchAction = connectorGraph => {
            if(
                connectorGraph 
                && connectorGraph.input
                && connectionActionStartOutputGraph
                && connectionActionStartOutputGraph.output
            ){
                connectionActionStartOutputGraph.output.connectTo(connectorGraph.input);

                connectionActionStartOutputGraph.removeClass("active");
                connectionActionStartOutputGraph = undefined;

                patchEndListeners.forEach(callback=>callback({
                    from:connectionActionStartOutputGraph,
                    to:connectorGraph
                }));
            }
        };

        /**@param {PatchStartCallback} callback */
        this.onPatchStart = (callback) => patchStartListeners.push(callback);
        /**@param {PatchEndCallback} callback */
        this.onPatchEnd = (callback) => patchEndListeners.push(callback);

    }
}

/** @param  {NodePosition} pos */

class ConnectorGraph extends SVGListElement {
    constructor() {
        super();

        ConnectorGraph.getGuiConnector();

        this.position = {};
        this.absolute = {};

        this.input = undefined;
        this.output = undefined;

        const connectorText = new Text();
        const showText = () => this.add(connectorText);
        const hideText = () => this.remove(connectorText);
        const rect = new Rectangle();
        const hoverable = new Hoverable(rect);

        hoverable.mouseEnterCallback = () => showText();
        hoverable.mouseLeaveCallback = () => hideText();

        const clickable = new Clickable(rect);
        clickable.clickCallback = () => {
            if (this.output) {
                ConnectorGraph.guiConnector.startPatchAction(this);
            } else {
                ConnectorGraph.guiConnector.endPatchAction(this);
            }
        };

        this.add(rect);
        /**
           * @param {Object} props
           * @param {number} props.x
           * @param {number} props.y
           * @param {import("../../dom-model-gui/utils/Vector2").MiniVector} props.absolute
           * @param {string} props.name
           * @param {Output|undefined} props.output
           * @param {Input|undefined} props.input
           */
        this.set = ({ x, y, name, output, input, absolute }) => {
            this.position.x=x;
            this.position.y=y;
            this.input=input;
            this.output=output;
            this.absolute=absolute;
            Object.assign(rect.attributes, {
                x: x - 5,
                y: y - 5,
                width: 10,
                height: 10
            });
            rect.update();
            Object.assign(connectorText.attributes, {
                x: x - 20,
                y: y + 3,
                "text-anchor": "end",
                transform: "rotate(90deg)",
                text: name || "out"
            });
            connectorText.update();
        };

    }
}

/** @type {GuiConnector} */
ConnectorGraph.guiConnector = undefined;

ConnectorGraph.getGuiConnector = () => {
    if (!ConnectorGraph.guiConnector)
        ConnectorGraph.guiConnector = new GuiConnector();

    return ConnectorGraph.guiConnector;
}

export default ConnectorGraph;