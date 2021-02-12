import GenericDisplay from "./GenericDisplay";

class MixerDisplay extends GenericDisplay{
    constructor(options){
        super(options); 

        const levels=[
            this.addParameterKnob("levela"),
            this.addParameterKnob("levelb"),
            this.addParameterKnob("levelc"),
            this.addParameterKnob("leveld")
        ];
        levels.map((k)=>
            k.setMinMax(0,4)
            .setDeltaCurve("channelvol")
        );


    }
}
export default MixerDisplay;