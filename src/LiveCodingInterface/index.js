
import Oscillator from "../SoundModules/Oscillator";
import Mixer from "../SoundModules/Mixer";
import Delay from "../SoundModules/Delay";
import EnvelopeGenerator from "../SoundModules/EnvelopeGenerator";
import Chevyshev from "../SoundModules/Chebyshev";

import GenericDisplay from "../DomInterfaces/GenericDisplay";
import OscillatorDisplay from "../DomInterfaces/OscillatorDisplay";
import EnvelopeGeneratorDisplay from "../DomInterfaces/EnvelopeGeneratorDisplay";
import Filter from "../SoundModules/Filter";
import MixerTesselator from "../SoundModules/MixerTesselator";


class LiveCodingInterface{
    constructor(){
        let count=0;

        const moduleCreationListeners = [];

        /** @param {Function} callback */
        this.onModuleCreated=(callback)=>{
            moduleCreationListeners.push(callback);
        }

        this.modules = {};

        /** @param {string|false} name */
        this.create=function(Which,name=false){
            let protoname=Which.name;

            if(!name) name=protoname+" "+count;

            const newModule=new Which();
            let newInterface;
            switch (protoname){
                case "Oscillator":
                    newInterface=new OscillatorDisplay({model:newModule,name});
                    break;
                case "EnvelopeGenerator":
                    newInterface=new EnvelopeGeneratorDisplay({model:newModule,name});
                    break;
                default:
                    newInterface=new GenericDisplay({model:newModule,name});
            }
            moduleCreationListeners.map((cb)=>cb(newModule,newInterface,count));

            this.modules[name]=newModule;
            newInterface.handyPosition(count);

            count++;
            return newModule;
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
            EnvelopeGenerator,
            Chevyshev,
            Filter,
        };

        window.create=this.create;
        window.modules=this.modules;

    }
}

export default LiveCodingInterface;