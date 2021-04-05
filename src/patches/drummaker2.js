// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function drummaker2(codeInterface) {
  
  create(possibleModules.Oscillator, 'osc1');
  create(possibleModules.Oscillator, 'osc2');
  create(possibleModules.HarmonicsOscillator, 'osc3');
  create(possibleModules.EnvelopeAttackRelease, 'env1');
  create(possibleModules.EnvelopeAttackRelease, 'env2');
  create(possibleModules.EnvelopeAttackRelease, 'env3');
  create(possibleModules.EnvelopeAttackRelease, 'env4');
  create(possibleModules.EnvelopeAttackRelease, 'env5');
  create(possibleModules.EnvelopeAttackRelease, 'env6');
  create(possibleModules.Mixer, 'premix');
  create(possibleModules.DelayWithFilter, 'dlytr1');
  create(possibleModules.DelayWithFilter, 'dlytr2');
  create(possibleModules.DelayWithFilter, 'dlytr3');
  create(possibleModules.DelayWithFilter, 'dlytr4');
  create(possibleModules.Mixer, 'postmix');
  create(possibleModules.RustFreeverb, 'reverb');
  modules['osc1'].connectTo(modules['premix'].inputs.a);
  modules['osc2'].connectTo(modules['premix'].inputs.b);
  modules['osc3'].connectTo(modules['premix'].inputs.c);
  modules['env1'].connectTo(modules['osc1'].inputs.amplitude);
  modules['env2'].connectTo(modules['osc2'].inputs.amplitude);
  modules['env3'].connectTo(modules['dlytr1'].inputs.feedback);
  modules['env3'].connectTo(modules['dlytr2'].inputs.feedback);
  modules['env3'].connectTo(modules['dlytr3'].inputs.feedback);
  modules['env3'].connectTo(modules['dlytr4'].inputs.feedback);
  modules['env3'].connectTo(modules['osc3'].inputs.amplitude);
  modules['env4'].connectTo(modules['dlytr1'].inputs.time);
  modules['env4'].connectTo(modules['dlytr2'].inputs.time);
  modules['env4'].connectTo(modules['dlytr3'].inputs.time);
  modules['env4'].connectTo(modules['dlytr4'].inputs.time);
  modules['env5'].connectTo(modules['osc3'].inputs.frequency);
  modules['env6'].connectTo(modules['osc2'].inputs.frequency);
  modules['premix'].connectTo(modules['dlytr1'].inputs.main);
  modules['premix'].connectTo(modules['dlytr2'].inputs.main);
  modules['premix'].connectTo(modules['dlytr3'].inputs.main);
  modules['premix'].connectTo(modules['dlytr4'].inputs.main);
  modules['dlytr1'].connectTo(modules['postmix'].inputs.a);
  modules['dlytr2'].connectTo(modules['postmix'].inputs.b);
  modules['dlytr3'].connectTo(modules['postmix'].inputs.c);
  modules['dlytr4'].connectTo(modules['postmix'].inputs.d);
  modules['postmix'].connectTo(modules['reverb'].inputs.main);
  modules['osc1'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': null,
    'phase': 0,
    'shape': 'noise'
  });
  modules['osc2'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 79.8913043478261,
    'phase': 0,
    'shape': 'sin'
  });
  modules['osc3'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 89.3940256720151,
    'phase': 0.658719819321023,
    'shape': 'sin',
    'interval1': 258.57468995195694,
    'interval2': 1.3772985747286803,
    'interval3': -3.8510361338141097,
    'interval4': 0
  });
  modules['env1'].set({
    'attack': 0.025212143489207313,
    'release': 0.06166357764786329,
    'amplitude': 0.3376072652732335,
    'attackShape': 1.7722005986615141,
    'releaseShape': 1.1498018790343794
  });
  modules['env2'].set({
    'attack': 0.04764885601580023,
    'release': 0.0007713584938956464,
    'amplitude': 0.5570146564547115,
    'attackShape': 1.366335342126122,
    'releaseShape': 0.9551684497546675
  });
  modules['env3'].set({
    'attack': 0.03595600421714794,
    'release': 0.014600548721542829,
    'amplitude': 0.07376990284762179,
    'attackShape': 1.5270942421232387,
    'releaseShape': 0.09331447459444964
  });
  modules['env4'].set({
    'attack': 0.007042176335834311,
    'release': 0.32251544371079716,
    'amplitude': 0.41673513736619255,
    'attackShape': 0.5982036058158341,
    'releaseShape': 1.89143998838994
  });
  modules['env5'].set({
    'attack': 0.019956630584488357,
    'release': 0.5849228986857816,
    'amplitude': 53.08736583712057,
    'attackShape': 1.115873422930361,
    'releaseShape': 1.3000751384820006
  });
  modules['env6'].set({
    'attack': 0.01489634105891588,
    'release': 0.035271037193237445,
    'amplitude': 2754.093595121477,
    'attackShape': 1.6694570385765486,
    'releaseShape': 0.9393106408285539
  });
  modules['premix'].set({
    'amplitude': 1,
    'levela': 0.17426955116456216,
    'levelb': 0.13095916083296522,
    'levelc': 0.25,
    'leveld': 0.25,
    'normalize': true,
    'saturate': true
  });
  modules['dlytr1'].set({
    'feedback': 0.08331473460091304,
    'time': 0.0020345146936090797,
    'dry': 0.4929478486819579,
    'wet': 0.6755025378066609,
    'gain': 0.23655517067959198,
    'reso': 1.1258277896415243,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 3645.7375021602156,
    'saturate': false
  });
  modules['dlytr2'].set({
    'feedback': 0.11521120716814275,
    'time': 0.07347742844161263,
    'dry': 0.035925040542592546,
    'wet': 0.764202574100255,
    'gain': 0.0338193983845817,
    'reso': 0.9179328495332797,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 688.9262273097185,
    'saturate': false
  });
  modules['dlytr3'].set({
    'feedback': 0.1635123320352257,
    'time': 0.011238880502067717,
    'dry': 0.3517387005239281,
    'wet': 0.9540824163103856,
    'gain': 0.15338281531087383,
    'reso': 1.1286061922795037,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 4855.476407563162,
    'saturate': false
  });
  modules['dlytr4'].set({
    'feedback': 0.69974791243754,
    'time': 0.057048333399359843,
    'dry': 0.18813593889317493,
    'wet': 0.9839379726795869,
    'gain': 0.2678461392586635,
    'reso': 0.5495612684630173,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 1555.934256161831,
    'saturate': false
  });
  modules['postmix'].set({
    'amplitude': 1,
    'levela': 0.1670822019580443,
    'levelb': 0.18509519774400335,
    'levelc': 0.16237995280779122,
    'leveld': 0.037772959102529646,
    'normalize': true,
    'saturate': false
  });
  modules['reverb'].set({
    'dampening': 0.05308441742396541,
    'freeze': false,
    'wet': 0.7598002854782693,
    'width': 0.8862989000151146,
    'dry': 0.37987433859677244,
    'roomSize': 0.4465728270480428,
    'LROffset': 1
  });
  modules['osc1'].getInterface().autoZoom();
  modules['osc2'].getInterface().autoZoom();
  modules['osc3'].getInterface().autoZoom();
  modules['env1'].getInterface().autoZoom();
  modules['env2'].getInterface().autoZoom();
  modules['env3'].getInterface().autoZoom();
  modules['env4'].getInterface().autoZoom();
  modules['env5'].getInterface().autoZoom();
  modules['env6'].getInterface().autoZoom();
  modules['premix'].getInterface().autoZoom();
  modules['dlytr1'].getInterface().autoZoom();
  modules['dlytr2'].getInterface().autoZoom();
  modules['dlytr3'].getInterface().autoZoom();
  modules['dlytr4'].getInterface().autoZoom();
  modules['postmix'].getInterface().autoZoom();
  modules['reverb'].getInterface().autoZoom();

  //////////////////////////////////////////////////


  ghost.add(env3, "attack", 0, 0.01);
  ghost.add(env4, "attack", 0, 0.01);
  ghost.add(env3, "release", 0, 0.9);
  ghost.add(env4, "release", 0, 0.9);
  ghost.add(env3, "amplitude", 0, 1);
  ghost.add(env4, "amplitude", 0, 1 / 90);



  ghost.add(osc3, 'frequency', 30, 200);
  ghost.add(osc3, 'phase', 0, 1);
  ghost.add(osc3, 'interval1', 0, 300);
  ghost.add(osc3, 'interval2', -15, 15);
  ghost.add(osc3, 'interval3', -10, 10);

  ghost.add(postmix, "levela", 0, 0.25);
  ghost.add(postmix, "levelb", 0, 0.25);
  ghost.add(postmix, "levelc", 0, 0.25);
  ghost.add(postmix, "leveld", 0, 0.25);

  ghost.add(premix, "levela", 0, 0.5);
  ghost.add(premix, "levelb", 0, 0.05);
  ghost.add(premix, "levelc", 0, 0.5);

  ghost.add(env1, 'attack', 0, 0.05);
  ghost.add(env1, 'release', 0, 0.5);
  ghost.add(env1, 'amplitude', 0, 1);
  ghost.add(env1, 'attackShape', 0.01, 2);
  ghost.add(env1, 'releaseShape', 0, 2);

  ghost.add(env2, 'attack', 0, 0.05);
  ghost.add(env2, 'release', 0, 5);
  ghost.add(env2, 'amplitude', 0, 1);
  ghost.add(env2, 'attackShape', 0.01, 2);
  ghost.add(env2, 'releaseShape', 0, 2);

  ghost.add(env3, 'attack', 0.01, 0.05);
  ghost.add(env3, 'release', 0, 0.9);
  ghost.add(env3, 'amplitude', 0, 0.1);
  ghost.add(env3, 'attackShape', 0.01, 2);
  ghost.add(env3, 'releaseShape', 0, 2);

  ghost.add(env4, 'attack', 0, 0.05);
  ghost.add(env4, 'release', 0, 0.9);
  ghost.add(env4, 'amplitude', 0, 0.5);
  ghost.add(env4, 'attackShape', 0.01, 2);
  ghost.add(env4, 'releaseShape', 0, 2);

  ghost.add(env5, 'attack', 0, 0.05);
  ghost.add(env5, 'release', 0, 0.9);
  ghost.add(env5, 'amplitude', 0, 200);
  ghost.add(env5, 'attackShape', 0.01, 2);
  ghost.add(env5, 'releaseShape', 0, 2);

  ghost.add(env6, 'attack', 0, 0.05);
  ghost.add(env6, 'release', 0, 0.9);
  ghost.add(env6, 'amplitude', 0, 5000);
  ghost.add(env6, 'attackShape', 0.01, 2);
  ghost.add(env6, 'releaseShape', 0, 2);

  ghost.add(dlytr1, 'feedback', 0, 0.7);
  ghost.add(dlytr1, 'time', 1e-320, 0.1);
  ghost.add(dlytr1, 'dry', 0, 0.5);
  ghost.add(dlytr1, 'wet', 0, 1);
  ghost.add(dlytr1, 'gain', 0, 1);
  ghost.add(dlytr1, 'reso', 0, 2);
  ghost.add(dlytr1, 'frequency', 50, 5000);


  ghost.add(dlytr2, 'feedback', 0, 0.7);
  ghost.add(dlytr2, 'time', 1e-320, 0.1);
  ghost.add(dlytr2, 'dry', 0, 0.5);
  ghost.add(dlytr2, 'wet', 0, 1);
  ghost.add(dlytr2, 'gain', 0, 1);
  ghost.add(dlytr2, 'reso', 0, 2);
  ghost.add(dlytr2, 'frequency', 50, 5000);

  ghost.add(dlytr3, 'feedback', 0, 0.7);
  ghost.add(dlytr3, 'time', 1e-320, 0.1);
  ghost.add(dlytr3, 'dry', 0, 0.5);
  ghost.add(dlytr3, 'wet', 0, 1);
  ghost.add(dlytr3, 'gain', 0, 1);
  ghost.add(dlytr3, 'reso', 0, 2);
  ghost.add(dlytr3, 'frequency', 50, 5000);

  ghost.add(dlytr4, 'feedback', 0, 0.7);
  ghost.add(dlytr4, 'time', 1e-320, 0.1);
  ghost.add(dlytr4, 'dry', 0, 0.5);
  ghost.add(dlytr4, 'wet', 0, 1);
  ghost.add(dlytr4, 'gain', 0, 1);
  ghost.add(dlytr4, 'reso', 0, 2);
  ghost.add(dlytr4, 'frequency', 50, 5000);

  dlytr1.connectTo(postmix.inputs.a);
  dlytr2.connectTo(postmix.inputs.b);
  dlytr3.connectTo(postmix.inputs.c);
  dlytr4.connectTo(postmix.inputs.d);


  ghost.add(reverb, 'dampening', 0, 1);
  ghost.add(reverb, 'wet', 0, 1);
  ghost.add(reverb, 'width', 0, 1);
  ghost.add(reverb, 'dry', 0, 1);
  ghost.add(reverb, 'roomSize', 0, 1);

  window.randomize = (() => {
    ghost.generateRandom();
    setTimeout(() => {
      Object.keys(modules).forEach((key) => modules[key].getInterface().autoZoom());
    }, 5);

  });


  setTimeout(() => {
    window.randomize();
  }, 10);
}
