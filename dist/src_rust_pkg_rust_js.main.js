/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfields"] = self["webpackChunkfields"] || []).push([["src_rust_pkg_rust_js"],{

/***/ "./src/rust/pkg/rust.js":
/*!******************************!*\
  !*** ./src/rust/pkg/rust.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"__wbg_alert_8a44b3152c7fba98\": () => (/* reexport safe */ _rust_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_alert_8a44b3152c7fba98),\n/* harmony export */   \"greet\": () => (/* reexport safe */ _rust_bg_js__WEBPACK_IMPORTED_MODULE_0__.greet)\n/* harmony export */ });\n/* harmony import */ var _rust_bg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rust_bg.js */ \"./src/rust/pkg/rust_bg.js\");\n\n\n\n//# sourceURL=webpack://fields/./src/rust/pkg/rust.js?");

/***/ }),

/***/ "./src/rust/pkg/rust_bg.js":
/*!*********************************!*\
  !*** ./src/rust/pkg/rust_bg.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"greet\": () => (/* binding */ greet),\n/* harmony export */   \"__wbg_alert_8a44b3152c7fba98\": () => (/* binding */ __wbg_alert_8a44b3152c7fba98)\n/* harmony export */ });\n/* harmony import */ var _rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rust_bg.wasm */ \"./src/rust/pkg/rust_bg.wasm\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachegetUint8Memory0 = null;\nfunction getUint8Memory0() {\n    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer) {\n        cachegetUint8Memory0 = new Uint8Array(_rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.memory.buffer);\n    }\n    return cachegetUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n/**\n*/\nfunction greet() {\n    _rust_bg_wasm__WEBPACK_IMPORTED_MODULE_0__.greet();\n}\n\nconst __wbg_alert_8a44b3152c7fba98 = function(arg0, arg1) {\n    alert(getStringFromWasm0(arg0, arg1));\n};\n\n\n\n//# sourceURL=webpack://fields/./src/rust/pkg/rust_bg.js?");

/***/ }),

/***/ "./src/rust/pkg/rust_bg.wasm":
/*!***********************************!*\
  !*** ./src/rust/pkg/rust_bg.wasm ***!
  \***********************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.id];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name) exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./rust_bg.js */ \"./src/rust/pkg/rust_bg.js\");\n\n\n// exec wasm module\nwasmExports[\"\"]()\n\n//# sourceURL=webpack://fields/./src/rust/pkg/rust_bg.wasm?");

/***/ })

}]);