import GenericDisplay from "./GenericDisplay";

class DelayDisplay extends GenericDisplay{
    constructor(options){
        super(options); 

        const timeKnob = this.addKnob("time");
        const feedbackKnob = this.addKnob("feedback");
        const wetKnob = this.addKnob("wet");
        const dryKnob = this.addKnob("dry");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");

    }
}
export default DelayDisplay;