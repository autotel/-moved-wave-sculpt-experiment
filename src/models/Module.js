import {maxRecursion} from "./vars";
import Model from "../scaffolding/Model";
import InputNode from "./InputNode";

function Module(settings){
    Model.call(this,settings);

    this.cachedValues=[];

    this.inputs={}
    this.outputs=new Set();

    this.hasInput=(inputName)=>{
        this.inputs[inputName] = new InputNode(this);
    }
    this.eachInput=(callback)=>{
        Object.keys(this.inputs).forEach((inputName,index)=>{
            const input = this.inputs[inputName];
            if(input.input) callback(input,index,inputName);
        });
    }
    /** @param {InputNode} inputNode */
    this.connectTo=(inputNode)=>{
        inputNode.disconnect();
        inputNode.input=this;
        this.outputs.add(inputNode);
    }
    /** @param {InputNode} inputNode */
    this.disconnect=(inputNode)=>{
        inputNode.input=false;
        this.outputs.delete(inputNode);
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