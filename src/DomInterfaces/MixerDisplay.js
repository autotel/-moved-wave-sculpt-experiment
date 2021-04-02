import WaveLane from "./LaneTypes/WaveLane";

class MixerDisplay extends WaveLane{
    constructor(options){
        super(options); 

        const levels=[
            this.addKnob("levela"),
            this.addKnob("levelb"),
            this.addKnob("levelc"),
            this.addKnob("leveld")
        ];
        const saturate = this.addToggle("saturate");

        levels.map((k)=>
            k.setMinMax(0,4)
            .setDeltaCurve("channelvol")
        );
        
        options.model.triggerInitialState();

    }
}
export default MixerDisplay;