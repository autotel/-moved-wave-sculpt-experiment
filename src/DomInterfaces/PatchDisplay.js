import Module from "../SoundModules/common/Module";
import { Path, SVGGroup, SVGCanvas }  from "../dom-model-gui/GuiComponents/SVGElements";
import Output from "../SoundModules/io/Output";
import Input from "../SoundModules/io/Input";
import Lane from "./components/Lane";
import debounce from "../utils/debounceFunction";
import ConnectorGraph from "./components/ConnectorGraph";
const pathTypes = require("../dom-model-gui/GuiComponents/SVGElements");

/** @typedef {pathTypes.PathOptions} PathOptions */

/**
 * @namespace DomInterface.PatchDisplay
 */

 /*
 * TODO: interfaces should also extend model, so that changes to interface can be tracked better.
 */

const VectorTypedef = require("../dom-model-gui/utils/Vector2");

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */

/**
 * @typedef {Object} NodePosition
 * @property {string} name
 * @property {number} x
 * @property {number} y
 * @property {MiniVector} absolute
 * //either:
 * @property {Input} [input]
 * @property {Output} [output]
 **/

/**
 * @param {Output} fromOutput
 * @param {Input} toInput 
 */
class PatchCord{
    /** @param {SVGGroup} parentEl*/
    constructor (parentEl){
        const myPath = new Path();
        parentEl.add(myPath);

        myPath.domElement.classList.toggle("patchcord");

        myPath.domElement.addEventListener(
            'click',
            (evt)=>myPath.domElement.classList.toggle("highlight")
        );

        let displaying = true;
        this.show=()=>{
            if(displaying) return;
            myPath.removeClass("hidden");
        }
        this.hide=()=>{
            if(!displaying) return;
            myPath.addClass("hidden");
        }
        this.set=(startPos,endPos)=>{
            this.show();
            let bez=Math.abs(startPos.y-endPos.y) / 5;
            myPath.set('d',
                `M ${startPos.x}, ${startPos.y}
                 C ${startPos.x + bez}, ${startPos.y}
                    ${endPos.x + bez}, ${endPos.y}
                    ${endPos.x}, ${endPos.y}`
            );
        }
    }
}

/** 
 * @class PatchDisplay
 * @extends SVGGroup
 */
class PatchDisplay extends SVGGroup{
    /** 
     * @param {SVGCanvas} drawBoard
     * */
    constructor(drawBoard){
        super();

        const connectActionPatchCord = new PatchCord(this);
        connectActionPatchCord.hide();

        const guiConnector = ConnectorGraph.getGuiConnector();

        this.addClass("patch-board");
        
        /** @type {Set<Module>}  */
        const myAppendedModules=new Set();

        /** @type {Set<Lane>}  */
        const myAppendedInterfaces=new Set();

        const patchCords = [];

        const drawPatchCord=(startPos,endPos,number)=>{
            if(!patchCords[number]) patchCords[number]=new PatchCord(this);
            patchCords[number].set(startPos,endPos);
        }

        const hidePatchCordsFrom=(from)=>{
            for(let index=from; index<patchCords.length; index++){
                patchCords[index].hide();
            }
        }

        const getListOfConnectionCoordinates = () => {
            const coords = [{
                startPos:{x:0,y:0},
                endPos:{x:0,y:0},
            }];

            /** @type {Array<NodePosition>} */
            const outputInfo = [];

            /** @type {Array<NodePosition>} */
            const inputInfo = [];

            /** @type {Array<ConnectorGraph>} */
            const connectorGraphs = [];
            
            myAppendedInterfaces.forEach((lane)=>{
                outputInfo.push(... lane.getOutputInfo());
                inputInfo.push(... lane.getInputInfo());
            });

            /** @param {Input} input */
            const getPositionOfInput = (input)=> {
                return inputInfo.filter((position)=>{
                    return position.input==input;
                })[0];
            }
            outputInfo.forEach((outputPosition)=>{
                const outputNode = outputPosition.output;
                outputNode.forEachConnectedInput((input)=>{
                    const inputPos = getPositionOfInput(input);
                    if(inputPos){
                        const startPos=outputPosition.absolute;
                        const endPos=inputPos.absolute;
                        coords.push({
                            startPos,
                            endPos
                        });
                    }else{
                        console.error("input position found to draw patch cable");
                    }
                });
            });
            return coords;

        }

        const updatePatchLines= debounce(()=>{
            let coordinates = getListOfConnectionCoordinates();

            hidePatchCordsFrom(coordinates.length);

            coordinates.forEach(({startPos,endPos},index)=>{
                drawPatchCord(startPos,endPos,index);
            });
        },10);

        // client functions
        this.appendModules=(...modules)=>{
            modules.map(this.appendModule);
        }
        
        /** @param {Module} module */
        this.appendModule=(module)=>{
            myAppendedModules.add(module);
            
            module.onUpdate((changes)=>{
                if(changes.outputs||changes.inputs){
                    updatePatchLines();
                }
            });

            const modInterface=module.getInterface();

            if(modInterface){
                modInterface.onMoved(updatePatchLines);
                myAppendedInterfaces.add(modInterface);
            }

            updatePatchLines();
        }
        //event callbacks

        drawBoard.size.onChange(()=>{
            updatePatchLines();
        });


        guiConnector.onPatchStart(({from})=>{
            const startPos = from.position;
            const endPos = {x:0,y:0};
            connectActionPatchCord.set(startPos,endPos);
        });

        guiConnector.onPatchStart(({from,to})=>{
            connectActionPatchCord.hide();
        });


    }
}
export default PatchDisplay;