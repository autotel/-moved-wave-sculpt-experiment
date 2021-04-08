export default function(){create(possibleModules.MixerTesselator,'main');
create(possibleModules.Repeater,'arr1');
create(possibleModules.Mixer,'norm1');
create(possibleModules.Filter,'c1');
create(possibleModules.HarmonicsOscillator,'harmosc');
create(possibleModules.EnvelopeAttackRelease,'env1');
create(possibleModules.EnvelopeAttackRelease,'env2');
create(possibleModules.Oscillator,'dither');
modules['arr1'].connectTo(modules['main'].inputs.a);
modules['norm1'].connectTo(modules['arr1'].inputs.main);
modules['c1'].connectTo(modules['norm1'].inputs.a);
modules['harmosc'].connectTo(modules['c1'].inputs.main);
modules['harmosc'].connectTo(modules['norm1'].inputs.b);
modules['env1'].connectTo(modules['harmosc'].inputs.mixCurve);
modules['env2'].connectTo(modules['harmosc'].inputs.amplitude);
modules['dither'].connectTo(modules['norm1'].inputs.c);
modules['main'].set({
  'amplitude': 1,
  'levela': 1,
  'levelb': 0.5,
  'levelc': 0.5,
  'leveld': 0.5
});
modules['arr1'].set({
  'length': 2,
  'points': [
    [
      0,
      0
    ],
    [
      5419,
      0.6
    ],
    [
      11484,
      0.36666666666666664
    ],
    [
      16774,
      0.5833333333333334
    ],
    [
      27484,
      0.35
    ],
    [
      38584,
      0.7666666666666666
    ],
    [
      54839,
      0.7833333333333333
    ],
    [
      61892,
      0.11666666666666667
    ],
    [
      66013,
      0.7833333333333333
    ],
    [
      77168,
      0.7666666666666666
    ],
    [
      82680,
      0.2
    ]
  ],
  'monophonic': false,
  'gain': 1,
  'loop': false
});
modules['norm1'].set({
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
  'frequency': 145.62530186732005,
  'saturate': true
});
modules['harmosc'].set({
  'amplitude': 0,
  'bias': 0,
  'length': 1,
  'frequency': 46.35397326286681,
  'phase': 0,
  'shape': 'sin',
  'mixCurve': -1,
  'interval1': 0,
  'interval2': 0.56,
  'interval3': -2.220446049250313e-16,
  'interval4': 0
});
modules['env1'].set({
  'attack': 0.0019629513326952786,
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
  'attack': 0,
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
modules['arr1'].getInterface().autoZoom();
modules['norm1'].getInterface().autoZoom();
modules['c1'].getInterface().autoZoom();
modules['harmosc'].getInterface().autoZoom();
modules['env1'].getInterface().autoZoom();
modules['env2'].getInterface().autoZoom();
modules['dither'].getInterface().autoZoom();




///////////////////////

harmosc.onUpdate((changes)=>{
  if(changes.frequency){
      c1.set({frequency:changes.frequency * Math.PI});
  }
})

window.randomize=function(){
  harmosc.setFrequency(Math.random() * 70 + 30);
}

let env1lfoCount = 0;
setInterval(()=>{
  env1lfoCount += 1/900;
  env1.set({
    attack:(Math.sin(env1lfoCount* Math.PI * 5) + 1 )/ 1000,
    amplitude:Math.cos(env1lfoCount* Math.PI * 7) * 1.8,
  });

},300);

window.randomize();

}