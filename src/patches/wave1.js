// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Delay, 'delay');
  create(possibleModules.DelayWithFilter, 'filteredDelay');
  create(possibleModules.Filter, 'noiseFilter');
  create(possibleModules.Oscillator, 'noise');
  create(possibleModules.EnvelopeGenerator, 'noiseEnvelope');
  modules['noise'].connectTo(modules['delay'].inputs.main);
  modules['noise'].connectTo(modules['filteredDelay'].inputs.main);
  modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
  modules['delay'].set({
    'feedback': 0.83,
    'time': 0.01167222222222214,
    'dry': 0.57,
    'wet': 0.35,
    'diffusion': 0.01
  });
  modules['filteredDelay'].set({
    'feedback': 0.9600000000000001,
    'time': 0.007255555555555494,
    'dry': 0.2900000000000002,
    'wet': 1.4400000000000002,
    'gain': 0.5499999999999998,
    'reso': 2.0700000000000007,
    'length': 1,
    'type': 'LpMoog',
    'order': 0,
    'frequency': 10336,
    'saturate': true,
    'diffusion': 0.01
  });
  modules['noiseFilter'].set({
    'gain': 6.930000000000001,
    'reso': 0.5799999999999966,
    'length': 1,
    'type': 'LpMoog',
    'order': 2.000000000000001,
    'frequency': 9962,
    'saturate': true
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
  modules['delay'].getInterface().autoZoom();
  modules['filteredDelay'].getInterface().autoZoom();
  modules['noiseFilter'].getInterface().autoZoom();
  modules['noise'].getInterface().autoZoom();
  modules['noiseEnvelope'].getInterface().autoZoom();
}