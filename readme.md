A gui to experiment with shound generation. 
It provides a more intuitive ontrol of timing, as it doesn't run on realtime.

<img src="./showoff/current.png"/>

http://autotel.co/sound-sculpt/

## available uses

* open ./dist/index.html to play
    * open developer console to change things with the patch (experimental)
    * type `modules.` and press "tab" key to get a list of available modules
    * type `let mymodule = create(`... and a module name, to create a module and make it appear in the window.
    * type `mymodule.connect(` and other module's input (`module.inputs.`...) to connect this module.
* `npm run doc` generate documentation
* `npm run watch` compile in watch mode
    * modify index.js to edit patch

## Tutorial in developers console

* open the experiment
* press control + shift + i to get the console.
* type `let myEnvelope = create(modules.EnvelopeGenerator);`
* observe the appearance of a new "lane"
* type `let myOscillator = create(modules.Oscillator);`
* type `myOscillator.connectTo(instancedModules.main.inputs.b)`
* drag the circle over the oscillator lane a bit, to see how it varies
* (don't use headphones, it's dangerous!) press the rectangle button at the bottom-right of the "main" lane. It will play the sound present in there. 
* drag the oscillator circle, until it produces a wave in the audible range, at high enough volume.
* type `myEnvelope.connectTo(myOscillator.inputs.amplitude)` and modify the envelope shape (similar to how the oscillator is modified)
* find a small square at the right of the lanes; when you drag it vertically, it changes the vertical scale of the lanes.

## todo:

### Number legend: 
* priority order, 
* utility (1: just an idea, 2: it would be nice, 3: it's required),
* effort (1: easy fix, 2: a bit involved,  3: quite involved, 4: it's a whole new thing)

1. 3 1 cli and module interface: deleting of modules
1. 3 2 export patches, export wav.
1. 2 1 connection should produce a recalculation
1. 3 2 something is wrong with the mixer input levels scaling: some affect others.
1. 2 3 there still are no interfaces to control some properties without the command line:
    * patching among modules
    * filter type selection
    * wave shape

1. remove reminiscent "NaNHz" from envelopeGenerator
1. wave lane should occupy all the window width (minus patch area, of course)
1. fix bugs with time navigation
1. envelopeGenerator shapes
1. Multi modules, I would like to:
    * be able to drag and drop one module over another and get them two in a group, navigated by tabs
    * constructing a composite module, that has a dedicated interface to control the two
    * possibility to have recursion
1. refactors
    * draggable, clickable, using attachment of event listeners instead of overriding callbacks
    * create a consistent interface for attaching callbacks. not eventlisteners, because it produces "unpredictable" listener names, but i am currently implementing listeners separately everywhere.
    * placement of elements in each lane, and hierarchy
1. implement the improved knobs interaction design (allows rotate/drag on same gesture)

1. how 