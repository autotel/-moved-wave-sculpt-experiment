// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Hipparchus, 'rotator');
  create(possibleModules.Oscillator, 'sinex');
  create(possibleModules.Oscillator, 'siney');
  create(possibleModules.Oscillator, 'modulator');
  modules['sinex'].connectTo(modules['rotator'].inputs.x);
  modules['siney'].connectTo(modules['rotator'].inputs.y);
  modules['modulator'].connectTo(modules['rotator'].inputs.rotation);
  modules['rotator'].set({
    'rotation': 0.95,
    'gain': 0.11
  });
  modules['sinex'].set({
    'amplitude': -0.19,
    'bias': 1.08,
    'length': 1,
    'frequency': 364.11111111111137,
    'phase': 0,
    'shape': 'sin'
  });
  modules['siney'].set({
    'amplitude': 0.15,
    'bias': -0.66,
    'length': 1,
    'frequency': 3816.111111111112,
    'phase': 0.32999999999999996,
    'shape': 'sin'
  });
  modules['modulator'].set({
    'amplitude': 1.01,
    'bias': 0,
    'length': 1,
    'frequency': 29.444444444444525,
    'phase': 0,
    'shape': 'sin'
  });
  modules['rotator'].getInterface().autoZoom();
  modules['sinex'].getInterface().autoZoom();
  modules['siney'].getInterface().autoZoom();
  modules['modulator'].getInterface().autoZoom();
}