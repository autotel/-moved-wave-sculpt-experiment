// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.RustComb, 'rustcomb');
  create(possibleModules.Oscillator, 'osc1');
  modules['osc1'].connectTo(modules['rustcomb'].inputs.main);
  modules['rustcomb'].set({
    'frequency': 418.4444444444444,
    'dampening_inverse': 0.71,
    'dampening': 0.8200000000000001,
    'feedback': 1.37,
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['osc1'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 0.02999999999999998,
    'frequency': 2247.7777777777756,
    'phase': 0,
    'shape': 'ramp',
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['rustcomb'].getInterface().autoZoom();
  modules['osc1'].getInterface().autoZoom();
  dumpPatch();
}