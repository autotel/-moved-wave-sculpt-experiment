
let mixer = window.create(window.modules.MixerTesselator,"main");

let oscillator1 = window.create(window.modules.Oscillator,"ramp").setShape("ramp");
let oscillator2 = window.create(window.modules.Oscillator,"sine").setShape("sin");
let envelope = window.create(window.modules.EnvelopeGenerator);
let filter = window.create(window.modules.Filter);


let noiseEnvelope = window.create(window.modules.EnvelopeGenerator,"noiseEnvelope");
let noise = window.create(window.modules.Oscillator).setShape("noise")
let noiseFilter = window.create(window.modules.Filter);

let delay = window.create(window.modules.Delay);

filter.setType("IIR.highpass.butterworth");
filter.setFrequency(4);

console.log(mixer.inputs);

noiseEnvelope.connectTo(noise.inputs.amplitude);
noise.connectTo(noiseFilter.inputs.main);
noise.setAmplitude(0);
noiseFilter.connectTo(mixer.inputs.a);

noiseFilter.setFrequency(440);


// oscillator1.connectTo(filter.inputs.main);
envelope.connectTo(filter.inputs.main);
filter.connectTo(oscillator1.inputs.frequency);
filter.connectTo(oscillator2.inputs.frequency);
oscillator2.connectTo(mixer.inputs.b);

envelope.setPoints([[0,1],[0,1],[11962,-58.408550385947244],[16647,-158.53749390471395],[22050,-166.88157253127784]]);
// Object.assign(oscillator2,{ amplitude: 1.44, frequency: 44.455});
oscillator2.setFrequency(44.455);
oscillator2.setAmplitude(1.44);

noiseEnvelope.setPoints([[8323,-0.11166969088139744],[10639,5.24847547142568],[10969,-6.588511762002449],[11851,3.3500907264419233],[12568,0.5583484544069872]]);