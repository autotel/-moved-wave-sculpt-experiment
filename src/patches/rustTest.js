// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Filter,'filter');
create(possibleModules.RustComb,'rustcomb');
create(possibleModules.Filter,'nativecomb');
create(possibleModules.Oscillator,'osc1');
modules['osc1'].connectTo(modules['rustcomb'].inputs.main);
modules['osc1'].connectTo(modules['nativecomb'].inputs.main);
modules['filter'].set({
  'gain': 4.28,
  'reso': 3.41,
  'length': 1,
  'type': 'LpMoog',
  'order': 1,
  'frequency': 10136.666666666664,
  'saturate': true,
  'nativeProcessor': {
    'ready': true
  }
});
modules['rustcomb'].set({
  'frequency': 218.79999999999993,
  'dampening_inverse': 0.2100000000000001,
  'dampening': 0,
  'feedback': 3.74,
  'nativeProcessor': {
    'ready': false
  }
});
modules['nativecomb'].set({
  'gain': 0.53,
  'reso': 1.61,
  'length': 1,
  'type': 'Comb',
  'order': 2,
  'frequency': 981.2444444444448,
  'saturate': false,
  'nativeProcessor': {
    'ready': false
  },
  'dampening_inverse': 0.3800000000000001,
  'dampening': 0.14,
  'feedback': 1.29
});
modules['osc1'].set({
  'amplitude': 0.24,
  'bias': 0,
  'length': 1.2,
  'frequency': 13.288888888888797,
  'phase': 0.44,
  'shape': 'ramp',
  'nativeProcessor': {
    'ready': false
  }
});
modules['filter'].getInterface().autoZoom();
modules['rustcomb'].getInterface().autoZoom();
modules['nativecomb'].getInterface().autoZoom();
modules['osc1'].getInterface().autoZoom();

}