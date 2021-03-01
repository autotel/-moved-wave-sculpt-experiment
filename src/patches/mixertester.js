// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  
  create(possibleModules.Oscillator,'osca');
create(possibleModules.Oscillator,'oscb');
create(possibleModules.Oscillator,'oscc');
create(possibleModules.Oscillator,'oscd');
create(possibleModules.Mixer,"mixa");
create(possibleModules.MixerTesselator,"mixb");
modules['osca'].connectTo(modules["mixa"].inputs.a);
modules['oscb'].connectTo(modules["mixa"].inputs.b);
modules['oscc'].connectTo(modules["mixa"].inputs.c);
modules['oscd'].connectTo(modules["mixa"].inputs.d);
modules['osca'].connectTo(modules["mixb"].inputs.a);
modules['oscb'].connectTo(modules["mixb"].inputs.b);
modules['oscc'].connectTo(modules["mixb"].inputs.c);
modules['oscd'].connectTo(modules["mixb"].inputs.d);
modules['osca'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': 5.4444444444444455,
  'phase': 0,
  'shape': 'sin'
});
modules['oscb'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': 2.777777777777778,
  'phase': 0,
  'shape': 'sin'
});
modules['oscc'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': null,
  'phase': 0,
  'shape': 'sin'
});
modules['oscd'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'frequency': null,
  'phase': 0,
  'shape': 'sin'
});
modules["mixa"].set({
  'amplitude': 1,
  'levela': 4,
  'levelb': 0.25,
  'levelc': 0.4666666666666667,
  'leveld': 0.8166666666666668
});
modules['osca'].getInterface().autoZoom();
modules['oscb'].getInterface().autoZoom();
modules['oscc'].getInterface().autoZoom();
modules['oscd'].getInterface().autoZoom();
modules["mixa"].getInterface().autoZoom();
modules["mixb"].getInterface().autoZoom();
}