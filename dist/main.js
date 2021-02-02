/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scaffolding_drawBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scaffolding/drawBoard */ \"./src/scaffolding/drawBoard.js\");\n/* harmony import */ var _interfaces_BoringCircle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./interfaces/BoringCircle */ \"./src/interfaces/BoringCircle.js\");\n/* harmony import */ var _models_Oscillator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/Oscillator */ \"./src/models/Oscillator.js\");\n/* harmony import */ var _models_Mixer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/Mixer */ \"./src/models/Mixer.js\");\n/* harmony import */ var _interfaces_GenericDisplay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interfaces/GenericDisplay */ \"./src/interfaces/GenericDisplay.js\");\n/* harmony import */ var _interfaces_components_Draggable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./interfaces/components/Draggable */ \"./src/interfaces/components/Draggable.js\");\n/* harmony import */ var _interfaces_OscillatorDisplay__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./interfaces/OscillatorDisplay */ \"./src/interfaces/OscillatorDisplay.js\");\n\n\n\n\n\n\n\n\n\n\n_interfaces_components_Draggable__WEBPACK_IMPORTED_MODULE_5__.default.setCanvas(_scaffolding_drawBoard__WEBPACK_IMPORTED_MODULE_0__.default.element);\n\nlet oscillator1 = new _models_Oscillator__WEBPACK_IMPORTED_MODULE_2__.default();\nlet oscillator2 = new _models_Oscillator__WEBPACK_IMPORTED_MODULE_2__.default();\nlet mixer = new _models_Mixer__WEBPACK_IMPORTED_MODULE_3__.default();\n\nlet interface1 = new _interfaces_GenericDisplay__WEBPACK_IMPORTED_MODULE_4__.default(mixer);\nlet interface2 = new _interfaces_OscillatorDisplay__WEBPACK_IMPORTED_MODULE_6__.default(oscillator1);\nlet interface3 = new _interfaces_OscillatorDisplay__WEBPACK_IMPORTED_MODULE_6__.default(oscillator2);\n\n([interface1,interface2,interface3]).map((i)=>_scaffolding_drawBoard__WEBPACK_IMPORTED_MODULE_0__.default.add(i));\n\noscillator1.connectTo(mixer);\noscillator2.connectTo(mixer);\n\n//# sourceURL=webpack://fields/./src/index.js?");

/***/ }),

/***/ "./src/interfaces/BoringCircle.js":
/*!****************************************!*\
  !*** ./src/interfaces/BoringCircle.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scaffolding/Sprite */ \"./src/scaffolding/Sprite.js\");\n/* harmony import */ var _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scaffolding/elements */ \"./src/scaffolding/elements.js\");\n/* harmony import */ var _components_Draggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/Draggable */ \"./src/interfaces/components/Draggable.js\");\n/* harmony import */ var _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scaffolding/Vector2 */ \"./src/scaffolding/Vector2.js\");\n\n\n\n\n\nconst defaultSettings = {x:10,y:10};\n\nfunction BoringCircle(userSettings){\n    const settings = {x:0,y:0};\n\n    Object.assign(settings,defaultSettings);\n    Object.assign(settings,userSettings);\n\n    _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__.default.call(this,\"boring circle\");\n    \n    const circle = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Circle({\n        // \"stroke-width\":\"4\",\n        // fill:\"yellow\",\n        r:10\n    });\n\n    const draggable=new _components_Draggable__WEBPACK_IMPORTED_MODULE_2__.default(circle.domElement);\n\n    draggable.positionChanged=(newPosition)=>{\n        circle.attributes.cx=newPosition.x;\n        circle.attributes.cy=newPosition.y;\n        circle.update();\n    }\n\n    this.add(circle);\n    \n    draggable.setPosition(new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_3__.default(settings));\n\n    draggable.dragStartCallback=(mouse)=>{\n        circle.set(\"r\",1);\n    }\n    draggable.dragEndCallback=(mouse)=>{\n        circle.set(\"r\",10);\n    }\n    \n    const line = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Line();\n    this.add(line);\n    \n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BoringCircle);\n\n//# sourceURL=webpack://fields/./src/interfaces/BoringCircle.js?");

/***/ }),

/***/ "./src/interfaces/GenericDisplay.js":
/*!******************************************!*\
  !*** ./src/interfaces/GenericDisplay.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scaffolding/Sprite */ \"./src/scaffolding/Sprite.js\");\n/* harmony import */ var _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scaffolding/elements */ \"./src/scaffolding/elements.js\");\n/* harmony import */ var _scaffolding_Interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scaffolding/Interface */ \"./src/scaffolding/Interface.js\");\n/* harmony import */ var _components_Lane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Lane */ \"./src/interfaces/components/Lane.js\");\n/* harmony import */ var _models_Module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/Module */ \"./src/models/Module.js\");\n\n\n\n\n\n\n/** @param {Module} model */\nfunction GenericDisplay(model){\n    const mySettings={\n        width:800,height:100,\n    }\n\n    _components_Lane__WEBPACK_IMPORTED_MODULE_3__.default.call(this,{\n        width:mySettings.width,x:0,y:0,\n        name:\"envelope lane\"\n    });\n\n    //lane has a contents sprite.\n    const contents=this.contents;\n\n    _scaffolding_Interface__WEBPACK_IMPORTED_MODULE_2__.default.call(this);\n\n    const oscLine = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Path({\n        d:`M ${0},${mySettings.height/2}\n        Q ${0},${mySettings.height/2} ${mySettings.width},${mySettings.height/2}`,\n        fill:\"transparent\",\n        stroke:\"black\"\n    });\n    \n    contents.add(oscLine);\n    \n    this.update=function(changes){\n        if(changes.cachedValues){\n            const {cachedValues}=changes;\n            let str = `M ${0},${mySettings.height/2}`;\n            let valsPerPixel=Math.floor(cachedValues.length/mySettings.width);\n            let pixelsPerVal=mySettings.width/cachedValues.length;\n            let topOffset = mySettings.height/2;\n            let prevTop = topOffset;\n            //todo: take whichever has less: pixels or samples.\n            //when multi samples per pixel, use max and a filled area\n            //otherwise, it's a line\n            for(let pixelNumber=0; pixelNumber<mySettings.width; pixelNumber++){\n                const top = 0.5 * mySettings.height * cachedValues[pixelNumber * valsPerPixel] + topOffset;\n                if(pixelNumber>0) str +=`Q ${pixelNumber-1},${prevTop} ${pixelNumber},${top}`;\n                prevTop=top;\n            }\n            oscLine.set('d',str);\n            \n        }\n    }\n    model.triggerInitialState();\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GenericDisplay);\n\n//# sourceURL=webpack://fields/./src/interfaces/GenericDisplay.js?");

/***/ }),

/***/ "./src/interfaces/OscillatorDisplay.js":
/*!*********************************************!*\
  !*** ./src/interfaces/OscillatorDisplay.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scaffolding/Sprite */ \"./src/scaffolding/Sprite.js\");\n/* harmony import */ var _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scaffolding/elements */ \"./src/scaffolding/elements.js\");\n/* harmony import */ var _scaffolding_Interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../scaffolding/Interface */ \"./src/scaffolding/Interface.js\");\n/* harmony import */ var _components_Lane__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/Lane */ \"./src/interfaces/components/Lane.js\");\n/* harmony import */ var _components_Draggable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/Draggable */ \"./src/interfaces/components/Draggable.js\");\n/* harmony import */ var _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../scaffolding/Vector2 */ \"./src/scaffolding/Vector2.js\");\n/* harmony import */ var _models_Oscillator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../models/Oscillator */ \"./src/models/Oscillator.js\");\n/* harmony import */ var _utils_round__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/round */ \"./src/utils/round.js\");\n\n\n\n\n\n\n\n\n/** @param {Oscillator} model */\nfunction OscillatorDisplay(model){\n    const mySettings={\n        width:800,height:100,\n    }\n\n    _components_Lane__WEBPACK_IMPORTED_MODULE_3__.default.call(this,{\n        width:mySettings.width,x:0,y:0,\n        name:\"Oscillator\"\n    });\n\n    //lane has a contents sprite.\n    const contents=this.contents;\n\n    _scaffolding_Interface__WEBPACK_IMPORTED_MODULE_2__.default.call(this);\n\n    function xToFrequency(x){\n        return x;\n    }\n    function yToAmplitude(y){\n        return 1 - 2 * y / mySettings.height;\n    }\n\n    const readoutText =  new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Text({\n        class:\"freq-times-amp\",\n        x:10, y:mySettings.height/2,\n        text:\"---\",\n    });\n\n    contents.add(readoutText);\n\n    const oscLine = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Path({\n        d:`M ${0},${mySettings.height/2}\n        Q ${0},${mySettings.height/2} ${mySettings.width},${mySettings.height/2}`,\n        fill:\"transparent\",\n        stroke:\"black\"\n    });\n    \n    contents.add(oscLine);\n\n    //TODO: some knob or text field\n    const frequencyHandle = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Circle({\n        r:10\n    });\n\n    const frequencyDraggable=new _components_Draggable__WEBPACK_IMPORTED_MODULE_4__.default(frequencyHandle.domElement);\n\n    frequencyDraggable.positionChanged=(newPosition)=>{\n        frequencyHandle.attributes.cx=newPosition.x;\n        frequencyHandle.attributes.cy=newPosition.y;\n        frequencyHandle.update();\n        model.setFrequency(xToFrequency(newPosition.x));\n        model.setAmplitude(yToAmplitude(newPosition.y));\n    }\n\n    contents.add(frequencyHandle);\n    \n    frequencyDraggable.setPosition(new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_5__.default(mySettings));\n\n    frequencyDraggable.dragStartCallback=(mouse)=>{\n        frequencyHandle.set(\"r\",1);\n    }\n    frequencyDraggable.dragEndCallback=(mouse)=>{\n        frequencyHandle.set(\"r\",10);\n    }\n\n    model.onUpdate((modelChanges)=>{\n        console.log(modelChanges);\n        if(modelChanges.cachedValues){\n            const {cachedValues}=modelChanges;\n            let str = `M ${0},${mySettings.height/2}`;\n            let valsPerPixel=Math.floor(cachedValues.length/mySettings.width);\n            let pixelsPerVal=mySettings.width/cachedValues.length;\n            let topOffset = mySettings.height/2;\n            let prevTop = topOffset;\n            //todo: take whichever has less: pixels or samples.\n            //when multi samples per pixel, use max and a filled area\n            //otherwise, it's a line\n            for(let pixelNumber=0; pixelNumber<mySettings.width; pixelNumber++){\n                const top = 0.5 * mySettings.height * cachedValues[pixelNumber * valsPerPixel] + topOffset;\n                if(pixelNumber>0) str +=`Q ${pixelNumber-1},${prevTop} ${pixelNumber},${top}`;\n                prevTop=top;\n            }\n            oscLine.set('d',str);\n            \n        }\n        if(\n            modelChanges.frequency!==undefined ||\n            modelChanges.amplitude!==undefined \n        ){\n            readoutText.set(\"text\",\n                `${\n                    (0,_utils_round__WEBPACK_IMPORTED_MODULE_7__.default)(model.settings.frequency,4)\n                }Hz; ${\n                    (0,_utils_round__WEBPACK_IMPORTED_MODULE_7__.default)(model.settings.amplitude,4)\n                }`);\n        }\n\n    });\n    model.triggerInitialState();\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OscillatorDisplay);\n\n//# sourceURL=webpack://fields/./src/interfaces/OscillatorDisplay.js?");

/***/ }),

/***/ "./src/interfaces/components/Draggable.js":
/*!************************************************!*\
  !*** ./src/interfaces/components/Draggable.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../scaffolding/Vector2 */ \"./src/scaffolding/Vector2.js\");\n\n\n/**\n * thing that can be dragged. It does not implement actual updating of position,\n * as it doesn't assume the object to have certain properties for position or \n * certain render methods. The user must implement by using dragCallback function\n * override\n */\n\n/**\n * @typedef {Object} HasClassList\n * @property {Set<string>} classList\n * @typedef {Node & HasClassList} NodeWithClassList\n * @exports NodeWithClassList\n */\n\n/** @param {Node} domElement */\nfunction Draggable(domElement){\n\n    const position = new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default();\n    const dragStartPosition = position.clone();\n\n    domElement.addEventListener(\"mouseenter\",(evt)=>{\n        Draggable.mouse.isHovering=this;\n        domElement.classList.add(\"active\");\n    });\n    \n    domElement.addEventListener(\"mouseleave\",(evt)=>{\n        if(!Draggable.mouse.selected.has(this)){\n            domElement.classList.remove(\"active\");\n        }\n        Draggable.mouse.isHovering=false;\n    });\n\n    /** do not override */\n    this._drag=(mouse)=>{\n        position.set(dragStartPosition);\n        position.add(mouse.dragDelta);\n\n\n        this.dragCallback(mouse);\n        this.positionChanged(position);\n    }\n    this._dragStart=(mouse)=>{\n\n        dragStartPosition.set(\n            _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default.sub(position,mouse)\n        );\n\n        this.dragStartCallback(mouse);\n    }\n    this._dragEnd=(...p)=>{\n        domElement.classList.remove(\"active\");\n        this.dragEndCallback(...p);\n    }\n\n    /** override */\n    this.dragCallback=(mouse)=>{\n    }\n    this.dragStartCallback=(mouse)=>{\n        // console.log(\"dragStart\",mouse);\n    }\n    this.dragEndCallback=(mouse)=>{\n        // console.log(\"dragEnd\",mouse);\n    }\n    /** @param {Vector2} newPosition */\n    this.positionChanged=(newPosition)=>{\n\n    }\n\n    /** @param {Vector2} newPosition */\n    this.setPosition=(newPosition)=>{\n        position.set(newPosition);\n        this.positionChanged(newPosition);\n    }\n\n    domElement.classList.add(\"draggable\");\n}\n\nDraggable.mouse={};\n/** @param {Node} canvas */\nDraggable.setCanvas=(canvas=document)=>{\n    const mouse = Draggable.mouse = new(function(){\n        _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default.call(this);\n\n        /** @type {boolean} */\n        this.pressed=false;\n        /** @type {Set<Draggable>} */\n        this.selected=new Set();\n        /** @type {false|Draggable} */\n        this.isHovering=false;\n        this.dragStartPosition=new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default();\n        this.dragDelta=new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default();\n\n    })();\n\n\n\n    canvas.addEventListener(\"mousemove\",(evt)=>{\n        mouse.x=evt.clientX;\n        mouse.y=evt.clientY;\n        mouse.dragDelta = _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_0__.default.sub(mouse,mouse.dragStartPosition);\n        if(mouse.pressed){\n           if(mouse.selected.size){\n               mouse.selected.forEach((draggable)=>{ draggable._drag(mouse) });\n           } \n        }\n    });\n\n    canvas.addEventListener(\"mousedown\", (evt)=>{\n        mouse.pressed=true;\n        if(evt.button==0){\n            //to implement multi element seletion, you would do changes here\n            if(mouse.isHovering){\n                mouse.selected.clear();\n                mouse.selected.add(mouse.isHovering);\n                mouse.selected.forEach((draggable)=>{ draggable._dragStart(mouse) });\n            }\n        }\n    });\n\n    canvas.addEventListener(\"mouseup\", (evt)=>{\n        mouse.pressed=false;\n        if(mouse.selected.size){\n            mouse.selected.forEach((draggable)=>{ draggable._dragEnd(mouse) });\n            mouse.selected.clear();\n        }\n    });\n\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Draggable);\n\n//# sourceURL=webpack://fields/./src/interfaces/components/Draggable.js?");

/***/ }),

/***/ "./src/interfaces/components/Lane.js":
/*!*******************************************!*\
  !*** ./src/interfaces/components/Lane.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../scaffolding/Sprite */ \"./src/scaffolding/Sprite.js\");\n/* harmony import */ var _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../scaffolding/elements */ \"./src/scaffolding/elements.js\");\n/* harmony import */ var _Draggable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Draggable */ \"./src/interfaces/components/Draggable.js\");\n/* harmony import */ var _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../scaffolding/Vector2 */ \"./src/scaffolding/Vector2.js\");\n\n\n\n\n\nconst defaultSettings = {\n    x:0,y:0,\n    width:800,\n    height:100,\n    handleHeight:10,\n    name:\"lane\",\n};\n\nfunction Lane(userSettings={\n    x:0,y:0,\n    width:100,\n    name:\"lane\",\n}){\n    const settings = {};\n\n    _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__.default.call(this,settings.name);\n\n    Object.assign(settings,defaultSettings);\n    Object.assign(settings,userSettings);\n\n    _scaffolding_Sprite__WEBPACK_IMPORTED_MODULE_0__.default.call(this,\"lane frame\");\n    \n    const handleRect = new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Rectangle({\n        x:settings.x,\n        y:settings.y,\n        width:settings.width,\n        height:settings.handleHeight,\n        fill:\"transparent\",\n    });\n    const draggable=new _Draggable__WEBPACK_IMPORTED_MODULE_2__.default(handleRect.domElement);\n\n    draggable.positionChanged=(newPosition)=>{\n        handleRect.attributes.x=settings.x;\n        handleRect.attributes.y=newPosition.y;\n        handleRect.update();\n\n        this.contents.attributes.x=settings.x;\n        this.contents.attributes.y=newPosition.y+settings.handleHeight;\n        this.contents.update();\n    }\n\n    this.contents=new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Group({\n        x:settings.x,y:settings.y,\n        width:settings.width, height:settings.height,\n        name:\"contents\"\n    });\n\n    this.add(this.contents);\n\n    const text=new _scaffolding_elements__WEBPACK_IMPORTED_MODULE_1__.Text({\n        x:10,y:0,\n        text:settings.name\n    });\n    this.contents.add(text);\n\n    //timeout to defer rect for later, so that it has higher z-index.\n    //TODO: find more elegant solution to this problem\n\n    this.add(handleRect);\n    \n    draggable.setPosition(new _scaffolding_Vector2__WEBPACK_IMPORTED_MODULE_3__.default(settings));\n\n    draggable.dragStartCallback=(mouse)=>{\n    }\n    draggable.dragEndCallback=(mouse)=>{\n    }    \n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lane);\n\n//# sourceURL=webpack://fields/./src/interfaces/components/Lane.js?");

/***/ }),

/***/ "./src/models/Mixer.js":
/*!*****************************!*\
  !*** ./src/models/Mixer.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Module */ \"./src/models/Module.js\");\n\n\nconst defaultSettings={\n    amplitude:0.25\n};\n\nfunction Mixer(userSettings={}){\n\n    //apply default settings for all the settings user did not provide\n    const settings={}\n    Object.assign(settings,defaultSettings);\n    Object.assign(settings,userSettings);\n\n    const {amplitude}=settings;\n    _Module__WEBPACK_IMPORTED_MODULE_0__.default.call(this,settings);\n    this.calculate=(recursion = 0)=>{\n        console.log(\"mixer calculate\");\n        this.inputs.forEach((input)=>{\n            const inputValues = input.getValues(recursion);\n            inputValues.map((val,index)=>{\n                const currentVal=this.cachedValues[index]!==undefined?this.cachedValues[index]:0;\n                this.cachedValues[index] += currentVal * amplitude;\n            });\n        });\n\n        this.changed({cachedValues:this.cachedValues});\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Mixer);\n\n//# sourceURL=webpack://fields/./src/models/Mixer.js?");

/***/ }),

/***/ "./src/models/Module.js":
/*!******************************!*\
  !*** ./src/models/Module.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _vars__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vars */ \"./src/models/vars.js\");\n/* harmony import */ var _scaffolding_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scaffolding/Model */ \"./src/scaffolding/Model.js\");\n\n\n\nfunction Module(settings){\n    _scaffolding_Model__WEBPACK_IMPORTED_MODULE_1__.default.call(this,settings);\n\n    this.cachedValues=[];\n\n    this.inputs=new Set();\n    this.outputs=new Set();\n\n    /** @param {Module} outputModule */\n    this.connectTo=(outputModule)=>{\n        outputModule.inputs.add(this);\n        this.outputs.add(outputModule);\n    }\n    /** @param {Module} outputModule */\n    this.disconnect=(outputModule)=>{\n        outputModule.inputs.delete(this);\n        this.outputs.delete(outputModule);\n    }\n\n    this.ss=[];\n    //a module can be set to not recalculate, it's not expected to change.\n    //maybe I can do a \"recalculate\" flag propagation later, for example\n    //to de-cache all outputs of an envelope when its changed\n    let recalculate=true;\n\n    this.useCache=()=>{\n        recalculate=false;\n        this.changed({recalculate});\n    }\n\n    this.recalculate=()=>{\n        recalculate=true;\n        this.changed({recalculate});\n        this.getValues();\n    }\n\n    //not to be changed\n    this.getValues=(recursion = 0)=>{\n        if(recursion > _vars__WEBPACK_IMPORTED_MODULE_0__.maxRecursion) throw new Error(\"max recursion reached\");\n        if(recalculate){\n            this.calculate(recursion+1);\n            this.changed({cachedValues:this.cachedValues});\n            this.useCache();\n            //if my cache changes, it means all my output modules need recalculation\n            this.outputs.forEach((outputModule)=>outputModule.recalculate());\n        }\n        return this.cachedValues;\n    }\n\n    //to be overriden.\n    //a this.calculate has to fill the this.cachedValues array\n    this.calculate=(recursion = 0)=>{\n        this.cachedValues=[];\n        this.changed({cachedValues:this.cachedValues});\n    }\n\n    this.triggerInitialState=()=>{\n        this.getValues();\n        this.changed({recalculate});\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Module);\n\n//# sourceURL=webpack://fields/./src/models/Module.js?");

/***/ }),

/***/ "./src/models/Oscillator.js":
/*!**********************************!*\
  !*** ./src/models/Oscillator.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Module */ \"./src/models/Module.js\");\n/* harmony import */ var _vars__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vars */ \"./src/models/vars.js\");\n\n\n\nconst defaultSettings={\n    amplitude:1,\n    bias:0,\n    length:1.2,\n    frequency:220,\n    shape:\"sin\",\n};\n\nfunction Oscillator(userSettings={}){\n    //apply default settings for all the settings user did not provide\n    const settings={};\n\n    Object.assign(settings,defaultSettings);\n    Object.assign(settings,userSettings);\n\n    let first=true;\n    const shapes={\n        sin:(sampleNumber)=>{\n            return Math.sin(\n                Math.PI * 2 \n                * settings.frequency * sampleNumber\n                / _vars__WEBPACK_IMPORTED_MODULE_1__.sampleRate\n            ) * settings.amplitude\n            + settings.bias\n        },\n        cos:(sampleNumber)=>{\n            return Math.cos(\n                Math.PI * 2 * \n                settings.frequency * sampleNumber\n                / _vars__WEBPACK_IMPORTED_MODULE_1__.sampleRate\n            ) * settings.amplitude\n            + settings.bias\n        },\n        //TODO: more shapes\n    }\n\n    _Module__WEBPACK_IMPORTED_MODULE_0__.default.call(this,settings);\n    \n    this.setFrequency=(to)=>{\n        settings.frequency=to;\n        this.changed({\n            frequency:to\n        });\n        this.calculate();\n    }\n    \n    this.setAmplitude=(to)=>{\n        settings.amplitude=to;\n        this.changed({\n            amplitude:to\n        });\n        this.calculate();\n    }\n    \n    this.calculate=(recursion = 0)=>{\n\n        const lengthSamples = settings.length*_vars__WEBPACK_IMPORTED_MODULE_1__.sampleRate;\n\n        if(!shapes[settings.shape]) throw new Error(`Wave shape function named ${settings.shape}, does not exist`);\n        \n\n        for(let a=0; a<lengthSamples; a++){\n            this.cachedValues[a]=shapes[settings.shape](a);\n        }\n\n        this.changed({cachedValues:this.cachedValues});\n    }\n\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Oscillator);\n\n//# sourceURL=webpack://fields/./src/models/Oscillator.js?");

/***/ }),

/***/ "./src/models/vars.js":
/*!****************************!*\
  !*** ./src/models/vars.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"maxRecursion\": () => (/* binding */ maxRecursion),\n/* harmony export */   \"sampleRate\": () => (/* binding */ sampleRate)\n/* harmony export */ });\n\nconst maxRecursion = 20;\nconst sampleRate = 44100;\n\n\n//# sourceURL=webpack://fields/./src/models/vars.js?");

/***/ }),

/***/ "./src/scaffolding/Canvas.js":
/*!***********************************!*\
  !*** ./src/scaffolding/Canvas.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ \"./src/scaffolding/elements.js\");\n\n//only for type:\n\n\nfunction Canvas(){\n    // const element = document.createElementNS(\"http://www.w3.org/2000/svg\",'svg');\n    const element =  document.createElementNS(\"http://www.w3.org/2000/svg\", 'svg');\n    this.element = element;\n    // element.setAttribute('viewBox',\"0 0 100 100\");\n    // element.setAttribute('width',\"100\");\n    // element.setAttribute('height',\"100\");\n    document.body.appendChild(element);\n    /** @param {Component} elem */\n    this.add=(elem)=>{\n        console.log(\"adding\",elem);\n        element.appendChild(elem.domElement);\n    }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Canvas);\n\n//# sourceURL=webpack://fields/./src/scaffolding/Canvas.js?");

/***/ }),

/***/ "./src/scaffolding/Interface.js":
/*!**************************************!*\
  !*** ./src/scaffolding/Interface.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Model */ \"./src/scaffolding/Model.js\");\n\n\nfunction Interface(model){\n    this.model=model;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Interface);\n\n//# sourceURL=webpack://fields/./src/scaffolding/Interface.js?");

/***/ }),

/***/ "./src/scaffolding/Model.js":
/*!**********************************!*\
  !*** ./src/scaffolding/Model.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction Model(settings){\n    const redrawList=[];\n    this.settings=settings;\n    //interface uses this method to conect changes in model to redrawss\n    this.onUpdate=(newCallback)=>{\n        if(typeof newCallback !== \"function\") throw new Error(`Callback has to be function but it is ${typeof newCallback}`);\n        redrawList.push(newCallback);\n    }\n    //model uses this method to notify changes to the interface\n    this.changed=(changes={})=>{\n        redrawList.map((cb)=>{cb(changes)});\n    }\n    //get the initial state of the model\n    this.triggerInitialState=()=>{};\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Model);\n\n//# sourceURL=webpack://fields/./src/scaffolding/Model.js?");

/***/ }),

/***/ "./src/scaffolding/Sprite.js":
/*!***********************************!*\
  !*** ./src/scaffolding/Sprite.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction Sprite(name=\"sprite\"){\n\n    const element = document.createElementNS(\"http://www.w3.org/2000/svg\",'g');\n    this.domElement=element;\n    /** @param {Component} elem */\n    this.add=(elem)=>{\n        element.appendChild(elem.domElement);\n    }\n    this.domElement.classList.add(name.replace(/\\s+/,\"-\"));\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Sprite);\n\n//# sourceURL=webpack://fields/./src/scaffolding/Sprite.js?");

/***/ }),

/***/ "./src/scaffolding/Vector2.js":
/*!************************************!*\
  !*** ./src/scaffolding/Vector2.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction Vector2(options={x:0,y:0}){\n    /** @param {Vector2} to */\n    this.add=(to)=>{\n        this.x+=to.x;\n        this.y+=to.y;\n        return this;\n    }\n    /** @param {Vector2} to */\n    this.sub=(to)=>{\n        this.x-=to.x;\n        this.y-=to.y;\n        return this;\n    }\n    this.clone=()=>{\n        return new Vector2(this);\n    }\n    /** @param {Vector2} to */\n    this.set=(to)=>{\n        this.x=to.x|0;\n        this.y=to.y|0;\n    }\n    this.set(options);\n}\n\n/** \n * @param {Vector2} vec1 \n * @param {Vector2} vec2 \n **/\nVector2.add=(vec1, vec2)=>{\n    return (new Vector2(vec1)).add(vec2);\n}\n\n/** \n * @param {Vector2} vec1 \n * @param {Vector2} vec2 \n **/\nVector2.sub=(vec1, vec2)=>{\n    return (new Vector2(vec1)).sub(vec2);\n}\n\n/** \n * @param {Vector2} vec1\n **/\nVector2.clone=(vec1)=>{\n    return (new Vector2(vec1));\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector2);\n\n//# sourceURL=webpack://fields/./src/scaffolding/Vector2.js?");

/***/ }),

/***/ "./src/scaffolding/drawBoard.js":
/*!**************************************!*\
  !*** ./src/scaffolding/drawBoard.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Canvas */ \"./src/scaffolding/Canvas.js\");\n\nconst drawBoard=new _Canvas__WEBPACK_IMPORTED_MODULE_0__.default();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (drawBoard);\n\n\n//# sourceURL=webpack://fields/./src/scaffolding/drawBoard.js?");

/***/ }),

/***/ "./src/scaffolding/elements.js":
/*!*************************************!*\
  !*** ./src/scaffolding/elements.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Component\": () => (/* binding */ Component),\n/* harmony export */   \"Circle\": () => (/* binding */ Circle),\n/* harmony export */   \"Path\": () => (/* binding */ Path),\n/* harmony export */   \"Line\": () => (/* binding */ Line),\n/* harmony export */   \"Rectangle\": () => (/* binding */ Rectangle),\n/* harmony export */   \"Group\": () => (/* binding */ Group),\n/* harmony export */   \"Text\": () => (/* binding */ Text)\n/* harmony export */ });\nfunction Component(myOptions={x:0,y:0}){\n    this.domElement;\n    this.attributes={};\n    this.appliedAttributes={};\n    this.update=()=>{\n        if(!this.domElement) return console.warn(\"this.domElement is\",this.domElement);\n        //apply what has been modified to the dom element\n        //it also keeps track of modified attributes to prevent redundant changes\n        Object.keys(this.attributes).map((attrName)=>{\n            const attr=this.attributes[attrName];\n            const appliedAttr=this.appliedAttributes[attrName];\n            if(attr!==appliedAttr){\n                this.domElement.setAttribute(attrName, attr);\n                this.attributes[attrName]=attr;\n            }\n        });\n    }\n    this.set=(attrname,attrval)=>{\n        this.attributes[attrname] = attrval;\n        this.update();\n    }\n    Object.assign(this.attributes,myOptions);\n}\n/**\n * @param {Object} myOptions\n **/\nfunction Circle(myOptions={\n    cx:0,cy:0,r:50\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'circle');\n\n    this.update();\n}\n\nfunction Path(myOptions={\n    d:`M 10,30\n    A 20,20 0,0,1 50,30\n    A 20,20 0,0,1 90,30\n    Q 90,60 50,90\n    Q 10,60 10,30 z`\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'path');\n    this.update();\n}\n\nfunction Rectangle(myOptions={\n    x:0, y:0, width: 100, height: 100\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'rect');\n    this.update();\n}\n\nfunction Line(myOptions={\n    x1:0, y1:80, x2:100, y2:20\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'line');\n\n    this.update();\n}\n\nfunction Group(myOptions={\n    x:0, y:0,\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'svg');\n\n    /** @param {Component} elem */\n    this.add=(elem)=>{\n        this.domElement.appendChild(elem.domElement);\n    }\n    this.update();\n}\nfunction Text(myOptions={\n    x:0, y:0,text:\"---\"\n}){\n    Component.call(this,myOptions);\n    this.domElement=document.createElementNS(\"http://www.w3.org/2000/svg\",'text');\n\n    /** @param {Component} elem */\n    this.add=(elem)=>{\n        this.domElement.appendChild(elem.domElement);\n    }\n    const superUpdate=this.update;\n    this.update=()=>{\n        this.domElement.innerHTML=this.attributes.text;\n        superUpdate();\n    }\n    this.update();\n}\n\n\n \n\n\n\n//# sourceURL=webpack://fields/./src/scaffolding/elements.js?");

/***/ }),

/***/ "./src/utils/round.js":
/*!****************************!*\
  !*** ./src/utils/round.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst round=(num,precision)=>{\n    let ratio = 10*precision;\n    return Math.round(num*ratio)/ratio;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (round);\n\n//# sourceURL=webpack://fields/./src/utils/round.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;