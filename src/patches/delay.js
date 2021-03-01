// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {

  create(possibleModules.Delay,'delay');
  create(possibleModules.DelayWithFilter,'filteredDelay');
  create(possibleModules.Filter,'noiseFilter');
  create(possibleModules.Oscillator,'noise');
  create(possibleModules.EnvelopeGenerator,'noiseEnvelope');
  modules['noise'].connectTo(modules['delay'].inputs.main);
  modules['noise'].connectTo(modules['filteredDelay'].inputs.main);
  modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
  modules['delay'].set({
    'feedback': 1,
    'time': 0.012790000000000003,
    'dry': 1,
    'wet': 1,
    'diffusion': 0.01
  });
  modules['filteredDelay'].set({
    'feedback': -0.99,
    'time': 0.0031566666666666444,
    'dry': 0.6000000000000001,
    'wet': 0.62,
    'gain': 0.2799999999999997,
    'reso': 4.16,
    'length': 1,
    'type': 'LpMoog',
    'order': 2,
    'frequency': 424.0000000000039,
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
        1598,
        1
      ],
      [
        2315,
        0
      ],
      [
        7111,
        0
      ],
      [
        22050,
        0
      ]
    ],
    'loop': false
  });
  modules['delay'].getInterface().autoZoom();
  modules['noiseFilter'].getInterface().autoZoom();
  modules['noise'].getInterface().autoZoom();
  modules['noiseEnvelope'].getInterface().autoZoom();
}