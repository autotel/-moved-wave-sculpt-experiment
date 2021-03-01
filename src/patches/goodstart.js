// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.MixerTesselator,'main');
  create(possibleModules.Oscillator,'sqw');
  create(possibleModules.EnvelopeGenerator,'envelope');
  create(possibleModules.Filter,'envFilter');
  create(possibleModules.Filter,'filter');
  create(possibleModules.Filter,'filter2');
  modules['sqw'].connectTo(modules['filter'].inputs.main);
  modules['sqw'].connectTo(modules['filter2'].inputs.main);
  modules['envelope'].connectTo(modules['envFilter'].inputs.main);
  modules['envFilter'].connectTo(modules['filter2'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  modules['filter2'].connectTo(modules['main'].inputs.b);
  modules['main'].set({
    'amplitude': 1,
    'levela': 0.65,
    'levelb': 0,
    'levelc': 0.5,
    'leveld': 0.5
  });
  modules['sqw'].set({
    'amplitude': 0.7333333333333333,
    'bias': 0,
    'length': 1,
    'frequency': 4.825,
    'phase': 0,
    'shape': 'square'
  });
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
        7056,
        -1318.7308762243943
      ],
      [
        8985,
        -3048.401900606446
      ]
    ],
    'loop': true
  });
  modules['envFilter'].set({
    'gain': 0.6,
    'reso': 1.9100000000000001,
    'length': 1,
    'type': 'HpBoxcar',
    'order': 1,
    'frequency': 58.64999999999992,
    'saturate': false
  });
  modules['filter'].set({
    'gain': 3.4400000000000004,
    'reso': 3.2399999999999967,
    'length': 1,
    'type': 'LpMoog',
    'order': 3,
    'frequency': 427.97777777777776,
    'saturate': true
  });
  modules['filter2'].set({
    'gain': 0.40000000000000013,
    'reso': 1.6600000000000006,
    'length': 1,
    'type': 'Comb',
    'order': 1,
    'frequency': 757.2222222222222,
    'saturate': true,
    'Reso': 1.95
  });
  modules['main'].getInterface().autoZoom();
  modules['sqw'].getInterface().autoZoom();
  modules['envelope'].getInterface().autoZoom();
  modules['envFilter'].getInterface().autoZoom();
  modules['filter'].getInterface().autoZoom();
  modules['filter2'].getInterface().autoZoom();
}