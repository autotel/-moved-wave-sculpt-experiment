// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {create(possibleModules.Mixer,'main');
create(possibleModules.DelayWithFilter,'filteredDelay1');
create(possibleModules.DelayWithFilter,'filteredDelay2');
create(possibleModules.DelayWithFilter,'filteredDelay3');
create(possibleModules.DelayWithFilter,'filteredDelay4');
create(possibleModules.Oscillator,'noise');
create(possibleModules.EnvelopeGenerator,'noiseEnvelope');
modules['filteredDelay1'].connectTo(modules['filteredDelay2'].inputs.main);
modules['filteredDelay1'].connectTo(modules['filteredDelay3'].inputs.main);
modules['filteredDelay1'].connectTo(modules['filteredDelay4'].inputs.main);
modules['filteredDelay1'].connectTo(modules['main'].inputs.a);
modules['filteredDelay2'].connectTo(modules['main'].inputs.b);
modules['filteredDelay3'].connectTo(modules['main'].inputs.c);
modules['filteredDelay4'].connectTo(modules['main'].inputs.d);
modules['noise'].connectTo(modules['filteredDelay1'].inputs.main);
modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
modules['main'].set({
  'amplitude': 1,
  'levela': 1.7666666666666675,
  'levelb': 2.483333333333334,
  'levelc': 2.083333333333334,
  'leveld': 0.7
});
modules['filteredDelay1'].set({
  'feedback': -0.8900000000000007,
  'time': 0.023645555555555517,
  'dry': 0.1700000000000002,
  'wet': 0.9400000000000001,
  'gain': 0.34999999999999976,
  'reso': 2.9400000000000013,
  'length': 1,
  'type': 'LpMoog',
  'order': 1,
  'frequency': 8662.44444444444,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay2'].set({
  'feedback': -0.9300000000000003,
  'time': 0.005702222222222172,
  'dry': 0.8600000000000001,
  'wet': 5.66,
  'gain': 0.18999999999999975,
  'reso': 2.0700000000000007,
  'length': 1,
  'type': 'Pinking',
  'order': 1,
  'frequency': 6480.777777777777,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay3'].set({
  'feedback': 0.9699999999999993,
  'time': 0.006964444444444384,
  'dry': 0.2900000000000002,
  'wet': 1.4400000000000002,
  'gain': 0.7999999999999998,
  'reso': 0.1400000000000008,
  'length': 1,
  'type': 'LpMoog',
  'order': 0,
  'frequency': 4225.555555555555,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay4'].set({
  'feedback': -0.9500000000000004,
  'time': 0.00673999999999994,
  'dry': 1.6653345369377348e-16,
  'wet': 8.860000000000001,
  'gain': 0.13999999999999974,
  'reso': 4.050000000000001,
  'length': 1,
  'type': 'LpMoog',
  'order': 1,
  'frequency': 8081.1111111111095,
  'saturate': false,
  'diffusion': 0.01
});
modules['noise'].set({
  'amplitude': 0,
  'bias': 0,
  'length': 1,
  'frequency': 3917.6666666666665,
  'phase': 0,
  'shape': 'noise'
});
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
      2315,
      0
    ],
    [
      3142,
      1.3833333333333333
    ],
    [
      3913,
      0.016666666666666666
    ],
    [
      22050,
      0
    ]
  ],
  'loop': false
});
modules['main'].getInterface().autoZoom();
modules['filteredDelay1'].getInterface().autoZoom();
modules['filteredDelay2'].getInterface().autoZoom();
modules['filteredDelay3'].getInterface().autoZoom();
modules['filteredDelay4'].getInterface().autoZoom();
modules['noise'].getInterface().autoZoom();
modules['noiseEnvelope'].getInterface().autoZoom();
}