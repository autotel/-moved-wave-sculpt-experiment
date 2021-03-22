// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Oscillator,'oscillator');
  create(possibleModules.WaveFolder,'wavefolder');
  modules['oscillator'].connectTo(modules['wavefolder'].inputs.main);
  modules['oscillator'].set({
    'amplitude': 0.6833333333333333,
    'bias': 0,
    'length': 1,
    'frequency': 10.369151187397131,
    'phase': 0,
    'shape': 'sin'
  });
  modules['wavefolder'].set({
    'preamp': 1,
    'bias': 0,
    'ceiling': 1.1400000000000001
  });
  modules['oscillator'].getInterface().autoZoom();
  modules['wavefolder'].getInterface().autoZoom();
}