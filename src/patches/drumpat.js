// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {create(possibleModules.MixerTesselator,'main');
create(possibleModules.Oscillator,'sine');
create(possibleModules.EnvelopeGenerator,'envelope');
create(possibleModules.Filter,'filter');
create(possibleModules.EnvelopeGenerator,'noiseEnvelope');
create(possibleModules.Oscillator,'noise');
create(possibleModules.Filter,'noiseFilter');
create(possibleModules.Repeater,'repet');
modules['sine'].connectTo(modules['main'].inputs.b);
modules['envelope'].connectTo(modules['filter'].inputs.main);
modules['filter'].connectTo(modules['sine'].inputs.frequency);
modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
modules['noise'].connectTo(modules['noiseFilter'].inputs.main);
modules['noiseFilter'].connectTo(modules['repet'].inputs.main);
modules['repet'].connectTo(modules['main'].inputs.d);
modules['main'].set({
  'amplitude': 1,
  'levela': 1,
  'levelb': 1,
  'levelc': 1,
  'leveld': 0.6499999999999999
});
modules['main'].getInterface().autoZoom();
modules['sine'].set({
  'amplitude': 0.7567991480823322,
  'bias': 0,
  'length': 1,
  'frequency': 34.806629834254146,
  'shape': 'sin'
});
modules['sine'].getInterface().autoZoom();
modules['envelope'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'points': [
    [
      16041,
      35.72758709124256
    ],
    [
      25522,
      128.47619675040696
    ],
    [
      27783,
      128.47619675040693
    ],
    [
      33295,
      -331.51985699299104
    ],
    [
      33405,
      0
    ]
  ],
  'loop': false
});
modules['envelope'].getInterface().autoZoom();
modules['filter'].set({
  'gain': 0.6799999999999999,
  'reso': 0.9400000000000001,
  'length': 1,
  'type': 'hp_boxcar',
  'order': 1,
  'frequency': 36.66666666666667,
  'saturate': false
});
modules['filter'].getInterface().autoZoom();
modules['noiseEnvelope'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'points': [
    [
      0,
      0
    ],
    [
      1598,
      0.12049330558547815
    ],
    [
      2315,
      0.04550038057594907
    ],
    [
      7111,
      -0.0001969597369755695
    ],
    [
      22050,
      0.0006278946322569583
    ]
  ],
  'loop': false
});
modules['noiseEnvelope'].getInterface().autoZoom();
modules['noise'].set({
  'amplitude': -0.009999999999999992,
  'bias': 0,
  'length': 1,
  'frequency': 3917.6666666666665,
  'shape': 'noise'
});
modules['noise'].getInterface().autoZoom();
modules['noiseFilter'].set({
  'gain': 6.420000000000001,
  'reso': 0.7099999999999966,
  'length': 1,
  'type': 'comb',
  'order': 2.000000000000001,
  'frequency': 341,
  'saturate': true
});
modules['noiseFilter'].getInterface().autoZoom();
modules['repet'].set({
  'length': 1,
  'points': [
    [
      6063,
      -0.003124281261118767
    ],
    [
      15490,
      0.02316965514238813
    ],
    [
      20837,
      0.06979094792778547
    ],
    [
      25578,
      -0.028227657315016162
    ],
    [
      32578,
      0.009688721856098103
    ]
  ],
  'loop': false,
  'gain': 12.44
});
modules['repet'].getInterface().autoZoom();
}