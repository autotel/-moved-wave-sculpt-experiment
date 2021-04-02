import WaveLane from "./LaneTypes/WaveLane";

class WaveFolderDisplay extends WaveLane{
    constructor(options){
        super(options); 

        this.addKnob("frequency");
        this.addKnob("dampening_inverse").setMinMax(0,1);
        this.addKnob("dampening").setMinMax(0,1);
        this.addKnob("feedback");
    }
}
export default WaveFolderDisplay;