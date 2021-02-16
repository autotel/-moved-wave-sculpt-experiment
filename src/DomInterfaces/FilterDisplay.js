import GenericDisplay from "./GenericDisplay";

class FilterDisplay extends GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("gain");
        this.addKnob("reso");
        this.addKnob("frequency");
        this.addKnob("order");
        this.addToggle("saturate");

    }
}
export default FilterDisplay;