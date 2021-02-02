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

    this.ss=[];
    //a module can be set to not recalculate, it's not expected to change.
    //maybe I can do a "recalculate" flag propagation later, for example
    //to de-cache all outputs of an envelope when its changed
    let recalculate=true;

    this.useCache=()=>{
        recalculate=false;
        this.changed({recalculate});
    }

    this.recalculate=()=>{
        recalculate=true;
        this.changed({recalculate});
        this.getValues();
    }

    //not to be changed
    this.getValues=(recursion = 0)=>{
        if(recursion > maxRecursion) throw new Error("max recursion reached");
        if(recalculate){
            this.calculate(recursion+1);
            this.changed({cachedValues:this.cachedValues});
            this.useCache();
            //if my cache changes, it means all my output modules need recalculation
            this.outputs.forEach((outputModule)=>outputModule.recalculate());
        }
        return this.cachedValues;
    }

    //to be overriden.
    //a this.calculate has to fill the this.cachedValues array
    this.calculate=(recursion = 0)=>{
        this.cachedValues=[];
        this.changed({cachedValues:this.cachedValues});
    }

    this.triggerInitialState=()=>{
        this.getValues();
        this.changed({recalculate});
    }
}
export default Module;