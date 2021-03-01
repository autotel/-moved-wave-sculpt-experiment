
import Oscillator from "../SoundModules/Oscillator";
import Mixer from "../SoundModules/Mixer";
import Delay from "../SoundModules/Delay";
import DelayWithFilter from "../SoundModules/DelayWithFilter";
import NaiveReverb from "../SoundModules/NaiveReverb";
import EnvelopeGenerator from "../SoundModules/EnvelopeGenerator";
import Chebyshev from "../SoundModules/Chebyshev";

import Model from "../scaffolding/Model";

import Filter from "../SoundModules/Filter";
import MixerTesselator from "../SoundModules/MixerTesselator";
import Module from "../SoundModules/Module";
import Repeater from "../SoundModules/Repeater";
import FilterDisplay from "../DomInterfaces/FilterDisplay";
import InputNode from "../SoundModules/InputNode";
import Hipparchus from "../SoundModules/Hipparchus";

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


class LiveCodingInterface{
    constructor(){
        let count=0;

        const moduleCreationListeners = [];

        /** @param {Function} callback */
        this.onModuleCreated=(callback)=>{
            moduleCreationListeners.push(callback);
        }

        this.modules = {};

        /** 
         * @param {string|false} name
         * @returns {Module} 
         **/
        this.create=function(Which,name=false){
            let protoname=Which.name;

            if(!name) name=protoname+" "+count;
            if(modules[name]) name = name+"_"+count;

            
            const newModule=new Which();
            
            if(window[name]===undefined) window[name]=newModule;

            let newInterface;
            switch (protoname){
                case "Oscillator":
                    newInterface=new OscillatorDisplay({model:newModule,name});
                break;
                case "Hipparchus":
                    newInterface=new HipparchusDisplay({model:newModule,name});
                break;
                case "EnvelopeGenerator":
                    newInterface=new EnvelopeGeneratorDisplay({model:newModule,name});
                break;
                case "Repeater":
                    newInterface=new RepeaterDisplay({model:newModule,name});
                break;
                case "Filter":
                    newInterface=new FilterDisplay({model:newModule,name});
                break;
                case "Chebyshev":
                    newInterface=new ChebyshevDisplay({model:newModule,name});
                break;
                case "Delay":
                    newInterface=new DelayDisplay({model:newModule,name});
                break;
                case "DelayWithFilter":
                    newInterface=new DelayWithFilterDisplay({model:newModule,name});
                break;
                case "NaiveReverb":
                    newInterface=new ReverbDisplay({model:newModule,name});
                break;
                case "MixerTesselator":
                    newInterface=new MixerDisplay({model:newModule,name});
                break;
                case "Mixer":
                    newInterface=new MixerDisplay({model:newModule,name});
                break;
                default:
                    newInterface=new GenericDisplay({model:newModule,name});
            }
            moduleCreationListeners.map((cb)=>cb(newModule,newInterface,count));

            newModule.name = name;
            
            this.modules[name]=newModule;
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
            
            /** @type {Array<Module>} */
            let modulesList = [];

            Object.keys(this.modules).map((mname)=>{
                modulesList.push(this.modules[mname]);
            });

            modulesList.sort((a,b)=>{
                return a.getInterface().attributes.y - b.getInterface().attributes.y;
            });
            
            modulesList.map((module)=>{
                //make creation string
                let constructorName = module.constructor.name;
                let name = module.name;
                instanceStrings.push(`create(possibleModules.${constructorName},"${name}");`);
                /** @type {Set<InputNode>} */
                let outputs=module.outputs;
                outputs.forEach((inputNode)=>{
                    /** @type {Module} */
                    let inputNodeOwner = inputNode.owner;
                    /* the key under which this inputNode is kept in owner module */
                    let inputNodeNameInOwner = Object.keys(inputNodeOwner.inputs)
                        .find((inputName)=>inputNodeOwner.inputs[inputName]===inputNode);
                    
                    connectionStrings.push(`modules["${name}"].connectTo(modules["${this.modules[inputNodeOwner.name].name}"].inputs.${inputNodeNameInOwner});`);
                });
                const setts = JSON.stringify(module.settings,null, 2);
                settingStrings.push('modules["'+name+'"].set('+setts+');');
                autozoomStrings.push('modules["'+name+'"].getInterface().autoZoom();');

            });
            return [instanceStrings,connectionStrings,settingStrings,autozoomStrings].flat().join("\n").replace(/\"/g,"'");
        }

        console.log(`use command "let myModule = create(<module>,<myName>)", where module is any of the prototypes contained in the "modules" object, and myname is a custom name you wish to give to this module. Type "modules" and then press enter to get the list of them.
        Then type "myModule" and tab, to see the available methods.
        `);
        console.log(`instanced modules are present in modules array`);

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
            NaiveReverb,
        };

        Object.keys(this.possibleModules).map((mname)=>{
            if(window[mname]===undefined) window[mname]=this.possibleModules[mname];
        });
        
        window.create=(module,name)=>{
            if(!module) return Object.keys(this.possibleModules);
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