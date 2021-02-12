import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface){
    let mixer = codeInterface.create(codeInterface.possibleModules.MixerTesselator,"main");

    let oscillator1 = codeInterface.create(codeInterface.possibleModules.Oscillator,"ramp").setShape("ramp");
    let oscillator2 = codeInterface.create(codeInterface.possibleModules.Oscillator,"sine").setShape("sin");
    let envelope = codeInterface.create(codeInterface.possibleModules.EnvelopeGenerator,"envelope");
    let filter = codeInterface.create(codeInterface.possibleModules.Filter,"filter");


    let noiseEnvelope = codeInterface.create(codeInterface.possibleModules.EnvelopeGenerator,"noiseEnvelope");
    let noise = codeInterface.create(codeInterface.possibleModules.Oscillator).setShape("noise")
    let noiseFilter = codeInterface.create(codeInterface.possibleModules.Filter,"noiseFilter");
    
    let delayTimeEnvelope = codeInterface.create(codeInterface.possibleModules.EnvelopeGenerator,"delayTimeEnvelope");
    let delayAmountEnvelope = codeInterface.create(codeInterface.possibleModules.EnvelopeGenerator,"delayAmountEnvelope");
    let delay = codeInterface.create(codeInterface.possibleModules.Delay,"delay");

    filter.setType("IIR.highpass.butterworth");
    filter.setFrequency(4);

    console.log(mixer.inputs);

    noiseEnvelope.connectTo(noise.inputs.amplitude);
    noise.connectTo(noiseFilter.inputs.main);
    noise.setAmplitude(0);

    noiseFilter.connectTo(delay.inputs.main);
    delay.connectTo(mixer.inputs.c);

    delayTimeEnvelope.connectTo(delay.inputs.time);
    delayAmountEnvelope.connectTo(delay.inputs.feedback);
    delayTimeEnvelope.set({points:[[0,0],[0,0],[0,0],[0,0],[0,0]]});
    delayAmountEnvelope.set({points:[[0,0],[0,0],[0,0],[0,0],[0,0]]});

    noiseFilter.setFrequency(440);


    // oscillator1.connectTo(filter.inputs.main);
    envelope.connectTo(filter.inputs.main);
    filter.connectTo(oscillator1.inputs.frequency);
    filter.connectTo(oscillator2.inputs.frequency);
    oscillator2.connectTo(mixer.inputs.b);

    envelope.setPoints([[0,1],[0,1],[11962,-58.408550385947244],[16647,-158.53749390471395],[22050,-166.88157253127784]]);
    envelope.getInterface().autoZoom();
    
    // Object.assign(oscillator2,{ amplitude: 1.44, frequency: 44.455});
    oscillator2.setFrequency(44.455);
    oscillator2.setAmplitude(1.44);

    noiseEnvelope.setPoints([[8323,-0.11166969088139744],[10639,5.24847547142568],[10969,-6.588511762002449],[11851,3.3500907264419233],[12568,0.5583484544069872]]);
    noiseEnvelope.getInterface().autoZoom();

    filter.getInterface().autoZoom();

    

}