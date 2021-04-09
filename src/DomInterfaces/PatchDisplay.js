import Module from "../SoundModules/common/Module";
import { Line, Path, Group } from "../scaffolding/elements";
import Canvas from "../scaffolding/Canvas";
import Output from "../SoundModules/io/Output";
import Input from "../SoundModules/io/Input";
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
 * @extends Group
 */
class PatchDisplay extends Group{
    /** 
     * @param {Canvas} drawBoard 
     * 
     * */

    constructor(drawBoard){
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
             * @param {Output} fromOutput
             * @param {Input} toInput 
             */
            const appendCoord=(fromOutput,toInput)=>{

                const modulesInterface=fromOutput.owner.getInterface();
                const otherModulesInterface=toInput.owner.getInterface();

                if(!modulesInterface) return;
                if(!otherModulesInterface) return;

                const othersModuleInputCoordinates = otherModulesInterface.getInputPositions();
                const othersModuleOutputCoordinates = otherModulesInterface.getOutputPositions();


                let filteredInputCoordinates=[];
                othersModuleInputCoordinates.forEach((outputCoordinates)=>{
                    if(outputCoordinates.input===toInput){
                        filteredInputCoordinates.push(outputCoordinates);
                    }
                })

                let filteredOutputCoordinates=[];
                othersModuleOutputCoordinates.forEach((outputCoordinates)=>{
                    if(outputCoordinates.output===fromOutput){
                        filteredOutputCoordinates.push(outputCoordinates);
                    }
                })

                filteredInputCoordinates.forEach((startPos)=>{
                    filteredOutputCoordinates.forEach((endPos)=>{         
                        let bez=Math.abs(startPos.y-endPos.y) / 5;
                        coords.push({
                            d:`M ${endPos.x}, ${startPos.y}
                                C ${endPos.x + bez}, ${startPos.y}
                                    ${endPos.x + bez}, ${endPos.y}
                                    ${endPos.x}, ${endPos.y}
                                `
                        });
                    });
                });
            }

            myAppendedModules.forEach((module)=>{
                module.eachOutput((output,index,name)=>{
                    module.eachInput((input,index,name)=>{
                        appendCoord(output,input);
                    });
                });
            });

            lines.forEach((line)=>{
                Object.assign(line.attributes,{d:""});
            });

            coords.forEach((coord,i)=>{
                if(!lines[i]){
                    lines[i]=new Path();
                    lines[i].domElement.addEventListener('click',(evt)=>lines[i].domElement.classList.toggle("highlight"));
                    this.add(lines[i]);
                }
                Object.assign(lines[i].attributes,coord);
                lines[i].attributes.class="patchcord";
            });

            lines.forEach((line)=>{
                line.update();
            });

            drawBoard.size.onChange(()=>{
                updatePatchLines();
            });


        }



    }
}
export default PatchDisplay;