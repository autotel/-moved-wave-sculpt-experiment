import GenericDisplay from "./GenericDisplay";

class FilterDisplay extends GenericDisplay{
    constructor(options){
        super(options); 
        this.addParameterKnob("gain");
        this.addParameterKnob("bandwidth");
        this.addParameterKnob("frequency");

    }
}
export default FilterDisplay;