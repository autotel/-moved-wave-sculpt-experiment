import GenericDisplay from "./GenericDisplay";

class WaveFolderDisplay extends GenericDisplay{
    constructor(options){
        super(options); 

        this.addKnob("frequency");
        this.addKnob("dampening_inverse");
        this.addKnob("dampening");
        this.addKnob("feedback");
    }
}
export default WaveFolderDisplay;