import Module from "../SoundModules/Module";
import { Line, Path } from "../scaffolding/elements";
import Lane from "./components/Lane";
import InputNode from "../SoundModules/InputNode";
import Sprite from "../scaffolding/Sprite";
const pathTypes = require("../scaffolding/elements");

/** @typedef {pathTypes.PathOptions} PathOptions */

/**
 * @namespace DomInterface.PatchDisplay
 */

 /*
 * TODO: interfaces should also extend model, so that changes to interface can be tracked better.
 */

/**
 * @typedef {{x:number,y:number}} MiniVector
 */

/** 
 * @class PatchDisplay
 * @extends Sprite
 */
class PatchDisplay extends Sprite{
    constructor(){
        super();
        /** @type {Path[]} */
        const lines=[];
        
        /** @type {Set<Module>}  */
        const myAppendedModules=new Set();


        this.appendModules=(...modules)=>{
            modules.map(this.appendModule);
        }
        /** @param {Module} module */
        this.appendModule=(module)=>{
            
            myAppendedModules.add(module);

            module.onUpdate((changes)=>{
                if(changes.outputs){
                    updatePatchLines();
                }
            });

            const modInterface=module.getInterface();
            if(modInterface) modInterface.onMoved(updatePatchLines);

            updatePatchLines();
        }

        const updatePatchLines=()=>{
            /** @type {Array<PathOptions>} */
            const coords = [];

            /**
             * @param {Module} fromModule
             * @param {InputNode} toInput 
             */
            const appendCoord=(fromModule,toInput)=>{
                const modulesInterface=fromModule.getInterface();
                const otherModulesInterface=toInput.owner.getInterface();
                if(!modulesInterface) return;
                if(!otherModulesInterface) return;

                const othersModuleInputCoordinates = otherModulesInterface.getInputPositions();
                let filteredCoordinates=[];
                Object.keys(othersModuleInputCoordinates).map((opname)=>{
                    const outputCoordinates=othersModuleInputCoordinates[opname];
                    if(outputCoordinates.input===toInput){
                        filteredCoordinates.push(outputCoordinates);
                    }
                })
                let bez=80;
                filteredCoordinates.map((filteredCoord)=>{
                    const startPos = modulesInterface.getOutputPosition().absolute;
                    const endPos = filteredCoord.absolute;
                    coords.push({
                        d:`M ${endPos.x}, ${startPos.y}
                            C ${endPos.x + bez}, ${startPos.y}
                              ${endPos.x + bez}, ${endPos.y}
                              ${endPos.x}, ${endPos.y}
                            `
                    });
                });
            }

            //for each of my modules
            myAppendedModules.forEach((module)=>{
                //for each input of that module
                
                module.eachInput((input,index,name)=>{
                    const otherModule = input.input;
                    // console.log("m["+module.unique+"]->m["+otherModule.unique+"]."+name);
                    appendCoord(otherModule,input);
                });
            });

            lines.map((line)=>{
                Object.assign(line.attributes,{d:""});
            });
            coords.map((coord,i)=>{
                if(!lines[i]){
                    lines[i]=new Path();
                    this.add(lines[i]);
                }
                Object.assign(lines[i].attributes,coord);
                lines[i].attributes.class="patchcord";
            });

            lines.map((line)=>{
                line.update();
            });

        }

    }
}
export default PatchDisplay;