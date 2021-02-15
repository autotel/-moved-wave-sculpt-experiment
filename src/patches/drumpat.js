// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.MixerTesselator, 'main');
  create(possibleModules.Oscillator, 'square');
  create(possibleModules.Oscillator, 'sine');
  create(possibleModules.EnvelopeGenerator, 'envelope');
  create(possibleModules.Filter, 'filter');
  create(possibleModules.EnvelopeGenerator, 'noiseEnvelope');
  create(possibleModules.Oscillator, 'Oscillator 6');
  create(possibleModules.Filter, 'noiseFilter');
  create(possibleModules.EnvelopeGenerator, 'delayTimeEnvelope');
  create(possibleModules.EnvelopeGenerator, 'delayAmountEnvelope');
  create(possibleModules.Delay, 'delay');
  modules['sine'].connectTo(modules['main'].inputs.b);
  modules['envelope'].connectTo(modules['filter'].inputs.main);
  modules['filter'].connectTo(modules['sine'].inputs.frequency);
  modules['noiseEnvelope'].connectTo(modules['Oscillator 6'].inputs.amplitude);
  modules['Oscillator 6'].connectTo(modules['noiseFilter'].inputs.main);
  modules['noiseFilter'].connectTo(modules['delay'].inputs.main);
  modules['delayTimeEnvelope'].connectTo(modules['delay'].inputs.time);
  modules['delayAmountEnvelope'].connectTo(modules['delay'].inputs.feedback);
  modules['delay'].connectTo(modules['main'].inputs.c);
  modules['main'].set({
    'amplitude': 1,
    'levela': 1.1333333333333333,
    'levelb': 4,
    'levelc': 0.22666666666666668,
    'leveld': 0
  });
  modules['main'].getInterface().autoZoom();
  modules['square'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'frequency': 42.11111111110753,
    'shape': 'square'
  });
  modules['square'].getInterface().autoZoom();
  modules['sine'].set({
    'amplitude': 0.7567991480823322,
    'bias': 0,
    'length': 1,
    'frequency': 34.806629834254146,
    'shape': 'sin'
  });
  modules['sine'].getInterface().autoZoom();
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
        22270,
        13.626263291709844
      ],
      [
        25522,
        128.47619675040696
      ],
      [
        27783,
        128.47619675040693
      ],
      [
        33295,
        -331.51985699299104
      ]
    ]
  });
  modules['envelope'].getInterface().autoZoom();
  modules['filter'].set({
    'gain': 1,
    'bandwidth': 0.2,
    'length': 1,
    'type': 'boxcar',
    'order': 1,
    'frequency': 5.555555555555555
  });
  modules['filter'].getInterface().autoZoom();
  modules['noiseEnvelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        14663,
        0.0010715725766371397
      ],
      [
        19348,
        0.0007011543464989415
      ],
      [
        22546,
        2.6186681752370333
      ],
      [
        23924,
        5.316216140802374e-16
      ],
      [
        34453,
        0.7161578883994346
      ]
    ]
  });
  modules['noiseEnvelope'].getInterface().autoZoom();
  modules['Oscillator 6'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 0,
    'shape': 'noise'
  });
  modules['Oscillator 6'].getInterface().autoZoom();
  modules['noiseFilter'].set({
    'gain': 1,
    'bandwidth': 20.4,
    'length': 1,
    'type': 'boxcar',
    'order': 1,
    'frequency': 1654.6666666666624
  });
  modules['noiseFilter'].getInterface().autoZoom();
  modules['delayTimeEnvelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        0,
        0
      ],
      [
        11741,
        0
      ],
      [
        20286,
        0
      ],
      [
        25081,
        -0.1532736364269152
      ],
      [
        33460,
        -0.2248498208548268
      ]
    ]
  });
  modules['delayTimeEnvelope'].getInterface().autoZoom();
  modules['delayAmountEnvelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        0,
        0
      ],
      [
        11741,
        0
      ],
      [
        16813,
        -0.14963818144211619
      ],
      [
        19238,
        -3.295675446711356
      ],
      [
        22932,
        -4.339899810513023
      ]
    ]
  });
  modules['delayAmountEnvelope'].getInterface().autoZoom();
  modules['delay'].set({
    'feedback': 0.6200000000000001,
    'time': 0.4007900000000001,
    'dry': 0.5699999999999998,
    'wet': 0.5299999999999997
  });
  modules['delay'].getInterface().autoZoom();

}