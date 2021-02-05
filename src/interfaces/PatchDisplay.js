import Module from "../models/Module";
import { Line } from "../scaffolding/elements";
import Lane from "./components/Lane";
import InputNode from "../models/InputNode";
import Sprite from "../scaffolding/Sprite";

/**
 * @typedef {{x:number,y:number}} MiniVector
 */

class PatchDisplay extends Sprite{
    constructor(){
        super();
        /** @type {Line[]} */
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
            console.log(modInterface);
            if(modInterface) modInterface.onMoved(updatePatchLines);

            updatePatchLines();
        }

        const updatePatchLines=()=>{

            /** @type {{x1:number,y1:number,x2:number,y2:number}[]} */
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

                filteredCoordinates.map((filteredCoord)=>{
                    const startPos = modulesInterface.getOutputPosition().absolute;
                    const endPos = filteredCoord.absolute;
                    coords.push({
                        x1:endPos.x,
                        y1:startPos.y,
                        x2:endPos.x,
                        y2:endPos.y,
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

            coords.map((coord,i)=>{
                if(!lines[i]){
                    lines[i]=new Line();
                    this.add(lines[i]);
                }
                Object.assign(lines[i].attributes,coord);
                lines[i].update();
            });
        }

    }
}
export default PatchDisplay;