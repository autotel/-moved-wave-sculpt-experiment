//welcome to spaghetti code hell

function demoLibrary() {

    //pre-run a live-coded patch
    const demos = window.demos = {
        "drummaker": () => {
            create(possibleModules.Oscillator, 'oscillator1');
            create(possibleModules.Oscillator, 'oscillator2');
            create(possibleModules.Oscillator, 'oscillator3');
            create(possibleModules.EnvelopeAttackRelease, 'env0');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            create(possibleModules.EnvelopeAttackRelease, 'env3');
            create(possibleModules.EnvelopeAttackRelease, 'env4');
            create(possibleModules.Mixer, 'premix');
            create(possibleModules.RustFreeverb, 'reverb');
            create(possibleModules.DelayWithFilter, 'fdel');
            create(possibleModules.Mixer, 'postmix');
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
                normalize: true,
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
                normalize: true,
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

            ghost.add(postmix, "levela", 0, 0.25);
            ghost.add(postmix, "levelb", 0, 0.25);
            ghost.add(postmix, "levelc", 0, 0.25);
            ghost.add(postmix, "leveld", 0, 0.25);

            ghost.add(premix, "levela", 0, 0.5);
            ghost.add(premix, "levelb", 0, 0.5);


            ghost.add(env0, 'attack', 0, 0.05);
            ghost.add(env0, 'release', 0, 0.9);
            ghost.add(env0, 'amplitude', 0, 0.9);
            ghost.add(env0, 'attackShape', 0.01, 2);
            ghost.add(env0, 'releaseShape', 0, 2);

            ghost.add(env1, 'attack', 0, 0.05);
            ghost.add(env1, 'release', 0, 0.5);
            ghost.add(env1, 'amplitude', 0, 1200);
            ghost.add(env1, 'attackShape', 0.01, 2);
            ghost.add(env1, 'releaseShape', 0, 2);

            ghost.add(env2, 'attack', 0, 0.05);
            ghost.add(env2, 'release', 0, 5);
            ghost.add(env2, 'amplitude', 0, 240);
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


            ghost.add(fdel, 'feedback', 0, 0.7);
            ghost.add(fdel, 'time', 1e-320, 0.1);
            ghost.add(fdel, 'dry', 0, 0.5);
            ghost.add(fdel, 'wet', 0, 1);
            ghost.add(fdel, 'gain', 0, 1);
            ghost.add(fdel, 'reso', 0, 2);
            ghost.add(fdel, 'frequency', 50, 5000);


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
            }, 1000);
        },
        "drumaker2": () => {

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
        },
        "harmosc": () => {
            create(possibleModules.Mixer, 'main');
            create(possibleModules.Filter, 'c1');
            create(possibleModules.HarmonicsOscillator, 'harmosc');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            create(possibleModules.Oscillator, 'dither');
            modules['c1'].connectTo(modules['main'].inputs.a);
            modules['harmosc'].connectTo(modules['c1'].inputs.main);
            modules['harmosc'].connectTo(modules['main'].inputs.b);
            modules['env1'].connectTo(modules['harmosc'].inputs.mixCurve);
            modules['env2'].connectTo(modules['harmosc'].inputs.amplitude);
            modules['dither'].connectTo(modules['main'].inputs.c);
            modules['main'].set({
                'amplitude': 1,
                'levela': 1.25,
                'levelb': 0,
                'levelc': 0.0009,
                'leveld': 0,
                'normalize': true,
                'saturate': true
            });
            modules['c1'].set({
                'gain': 1.08,
                'reso': 1.6600000000000001,
                'type': 'Comb',
                'order': 1,
                'frequency': 145.75223687797694,
                'saturate': true
            });
            modules['harmosc'].set({
                'amplitude': 0,
                'bias': 0,
                'length': 1,
                'frequency': 46.394377931661744,
                'phase': 0,
                'shape': 'sin',
                'mixCurve': -1,
                'interval1': 0,
                'interval2': 2.14,
                'interval3': -1.2400000000000002,
                'interval4': 0
            });
            modules['env1'].set({
                'attack': 0.005079365079365079,
                'release': 0.20507936507936506,
                'amplitude': -0.8,
                'attackShape': 1,
                'releaseShape': 1.17,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['env2'].set({
                'attack': 0.0163718820861678,
                'release': 0.8717460317460317,
                'amplitude': 2.0666666666666664,
                'attackShape': 1,
                'releaseShape': 2.27,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['dither'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 1,
                'frequency': 2,
                'phase': 0,
                'shape': 'noise'
            });
            modules['main'].getInterface().autoZoom();
            modules['c1'].getInterface().autoZoom();
            modules['harmosc'].getInterface().autoZoom();
            modules['env1'].getInterface().autoZoom();
            modules['env2'].getInterface().autoZoom();
            modules['dither'].getInterface().autoZoom();

            harmosc.onUpdate((changes) => {
                if (changes.frequency) {
                    c1.set({ frequency: changes.frequency * Math.PI });
                }
            })

            window.randomize = function () {
                harmosc.setFrequency(Math.random() * 70);
                env1.set({ attack: Math.random() / 100 });
            }

            window.randomize();

        },
        "harmosc2": () => {
            create(possibleModules.Mixer, 'main');
            create(possibleModules.Filter, 'c1');
            create(possibleModules.HarmonicsOscillator, 'harmosc');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            create(possibleModules.Oscillator, 'dither');
            modules['c1'].connectTo(modules['main'].inputs.a);
            modules['harmosc'].connectTo(modules['c1'].inputs.main);
            modules['harmosc'].connectTo(modules['main'].inputs.b);
            modules['env1'].connectTo(modules['harmosc'].inputs.mixCurve);
            modules['env2'].connectTo(modules['harmosc'].inputs.amplitude);
            modules['dither'].connectTo(modules['main'].inputs.c);
            modules['main'].set({
                'amplitude': 1,
                'levela': 1.25,
                'levelb': 0,
                'levelc': 0.0009,
                'leveld': 0,
                'normalize': true,
                'saturate': true
            });
            modules['c1'].set({
                'gain': 1.08,
                'reso': 1.6600000000000001,
                'type': 'Comb',
                'order': 1,
                'frequency': 150.93061009012172,
                'saturate': true
            });
            modules['harmosc'].set({
                'amplitude': 0,
                'bias': 0,
                'length': 1,
                'frequency': 48.042705319436735,
                'phase': 0,
                'shape': 'sin',
                'mixCurve': -1,
                'interval1': 0,
                'interval2': 0.56,
                'interval3': -1.2400000000000002,
                'interval4': 0
            });
            modules['env1'].set({
                'attack': 0.001181828421363873,
                'release': 0.20507936507936506,
                'amplitude': -0.8,
                'attackShape': 1,
                'releaseShape': 1.17,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['env2'].set({
                'attack': 0.0163718820861678,
                'release': 0.8717460317460317,
                'amplitude': 2.0666666666666664,
                'attackShape': 1,
                'releaseShape': 2.27,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['dither'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 1,
                'frequency': 2,
                'phase': 0,
                'shape': 'noise'
            });
            modules['main'].getInterface().autoZoom();
            modules['c1'].getInterface().autoZoom();
            modules['harmosc'].getInterface().autoZoom();
            modules['env1'].getInterface().autoZoom();
            modules['env2'].getInterface().autoZoom();
            modules['dither'].getInterface().autoZoom();


            harmosc.onUpdate((changes) => {
                if (changes.frequency) {
                    c1.set({ frequency: changes.frequency * Math.PI });
                }
            })

            window.randomize = function () {
                harmosc.setFrequency(Math.random() * 70);
                env1.set({ attack: Math.random() / 100 });
            }

            window.randomize();

        },
        "harmosc3": () => {
            create(possibleModules.MixerTesselator, 'main');
            create(possibleModules.Repeater, 'arr1');
            create(possibleModules.Mixer, 'norm1');
            create(possibleModules.Filter, 'c1');
            create(possibleModules.HarmonicsOscillator, 'harmosc');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            create(possibleModules.Oscillator, 'dither');
            modules['arr1'].connectTo(modules['main'].inputs.a);
            modules['norm1'].connectTo(modules['arr1'].inputs.main);
            modules['c1'].connectTo(modules['norm1'].inputs.a);
            modules['harmosc'].connectTo(modules['c1'].inputs.main);
            modules['harmosc'].connectTo(modules['norm1'].inputs.b);
            modules['env1'].connectTo(modules['harmosc'].inputs.mixCurve);
            modules['env2'].connectTo(modules['harmosc'].inputs.amplitude);
            modules['dither'].connectTo(modules['norm1'].inputs.c);
            modules['main'].set({
                'amplitude': 1,
                'levela': 1,
                'levelb': 0.5,
                'levelc': 0.5,
                'leveld': 0.5
            });
            modules['arr1'].set({
                'length': 2,
                'points': [
                    [
                        0,
                        0
                    ],
                    [
                        5419,
                        0.6
                    ],
                    [
                        11484,
                        0.36666666666666664
                    ],
                    [
                        16774,
                        0.5833333333333334
                    ],
                    [
                        27484,
                        0.35
                    ],
                    [
                        38584,
                        0.7666666666666666
                    ],
                    [
                        54839,
                        0.7833333333333333
                    ],
                    [
                        61892,
                        0.11666666666666667
                    ],
                    [
                        66013,
                        0.7833333333333333
                    ],
                    [
                        77168,
                        0.7666666666666666
                    ],
                    [
                        82680,
                        0.2
                    ]
                ],
                'monophonic': false,
                'gain': 1,
                'loop': false
            });
            modules['norm1'].set({
                'amplitude': 1,
                'levela': 1.25,
                'levelb': 0,
                'levelc': 0.0009,
                'leveld': 0,
                'normalize': true,
                'saturate': true
            });
            modules['c1'].set({
                'gain': 1.08,
                'reso': 1.6600000000000001,
                'type': 'Comb',
                'order': 1,
                'frequency': 145.62530186732005,
                'saturate': true
            });
            modules['harmosc'].set({
                'amplitude': 0,
                'bias': 0,
                'length': 1,
                'frequency': 46.35397326286681,
                'phase': 0,
                'shape': 'sin',
                'mixCurve': -1,
                'interval1': 0,
                'interval2': 0.56,
                'interval3': -2.220446049250313e-16,
                'interval4': 0
            });
            modules['env1'].set({
                'attack': 0.0019629513326952786,
                'release': 0.20507936507936506,
                'amplitude': -0.8,
                'attackShape': 1,
                'releaseShape': 1.17,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['env2'].set({
                'attack': 0,
                'release': 0.8717460317460317,
                'amplitude': 2.0666666666666664,
                'attackShape': 1,
                'releaseShape': 2.27,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            modules['dither'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 1,
                'frequency': 2,
                'phase': 0,
                'shape': 'noise'
            });
            modules['main'].getInterface().autoZoom();
            modules['arr1'].getInterface().autoZoom();
            modules['norm1'].getInterface().autoZoom();
            modules['c1'].getInterface().autoZoom();
            modules['harmosc'].getInterface().autoZoom();
            modules['env1'].getInterface().autoZoom();
            modules['env2'].getInterface().autoZoom();
            modules['dither'].getInterface().autoZoom();




            ///////////////////////

            harmosc.onUpdate((changes) => {
                if (changes.frequency) {
                    c1.set({ frequency: changes.frequency * Math.PI });
                }
            })

            window.randomize = function () {
                harmosc.setFrequency(Math.random() * 70 + 30);
            }

            let env1lfoCount = 0;
            setInterval(() => {
                env1lfoCount += 1 / 900;
                env1.set({
                    attack: (Math.sin(env1lfoCount * Math.PI * 5) + 1) / 1000,
                    amplitude: Math.cos(env1lfoCount * Math.PI * 7) * 1.8,
                });

            }, 300);

            window.randomize();

        },
        "wushiu": () => {
            let env = create(possibleModules.EnvelopeGenerator, 'env');
            let env1 = create(possibleModules.EnvelopeAttackRelease, 'env1');
            let wav = create(possibleModules.WaveFolder, 'wav');
            let rus = create(possibleModules.RustComb, 'rus');
            env1.outputs.main.connectTo(wav.inputs.main);
            wav.outputs.main.connectTo(rus.inputs.main);
            env.set({
                'amplitude': 1,
                'bias': 0,
                'length': 1,
                'points': [],
                'loop': false
            });
            env1.set({
                'attack': 0.31267573696145123,
                'release': 0.35176870748299316,
                'amplitude': 96.4896738277456,
                'attackShape': 0.14,
                'releaseShape': 0.15999999999999923
            });
            wav.set({
                'amplitude': 1,
                'bias': 0,
                'fold': 1
            });
            rus.set({
                'frequency': 365.8888888888889,
                'dampening_inverse': 0.21999999999999995,
                'dampening': 0.77,
                'feedback': 0.9
            });
            env.getInterface().autoZoom();
            env1.getInterface().autoZoom();
            wav.getInterface().autoZoom();
            rus.getInterface().autoZoom();
        },
        "seceretcumbia": ()=>{
            let osc2 = create(possibleModules.Oscillator,'osc2');
        let fil = create(possibleModules.Filter,'fil');
        let rus = create(possibleModules.RustFreeverb,'rus');
        let rus7 = create(possibleModules.RustComb,'rus7');
        let vol = create(possibleModules.VoltsPerOctaveToHertz,'vol');
        let osc = create(possibleModules.Oscillator,'osc');
        osc2.outputs.main.connectTo(fil.inputs.main);
        fil.outputs.main.connectTo(rus.inputs.main);
        rus.outputs.main.connectTo(rus7.inputs.main);
        rus7.outputs.main.connectTo(vol.inputs.main);
        rus7.outputs.main.connectTo(osc.inputs.amplitude);
        vol.outputs.main.connectTo(osc.inputs.frequency);
        osc2.set({
          'amplitude': 1.35,
          'bias': 1.8900000000000003,
          'length': 1,
          'frequency': 2,
          'phase': 0,
          'shape': 'square'
        });
        fil.set({
          'gain': 0.75,
          'reso': 3.38,
          'type': 'LpMoog',
          'order': 3,
          'frequency': 408.44444444444423,
          'saturate': false
        });
        rus.set({
          'dampening': 0.9999999999999999,
          'freeze': true,
          'wet': -0.3100000000000003,
          'width': 1.7100000000000002,
          'dry': 1.1900000000000002,
          'roomSize': 0.6000000000000001,
          'LROffset': 1.85
        });
        rus7.set({
          'frequency': 59.55555555555556,
          'dampening_inverse': 0.6199999999999999,
          'dampening': 0.52,
          'feedback': -0.6400000000000001
        });
        vol.set({
          'preamp': 1,
          'center': 146.78000000000003
        });
        osc.set({
          'amplitude': -8.673617379884035e-18,
          'bias': 0,
          'length': 1,
          'frequency': 2,
          'phase': 0,
          'shape': 'sin'
        });
        osc2.getInterface().autoZoom();
        fil.getInterface().autoZoom();
        rus.getInterface().autoZoom();
        rus7.getInterface().autoZoom();
        vol.getInterface().autoZoom();
        osc.getInterface().autoZoom();
        },
        "wiwu": () => {
            create(possibleModules.HarmonicsOscillator, 'harmosc');
            create(possibleModules.EnvelopeGenerator, 'timbrenv');
            create(possibleModules.Oscillator, 'osclltr2');
            create(possibleModules.MixerTesselator, 'mxrltr3');
            modules['harmosc'].connectTo(modules['mxrltr3'].inputs.a);
            modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval2);
            modules['osclltr2'].connectTo(modules['harmosc'].inputs.frequency);
            modules['harmosc'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 1,
                'frequency': 105.55555555555564,
                'phase': 0,
                'shape': 'sin',
                'interval1': 0,
                'interval2': 1,
                'interval3': 0,
                'interval4': 0,
                'interval0': 0
            });
            modules['timbrenv'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 1.93,
                'points': [
                    [
                        19,
                        -11.325735319544375
                    ],
                    [
                        85,
                        9.455989716159985
                    ]
                ],
                'loop': true
            });
            modules['osclltr2'].set({
                'amplitude': 34.28,
                'bias': 0,
                'length': 1,
                'frequency': 1,
                'phase': 0,
                'shape': 'sin'
            });
            modules['mxrltr3'].set({
                'amplitude': 1,
                'levela': 0.6399999999999999,
                'levelb': 0.25,
                'levelc': 0.5,
                'leveld': 0.5
            });
            modules['harmosc'].getInterface().autoZoom();
            modules['timbrenv'].getInterface().autoZoom();
            modules['osclltr2'].getInterface().autoZoom();
            modules['mxrltr3'].getInterface().autoZoom();
        },
        "kik": () => {
            create(possibleModules.Oscillator, 'osc1');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            modules['env1'].connectTo(modules['osc1'].inputs.amplitude);
            modules['env2'].connectTo(modules['osc1'].inputs.frequency);
            modules['osc1'].set({
                'amplitude': 0,
                'bias': 0,
                'length': 1,
                'frequency': 1.7777777777777781,
                'phase': 0,
                'shape': 'sin',
            });
            modules['env1'].set({
                'attack': 0.026961451247165532,
                'release': 0.337437641723356,
                'amplitude': 0.457793034018502,
                'attackShape': 1,
                'releaseShape': 0.42000000000000015
            });
            modules['env2'].set({
                'attack': 0.011111111111111112,
                'release': 0.20002267573696147,
                'amplitude': 200.27912293593687,
                'attackShape': 0.6799999999999999,
                'releaseShape': 4.880000000000001
            });
            setTimeout(() => {
                modules['osc1'].getInterface().autoZoom();
                modules['env1'].getInterface().autoZoom();
                modules['env2'].getInterface().autoZoom();
            }, 200);
        },
        "nicetimbres": () => {


            const randomnum = () => Math.round(Math.random() * 10 - 5) / 10

            create(possibleModules.HarmonicsOscillator, 'harmosc');
            create(possibleModules.EnvelopeGenerator, 'timbrenv');

            // modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval2);
            // modules['timbrenv'].connectTo(modules['harmosc'].inputs.interval3);

            modules['harmosc'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 0.2,
                'frequency': 110,
                'phase': 0,
                'shape': 'sin',
                'interval1': 0,
                'interval2': randomnum(),
                'interval3': randomnum(),
                'interval4': 0,
            });
            modules['timbrenv'].set({
                'amplitude': 1,
                'bias': 0,
                'length': 2,
                'points': [
                    [
                        0,
                        randomnum()
                    ],
                    [
                        88200,
                        randomnum()
                    ]
                ],
                'loop': false,
            });
            setTimeout(() => {
                modules['harmosc'].getInterface().autoZoom();
                modules['timbrenv'].getInterface().autoZoom();
            }, 100);
        },
        "percpat": () => {
            create(possibleModules.HarmonicsOscillator, 'harmosc1');
            create(possibleModules.EnvelopeAttackRelease, 'env1');
            create(possibleModules.EnvelopeAttackRelease, 'env2');
            create(possibleModules.Filter, 'lfoshpr2');
            create(possibleModules.Filter, 'lfoshpr');
            create(possibleModules.Oscillator, 'lfo1');
            modules['env1'].connectTo(modules['harmosc1'].inputs.interval2);
            modules['lfoshpr2'].connectTo(modules['harmosc1'].inputs.amplitude);
            modules['lfoshpr'].connectTo(modules['lfoshpr2'].inputs.main);
            modules['lfo1'].connectTo(modules['lfoshpr'].inputs.main);
            modules['harmosc1'].set({
                'amplitude': 0,
                'bias': 0,
                'length': 4,
                'frequency': 80,
                'phase': 0,
                'shape': 'sin',
                'interval1': 0,
                'interval2': 0,
                'interval3': 0,
                'interval4': 0
            });
            modules['env1'].set({
                'attack': -0.012653061224489797,
                'release': 3.8814285714285712,
                'amplitude': 0.6666666666666666,
                'attackShape': 1,
                'releaseShape': 1
            });
            modules['env2'].set({
                'attack': 0.1,
                'release': 0.9,
                'amplitude': 1,
                'attackShape': 1,
                'releaseShape': 1
            });
            modules['lfoshpr2'].set({
                'gain': 1,
                'reso': 0.2,
                'type': 'LpMoog',
                'order': 1,
                'frequency': 486.7777777777778,
                'saturate': true
            });
            modules['lfoshpr'].set({
                'gain': 2.65,
                'reso': 0.2,
                'type': 'HpBoxcar',
                'order': 1,
                'frequency': 87.44444444444443,
                'saturate': true
            });
            modules['lfo1'].set({
                'amplitude': 0.010000000000000009,
                'bias': 0,
                'length': 4,
                'frequency': 2,
                'phase': 0,
                'shape': 'ramp'
            });
            modules['harmosc1'].getInterface().autoZoom();
            modules['env1'].getInterface().autoZoom();
            modules['env2'].getInterface().autoZoom();
            modules['lfoshpr2'].getInterface().autoZoom();
            modules['lfoshpr'].getInterface().autoZoom();
            modules['lfo1'].getInterface().autoZoom();

        }
    }

    const appendTo = document.getElementById("demo-buttons");
    if(!appendTo) throw new Error("div with id 'demo-buttons' missing");

    let hashBefore = window.location.hash;

    const hashchange = () => {
        if (window.location.hash) {
            let hashval = window.location.hash.slice(1);
            if (demos[hashval]) {
                console.log("trying load of", hashval);
                demos[hashval]();
            }else{
                console.log("nonexisting demo named",hashval);
            }
        } else {
            if (hashBefore) {

            }
        }
    }

    window.addEventListener('DOMContentLoaded', hashchange);

    window.addEventListener("hashchange", hashchange);

    window.onpopstate = () => window.location.reload();
    
    Object.keys(demos).forEach((name)=>{
        appendTo.innerHTML+=(`<a class="tag" href="#${name}">${name}</a>`);
    });
}

export default demoLibrary;

