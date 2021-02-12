import GenericDisplay from "./GenericDisplay";

class DelayDisplay extends GenericDisplay{
    constructor(options){
        super(options); 

        const timeKnob = this.addParameterKnob("time");
        const feedbackKnob = this.addParameterKnob("feedback");
        const wetKnob = this.addParameterKnob("wet");
        const dryKnob = this.addParameterKnob("dry");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");

    }
}
export default DelayDisplay;