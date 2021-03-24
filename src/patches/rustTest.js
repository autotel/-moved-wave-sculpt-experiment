// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.RustComb,'rustcomb');
create(possibleModules.Oscillator,'osc1');
modules['osc1'].connectTo(modules['rustcomb'].inputs.main);
modules['rustcomb'].set({
  'frequency': 145.02222222222224,
  'dampening_inverse': 0.53,
  'dampening': 0.28,
  'feedback': 1.36,
  'nativeProcessor': {
    'ready': false
  }
});
modules['osc1'].set({
  'amplitude': 0.24,
  'bias': 0,
  'length': 1.2,
  'frequency': 12.844444444444353,
  'phase': 0,
  'shape': 'ramp',
  'nativeProcessor': {
    'ready': false
  }
});
modules['rustcomb'].getInterface().autoZoom();
modules['osc1'].getInterface().autoZoom();
}