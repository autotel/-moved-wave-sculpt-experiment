/** @typedef {import("../PatchDisplay").NodePosition} NodePosition */

import { Rectangle, Text, Path } from "../../dom-model-gui/GuiComponents/SVGElements";
import Hoverable from "../../dom-model-gui/Interactive/Hoverable";
import { SVGListElement } from "../../dom-model-gui/GuiComponents/ElementsArray";
import Output from "../../SoundModules/io/Output";
import Input from "../../SoundModules/io/Input";
import Clickable from "../../dom-model-gui/Interactive/Clickable";
import Mouse from "../../dom-model-gui/Interactive/Mouse";
import Draggable from "../../dom-model-gui/Interactive/Draggable";

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
        let patchFromOnRelease = undefined;
        /** @type {ConnectorGraph|undefined} */
        let patchToOnRelease = undefined;

        const mouse = Mouse.get();

        /** @param {ConnectorGraph} connectorGraph */
        this.startPatchAction = connectorGraph => {
            if (!connectorGraph.output) return;
            console.log("connect ", connectorGraph.output.name, "...");
            if (patchFromOnRelease) {
                patchFromOnRelease.removeClass("active");
            }
            patchFromOnRelease = connectorGraph;
            patchFromOnRelease.addClass("active");

            patchStartListeners.map(callback => callback({
                from: patchFromOnRelease,
            }));
        };

        this.hover = connectorGraph => {
            console.log("... to ", connectorGraph.input.name, "? ...");
            patchToOnRelease = connectorGraph;
        }

        this.unhover = connectorGraph => {
            console.log("... nope, not ", connectorGraph.input.name, " ...");
            if (connectorGraph === patchToOnRelease) patchToOnRelease = undefined;
        }

        this.release = () => {
            if (
                patchFromOnRelease
                && patchFromOnRelease.output
                && patchToOnRelease
                && patchToOnRelease.input
            ) {
                patchFromOnRelease.output.connectTo(patchToOnRelease.input);

                patchEndListeners.forEach(callback => callback({
                    from: patchFromOnRelease,
                    to: patchToOnRelease
                }));
                console.log("... ah, to ", patchToOnRelease ? patchToOnRelease.input.name : patchToOnRelease, " ...");
                console.log("connected");
            } else {
                console.log("connection cancelled");
            }

            if (patchFromOnRelease) {
                patchFromOnRelease.removeClass("active");
                patchFromOnRelease = undefined;
            }

            patchToOnRelease = undefined;
        };

        /**@param {PatchStartCallback} callback */
        this.onPatchStart = (callback) => patchStartListeners.push(callback);
        /**@param {PatchEndCallback} callback */
        this.onPatchEnd = (callback) => patchEndListeners.push(callback);

        mouse.onUp(() => {
            this.release();
        });

    }
}

/** @param  {NodePosition} pos */

class ConnectorGraph extends SVGListElement {
    constructor() {
        super();

        const guiConnector = ConnectorGraph.getGuiConnector();

        this.position = {};
        this.absolute = {};

        this.input = undefined;
        this.output = undefined;

        const connectorText = new Text();
        const showText = () => this.add(connectorText);
        const hideText = () => this.remove(connectorText);
        const rect = new Rectangle();
        const hoverable = new Hoverable(rect);

        hoverable.mouseEnterCallback = () => {
            showText();
            if (this.input) {
                guiConnector.hover(this);
            }
        }

        hoverable.mouseLeaveCallback = () => {
            hideText();
            if (this.input) {
                guiConnector.unhover(this);
            }
        }

        const clickable = new Clickable(rect);

        clickable.mouseDownCallback = () => {
            guiConnector.startPatchAction(this);
        }


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
            this.position.x = x;
            this.position.y = y;
            this.input = input;
            this.output = output;
            this.absolute = absolute;
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