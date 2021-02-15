// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.MixerTesselator,'main');
  create(possibleModules.Oscillator,'square');
  create(possibleModules.EnvelopeGenerator,'envelope');
  create(possibleModules.Filter,'envFilter');
  create(possibleModules.Filter,'filter');
  create(possibleModules.Filter,'filter2');
  modules['square'].connectTo(modules['filter'].inputs.main);
  modules['square'].connectTo(modules['filter2'].inputs.main);
  modules['envelope'].connectTo(modules['envFilter'].inputs.main);
  modules['envFilter'].connectTo(modules['filter'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  // modules['filter2'].connectTo(modules['main'].inputs.b);
  modules['main'].set({
    'amplitude': 1,
    'levela': 1,
    'levelb': 0,
    'levelc': 0.5,
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
        24806,
        -11563.60352414501
      ],
      [
        29326,
        23128.05328636478
      ]
    ]
  });
  modules['envelope'].getInterface().autoZoom();
  modules['envFilter'].set({
    'gain': 0.8599999999999999,
    'reso': 2.1500000000000004,
    'length': 1,
    'type': 'hp_boxcar',
    'order': 1,
    'frequency': 4.999999999995971
  });
  modules['envFilter'].getInterface().autoZoom();
  modules['filter'].set({
    'gain': 1.8600000000000003,
    'reso': 15.149999999999999,
    'length': 1,
    'type': 'lp_nboxcar',
    'order': 10,
    'frequency': 7644.333333333336
  });
  modules['filter'].getInterface().autoZoom();
  modules['filter2'].set({
    'gain': 1.2,
    'reso': 0.8300000000000001,
    'length': 1,
    'type': 'lp_moog',
    'order': 8,
    'frequency': 1226.7777777777792
  });
  modules['filter2'].getInterface().autoZoom();

}