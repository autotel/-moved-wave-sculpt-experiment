import GenericDisplay from "./GenericDisplay";

class FilterDisplay extends GenericDisplay{
    constructor(options){
        super(options); 
        this.addParameterKnob("gain");
        this.addParameterKnob("reso");
        this.addParameterKnob("frequency");
        this.addParameterKnob("order");

    }
}
export default FilterDisplay;