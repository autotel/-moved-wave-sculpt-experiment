// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Oscillator,'oscillator');
  create(possibleModules.WaveFolder,'wavefolder');
  create(possibleModules.Filter,'filter');
  modules['oscillator'].connectTo(modules['wavefolder'].inputs.main);
  modules['wavefolder'].connectTo(modules['filter'].inputs.main);
  modules['oscillator'].set({
    'amplitude': 0.5124999650447224,
    'bias': 0,
    'length': 1,
    'frequency': 306.53733528550447,
    'phase': 0,
    'shape': 'sin'
  });
  modules['wavefolder'].set({
    'amplitude': 0.39,
    'bias': -0.9400000000000002,
    'fold': 0.9400000000000002,
    'preamp': 1,
    'ceiling': 1.1400000000000001
  });
  modules['filter'].set({
    'gain': 3,
    'reso': 2.72,
    'length': 1,
    'type': 'LpMoog',
    'order': 0,
    'frequency': 9000.555555555558,
    'saturate': true
  });
  modules['oscillator'].getInterface().autoZoom();
  modules['wavefolder'].getInterface().autoZoom();
  modules['filter'].getInterface().autoZoom();
}