import WaveLane from "./LaneTypes/WaveLane";

class WaveFolderDisplay extends WaveLane{
    constructor(options){
        super(options); 
        this.addKnob("amplitude");
        this.addKnob("bias");
        this.addKnob("fold");
    }
}
export default WaveFolderDisplay;