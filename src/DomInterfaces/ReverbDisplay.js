import WaveLane from "./LaneTypes/WaveLane";

class ReverbDisplay extends WaveLane{
    constructor(options){
        super(options); 

        const timeKnob = this.addKnob("time");
        const difussionKnob = this.addKnob("diffusion");
        const feedbackKnob = this.addKnob("feedback");
        const wetKnob = this.addKnob("wet");
        const dryKnob = this.addKnob("dry");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");
        difussionKnob.setDeltaCurve("periodseconds");

    }
}
export default ReverbDisplay;