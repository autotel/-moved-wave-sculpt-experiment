// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.MixerTesselator, 'main');
  create(possibleModules.Oscillator, 'square');
  create(possibleModules.EnvelopeGenerator, 'envelope');
  create(possibleModules.Filter, 'envFilter');
  create(possibleModules.Filter, 'filter');
  create(possibleModules.Filter, 'filter2');
  modules['square'].connectTo(modules['filter'].inputs.main);
  modules['square'].connectTo(modules['filter2'].inputs.main);
  modules['envelope'].connectTo(modules['envFilter'].inputs.main);
  modules['envelope'].connectTo(modules['filter2'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter2'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  modules['filter2'].connectTo(modules['main'].inputs.b);
  modules['main'].set({
    'amplitude': 1,
    'levela': 1.183333333333333,
    'levelb': 1.05,
    'levelc': 1.3333333333333335,
    'leveld': 0.5
  });
  modules['main'].getInterface().autoZoom();
  modules['square'].set({
    'amplitude': 0.7791666666666667,
    'bias': 0,
    'length': 1,
    'frequency': 32,
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
        10363,
        -4394.160876794359
      ],
      [
        12844,
        -9315.818506205853
      ]
    ],
    'loop': true
  });
  modules['envelope'].getInterface().autoZoom();
  modules['envFilter'].set({
    'gain': 0.8599999999999999,
    'reso': 2.1500000000000004,
    'length': 1,
    'type': 'hp_boxcar',
    'order': 1,
    'frequency': 283.6666666666627,
    'saturate': false
  });
  modules['envFilter'].getInterface().autoZoom();
  modules['filter'].set({
    'gain': 1.5100000000000007,
    'reso': 21.32,
    'length': 1,
    'type': 'lp_moog',
    'order': 10,
    'frequency': 705.2222222222247,
    'saturate': true
  });
  modules['filter'].getInterface().autoZoom();
  modules['filter2'].set({
    'gain': 0.08999999999999997,
    'reso': 2.0300000000000007,
    'length': 1,
    'type': 'comb',
    'order': 5,
    'frequency': 447.5555555555555,
    'saturate': true
  });
  modules['filter2'].getInterface().autoZoom();
}