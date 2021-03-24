//actual sound modules
import Oscillator from "../SoundModules/Oscillator";
import Mixer from "../SoundModules/Mixer";
import Delay from "../SoundModules/Delay";
import DelayWithFilter from "../SoundModules/DelayWithFilter";
import NaiveReverb from "../SoundModules/NaiveReverb";
import EnvelopeGenerator from "../SoundModules/EnvelopeGenerator";
import Chebyshev from "../SoundModules/Chebyshev";
import WaveFolder from "../SoundModules/WaveFolder";
import RustComb from "../SoundModules/RustComb";
import RustFreeverb from "../SoundModules/RustFreeverb";
import Filter from "../SoundModules/Filter";
import MixerTesselator from "../SoundModules/MixerTesselator";
import Module from "../SoundModules/Module";
import Repeater from "../SoundModules/Repeater";
import FilterDisplay from "../DomInterfaces/FilterDisplay";
import InputNode from "../SoundModules/InputNode";
import Hipparchus from "../SoundModules/Hipparchus";

//for interfaces
import DelayDisplay from "../DomInterfaces/DelayDisplay";
import DelayWithFilterDisplay from "../DomInterfaces/DelayWithFilterDisplay";
import ReverbDisplay from "../DomInterfaces/ReverbDisplay";
import MixerDisplay from "../DomInterfaces/MixerDisplay";
import GenericDisplay from "../DomInterfaces/GenericDisplay";
import OscillatorDisplay from "../DomInterfaces/OscillatorDisplay";
import EnvelopeGeneratorDisplay from "../DomInterfaces/EnvelopeGeneratorDisplay";
import ChebyshevDisplay from "../DomInterfaces/ChebyshevDisplay";
import RepeaterDisplay from "../DomInterfaces/RepeaterDisplay";
import HipparchusDisplay from "../DomInterfaces/HipparchusDisplay";
import WaveFolderDisplay from "../DomInterfaces/WaveFolderDisplay";
import RustCombDisplay from "../DomInterfaces/RustCombDisplay";

//for typing
import Canvas from "../scaffolding/Canvas";
import NativeProcess from "../scaffolding/NativeProcess";

function giveHelp(){

    console.log(`
    use command "create(<module>,<myName>)", where module is any of the prototypes contained in the "modules" object, and myname is a custom name you wish to give to this module. Type "modules" and then press enter to get the list of them.
    Then type "modules.<myName>" and tab, to see the available methods.
    `);
    console.log(`instanced modules are present in modules array`);
    console.log(`to display how to re-create the patch in screen, run "dumpPatch()". This is a good way to save patches for later use, too.`);

}

class LiveCodingInterface{
    /**
     * @param {Object} globals
     * @param {Canvas} globals.drawBoard
     * @param {NativeProcess} globals.nativeProcessor
     */
    constructor({drawBoard,nativeProcessor}){
        let count=0;

        setTimeout(giveHelp,1000);
        const moduleCreationListeners = [];

        /** @param {Function} callback */
        this.onModuleCreated=(callback)=>{
            moduleCreationListeners.push(callback);
        }

        this.modules = {};

        let first=true;
        /** 
         * @param {string|false} intendedName
         * @returns {Module} 
         **/
        this.create=function(Which,intendedName=false){
            if(first){
                first=false;
                let helpDom = document.getElementById("notes");
                if(helpDom) helpDom.classList.add("hide");
            }

            let protoname=Which.name;
            if(!intendedName) intendedName=protoname+" "+count;
            let nameForAccess = intendedName.match(/[A-Za-z0-9]/gi).join("");

            if(this.modules[nameForAccess]) nameForAccess = nameForAccess+count;
            
            console.log(`this module will be available as "modules.${nameForAccess}"`);
            
            const newModule=new Which({nativeProcessor});

            this.modules[nameForAccess]=newModule;
            if(window[intendedName]===undefined) window[intendedName]=newModule;

            const props = {
                model:newModule,
                name:nameForAccess, drawBoard
            }

            let newInterface;
            switch (protoname){
                case "Oscillator":
                    newInterface=new OscillatorDisplay(props);
                break;
                case "Hipparchus":
                    newInterface=new HipparchusDisplay(props);
                break;
                case "WaveFolder":
                    newInterface=new WaveFolderDisplay(props);
                break;
                case "RustComb":
                    newInterface=new RustCombDisplay(props);
                break;
                case "EnvelopeGenerator":
                    newInterface=new EnvelopeGeneratorDisplay(props);
                break;
                case "Repeater":
                    newInterface=new RepeaterDisplay(props);
                break;
                case "Filter":
                    newInterface=new FilterDisplay(props);
                break;
                case "Chebyshev":
                    newInterface=new ChebyshevDisplay(props);
                break;
                case "Delay":
                    newInterface=new DelayDisplay(props);
                break;
                case "DelayWithFilter":
                    newInterface=new DelayWithFilterDisplay(props);
                break;
                case "NaiveReverb":
                    newInterface=new ReverbDisplay(props);
                break;
                case "MixerTesselator":
                    newInterface=new MixerDisplay(props);
                break;
                case "Mixer":
                    newInterface=new MixerDisplay(props);
                break;
                default:
                    newInterface=new GenericDisplay(props);
            }
            moduleCreationListeners.map((cb)=>cb(newModule,newInterface,count));

            
            newInterface.handyPosition(count + 3);

            count++;
            return newModule;
        }
        //TODO: the dumped file assumes the modules contain a property called "name" which contains exactly the name to which this patcher refers to as that module, thus it's limited to modules created with "create" functioon
        //creates a procedure to recreate the current patch
        const dumpPatch = () => {
            let instanceStrings = [];
            let connectionStrings = [];
            let settingStrings = [];
            let autozoomStrings = [];
            
            /*
            TODO:replace moduleList type from Array<Module> into Array of [module,name]
            so that we dont need to run "findModulesName" on each iteration of modulesList.map

            */


            /** @type {Array<Module>} */
            let modulesList = [];

            Object.keys(this.modules).map((mname)=>{
                modulesList.push(this.modules[mname]);
            });

            modulesList.sort((a,b)=>{
                return a.getInterface().attributes.y - b.getInterface().attributes.y;
            });

            const findModulesName = (module)=>{
                let keys = Object.keys(this.modules)
                return keys.find((keyName)=>this.modules[keyName]===module);
            }
            
            modulesList.map((module)=>{
                //make creation string
                let constructorName = module.constructor.name;
                let name = findModulesName(module);
                instanceStrings.push(`create(possibleModules.${constructorName},"${name}");`);
                /** @type {Set<InputNode>} */
                let outputs=module.outputs;
                outputs.forEach((inputNode)=>{
                    /** @type {Module} */
                    let inputNodeOwner = inputNode.owner;

                    let inputNodeOwnerName=findModulesName(inputNodeOwner);
                    /* the key under which this inputNode is kept in owner module */
                    let inputNodeNameInOwner = Object.keys(inputNodeOwner.inputs)
                        .find((inputName)=>inputNodeOwner.inputs[inputName]===inputNode);
                    
                    connectionStrings.push(`modules["${name}"].connectTo(modules["${inputNodeOwnerName}"].inputs.${inputNodeNameInOwner});`);
                });
                const setts = JSON.stringify(module.settings,null, 2);
                settingStrings.push('modules["'+name+'"].set('+setts+');');
                autozoomStrings.push('modules["'+name+'"].getInterface().autoZoom();');

            });
            return [instanceStrings,connectionStrings,settingStrings,autozoomStrings].flat().join("\n").replace(/\"/g,"'");
        }

        //export stuff to window, so that you can call it from webinspector

        window.possibleModules=this.possibleModules={
            Oscillator,
            Mixer,
            MixerTesselator,
            Delay,
            DelayWithFilter,
            EnvelopeGenerator,
            Chebyshev,
            Filter,
            Repeater,
            Hipparchus,
            WaveFolder,
            RustComb,
            NaiveReverb,
            RustFreeverb,
        };

        Object.keys(this.possibleModules).map((mname)=>{
            if(window[mname]===undefined) window[mname]=this.possibleModules[mname];
        });
        
        window.create=(module,name)=>{
            if(!module){
                console.error("create: provided module is",module);
                return Object.keys(this.possibleModules);
            }
            return this.create(module,name)
        };
        window.modules=this.modules;
        window.dumpPatch=()=>{return dumpPatch()};
        window.connect=(from,to)=>{
            from=([from]).flat();
            to=([to]).flat();
            from.map((source)=>{
                to.map((destination)=>{
                    source.connectTo(destination);
                })
            });
        }

    }
}

export default LiveCodingInterface;