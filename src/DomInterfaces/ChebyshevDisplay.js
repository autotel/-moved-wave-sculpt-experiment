import GenericDisplay from "./GenericDisplay";

class ChebyshevDisplay extends GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("amplitude");
        this.addKnob("bias");
        this.addKnob("order").setMinMax(0,4);
    }
}
export default ChebyshevDisplay;