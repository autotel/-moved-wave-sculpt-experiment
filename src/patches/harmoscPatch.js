export default function(){
    create(possibleModules.Mixer,'main');
create(possibleModules.Filter,'c1');
create(possibleModules.HarmonicsOscillator,'harmosc');
create(possibleModules.EnvelopeAttackRelease,'env1');
create(possibleModules.EnvelopeAttackRelease,'env2');
create(possibleModules.Oscillator,'dither');
modules['c1'].connectTo(modules['main'].inputs.a);
modules['harmosc'].connectTo(modules['c1'].inputs.main);
modules['harmosc'].connectTo(modules['main'].inputs.b);
modules['env1'].connectTo(modules['harmosc'].inputs.mixCurve);
modules['env2'].connectTo(modules['harmosc'].inputs.amplitude);
modules['dither'].connectTo(modules['main'].inputs.c);
modules['main'].set({
  'amplitude': 1,
  'levela': 1.25,
  'levelb': 0,
  'levelc': 0.0009,
  'leveld': 0,
  'normalize': true,
  'saturate': true
});
modules['c1'].set({
  'gain': 1.08,
  'reso': 1.6600000000000001,
  'type': 'Comb',
  'order': 1,
  'frequency': 145.75223687797694,
  'saturate': true
});
modules['harmosc'].set({
  'amplitude': 0,
  'bias': 0,
  'length': 1,
  'frequency': 46.394377931661744,
  'phase': 0,
  'shape': 'sin',
  'mixCurve': -1,
  'interval1': 0,
  'interval2': 2.14,
  'interval3': -1.2400000000000002,
  'interval4': 0
});
modules['env1'].set({
  'attack': 0.005079365079365079,
  'release': 0.20507936507936506,
  'amplitude': -0.8,
  'attackShape': 1,
  'releaseShape': 1.17,
  'bias': 0,
  'length': 1,
  'points': [],
  'loop': false
});
modules['env2'].set({
  'attack': 0.0163718820861678,
  'release': 0.8717460317460317,
  'amplitude': 2.0666666666666664,
  'attackShape': 1,
  'releaseShape': 2.27,
  'bias': 0,
  'length': 1,
  'points': [],
  'loop': false
});
modules['dither'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': 2,
  'phase': 0,
  'shape': 'noise'
});
modules['main'].getInterface().autoZoom();
modules['c1'].getInterface().autoZoom();
modules['harmosc'].getInterface().autoZoom();
modules['env1'].getInterface().autoZoom();
modules['env2'].getInterface().autoZoom();
modules['dither'].getInterface().autoZoom();

    harmosc.onUpdate((changes)=>{
        if(changes.frequency){
            c1.set({frequency:changes.frequency * Math.PI});
        }
    })

    window.randomize=function(){
        harmosc.setFrequency(Math.random() * 70);
        env1.set({attack:Math.random() /100});
    }

    window.randomize();
    
}