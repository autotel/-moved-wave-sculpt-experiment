// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  create(possibleModules.Oscillator,'oscillator1');
  create(possibleModules.Oscillator,'oscillator2');
  create(possibleModules.Oscillator,'oscillator3');
  create(possibleModules.EnvelopeAttackRelease,'env0');
  create(possibleModules.EnvelopeAttackRelease,'env1');
  create(possibleModules.EnvelopeAttackRelease,'env2');
  create(possibleModules.EnvelopeAttackRelease,'env3');
  create(possibleModules.EnvelopeAttackRelease,'env4');
  create(possibleModules.Mixer,'premix');
  create(possibleModules.RustFreeverb,'reverb');
  create(possibleModules.DelayWithFilter,'fdel');
  create(possibleModules.Mixer,'postmix');
  modules['oscillator1'].connectTo(modules['premix'].inputs.a);
  modules['oscillator1'].connectTo(modules['postmix'].inputs.a);
  modules['oscillator2'].connectTo(modules['oscillator1'].inputs.frequency);
  modules['oscillator3'].connectTo(modules['premix'].inputs.b);
  modules['env0'].connectTo(modules['oscillator1'].inputs.amplitude);
  modules['env1'].connectTo(modules['oscillator2'].inputs.amplitude);
  modules['env2'].connectTo(modules['oscillator2'].inputs.frequency);
  modules['env3'].connectTo(modules['oscillator3'].inputs.amplitude);
  modules['env4'].connectTo(modules['fdel'].inputs.time);
  modules['premix'].connectTo(modules['fdel'].inputs.main);
  modules['premix'].connectTo(modules['postmix'].inputs.c);
  modules['premix'].connectTo(modules['reverb'].inputs.main);
  modules['reverb'].connectTo(modules['postmix'].inputs.d);
  modules['fdel'].connectTo(modules['postmix'].inputs.b);
  modules['oscillator1'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 37.19489981785033,
    'phase': 0,
    'shape': 'sin'
  });
  modules['oscillator2'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 477.2247474747475,
    'phase': 0,
    'shape': 'sin'
  });
  modules['oscillator3'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 1,
    'phase': 0,
    'shape': 'noise'
  });
  modules['env0'].set({
    'attack': 0,
    'release': 0.18020408163265306,
    'amplitude': 1,
    'attackShape': 1,
    'releaseShape': 5.19
  });
  modules['env1'].set({
    'attack': 0.017414965986394557,
    'release': 0.6265079365079365,
    'amplitude': 440.6733333333333,
    'attackShape': 0,
    'releaseShape': 3.15
  });
  modules['env2'].set({
    'attack': 0,
    'release': 0.6006122448979592,
    'amplitude': 55,
    'attackShape': 1,
    'releaseShape': 5.19
  });
  modules['env3'].set({
    'attack': 0,
    'release': 0.6006122448979592,
    'amplitude': 1,
    'attackShape': 1,
    'releaseShape': 5.19
  });
  modules['env4'].set({
    'attack': 0.2,
    'release': 0.5,
    'amplitude': 0.2,
    'attackShape': 1,
    'releaseShape': 5.19
  });
  modules['premix'].set({
    'amplitude': 0.4,
    'levela': 1,
    'levelb': 0.25,
    'levelc': 0.25,
    'leveld': 0.25,
    'saturate': true,
    normalize:true,
  });
  modules['reverb'].set({
    'dampening': 0.39,
    'freeze': false,
    'wet': 0.04999999999999993,
    'width': -0.009999999999999953,
    'dry': 0.84,
    'roomSize': 0.4099999999999998,
    'LROffset': 1
  });
  modules['fdel'].set({
    'feedback': 0.8700000000000001,
    'time': 0.011462222222222233,
    'dry': 0.0699999999999999,
    'wet': 0.73,
    'gain': 0.2899999999999999,
    'reso': 3.78,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 5594.777777777777,
    'saturate': true
  });
  modules['postmix'].set({
    'amplitude': 1,
    'levela': 0,
    'levelb': 4,
    'levelc': 0,
    'leveld': 0.2833333333333333,
    'saturate': true,
    normalize:true,
  });
  modules['oscillator1'].getInterface().autoZoom();
  modules['oscillator2'].getInterface().autoZoom();
  modules['oscillator3'].getInterface().autoZoom();
  modules['env0'].getInterface().autoZoom();
  modules['env1'].getInterface().autoZoom();
  modules['env2'].getInterface().autoZoom();
  modules['env3'].getInterface().autoZoom();
  modules['env4'].getInterface().autoZoom();
  modules['premix'].getInterface().autoZoom();
  modules['reverb'].getInterface().autoZoom();
  modules['fdel'].getInterface().autoZoom();
  modules['postmix'].getInterface().autoZoom();

  ghost.add(postmix,"levela",0,0.25);
  ghost.add(postmix,"levelb",0,0.25);
  ghost.add(postmix,"levelc",0,0.25);
  ghost.add(postmix,"leveld",0,0.25);

  ghost.add(premix,"levela",0,0.5);
  ghost.add(premix,"levelb",0,0.5);


  ghost.add(env0,'attack',0,0.05);
  ghost.add(env0,'release',0,0.9);
  ghost.add(env0,'amplitude',0,0.9);
  ghost.add(env0,'attackShape',0.01,2);
  ghost.add(env0,'releaseShape',0,2);

  ghost.add(env1,'attack',0,0.05);
  ghost.add(env1,'release',0,0.5);
  ghost.add(env1,'amplitude',0,1200);
  ghost.add(env1,'attackShape',0.01,2);
  ghost.add(env1,'releaseShape',0,2);
  
  ghost.add(env2,'attack',0,0.05);
  ghost.add(env2,'release',0,5);
  ghost.add(env2,'amplitude',0,240);
  ghost.add(env2,'attackShape',0.01,2);
  ghost.add(env2,'releaseShape',0,2);
  
  ghost.add(env3,'attack',0.01,0.05);
  ghost.add(env3,'release',0,0.9);
  ghost.add(env3,'amplitude',0,0.1);
  ghost.add(env3,'attackShape',0.01,2);
  ghost.add(env3,'releaseShape',0,2);

  ghost.add(env4,'attack',0,0.05);
  ghost.add(env4,'release',0,0.9);
  ghost.add(env4,'amplitude',0,0.5);
  ghost.add(env4,'attackShape',0.01,2);
  ghost.add(env4,'releaseShape',0,2);
  

  ghost.add(fdel,'feedback',0,0.7);
  ghost.add(fdel,'time',1e-320,0.1);
  ghost.add(fdel,'dry',0,0.5);
  ghost.add(fdel,'wet',0,1);
  ghost.add(fdel,'gain',0,1);
  ghost.add(fdel,'reso',0,2);
  ghost.add(fdel,'frequency',50,5000);


  ghost.add(reverb,'dampening',0,1);
  ghost.add(reverb,'wet',0,1);
  ghost.add(reverb,'width',0,1);
  ghost.add(reverb,'dry',0,1);
  ghost.add(reverb,'roomSize',0,1);

  window.randomize = (()=>{
    ghost.generateRandom();
    setTimeout(()=>{
      Object.keys(modules).forEach((key)=>modules[key].getInterface().autoZoom());
    },5);
  
  });

  setTimeout(()=>{
    modules['oscillator1'].getInterface().autoZoom();
    modules['oscillator2'].getInterface().autoZoom();
    modules['oscillator3'].getInterface().autoZoom();
    modules['env0'].getInterface().autoZoom();
    modules['env1'].getInterface().autoZoom();
    modules['env2'].getInterface().autoZoom();
    modules['env3'].getInterface().autoZoom();
    modules['premix'].getInterface().autoZoom();
    modules['fdel'].getInterface().autoZoom();
    modules['postmix'].getInterface().autoZoom();
    // setInterval(randomize,1000);
  },1000);
}