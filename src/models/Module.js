import {maxRecursion} from "./vars";
import Model from "../scaffolding/Model";

function Module(settings){
    Model.call(this,settings);

    this.cachedValues=[];

    this.inputs=new Set();
    this.outputs=new Set();

    /** @param {Module} outputModule */
    this.connectTo=(outputModule)=>{
        outputModule.inputs.add(this);
        this.outputs.add(outputModule);
    }
    /** @param {Module} outputModule */
    this.disconnect=(outputModule)=>{
        outputModule.inputs.delete(this);
        this.outputs.delete(outputModule);
    }

    //a module can be set to not useCache, it's not expected to change.
    //maybe I can do a "useCache" flag propagation later, for example
    //to de-cache all outputs of an envelope when its changed
    let useCache=false;

    this.useCache=()=>{
        useCache=true;
        this.changed({useCache});
    }

    this.inputChanged=()=>{

        useCache=false;
        this.changed({useCache});
        this.getValues();
    }

    //not to be changed
    this.getValues=(recursion = 0)=>{
        if(recursion > maxRecursion) throw new Error("max recursion reached");
        if(!useCache){
            this.recalculate(recursion+1);
            this.changed({cachedValues:this.cachedValues});
            this.useCache();
            //if my cache changes, it means all my output modules need recalculation
            this.outputs.forEach((outputModule)=>outputModule.inputChanged());
        }
        return this.cachedValues;
    }

    //to be overriden.
    //a this.recalculate has to fill the this.cachedValues array
    this.recalculate=(recursion = 0)=>{
        this.cachedValues=[];
        this.changed({cachedValues:this.cachedValues});
    }

    this.triggerInitialState=()=>{
        this.getValues();
        this.changed({useCache});
    }
}
export default Module;