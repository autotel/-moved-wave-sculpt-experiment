import GenericDisplay from "./GenericDisplay";

class WaveFolderDisplay extends GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("amplitude");
        this.addKnob("bias");
        this.addKnob("fold");
    }
}
export default WaveFolderDisplay;