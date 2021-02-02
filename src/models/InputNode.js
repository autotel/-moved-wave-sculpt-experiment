const InputNode=function(owner){

    this.input=undefined;
    this.owner=owner;
    this.disconnect=()=>{
        if(this.input){
            this.input.disconnect(this);
        }
    }
    this.getValues=()=>{
        if(!this.input) throw new Error("requested getValues from nonconnected input");
        return this.input.getValues();
    }
    this.inputChanged=owner.inputChanged;
}
export default InputNode;