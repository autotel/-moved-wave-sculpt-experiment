// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  
  
  create(possibleModules.MixerTesselator,'main');
  create(possibleModules.Oscillator,'square');
  create(possibleModules.EnvelopeGenerator,'envelope');
  create(possibleModules.Filter,'filter');
  modules['square'].connectTo(modules['filter'].inputs.main);
  modules['envelope'].connectTo(modules['filter'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  modules['main'].set({
    'amplitude': 1,
    'levela': 0.5,
    'levelb': 0.5,
    'levelc': 0.5,
    'leveld': 0.5
  });
  modules['main'].getInterface().autoZoom();
  modules['square'].set({
    'amplitude': 0.7791666666666667,
    'bias': 0,
    'length': 1,
    'frequency': 32.92168133644692,
    'shape': 'square'
  });
  modules['square'].getInterface().autoZoom();
  modules['envelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        0,
        0
      ],
      [
        0,
        0
      ],
      [
        0,
        0
      ],
    ]
  });
  modules['envelope'].getInterface().autoZoom();
  modules['filter'].set({
    'gain': 1.2,
    'bandwidth': 0.8300000000000001,
    'length': 1,
    'type': 'boxcar',
    'order': 1,
    'frequency': 17852.222222222223
  });
  modules['filter'].getInterface().autoZoom();

  
}