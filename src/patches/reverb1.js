// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {


  create(possibleModules.NaiveReverb, 'reverb');
  create(possibleModules.Filter, 'noiseFilter');
  create(possibleModules.Oscillator, 'noise');
  create(possibleModules.EnvelopeGenerator, 'noiseEnvelope');
  modules['noiseFilter'].connectTo(modules['reverb'].inputs.main);
  modules['noise'].connectTo(modules['noiseFilter'].inputs.main);
  modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
  modules['reverb'].set({
    'feedback': 1,
    'diffusion': 0.01,
    'time': 0.05,
    'dry': 1,
    'wet': 1
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
  // modules['reverb'].getInterface().autoZoom();
  modules['noiseFilter'].getInterface().autoZoom();
  modules['noise'].getInterface().autoZoom();
  modules['noiseEnvelope'].getInterface().autoZoom();



}