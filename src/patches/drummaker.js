// @ts-nocheck

import LiveCodingInterface from "../LiveCodingInterface";
import Ghost from "../Ghost";

/** @param {LiveCodingInterface} codeInterface */
export default function run(codeInterface) {
  window.ghost = new Ghost();

  create(possibleModules.Oscillator, 'oscillator1');
  create(possibleModules.Oscillator, 'oscillator2');
  create(possibleModules.Oscillator, 'oscillator3');
  create(possibleModules.EnvelopeAttackRelease, 'env0');
  create(possibleModules.EnvelopeAttackRelease, 'env1');
  create(possibleModules.EnvelopeAttackRelease, 'env2');
  create(possibleModules.EnvelopeAttackRelease, 'env3');
  create(possibleModules.EnvelopeAttackRelease, 'env4');
  create(possibleModules.Mixer, 'premix');
  create(possibleModules.DelayWithFilter, 'fdel');
  create(possibleModules.Mixer, 'postmix');

  ghost.add(postmix,"levela",0,0.25);
  ghost.add(postmix,"levelb",0,0.25);
  ghost.add(postmix,"levelc",0,0.25);
  ghost.add(postmix,"leveld",0,0.25);

  ghost.add(premix,"levela",0,0.5);
  ghost.add(premix,"levelb",0,0.5);


  ghost.add(env0,'attack',0,0.1);
  ghost.add(env0,'release',0,0.9);
  ghost.add(env0,'amplitude',0,0.9);
  ghost.add(env0,'attackShape',0.01,2);
  ghost.add(env0,'releaseShape',-2,2);

  ghost.add(env1,'attack',0,0.5);
  ghost.add(env1,'release',0,0.5);
  ghost.add(env1,'amplitude',0,1200);
  ghost.add(env1,'attackShape',0.01,2);
  ghost.add(env1,'releaseShape',-2,2);
  
  ghost.add(env2,'attack',0,0.5);
  ghost.add(env2,'release',0,5);
  ghost.add(env2,'amplitude',0,240);
  ghost.add(env2,'attackShape',0.01,2);
  ghost.add(env2,'releaseShape',-2,2);
  
  ghost.add(env3,'attack',0.01,0.1);
  ghost.add(env3,'release',0,0.9);
  ghost.add(env3,'amplitude',0,0.1);
  ghost.add(env3,'attackShape',0.01,2);
  ghost.add(env3,'releaseShape',-2,2);

  ghost.add(env4,'attack',0,0.1);
  ghost.add(env4,'release',0,0.9);
  ghost.add(env4,'amplitude',0,0.5);
  ghost.add(env4,'attackShape',0.01,2);
  ghost.add(env4,'releaseShape',-2,2);
  

  ghost.add(fdel,'feedback',0,0.7);
  ghost.add(fdel,'time',1e-320,0.1);
  ghost.add(fdel,'dry',0,0.5);
  ghost.add(fdel,'wet',0,1);
  ghost.add(fdel,'gain',0,1);
  ghost.add(fdel,'reso',0,20);
  ghost.add(fdel,'frequency',50,44100);
  // ghost.add(fdel,// 'type': 'LpMoog',
  // ghost.add(fdel,// 'order': 1,

  window.randomize = (()=>{
    ghost.generateRandom();
    setTimeout(()=>{
      Object.keys(modules).forEach((key)=>modules[key].getInterface().autoZoom());
    },5);
  
  });

  modules['oscillator1'].connectTo(modules['premix'].inputs.a);
  modules['oscillator1'].connectTo(modules['postmix'].inputs.a);
  modules['oscillator2'].connectTo(modules['oscillator1'].inputs.frequency);
  modules['oscillator3'].connectTo(modules['premix'].inputs.b);
  modules['env0'].connectTo(modules['oscillator1'].inputs.amplitude);
  modules['env1'].connectTo(modules['oscillator2'].inputs.amplitude);
  modules['env2'].connectTo(modules['oscillator2'].inputs.frequency);
  modules['env3'].connectTo(modules['oscillator3'].inputs.amplitude);
  modules['premix'].connectTo(modules['fdel'].inputs.main);
  modules['premix'].connectTo(modules['postmix'].inputs.c);
  modules['fdel'].connectTo(modules['postmix'].inputs.b);
  env4.connectTo(fdel.inputs.time);
  modules['oscillator1'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 37.19489981785033,
    'phase': 0,
    'shape': 'sin',
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['oscillator2'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 50.11363636363637,
    'phase': 0,
    'shape': 'sin',
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['oscillator3'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 1,
    'phase': 0,
    'shape': 'noise',
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['env0'].set({
    'attack': 0,
    'release': 0.6006122448979592,
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
  })
  modules['env4'].set({
    'attack': 0.2,
    'release': 0.5,
    'amplitude': 0.2,
    'attackShape': 1,
    'releaseShape': 5.19
  });
  modules['premix'].set({
    'amplitude': 1,
    'levela': 0.25,
    'levelb': 0.25,
    'levelc': 0.25,
    'leveld': 0.25,
    'nativeProcessor': {
      'ready': false
    }
  });
  modules['fdel'].set({
    'feedback': 0.8700000000000001,
    'time': 0.011462222222222233,
    'dry': 0.0699999999999999,
    'wet': 0.6,
    'gain': 0.2899999999999999,
    'reso': 3.78,
    'length': 1,
    'type': 'LpMoog',
    'order': 1,
    'frequency': 5594.777777777777,
    'saturate': true,
  });
  modules['postmix'].set({
    'amplitude': 1,
    'levela': 0,
    'levelb': 4,
    'levelc': 0,
    'leveld': 0.2833333333333333,
    'nativeProcessor': {
      'ready': false
    }
  });
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
}