import WaveLane from "./LaneTypes/WaveLane";

class FilterDisplay extends WaveLane{
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