/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 377:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(832);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(652);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(801);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(30);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(618);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(49);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(971);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = String(data);
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 618:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);


/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);



/***/ }),

/***/ 801:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__.amdD && __webpack_require__.amdO) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__.amdD   // present with an AMD loader
);




/***/ }),

/***/ 971:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2019 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (global, pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

var width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ( true && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(42);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return seedrandom; }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}


// End anonymous scope, and pass initial values.
})(
  // global: `self` in browsers (including strict mode and web workers),
  // otherwise `this` in Node and other environments
  (typeof self !== 'undefined') ? self : this,
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),

/***/ 679:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

// EXTERNAL MODULE: ./src/scaffolding/Vector2.js
var Vector2 = __webpack_require__(147);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Draggable.js

const VectorTypedef = __webpack_require__(147);

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */


/**
 * @typedef {Node} NodeWithClassList
 * @property {Set<string>} classList
 * @exports NodeWithClassList
 */



/**
 * @class Draggable
 * 
 * thing that can be dragged. It does not implement actual updating of position,
 * as it doesn't assume the object to have certain properties for position or 
 * certain render methods. The user must implement by using dragCallback function
 * override
 *  @constructor 
 *  @param {HTMLElement|SVGElement} domElement */
function Draggable(domElement){

    const position = new Vector2.default();
    const dragStartPosition = position.clone();

    domElement.addEventListener("mouseenter",(evt)=>{
        Draggable.mouse.isHovering=this;
        domElement.classList.add("active");
    });
    
    domElement.addEventListener("mouseleave",(evt)=>{
        if(!Draggable.mouse.selected.has(this)){
            domElement.classList.remove("active");
        }
        Draggable.mouse.isHovering=false;
    });

    /** do not override */
    this._drag=(mouse)=>{
        position.set(dragStartPosition);
        position.add(mouse.dragDelta);
        
        this.dragCallback(mouse);
        this.positionChanged({
            x:position.x,
            y:position.y,
            delta:mouse.dragDelta,
            localDragOffset:dragStartPosition,
            start:{
                x:dragStartPosition.x,
                y:dragStartPosition.y,
            }
        });
    }
    this._dragStart=(mouse)=>{

        dragStartPosition.set(position);
        
        this.dragStartCallback(mouse);
    }
    this._dragEnd=(...p)=>{
        domElement.classList.remove("active");
        this.dragEndCallback(...p);
    }

    /** override */
    this.dragCallback=(mouse)=>{
    }
    this.dragStartCallback=(mouse)=>{
    }
    this.dragEndCallback=(mouse)=>{
    }

    /**
     * @typedef {MiniVector} DragPosition
     * @property {MiniVector} start
     * @property {MiniVector} delta
     **/
    
    /** @param {DragPosition} newPosition */
    this.positionChanged=(newPosition)=>{

    }

    /** @param {Vector2|MiniVector} newPosition */
    this.setPosition=(newPosition, callback=true)=>{
        position.set(newPosition);
        if(callback) this.positionChanged(newPosition);
    }

    domElement.classList.add("draggable");
}

class Mouse extends Vector2.default{
    constructor(){
        super();
        /** @type {boolean} */
        this.pressed=false;
        /** @type {Set<Draggable>} */
        this.selected=new Set();
        /** @type {false|Draggable} */
        this.isHovering=false;
        this.dragStartPosition=new Vector2.default();
        this.dragDelta=new Vector2.default();
    }
}

Draggable.mouse = new Mouse();
/** @param {Node} canvas */
Draggable.setCanvas=(canvas=document)=>{
    const mouse = Draggable.mouse;

    canvas.addEventListener("mousemove",(evt)=>{
        // @ts-ignore
        mouse.x=evt.clientX;
        // @ts-ignore
        mouse.y=evt.clientY;
        mouse.dragDelta = Vector2.default.sub(mouse,mouse.dragStartPosition);
        if(mouse.pressed){
           if(mouse.selected.size){
               mouse.selected.forEach((draggable)=>{ draggable._drag(mouse) });
           } 
        }
    });

    canvas.addEventListener("mousedown", (evt)=>{
        mouse.pressed=true;
        //@ts-ignore
        mouse.dragStartPosition.set({x:evt.clientX,y:evt.clientY});
        // @ts-ignore
        if(evt.button==0){
            //to implement multi element seletion, you would do changes here
            if(mouse.isHovering){
                mouse.selected.clear();
                mouse.selected.add(mouse.isHovering);
                mouse.selected.forEach((draggable)=>{ draggable._dragStart(mouse) });
            }
        }
    });

    canvas.addEventListener("mouseup", (evt)=>{
        mouse.pressed=false;
        if(mouse.selected.size){
            mouse.selected.forEach((draggable)=>{ draggable._dragEnd(mouse) });
            mouse.selected.clear();
        }
    });

}
/* harmony default export */ const components_Draggable = (Draggable);
;// CONCATENATED MODULE: ./src/SoundModules/vars.js

/**
 * @returns {AudioContext} the new or existing context
 */
function getAudioContext(){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    
    if(! window.audioCtx){
        console.log("creating new audioContext", AudioContext);
        window.audioCtx = new AudioContext();
        // var oscillator = audioCtx.createOscillator();
        // var gain = audioCtx.createGain();
        // gain.gain.value=0.2;
        // gain.connect(audioCtx.destination);
        // oscillator.type = 'square';
        // oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // value in hertz
        // oscillator.connect(gain);
        // oscillator.start();
    }
    return window.audioCtx;
}

const audioContext=getAudioContext();


const maxRecursion = 20;
const sampleRate = audioContext.sampleRate;

// EXTERNAL MODULE: ./src/scaffolding/elements.js
var scaffolding_elements = __webpack_require__(686);
;// CONCATENATED MODULE: ./src/utils/const typicalLaneSettings.js




/**
 * @typedef {import("../DomInterfaces/components/Lane").LaneOptions} LaneOptions
 */
/**
 * @typedef {Object} TypicalLaneSettingsReturn
 * @property {string} name 
 * @property {number} x position
 * @property {number} y position
 * @property {number} centerAmplitude pan vertical
 * @property {number} rangeAmplitude zoom vertical
 * @property {number} firstSample pan horizontal
 * @property {number} rangeSamples zoom horizontal
 * @property {number} width size horizontal
 * @property {number} height size vertical
 * @property {Module} model 
 * @property {Canvas} drawBoard 
 * 
 * @typedef {Object<String,number|string|Module|Model|Canvas>} ExtraLaneOptions
 */

/**
 * @param {Module} model
 * @param {Canvas} drawBoard
 * @returns {TypicalLaneSettingsReturn}
 * */
const typicalLaneSettings=(model,drawBoard)=>({
    name:"Lane",
    x:0,y:0,
    centerAmplitude:0,rangeAmplitude:2,
    firstSample:0, rangeSamples:44100,
    width:800, height:120,
    model, drawBoard,
})

/* harmony default export */ const const_typicalLaneSettings = (typicalLaneSettings);
;// CONCATENATED MODULE: ./src/SoundModules/InputNode.js


/** @param {Module} owner */
class InputNode {
    constructor(owner) {
        this.isInputNode=true;
        /** @type {undefined | Module} */
        this.input = undefined;
        this.owner = owner;
        this.getValues = (recursion) => {
            // if(!this.input) throw new Error("requested getValues from nonconnected input");
            if (this.input)
                return this.input.getValues(recursion);
            return [];
        };
        
        this.getValue = (sampleNumber) => {
            if(sampleNumber<0) return 0;
            if (this.input){
                if(this.input.cachedValues[sampleNumber]){
                    this.input.cachedValues[sampleNumber];
                }else{
                    this.input.cachedValues[this.input.cachedValues.length - 1];
                }
            }
            return 0;
        }
        this.cacheObsolete = owner.cacheObsolete;
    }
}
/* harmony default export */ const SoundModules_InputNode = (InputNode);


;// CONCATENATED MODULE: ./src/utils/round.js
const round=(num,precision)=>{
    let ratio = 10*precision;
    return Math.round(num*ratio)/ratio;
}
/* harmony default export */ const utils_round = (round);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Knob.js





let defaultKnobOptions = {
    x: 0, y:0,
    radius:20,
    name:"knob",
    class:"knob",
    min:false, max:false,
    deltaCurve:"gain",
}

//TODO:
const deltaCurves = {
    periodseconds:(deltaval)=> {
        const newVal = Math.pow(deltaval/10,2)*10 * Math.sign(deltaval);
        return newVal;
    },
    integer:(deltaval)=> {
        const newVal = Math.round(deltaval * 20);
        return newVal;
    },
    frequency:(deltaval)=>{
        deltaval*=100;
        return Math.pow(Math.abs(deltaval),2)*Math.sign(deltaval);
    },
    gain:(deltaval)=>(deltaval*3),
    channelvol:(deltaval)=>deltaval*5,
}

class Knob extends scaffolding_elements.Group{
    constructor(userOptions){
        const options = {};
        Object.assign(options,defaultKnobOptions);
        Object.assign(options,userOptions);
        super(options);

        let nameText = new scaffolding_elements.Text({
            x:0,
            y: options.radius + 5,
            'text-anchor':'middle'
        });
        let valueText = new scaffolding_elements.Text({
            x:0,
            y: options.radius + 15,
            'text-anchor':'middle'
        });

        this.add(nameText);
        this.add(valueText);


        let knobShape = new scaffolding_elements.Path();
        let valueShape = new scaffolding_elements.Path();
        this.add(valueShape);
        this.add(knobShape);
        valueShape.set("fill","none");
        valueShape.domElement.classList.add("knob-value-arc");

        const remakeValueShape=()=>{
            let maxValue = options.max?options.max:1;
            // console.log(maxValue);
            // if(!maxValue) throw new Error("maxvalue"+maxValue);
            let endPortion = this.value / maxValue;
            if(endPortion>1) endPortion=1;
            //there's no good reason for using an arc.
            let maxCorners = 54;
            let lastPoint = [];
            let pathString = "";

            let corners = maxCorners * endPortion;

            for(let corner = 0; corner<corners; corner++){
                let nowPoint=[
                    Math.cos(Math.PI * 2 * corner/maxCorners) * options.radius,
                    Math.sin(Math.PI * 2 * corner/maxCorners) * options.radius,
                ];
                if(corner > 0){
                    pathString += `L ${nowPoint.join()} `
                }else{
                    pathString += `M ${nowPoint.join()}`;
                }
                lastPoint=nowPoint;
            }

            //add that last one bit
            let nowPoint=[
                Math.cos(Math.PI * 2 * endPortion) * options.radius,
                Math.sin(Math.PI * 2 * endPortion) * options.radius,
            ];
            pathString += `L ${nowPoint.join()} `
            

            valueShape.set("d",pathString);
        }
        
        const remakePath=()=>{
            let corners = 7;
            let lastPoint = [];
            let pathString = "";

            for(let corner = 0; corner<corners; corner++){
                let nowPoint=[
                    Math.cos(Math.PI * 2 * corner/corners) * options.radius * 0.6,
                    Math.sin(Math.PI * 2 * corner/corners) * options.radius * 0.6,
                ];
                if(corner > 0){
                    pathString += `L ${lastPoint.join()} ${nowPoint.join()} `
                }else{
                    pathString += `M ${nowPoint.join()}`;
                }
                lastPoint=nowPoint;
            }
            
            pathString += `z`;
            if(options.min !==false && options.max !==false){
                //knob direction indicator
                pathString += `M ${options.radius * 0.6},${0}`;
                pathString += `Q ${options.radius * 0.6},${0} ${0},${0}`
            }
            knobShape.set("d",pathString);
            remakeValueShape();
        }

        remakePath();

        const changeCallbacks=[];
        
        this.step=1/300;
        
        let pixValueOnDragStart;

        const distanceToValue=(pixels)=> pixels * this.step;
        const valueToPixels=(value)=> value / this.step ;
        const getAngle=()=>{
            let rpv = this.step * 300;
            if(options.min!==false && options.max!==false){
                let range = options.max - options.min;
                rpv = 1/range;
            }
            return rpv * this.value * 360;
        }

        const draggable = new components_Draggable(knobShape.domElement);

        draggable.dragStartCallback=()=>{
            pixValueOnDragStart = valueToPixels(this.value);
            if(isNaN(pixValueOnDragStart)) pixValueOnDragStart=0;
            this.domElement.classList.add("active");
        }

        draggable.dragEndCallback=()=>{
            this.domElement.classList.remove("active");
        }

        draggable.positionChanged=(newPosition)=>{
            //choose the lengthiest coord to define delta
            let theDistance = -newPosition.delta.y;
            let valueDelta = distanceToValue(theDistance);
            let newValue = deltaCurves[options.deltaCurve](valueDelta);
            
            newValue+=distanceToValue(pixValueOnDragStart);

            if(options.min !== false){
                if(newValue < options.min) newValue = options.min;
            }
            if(options.max !== false){
                if(newValue > options.max) newValue = options.max;
            }
            this.changeValue(
                newValue
            );
        }

        this.value=0;
        /** @param {Function} cb */
        this.onChange=(cb)=>{
            changeCallbacks.push(cb);
        }

        const handleChanged=(changes)=> changeCallbacks.map((cb)=>cb(changes));
        
        this.updateGraphic=()=>{
            knobShape.set("transform",`rotate(${getAngle()})`);
            nameText.set("text",options.name);
            valueText.set("text","~"+(utils_round(this.value,2)));

            if(options.min!==false&&options.max!==false){
                remakeValueShape();
            }
        }

        this.changeValue=(to)=>{
            this.value=to;
            this.updateGraphic();
            handleChanged({value:to});
        }
        
        /** 
         * @param {Module} module
         * @param {string} parameterName
         */
        this.setToModuleParameter=(module,parameterName)=>{
            
            let propertyObject = {};
            propertyObject=module.settings;
            options.name=parameterName;
            this.value=propertyObject[parameterName];

            this.onChange(({value})=>{
                propertyObject[parameterName] = value;
                module.set(propertyObject);
            });

            module.onUpdate((changes)=>{
                if(changes[parameterName]){
                    this.value=changes[parameterName];
                    this.updateGraphic();
                }
            });
            switch (parameterName){
                case "frequency":
                    this.setDeltaCurve("frequency");
                    this.setMinMax(0,22000);
                break;
                case "order":
                    this.setDeltaCurve("integer");
                    this.setMinMax(0,10);
                break;

                case "time":
                case "length":
                    this.setMinMax(0,5);
                break;
            }

            this.updateGraphic();
        }

        this.setMinMax=(min,max)=>{
            if(max<=min) console.warn("max<=min",min,max);
            options.min=min;
            options.max=max;
            remakePath();
            return this;
        }
        /**
         * @param {"integer"|"frequency"|"gain"|"channelvol"|"integer"|"periodseconds"} deltaCurve
         **/
        this.setDeltaCurve=(deltaCurve)=>{
            options.deltaCurve=deltaCurve;
            return this;
        }
    }
}

/* harmony default export */ const components_Knob = (Knob);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Clickable.js

const Clickable_VectorTypedef = __webpack_require__(147);

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */


/**
 * @typedef {Node} NodeWithClassList
 * @property {Set<string>} classList
 * @exports NodeWithClassList
 */



/**
 * @class Clickable
 * 
 * thing that can be dragged. It does not implement actual updating of position,
 * as it doesn't assume the object to have certain properties for position or 
 * certain render methods. The user must implement by using dragCallback function
 * override
 *  @constructor 
 *  @param {HTMLElement|SVGElement} domElement */
function Clickable(domElement){


    this.clickCallback=(mouse)=>{
    }
    this.releaseCallback=()=>{
    }

    domElement.addEventListener('mousedown',()=>this.clickCallback());
    domElement.addEventListener('mouseup',()=>this.releaseCallback());

    domElement.classList.add("clickable");
}

/* harmony default export */ const components_Clickable = (Clickable);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Toggle.js






let defaultToggleOptions = {
    x: 0, y: 0,
    width: 20,
    name: "toggle",
    class: "toggle",
    min: false, max: false,
}

class Toggle extends scaffolding_elements.Group {
    constructor(userOptions) {
        const options = {};
        Object.assign(options, defaultToggleOptions);
        Object.assign(options, userOptions);
        super(options);

        let nameText = new scaffolding_elements.Text({
            x: -options.radius,
            y: options.radius + 5
        });

        this.add(nameText);

        let buttonShape = new scaffolding_elements.Rectangle();
        let valueShape = new scaffolding_elements.Rectangle();
        this.add(valueShape);
        this.add(buttonShape);
        valueShape.set("fill", "none");
        valueShape.domElement.classList.add("knob-value-arc");

        const remakeValueShape = () => {
            valueShape.attributes.width = options.width - 6;
            valueShape.attributes.height = options.width - 6;

            valueShape.attributes.x = 3 - options.width/2;
            if (this.value) {
                valueShape.attributes.y = 3 - options.width;
            } else {
                valueShape.attributes.y = 3;
            }

            valueShape.update();
        }

        const remakePath = () => {
            buttonShape.attributes.width = options.width;
            buttonShape.attributes.height = options.width * 2;

            buttonShape.attributes.x = -options.width/2;
            buttonShape.attributes.y = -options.width;

            nameText.attributes["text-anchor"]="middle";
            nameText.attributes.y = options.width * 1.5;

            nameText.update();
            buttonShape.update();
            remakeValueShape();
        }

        remakePath();

        const changeCallbacks = [];

        const clickable = new components_Clickable(buttonShape.domElement);

        clickable.releaseCallback = () => {
            this.changeValue(this.value ? false : true);
        }

        this.value = false;

        /** @param {Function} cb */
        this.onChange = (cb) => {
            changeCallbacks.push(cb);
        }
        const handleChanged = (changes) => changeCallbacks.map((cb) => cb(changes));

        this.updateGraphic = () => {
            nameText.set("text", options.name);
            remakeValueShape();
        }

        this.changeValue = (to) => {
            this.value = to;
            this.updateGraphic();
            handleChanged({ value: to });
        }

        /** 
         * @param {Module} module
         * @param {string} parameterName
         */
        this.setToModuleParameter = (module, parameterName) => {

            let propertyObject = {};
            propertyObject = module.settings;
            options.name = parameterName;
            this.value = propertyObject[parameterName];

            this.onChange(({ value }) => {
                propertyObject[parameterName] = value;
                module.set(propertyObject);
            });

            module.onUpdate((changes) => {
                if (changes[parameterName]) {
                    this.value = changes[parameterName];
                    this.updateGraphic();
                }
            });
            this.updateGraphic();
        }
    }
}

/* harmony default export */ const components_Toggle = (Toggle);
;// CONCATENATED MODULE: ./src/DomInterfaces/config/placement.js
/* harmony default export */ const placement = ({
    patcher:{
        width:150, // pixels
    },
    

});
;// CONCATENATED MODULE: ./src/utils/ValuePixelTranslator.js



/**
 * @export @typedef {{
*  rangeAmplitude:number,
*  rangeSamples:number,
*  centerAmplitude:number,
*  firstSample:number,
*  width:number,
*  height:number,
*  model:Model,
* }} ValuePixelTranslatorParams
*/
/**
 * @export @typedef {Object} ValuePixelChanges 
 * @param {number} [rangeAmplitude]
 * @param {number} [centerAmplitude]
 * @param {number} [width]
 * @param {number} [height]
 * @param {Model} [model]
 * }} 
*/
    
class ValuePixelTranslator {
    /**
     * reference to settings objects, which may be changed at runtime
     * causing changes in the scale in this object.
     * @param {ValuePixelTranslatorParams} settings
    */
    constructor(settings) {
        const model = settings.model;
        const modelSettings = model.settings;
        this.settings=settings;
        
        let changedListeners = [];
        /**
         * @param {Function}  callback
         */
        this.onChange = (callback)=>{
            changedListeners.push(callback);
            ValuePixelTranslator.onChange(callback);
        }

        /** if you manually change some parameters, call this after, so that it can trigger the listeners accordingly. */
        this.handleChanged = (changes)=>{
            changedListeners.map((cb)=>cb(changes));
        }

        /**
         * Use this to change parameters such as zoom, center etc. and call any listener.
         * Also, call this without argument to just call the callbacks; for example when you need to get the initial state represented.
         * @param {ValuePixelChanges} settings 
         */
        this.change=(settings={})=>{
            Object.assign(this.settings,settings);
            this.handleChanged(settings);
        }

        /**
         * handy function to set the zoom/pan in such way that maxValue translates to maxPixel
         */
        this.coverVerticalRange=(minValue,maxValue)=>{
            const range=maxValue-minValue;
            this.change({
                rangeAmplitude: range,
                centerAmplitude: minValue + (range/2),
            });
        };

        /** pixel number to amplitude */
        this.yToAmplitude = (y) => {
            const {
                rangeAmplitude,height,
                centerAmplitude
            } = settings;
            const center=height/2;
            return  (centerAmplitude) - (y - center) * (rangeAmplitude / height);
        };

        /** amplitude to pixel number */
        this.amplitudeToY = (amplitude) => {
            const {
                rangeAmplitude,height,
                centerAmplitude
            } = settings;
            const center=height/2;
            return  ( centerAmplitude * height - amplitude * height ) / rangeAmplitude + center;
        };

        /** pixel number to sample number */
        this.xToSampleNumber = (x) => {
            let sampleNumber =  Math.floor(
                ValuePixelTranslator.shared.rangeSamples  * x / settings.width
            );
            return sampleNumber + ValuePixelTranslator.shared.firstSample;
        };

        /** sample number to pixel number */
        this.sampleNumberToX = (sampleNumber) => {
            sampleNumber -= ValuePixelTranslator.shared.firstSample;
            return Math.floor(settings.width * sampleNumber / ValuePixelTranslator.shared.rangeSamples);
        };

        /** convert pixel number into time in seconds */
        this.xToSeconds = (x)=>{
            return this.xToSampleNumber(x) / sampleRate;
        }
        /** convert time in seconds into pixel number  */
        this.secondsToX = (time)=>{
            return this.sampleNumberToX(time * sampleRate);
        }
    }
}

ValuePixelTranslator.shared = {
    rangeSamples:sampleRate,
    firstSample:0,
}


ValuePixelTranslator.changedListeners = [];
/**
 * @param {Function}  callback
 */
ValuePixelTranslator.onChange = (callback)=>{
    ValuePixelTranslator.changedListeners.push(callback);
}
/** if you manually change some parameters, call this after, so that it can trigger the listeners accordingly. */
ValuePixelTranslator.handleChanged = (changes)=>{
    ValuePixelTranslator.changedListeners.map((cb)=>cb(changes));
}
/**
 * Use this to change parameters such as zoom, center etc. and call any listener.
 * Also, call this without argument to just call the callbacks; for example when you need to get the initial state represented.
 * @param {ValuePixelChanges} settings 
 */
ValuePixelTranslator.change=(settings={})=>{
    Object.assign(ValuePixelTranslator.shared,settings);
    ValuePixelTranslator.handleChanged(settings);
}


/* harmony default export */ const utils_ValuePixelTranslator = (ValuePixelTranslator);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Lane.js











const sizes = placement;

const Lane_VectorTypedef = __webpack_require__(147);

/**
 * @typedef {VectorTypedef.MiniVector} MiniVector
 */

/**
 * @typedef {Object} LaneOptions
 * @property {number} [x] 
 * @property {number} [y] 
 * @property {number} [width]
 * @property {number} [height]
 * @property {Module} model
 * @property {string} [name]
 * @property {Canvas} drawBoard
 * @exports LaneOptions
 */


/**
 * @class Lane
 * @extends Group
 * */
class Lane extends scaffolding_elements.Group {
    /**
     * @param {ValuePixelTranslator} translator
     * @param {LaneOptions} options
     */
    constructor(translator,options) {

        const { model, drawBoard } = options;
        const settings = const_typicalLaneSettings(model,drawBoard);
        Object.assign(settings, options);

        super(settings);


        this.domElement.classList.add("lane"),

            this.autoZoom = () => { }

        // this.settings=settings;

        /** @type {function[]} */
        const movedCallbacks = [];
        /** @param {function} callback */
        this.onMoved = (callback) => {
            movedCallbacks.push(callback);
        }

        const handleMoved = () => {
            movedCallbacks.map((cb) => cb());
        }

        model.interfaces.add(this);

        const handleRect = new scaffolding_elements.Rectangle({
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.height,
            fill: "transparent",
        });

        handleRect.domElement.classList.add("lane-handle");

        //position this lane at a distance from top, proportional to it's height,
        this.handyPosition = (posNumber) => {
            draggable.setPosition({
                y: posNumber * (settings.height + 5)
            });
            handleMoved();
            return this;
        }

        let controlsCount = 0;

        const widthPerControl = 40;
        const controlPanelTop = 10;
        const controlPanelRight = 30;
        const controlPanelHeight = 70;
        const controlsCenterTop = 26;
        const controlPanelBackground = new scaffolding_elements.Rectangle();
        const controlPanel = new scaffolding_elements.Group();

        let controlPanelAppended = false;
        const updateControlsBg = () => {
            if (controlsCount > 0 && !controlPanelAppended) {
                this.contents.add(controlPanel);
                controlPanel.add(controlPanelBackground);
                controlPanelAppended = true;
            }
            const cc1 = controlsCount + 1;
            controlPanel.attributes.class="control-panel";
            controlPanel.attributes.width = controlPanelWidth;
            controlPanel.attributes.x = options.width - controlPanelWidth - controlPanelRight;
            controlPanel.attributes.y = controlPanelTop;
            controlPanel.attributes.height = controlPanelHeight;

            controlPanelBackground.attributes.class="background";
            controlPanelBackground.attributes.width=controlPanel.attributes.width;
            controlPanelBackground.attributes.height=controlPanel.attributes.height;

            controlPanel.update();
            controlPanelBackground.update();
        }
        let controlPanelWidth = 20;
        
        /** @param {Component} component */
        this.appendToControlPanel = (component,width=widthPerControl) => {
            controlsCount++;
            updateControlsBg();

            controlPanelWidth += width/2;
            component.attributes.x= controlPanelWidth;
            component.attributes.y= controlsCenterTop;
            controlPanelWidth += width/2;

            component.update();
            controlPanel.add(component);
        }
        /** @param {string} parameterName */
        this.addKnob = (parameterName) => {
            const newControl = new components_Knob();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(model, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }
        /** @param {string} parameterName */
        this.addToggle = (parameterName) => {
            const newControl = new components_Toggle();
            this.appendToControlPanel(newControl);
            newControl.setToModuleParameter(model, parameterName);
            controlPanel.add(newControl);
            return newControl;
        }


        const draggable = new components_Draggable(handleRect.domElement);
        draggable.setPosition(settings);
        draggable.positionChanged = (newPosition) => {
            settings.y = newPosition.y;
            this.set("y", newPosition.y);
            handleMoved();
            return;

            // handleRect.attributes.x = settings.x;
            handleRect.attributes.y = settings.y;
            handleRect.update();

            // this.contents.attributes.x = settings.x;
            this.contents.attributes.y = settings.y;
            this.contents.update();
            handleMoved();
        };

        this.add(handleRect);

        this.contents = new scaffolding_elements.Group({
            x: settings.x, y: settings.y,
            width: settings.width, height: settings.height,
            name: "contents"
        });

        //add graphs to input and output
        //TODO: encapsulate
        this.add(this.contents);
        /** @typedef {{x:number,y:number,input:InputNode,absolute:MiniVector}} inputPosition */
        /** @type {Object<String,inputPosition>|undefined} */
        const inputPositions={};
        /** @returns {Object<String,inputPosition>} */
        this.getInputPositions = () => {
            Object.keys(model.inputs).map((inputName, index) => {
                const newInputPosition = {
                    x: settings.width + 10,
                    y: settings.height - index * 20 - 10,
                    absolute: {},
                    input: model.inputs[inputName],
                };
                newInputPosition.absolute.x = newInputPosition.x + settings.x;
                newInputPosition.absolute.y = newInputPosition.y + settings.y;
                if(inputPositions[inputName]) delete inputPositions[inputName];
                inputPositions[inputName] = newInputPosition;
            });
            // }
            return inputPositions;
        }

        this.getOutputPosition = () => {
            let ret = {
                x: settings.width + 10,
                y: 0,
            }
            ret.absolute = {
                x: ret.x + settings.x,
                y: ret.y + settings.y + 5,
            };
            return ret;
        };


        const InputGraph = function (inputPositions, name, container) {
            const inputPosition = inputPositions[name];
            const optxt = new scaffolding_elements.Text({
                x: inputPosition.x + 10, y: inputPosition.y + 5,
                text: name,
            });
            container.add(optxt);
            const rect = new scaffolding_elements.Rectangle({
                x: inputPosition.x - 5,
                y: inputPosition.y - 5,
                width: 10,
                height: 10,
            });
            container.add(rect);
            this.updatePosition = () =>{

                optxt.set("x",inputPositions[name].x + 10);
                rect.set("x",inputPositions[name].x - 5);
            }
        }

        const OutputGraph = function (parent,container) {
            let position=parent.getOutputPosition();
            const rect = new scaffolding_elements.Rectangle({
                x: position.x,
                y: position.y,
                width: 80,
                height: 10,
            });

            container.add(rect);
            this.updatePosition=()=>{
                position=parent.getOutputPosition();
                rect.set("x",position.x);
            }
        }

        this.getInputPositions();
        const myInputGraphs = Object.keys(inputPositions).map((name)=>{
            return new InputGraph(inputPositions, name, this.contents)
        });
        const myOutputGraph = new OutputGraph(this,this.contents);


        const updateSize = () => {
            const newWidth = drawBoard.size.width - sizes.patcher.width;
            settings.width = newWidth;
            translator.change({
                width:newWidth
            });

            this.getInputPositions();
            myInputGraphs.forEach((ig)=>ig.updatePosition());
            myOutputGraph.updatePosition();
        }

        translator.onChange(()=>{
            const newWidth=translator.settings.width;
            handleRect.set("width",newWidth);

            controlPanel.set(
                "x",
                newWidth - controlPanelWidth - controlPanelRight
            );
        });

        drawBoard.size.onChange(()=>updateSize());

        const title = new scaffolding_elements.Text({
            x: 10, y: 0,
            text: settings.name
        });

        this.contents.add(title);
    }
};

/* harmony default export */ const components_Lane = (Lane);
;// CONCATENATED MODULE: ./src/scaffolding/Model.js


class Model {
    constructor(settings) {
        const redrawList = [];
        /** @type {Set<Lane>} */
        this.interfaces=new Set();
        /** @returns {Lane|undefined} */
        this.getInterface = ()=>this.interfaces.values().next().value;
        this.settings = settings;
        //interface uses this method to conect changes in model to redrawss
        this.onUpdate = (newCallback) => {
            if (typeof newCallback !== "function")
                throw new Error(`Callback has to be function but it is ${typeof newCallback}`);
            redrawList.push(newCallback);
        };
        //model uses this method to notify changes to the interface
        this.changed = (changes = {}) => {
            redrawList.map((cb) => { cb(changes); });
        };

        this.set=(changes = {})=>{
            Object.assign(this.settings,changes);
            this.changed(changes);
            return this;
        }
        //get the initial state of the model
        this.triggerInitialState = () => { };
    }
}
/* harmony default export */ const scaffolding_Model = (Model);
;// CONCATENATED MODULE: ./src/SoundModules/Module.js




let count = 0;

/**
 * @namespace SoundModules
 */

/**
 * @class Module
 * @extends Model
 */
class Module extends scaffolding_Model{
    constructor(settings) {
        // Model.call(this, settings);
        super(settings);
        this.unique = count ++;
        this.name = this.constructor.name + "-" + this.unique;
        this.cachedValues = [];
        /** @type {Object<string, InputNode>} */
        this.inputs = {};
        /** @type {Set<InputNode>} */
        this.outputs = new Set();

        /**
         * @function hasInput defines an input for this module. This function is intended to be called only within a child's constructor. After an input has been created with this module, it will be possible for other modules to connect to this input, and for the module to get values from it.
         * @param inputName
         */
        this.hasInput = (inputName) => {
            this.inputs[inputName] = new SoundModules_InputNode(this);
        };

        /**
         * @function eachInput run a callback function for each of the InputNodes. This saves the trouble of iterating each input. This function is intended to be called only from within the recalculate function.
         * @param {Function} callback
         */
        this.eachInput = (callback) => {
            Object.keys(this.inputs).forEach((inputName, index) => {
                const input = this.inputs[inputName];
                if (input.input)
                    callback(input, index, inputName);
            });
        };

        this.eachOutput = (callback) => {
            this.outputs.forEach(callback);
        }

        /** 
         * @function connectTo connect the output of this module to one input of another module. The module's produced samples will affect the inputNode's owner according to the module's recalculate function
         * @param {InputNode} inputNode */
        this.connectTo = (inputNode) => {
            if(!(inputNode && inputNode.isInputNode)) throw new Error("you can only connect to InputNodes");
            if(inputNode.input) inputNode.input=undefined;
            inputNode.input = this;
            this.outputs.add(inputNode);
            this.changed({
                outputs:this.outputs,
            });
        };
        /** 
         * @function disconnect disconnect this module from an input node. The module will not cause effects in the other module's input any more.
         * @param {InputNode | false } inputNode if not given, it will disconnect all the modules to which this module outputs
         */
        this.disconnect = (inputNode = false) => {
            if(inputNode){
                if (inputNode.input) {
                    inputNode.input=undefined;
                }
                this.outputs.delete(inputNode);
                this.changed({
                    outputs:this.outputs,
                });
            }else{
                this.eachOutput(this.disconnect);
            }
        };
        
        this.set=(changes = {})=>{
            Object.assign(this.settings,changes);
            this.changed(changes);
            this.cacheObsolete();
            return this;
        }

        let useCache = false;

        /**
         * Call this function to set the `useCache` flag to true, therefore indicating the module that it's samples cache needs no recalculation.
         * This function is probably not needed anywhere else than within `Module`'s source file.
         */
        this.useCache = () => {
            useCache = true;
            this.changed({ useCache });
        };
        /**
         * Call this function to set the `useCache` flag to false, therefore indicating the module that it's sample cache needs to be calculated again. If one parameter is changed in the module, for example, one might want to call this function.
         * Note that any module might trigger recalculation on any of it's input modules, when it requests their samples.
         * @param {boolean} calculate indicates whether to recalculate the cache right away. @default true
         */ 
        this.cacheObsolete = (calculate = true) => {
            useCache = false;
            this.changed({ useCache });
            if(calculate) this.getValues(0);
        };
        /**
         * used to get the values from the module, or to cause the module to recalculate its values.
         * @returns {Array<number>} the sound array, sample by sample.
         * The samples will get recalculated if it's useCache flag is set to true. Otherwise, this function will return the cached samples.
         * The user can also get the cached samples by simply getting the `cachedValues` property, in which case one might get outdated samples.
         */
        this.getValues = (recursion = 0) => {
            if (recursion > maxRecursion)
                throw new Error("max recursion reached");
            if (!useCache) {
                this.recalculate(recursion + 1);
                this.changed({ cachedValues: this.cachedValues });
                this.useCache();
                //if my cache changes, it means all my output modules need recalculation
                this.outputs.forEach((outputModule) => outputModule.cacheObsolete());
            }
            return this.cachedValues;
        };
        /** 
         * Calculate the output samples, filling the cachedValues property. This function is extended by each different Module with their own calculation function
         *  this.recalculate has to fill the this.cachedValues array
         */
        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            this.changed({ cachedValues: this.cachedValues });
        };
        /**
         * Trigger all the model change functions, so that any other object listening to this model's properties get the initial status of the module.
         */
        this.triggerInitialState = () => {
            this.getValues();
            this.changed({ useCache });
        };
    }
}
/* harmony default export */ const SoundModules_Module = (Module);
;// CONCATENATED MODULE: ./src/DomInterfaces/PatchDisplay.js




const pathTypes = __webpack_require__(686);

/** @typedef {pathTypes.PathOptions} PathOptions */

/**
 * @namespace DomInterface.PatchDisplay
 */

 /*
 * TODO: interfaces should also extend model, so that changes to interface can be tracked better.
 */

/**
 * @typedef {{x:number,y:number}} MiniVector
 */

/** 
 * @class PatchDisplay
 * @extends Group
 */
class PatchDisplay extends scaffolding_elements.Group{
    /** 
     * @param {Canvas} drawBoard 
     * 
     * */

    constructor(drawBoard){
        super();
        /** @type {Path[]} */
        const lines=[];
        
        /** @type {Set<Module>}  */
        const myAppendedModules=new Set();


        this.appendModules=(...modules)=>{
            modules.map(this.appendModule);
        }
        /** @param {Module} module */
        this.appendModule=(module)=>{
            
            myAppendedModules.add(module);

            module.onUpdate((changes)=>{
                if(changes.outputs){
                    updatePatchLines();
                }
            });

            const modInterface=module.getInterface();
            if(modInterface) modInterface.onMoved(updatePatchLines);

            updatePatchLines();
        }

        const updatePatchLines=()=>{
            /** @type {Array<PathOptions>} */
            const coords = [];

            /**
             * @param {Module} fromModule
             * @param {InputNode} toInput 
             */
            const appendCoord=(fromModule,toInput)=>{
                const modulesInterface=fromModule.getInterface();
                const otherModulesInterface=toInput.owner.getInterface();
                if(!modulesInterface) return;
                if(!otherModulesInterface) return;

                const othersModuleInputCoordinates = otherModulesInterface.getInputPositions();
                let filteredCoordinates=[];
                Object.keys(othersModuleInputCoordinates).map((opname)=>{
                    const outputCoordinates=othersModuleInputCoordinates[opname];
                    if(outputCoordinates.input===toInput){
                        filteredCoordinates.push(outputCoordinates);
                    }
                })
                filteredCoordinates.map((filteredCoord)=>{
                    const startPos = modulesInterface.getOutputPosition().absolute;
                    const endPos = filteredCoord.absolute;
                    
                    let bez=Math.abs(startPos.y-endPos.y) / 5;

                    coords.push({
                        d:`M ${endPos.x}, ${startPos.y}
                            C ${endPos.x + bez}, ${startPos.y}
                              ${endPos.x + bez}, ${endPos.y}
                              ${endPos.x}, ${endPos.y}
                            `
                    });
                });
            }

            //for each of my modules
            myAppendedModules.forEach((module)=>{
                //for each input of that module
                
                module.eachInput((input,index,name)=>{
                    const otherModule = input.input;
                    // console.log("m["+module.unique+"]->m["+otherModule.unique+"]."+name);
                    appendCoord(otherModule,input);
                });
            });

            lines.forEach((line)=>{
                Object.assign(line.attributes,{d:""});
            });
            coords.forEach((coord,i)=>{
                if(!lines[i]){
                    lines[i]=new scaffolding_elements.Path();
                    lines[i].domElement.addEventListener('click',(evt)=>lines[i].domElement.classList.toggle("highlight"));
                    this.add(lines[i]);
                }
                Object.assign(lines[i].attributes,coord);
                lines[i].attributes.class="patchcord";
            });

            lines.forEach((line)=>{
                line.update();
            });

            drawBoard.size.onChange(()=>{
                updatePatchLines();
            });


        }



    }
}
/* harmony default export */ const DomInterfaces_PatchDisplay = (PatchDisplay);
;// CONCATENATED MODULE: ./src/scaffolding/Canvas.js

//only for type:


function Canvas(){
    // const element = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    const element =  document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    this.element = element;
    
    // element.setAttribute('viewBox',"0 0 1000 1000");
    element.setAttribute('width',"100%");
    element.setAttribute('height',"1000px");
    
    document.body.appendChild(element);

    /** @param {{domElement:Node}} elem */
    this.add=(elem)=>{
        element.appendChild(elem.domElement);
    }

    const sizeChangeCallbacks = [];
    this.size = {
        width:0,
        height:0,
        onChange:(callback)=>sizeChangeCallbacks.push(callback)
    }

    //something is causing an infinite call cycle, this is a hacky patch for that.
    let doSize=false;
    setInterval(()=>{
        if(doSize){
            this.size.width=window.outerWidth;
            this.size.height=window.outerHeight;
            sizeChangeCallbacks.forEach((callback)=>callback());
            doSize=false;
            console.log("recalc size");
        }
    },1000);

    const recalcSize = () => {
        doSize=true;
    }
    
    const scrollChangeCallbacks = [];
    this.scroll = {
        top:0,
        left:0,
        onChange:(callback)=>scrollChangeCallbacks.push(callback)
    }
    const recalcScroll = () => {
        this.scroll.top=window.scrollX;
        this.scroll.left=window.scrollY;
        scrollChangeCallbacks.forEach((callback)=>callback());
    }

    window.addEventListener("resize",recalcSize);
    window.addEventListener("scroll",recalcScroll);
    window.addEventListener("DOMContentLoaded",()=>{
        recalcSize();
        recalcScroll();
    });

}

/* harmony default export */ const scaffolding_Canvas = (Canvas);
;// CONCATENATED MODULE: ./src/DomInterfaces/TimeZoomer.js




class TimeZoomer extends scaffolding_elements.Group {
    constructor() {
        super();
        const maxSample = 44100 * 4;

        let maxPixel;
        let samplePerPixel ;

        let minx;
        let maxx;

        console.log(maxPixel);

        const panRect = new scaffolding_elements.Rectangle({
            class: "time-pan draggable",
        });
        const zoomRect = new scaffolding_elements.Rectangle({
            class: "time-zoom draggable",
        });

        const rectXToSampleN=(x)=> maxSample * x / (window.innerWidth-panRect.attributes.width);

        const updateGraph = () => {
            
            maxPixel = window.innerWidth;
            samplePerPixel =  (maxPixel-(panRect.attributes.width||0))/maxSample;
            
            panRect.attributes.width = utils_ValuePixelTranslator.shared.rangeSamples * samplePerPixel;
            panRect.attributes.x = utils_ValuePixelTranslator.shared.firstSample * samplePerPixel;
            panRect.attributes.height = 10;

            const zoomSize = 10;

            zoomRect.attributes.width = panRect.attributes.width + zoomSize * 2;
            zoomRect.attributes.x = panRect.attributes.x - zoomSize;
            zoomRect.attributes.height = panRect.attributes.height;
            
            panRect.update();
            zoomRect.update();
        }

        updateGraph();

        utils_ValuePixelTranslator.onChange(()=>updateGraph());
        
        //zoomrect lies behind, so that you can drag each side.
        this.add(zoomRect);
        this.add(panRect);

        let panDraggable = new components_Draggable(panRect.domElement);
        panDraggable.positionChanged = (pos)=>{
            let positionInRange = rectXToSampleN(pos.x);
            if(positionInRange<0) positionInRange=0;
            // if(pos.x>maxx) pos.x=maxx;
            // if(positionInRange>maxSample || positionInRange<0) return;
            this.pan(Math.floor(positionInRange));
        };

        let zoomDraggable = new components_Draggable(zoomRect.domElement);
        zoomDraggable.positionChanged = (pos)=>{
            let positionInRange = rectXToSampleN(pos.x);

            // if(positionInRange>maxSample || positionInRange<0) return;
            this.zoom(Math.floor(positionInRange));
        };

        this.zoom = (l) => {
            return utils_ValuePixelTranslator.change({ rangeSamples: l });
        };
        this.pan = (l) => {
            // console.log("pan",l);
            return utils_ValuePixelTranslator.change({ firstSample: l });
        };
    }

}

/* harmony default export */ const DomInterfaces_TimeZoomer = (TimeZoomer);
;// CONCATENATED MODULE: ./src/scaffolding/SoundPlayer.js






class SoundPlayer{
    constructor(){
        /** @type {AudioBufferSourceNode|false} */
        var source=false;
        const myGain = audioContext.createGain();
        myGain.gain.value=1;
        myGain.connect(audioContext.destination);
        
        /** @type {Module|false} */
        let myModule = false;
        let playing = false;

        var magicPlayer = (function() {
            //playing position in the original module, from where we source sound
            let sourcePlayhead=0;
            //how long each period
            var bufferSize = 2048;
            //get a curve to fade in/out old and new "peeked" buffer (click prevention)
            const fadeCurveFunction = (v) => {
                return (1-Math.cos(Math.PI * v))/2;
            }
            //makes a slice from the module's buffer in a circular way
            const getCircularSlice=(start,length)=>{
                let returnBuffer = [];
                if(myModule){
                    start %= myModule.cachedValues.length;
                    let sliceStart = start;
                    let sliceEnd = (start+length) % myModule.cachedValues.length
    
                    returnBuffer = myModule.cachedValues.slice(
                        start,
                        start+length
                    );
    
                    //if the current period will reach beyond the length of audio loop
                    if(sliceEnd<sliceStart){
                        let append = myModule.cachedValues.slice(
                            0,
                            sliceStart-sliceEnd
                        );
                        returnBuffer = returnBuffer.concat(append);
                    }
                }
                return returnBuffer;
            }
            //the foreseen period, in the state it was on the last period
            /** @type {false|Array<number>} */
            let peekedPeriod = false;
            let interpolationSpls = bufferSize;

            var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function(e) {
                
                //make a copy of the buffer for this period. This will let us interpolate,
                //preventing the clicks caused by buffer changes while playing.
                //note that the frequency response of the interpolation changes 
                //in function of the bufferSize selection.
                let currentBuffer = getCircularSlice(sourcePlayhead,bufferSize);
                // var input = e.inputBuffer.getChannelData(0);
                var output = e.outputBuffer.getChannelData(0);

                for (var i = 0; i < bufferSize; i++) {
                    
                    if(playing && myModule){
                        let nowWeight = fadeCurveFunction(i/interpolationSpls);
                        if(nowWeight>1) nowWeight=1;
                        let nextWeight = 1-nowWeight;
                        //current sonic contents fading in...
                        output[i] = currentBuffer[i] * nowWeight;
                        if(peekedPeriod){
                            //and the previously expected sonic contents fading out.
                            //clipped, for security.
                            output[i] += Math.min(1,peekedPeriod[i] * nextWeight);
                        }
                    }else{
                        output[i]=0;
                    }
                }
                sourcePlayhead += bufferSize;
                if(myModule) sourcePlayhead %= myModule.cachedValues.length;

                //peek into next period, so that in next lap we interpolate
                peekedPeriod = getCircularSlice(sourcePlayhead,bufferSize);
            }
            return node;
        })();

        magicPlayer.connect(myGain);

        let position={
            x:-15,
            y:-10,
            width:30,
            height:20,
            spacing:5,
        }

        const everyPlayButton=[];
        /** @param {Module} module */
        this.appendModule = (module)=>{


            console.log("module appended to player");
            //rect
            let c1=`${position.x}, ${position.y}`;
            let c2=`${position.x + position.width}, ${position.y}`;
            let c3=`${position.x + position.width}, ${position.y + position.height}`;
            let c4=`${position.x}, ${position.y + position.height}`;
            let triW = position.width / 5;
            let triH = position.width / 5;
            let triStartX = position.x + position.width/2 - triW/2;
            let triStartY = position.y + position.height/2 - triH/2;
            //tri
            let c5=`${triStartX}, ${triStartY}`;
            let c6=`${triStartX + triW}, ${triStartY + triH / 2}`;
            let c7=`${triStartX}, ${triStartY + triH}`;

            const playButton = new scaffolding_elements.Group();

            let path = new scaffolding_elements.Path({
                d: `M ${c1}
                    L ${c2} 
                    L ${c3} 
                    L ${c4}
                    z
                    M ${c5}
                    L ${c6}
                    L ${c7}
                    z`,
            });


            playButton.add(path);

            playButton.domElement.setAttribute("class","button play");
            everyPlayButton.push(playButton);
            module.getInterface().appendToControlPanel(
                playButton,
                position.width + 10
            );
            
            module.onUpdate((changes)=>{
                if(changes.cachedValues){
                    // this.updateBuffer();
                }
            });
            
            playButton.domElement.addEventListener('mousedown',(evt)=>{
                if(playButton.domElement.classList.contains("active")){

                    console.log("stop");
                    this.stop();
                    
                    everyPlayButton.map((otherButton)=>{
                        otherButton.domElement.classList.remove("active");
                    });
                }else{

                    everyPlayButton.map((otherButton)=>{
                        otherButton.domElement.classList.remove("active");
                    });

                    console.log("play");
                    playButton.domElement.classList.add("active");
                    this.setModule(module,true);

                }

            });
            
        }

        /** @param {Module} module */
        this.setModule = (module,start=false)=>{
            myModule=module;
            if(start) playing=true;
        }

        // this.updateBuffer = ()=>{
        //     if(!buffer) return;
        //     if(!myModule) return;
        //     //not possible for now
        // }

        // /** @type {AudioBuffer|false} */
        // let buffer=false;

        this.stop = ()=>{
            playing=false;
        }
    }
}
/* harmony default export */ const scaffolding_SoundPlayer = (SoundPlayer);
// EXTERNAL MODULE: ./node_modules/seedrandom/index.js
var seedrandom = __webpack_require__(377);
var seedrandom_default = /*#__PURE__*/__webpack_require__.n(seedrandom);
;// CONCATENATED MODULE: ./src/SoundModules/Oscillator.js




/**
 * @namespace SoundModules.Oscillator
 */

const defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    frequency:2,
    phase:0,
    shape:"sin",
};

/** 
 * @typedef {Object} OscillatorOptions
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [phase]
 * @property {"sin"|"cos"|"ramp"|"noise"|"offset"} [shape]
 */
/**
 * @class Oscillator 
 * @extends Module
 */
class Oscillator extends SoundModules_Module{
    /**
     * @param {OscillatorOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        let phaseAccumulator = 0;
        const accumulatePhase = (frequency) => {
            phaseAccumulator += frequency / sampleRate;
        };
        
        let rng=seedrandom_default()();

        const shapes = {
            sin: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.sin(phaseAccumulator * Math.PI * 2) * amplitude
                    + bias;
            },
            cos: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return Math.cos(phaseAccumulator * Math.PI * 2) * amplitude
                    + bias;
            },
            ramp: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (phaseAccumulator % 1 - 0.5) * amplitude
                    + bias;
            },
            square: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (((phaseAccumulator % 1 ) > 0.5)?1:-1) * amplitude
                    + bias;
            },
            noise: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return (rng() - 0.5) * amplitude
                    + bias;
            },
            offset: (frequency, amplitude,bias) => {
                accumulatePhase(frequency);
                return amplitude + bias;
            }, 
        };

        super(settings);

        this.hasInput("frequency");
        this.hasInput("amplitude");
        this.hasInput("bias");

        this.setFrequency = (to) => {
            settings.frequency = to;
            this.changed({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };
        this.setAmplitude = (to) => {
            settings.amplitude = to;
            this.changed({
                amplitude: to
            });
            this.cacheObsolete();
            return this;
        };
        
        this.setShape = (to) => {
            settings.shape = to;
            this.changed({
                shape: to
            });
            this.cacheObsolete();
            return this;
        };
        
        this.setPhase = (to) => {
            return this.set({
                phase: to
            });
        };
        
        this.recalculate = (recursion = 0) => {
            phaseAccumulator = settings.phase;
            this.cachedValues=[];
            const lengthSamples = settings.length * sampleRate;
            if (!shapes[settings.shape])
            throw new Error(`
                Wave shape function named ${settings.shape}, does not exist. 
                Try: ${Object.keys(shapes).join()}
            `);
            
            const freqInputValues = this.inputs.frequency.getValues(recursion);
            const ampInputValues = this.inputs.amplitude.getValues(recursion);
            const biasInputValues = this.inputs.bias.getValues(recursion);
            
            //for noise, lets us have always the same noise. Frequency will be the seed
            rng=seedrandom_default()(settings.frequency);

            for (let a = 0; a < lengthSamples; a++) {
                const freq = (freqInputValues[a] || 0) + settings.frequency;
                const amp = (ampInputValues[a] || 0) + settings.amplitude;
                const bias = (biasInputValues[a] || 0) + settings.bias;
                this.cachedValues[a] = shapes[settings.shape](freq, amp, bias);
            }

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Oscillator = (Oscillator);
;// CONCATENATED MODULE: ./src/SoundModules/Mixer.js


/**
 * @namespace SoundModules.Mixer
 */

const Mixer_defaultSettings={
    amplitude:1,
    levela:0.25,
    levelb:0.25,
    levelc:0.25,
    leveld:0.25,
};
/**
 * @class Mixer
 * @extends Module
 */
class Mixer extends SoundModules_Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Mixer_defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        
        super(settings);

        this.hasInput("a");
        this.hasInput("b");
        this.hasInput("c");
        this.hasInput("d");

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            let result=[];
            let first = true;
            this.eachInput((input,inputno,inputName) => {
                const inputValues = input.getValues(recursion);
                inputValues.map((val, index) => {
                    if(!result[index]) result[index]=0;
                    result[index] += (val) * amplitude * settings["level"+inputName];
                });
            });
            this.cachedValues=result;
        
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Mixer = (Mixer);
;// CONCATENATED MODULE: ./src/SoundModules/operators/Operator.js


class Operator{
    constructor(){
        this.reset=()=>{}
        this.calculateSample=(sample)=>{
            return sample;
        }
    }
}

/* harmony default export */ const operators_Operator = (Operator);
;// CONCATENATED MODULE: ./src/SoundModules/operators/BasicDelay.js

//just average, only takes sample into account
class BasicDelay extends operators_Operator{
    constructor(){
        super();
        this.delayCache;

        this.reset=()=>{
            this.delayCache=[];
        }

        this.calculateSample=(sample,lengthSamples)=>{
            let len = this.delayCache.push(sample);
            if(len > lengthSamples){
                this.delayCache.splice(0,this.delayCache.length-lengthSamples);
            }
            return this.delayCache[0];
        }
        
        this.reset();
    }
}

/* harmony default export */ const operators_BasicDelay = (BasicDelay);
;// CONCATENATED MODULE: ./src/utils/valueOrZero.js
const voz=(val)=>val?val:0;
/* harmony default export */ const valueOrZero = (voz);
;// CONCATENATED MODULE: ./src/SoundModules/Delay.js





/**
 * @namespace SoundModules.Module
 */

const Delay_defaultSettings={
    feedback:0.5,
    time:0.2, //seconds
    dry:1,
    wet:0.5,
};

/**
 * @class Delay
 * @extends Module
 */
class Delay extends SoundModules_Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Delay_defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        super(settings);

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");

        let operator = new operators_BasicDelay();
        
        this.recalculate = (recursion = 0) => {

            this.cachedValues = [];
            operator.reset();
            
            let inputValues = this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);
            
            inputValues.map((value,sampleNumber)=>{
                this.cachedValues[sampleNumber] = 0;
                
                let currentTimeLevel = valueOrZero(timeLevels[sampleNumber]) + delayInSamples;
                
                if(sampleNumber>currentTimeLevel){
                    let timeAgo=sampleNumber - currentTimeLevel;
                    value += (this.cachedValues[timeAgo] + inputValues[timeAgo])
                        * (settings.feedback + valueOrZero(feedbackLevels[sampleNumber]));
                }

                this.cachedValues[sampleNumber]+=operator.calculateSample(value,currentTimeLevel);
                
            });

            //mix dry and wet
            this.cachedValues.map((val,sampleNumber)=>{

                this.cachedValues[sampleNumber] = this.cachedValues[sampleNumber] * settings.wet 
                    + inputValues[sampleNumber] * settings.dry;
                
            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Delay = (Delay);
;// CONCATENATED MODULE: ./src/utils/saturate1.js

const saturate1 = (val) => {
    if(val>1) val=1; 
    if(val<-1) val=-1;
    return val;
}

/* harmony default export */ const utils_saturate1 = (saturate1);
;// CONCATENATED MODULE: ./src/SoundModules/operators/Comb.js



//I havent checked that this is actually a comb filter
class Comb extends operators_Operator{
    constructor(){
        super();

        let delayBuf=[];
        
        this.reset=()=>{
            delayBuf=[];
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            reso *= 0.5;
            gain *= 0.5;
            frequency /= 4;

            let period = sampleRate/frequency;
            
            let delayedSample = 0;
            
            if(delayBuf.length>period){
                delayedSample = delayBuf.shift();
            }

            sample *= reso;
            sample += delayedSample * reso;
            delayBuf.push(sample);
            
            let outSample = sample * gain;
            return saturate?utils_saturate1(outSample):outSample;
        }
    }
}
/* harmony default export */ const operators_Comb = (Comb);
;// CONCATENATED MODULE: ./src/SoundModules/operators/HpBoxcar.js




//just average, only takes sample into account
class HpBoxcar extends operators_Operator{
    constructor(){
        super();
        let lastOutput = 0;

        this.reset=()=>{
            lastOutput=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            output=(sample - output) * gain
            return saturate?utils_saturate1(output):output;
        }
    }
}

/* harmony default export */ const operators_HpBoxcar = (HpBoxcar);
;// CONCATENATED MODULE: ./src/SoundModules/operators/LpBoxcar.js




//just average, only takes sample into account
class LpBoxcar extends operators_Operator{
    constructor(){
        super();
        let lastOutput = 0;

        this.reset=()=>{
            lastOutput=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            //I actually don't know well how to calculate the cutoff frequency, I just made this simplistic guess:
            //a moving average roughly takes "weight" times to get quite close to the value
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            const weightb = 1-weighta;
            let output = (sample * weighta + lastOutput * weightb);
            lastOutput = output;
            output*=gain;
            
            return saturate?utils_saturate1(output):output;
        }
    }
}

/* harmony default export */ const operators_LpBoxcar = (LpBoxcar);
;// CONCATENATED MODULE: ./src/SoundModules/operators/HpNBoxcar.js


class HpNBoxcar extends operators_LpBoxcar{
    constructor(){
        super();
        let superCSample = this.calculateSample;
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let output = sample * gain - superCSample(sample,frequency,reso,gain,order,false);
            return saturate?utils_saturate1(output):output;

        }
    }
}

/* harmony default export */ const operators_HpNBoxcar = (HpNBoxcar);
;// CONCATENATED MODULE: ./src/SoundModules/operators/LpNBoxcar.js



/**
 * boxcar, but utilizing any amount of steps in series. 
 * note the sample weighting function, which I decided arbitrarily. It could have been linear ramp.
 * not working! it produces undesired bias
 */
class LpNBoxcar extends operators_Operator{
    constructor(){
        super();
        
        let lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
        let dc=0;

        this.reset=()=>{
            lastOutputs=[0,0,0,0,0,0,0,0,0,0,0,0];
            dc=0;
        }

        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency < 0) frequency=0;
            let weighta = frequency/sampleRate;
            if(weighta>1) weighta=1;
            let weightb = 1-weighta;

            let resoScaled = (reso / 10);
            
            let currentIn=sample + (1 - lastOutputs[order-1]) * resoScaled;

            for(let pole=0; pole<order; pole++){
                lastOutputs[pole] = currentIn * weighta + lastOutputs[pole] * weightb;
                currentIn = lastOutputs[pole];
            }
            let output=currentIn * gain;
            return saturate?utils_saturate1(output):output;
        }
    }
}

/* harmony default export */ const operators_LpNBoxcar = (LpNBoxcar);
;// CONCATENATED MODULE: ./src/SoundModules/operators/LpMoog.js



//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
//https://www.musicdsp.org/en/latest/Filters/26-LpMoog-vcf-variation-2.html#id2
//todo: frequency and gain are off.
class LpMoog extends operators_Operator{
    constructor(){
        super();
        let msgcount = 0;
        let in1, in2, in3, in4, out1, out2, out3, out4
        in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
        
        this.reset=()=>{
            in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
            msgcount=0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            if(frequency<0) frequency=0;
            let f = (frequency / sampleRate) * 1.16;
            
            let af = 1-f;
            let sqf = f*f;

            let fb = reso * (1.0 - 0.15 * sqf);

            let outSample=0;
            sample -= out4 * fb;
            sample *= 0.35013 * (sqf)*(sqf);

            out1 = sample + 0.3 * in1 + af * out1; // Pole 1
            in1 = sample;
            out2 = out1 + 0.3 * in2 + af * out2; // Pole 2
            in2 = out1;
            out3 = out2 + 0.3 * in3 + af * out3; // Pole 3
            in3 = out2;
            out4 = out3 + 0.3 * in4 + af * out4; // Pole 4
            in4 = out3;

            outSample = out4 * gain;
            // if(msgcount<20){
            //     msgcount++
            //     console.log({
            //         in1, in2, in3, in4, out1, out2, out3, out4,
            //         sample,frequency,reso,reso,order,
            //         f,fb,outSample
            //     });
            // }else if(msgcount==20){
            //     msgcount++
            //     console.log("omitting the rest...");
            // }
            // if(isNaN(frequency)) throw new Error("frequency is NaN");
            // if(isNaN(reso)) throw new Error("reso is NaN");
            // if(isNaN(fb)) throw new Error("fb is NaN");
            // if(isNaN(sample)) throw new Error("sample is NaN");
            // if(isNaN(in1)) throw new Error("in1 is NaN");
            // if(isNaN(out1)) throw new Error("out1 is NaN "+in1);
            // if(isNaN(out2)) throw new Error("out2 is NaN");
            // if(isNaN(out3)) throw new Error("out3 is NaN");
            // if(isNaN(out4)) throw new Error("out4 is NaN");
            // if(isNaN(outSample)) throw new Error("outSample is NaN");

            return saturate?utils_saturate1(outSample):outSample;
        }
    }
}
/* harmony default export */ const operators_LpMoog = (LpMoog);
;// CONCATENATED MODULE: ./src/SoundModules/operators/Pinking.js


//https://noisehack.com/custom-audio-effects-javascript-web-audio-api/
class Pinking extends operators_Operator{
    constructor(){
        super();

        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        this.reset=()=>{
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        }
        this.calculateSample=(sample,frequency,reso,gain,order,saturate)=>{
            let outSample=0;
            b0 = 0.99886 * b0 + sample * 0.0555179;
            if(order>1) b1 = 0.99332 * b1 + sample * 0.0750759;
            if(order>2) b2 = 0.96900 * b2 + sample * 0.1538520;
            if(order>3) b3 = 0.86650 * b3 + sample * 0.3104856;
            if(order>4) b4 = 0.55000 * b4 + sample * 0.5329522;
            if(order>5) b5 = -0.7616 * b5 - sample * 0.0168980;
            outSample = b0 + b1 + b2 + b3 + b4 + b5 + b6 + sample * 0.5362;
            outSample *= gain;
            b6 = sample * 0.115926;
            return saturate?utils_saturate1(outSample):outSample;
        }
    }
}
/* harmony default export */ const operators_Pinking = (Pinking);
;// CONCATENATED MODULE: ./src/SoundModules/DelayWithFilter.js















/**
 * @namespace SoundModules.DelayWithFilter
 */

/** @typedef {"none"
 *      |"LpBoxcar"
 *      |"HpBoxcar"
 *      |"LpMoog"
 *      |"Pinking"
 * } filterType */

/** 
 * @typedef {Object} FilterSettings
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [gain]
 * @property {number} [reso]
 * @property {filterType} [type]
 * @property {0|1|2|3|4} [order]
 * @property {boolean} [saturate]
 */

/**
 * @typedef {Object} CommonFilterProperties
 * @property {number} frequency
 * @property {number} reso 
 * @property {number} gain 
 * @property {number} order 
*/


const filterProtos={
    none:operators_Operator,
    LpMoog: operators_LpMoog,
    LpBoxcar: operators_LpBoxcar,
    LpNBoxcar: operators_LpNBoxcar,
    HpBoxcar: operators_HpBoxcar,
    HpNBoxcar: operators_HpNBoxcar,
    Comb: operators_Comb,
    Pinking: operators_Pinking
}

const DelayWithFilter_defaultSettings={
    feedback:0.5,
    time:0.2, //seconds
    dry:1,
    wet:0.5,
    gain:1,
    reso:0.2,
    length:1,
    type:"LpMoog",
    order:1,
    frequency:100,
    saturate:false,
};

/**
 * @class DelayWithFilter
 * @extends Module
 */
class DelayWithFilter extends SoundModules_Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, DelayWithFilter_defaultSettings);
        Object.assign(settings, userSettings);

        super(settings);

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");
        this.hasInput("frequency");
        this.hasInput("gain");
        this.hasInput("reso");


        this.setOrder = (to) => {
            return this.set({
                order: to
            });
        };
        this.setFrequency = (to) => {
            return this.set({
                frequency: to
            });
        };
        /** @param {filterType} to */
        this.setType = (to) => {
            if(!filterProtos[to]){
                return Object.keys(filterProtos);
            }
            return this.set({
                type: to
            });
        };

        let delayOperator = new operators_BasicDelay();
        
        this.recalculate = (recursion = 0) => {

            this.cachedValues = [];
            
            //filter setup
            let filter = new filterProtos[settings.type]();
            const order = settings.order;
            const frequencies = this.inputs.frequency.getValues(recursion);
            const gains = this.inputs.gain.getValues(recursion);
            const resos = this.inputs.reso.getValues(recursion);
            filter.reset();

            //delay setup
            delayOperator.reset();
            let inputValues = this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);
            
            inputValues.map((value,sampleNumber)=>{
                this.cachedValues[sampleNumber] = 0;
                
                let currentTimeLevel = Math.floor(
                    valueOrZero(timeLevels[sampleNumber]) * sampleRate + delayInSamples
                );

                value = filter.calculateSample(
                    value,
                    valueOrZero(frequencies[sampleNumber]) + settings.frequency,
                    valueOrZero(resos[sampleNumber]) + settings.reso,
                    valueOrZero(gains[sampleNumber]) + settings.gain,
                    order,settings.saturate
                );

                if(sampleNumber>currentTimeLevel){
                    let timeAgo=sampleNumber - currentTimeLevel;
                    value += (this.cachedValues[timeAgo])
                        * (settings.feedback + valueOrZero(feedbackLevels[sampleNumber]));
                    if(this.settings.saturate) value = utils_saturate1(value);
                }

                this.cachedValues[sampleNumber]+=delayOperator.calculateSample(value,currentTimeLevel);
                
            });

            //mix dry and wet
            this.cachedValues.map((val,sampleNumber)=>{

                this.cachedValues[sampleNumber] = this.cachedValues[sampleNumber] * settings.wet 
                    + inputValues[sampleNumber] * settings.dry;
                
            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_DelayWithFilter = (DelayWithFilter);
;// CONCATENATED MODULE: ./src/SoundModules/NaiveReverb.js




/**
 * @namespace SoundModules.Module
 */

const NaiveReverb_defaultSettings={
    feedback:0.5,
    diffusion:0.06,
    time:0.1, //seconds
    dry:0.5,
    wet:0.5,
};

/* 
a simple delay tap.
todo: in order to produce a network of delays, I need to also
implement some way for one reverb to send it's output to another
reverb, also producing feebdack loops
*/
class ReverbTap{
    constructor(){

        //delay reflection time start
        //in other words, wait this time before starting reverberating
        this.time = 100 / 1000;
        //how many consecutive taps are produced
        //in other words, how many times (*splrate) it reverberates 
        this.diffusion = 10 / 1000;

        let timeSpls;
        let difussionSpls;

        this.reset=()=>{
            this.pastSamples=[];
            timeSpls = Math.floor(this.time * sampleRate);
            difussionSpls = Math.floor(this.diffusion * sampleRate);
            console.log({timeSpls,difussionSpls});
        }

        this.calculateSample=(level, pastSamples)=>{
            let ret = 0;
            const pastSamplesEnd = pastSamples.length - timeSpls;
            const pastSamplesStart = pastSamplesEnd - difussionSpls;
            if(pastSamplesStart > 0){
                //get the correct samples at teh array start
                for(let tapN=pastSamplesStart; tapN < pastSamplesEnd; tapN++){
                    ret += pastSamples[tapN] * level;
                }
                // ret/=sampleRate;
            }
            return ret;
        }

        this.reset();
    }

}

/**
 * @class NaiveReverb
 * @extends Module
 */
class NaiveReverb extends SoundModules_Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, NaiveReverb_defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        super(settings);

        this.hasInput("main");
        this.hasInput("feedback");
        this.hasInput("time");

        const tap1 = new ReverbTap();
        
        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];

            let delayCache = [];
            
            let inputValues = this.inputs.main.getValues(recursion);
            let delayInSamples = Math.floor(sampleRate * settings.time);

            let feedbackLevels = this.inputs.feedback.getValues(recursion);
            let timeLevels = this.inputs.time.getValues(recursion);
            
            tap1.time = settings.time;
            tap1.diffusion = settings.diffusion;
            tap1.reset();
            
            inputValues.map((value,sampleNumber)=>{
                this.cachedValues[sampleNumber]=0;
                
                if(isNaN(value)) value = 0;
                delayCache.push(value);

                
                if(settings.wet>0){
                    this.cachedValues[sampleNumber] += tap1.calculateSample(
                        settings.feedback + valueOrZero(feedbackLevels[sampleNumber]),
                        delayCache
                    ) * settings.wet;
                }
                
                if(settings.feedback>0){
                    delayCache[delayCache.length-1] += this.cachedValues[sampleNumber] * settings.feedback;
                }


                if(settings.dry>0){
                    this.cachedValues[sampleNumber] += value * settings.dry;
                }
            });
            
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_NaiveReverb = (NaiveReverb);
;// CONCATENATED MODULE: ./src/SoundModules/EnvelopeGenerator.js



/**
 * @namespace SoundModules.EnvelopeGenerator
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} EnvelopeGeneratorSettings
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {Array<EnvelopePoint>} [points]
 * @property {boolean} [loop]
 */

/** @type {EnvelopeGeneratorSettings} */
const EnvelopeGenerator_defaultSettings = {
    amplitude: 1,
    bias: 0,
    length: 1,
    points: [],
    loop: false,
};

/**
 * @class EnvelopeGenerator 
 * @extends Module
 */
class EnvelopeGenerator extends SoundModules_Module {
    /**
     * @param {EnvelopeGeneratorSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, EnvelopeGenerator_defaultSettings);
        Object.assign(settings, userSettings);
        let first = true;
        let phaseAccumulator = 0;
        const accumulatePhase = (frequency) => {
            phaseAccumulator += frequency / sampleRate;
        };


        super(settings);

        this.setFrequency = (to) => {
            settings.frequency = to;
            this.changed({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };
        this.setLength = (to) => {
            return this.set({
                length: to
            });
        }
        this.setPoints = (points) => {
            return this.set({
                points
            });
        };
        this.addPoint = (point=[0,0]) => {
            return this.set({
                points: settings.points.push(point)
            });
        };
        const sortPointsByTime = () => {
            settings.points.sort((a, b) => a[0] - b[0]);
            this.changed({ points: settings.points });
        }
        const getInterpolation = (position, pointa, pointb) => {
            const distancea = position - pointa[0];
            const distanceb = pointb[0] - position;
            const distancet = pointb[0] - pointa[0];
            const ret = (pointa[1] * distanceb + pointb[1] * distancea) / distancet;
            // const ret=(
            //     pointa[1] * distancet / 4000
            // );
            if (isNaN(ret)) return 0;
            // return position / 44100;
            // return pointa[1]+pointb[1] * position / 44100;
            return ret;
        }
        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            sortPointsByTime();
            /** @returns {EnvelopePoint|false} */
            const getNextPoint = (spl) => {

                /** @type {EnvelopePoint|false} */
                let selected = false;
                for (let pnum = 0; pnum < settings.points.length; pnum++) {
                    const point = settings.points[pnum];
                    selected = point;
                    if (point[0] > spl) return selected;
                };
                return false;
            }

            const lengthSamples = settings.length * sampleRate;

            let nextPoint = getNextPoint(0);
            let currentPoint = [0, 0];

            for (let splN = 0; splN < lengthSamples; splN++) {
                if (nextPoint) {
                    this.cachedValues[splN] = getInterpolation(splN, currentPoint, nextPoint);
                    if (splN >= nextPoint[0]) {
                        currentPoint = nextPoint;
                        nextPoint = getNextPoint(splN);
                    }
                } else {
                    if(settings.loop){
                        //currentPoint is now last point, and indicates length of the loop
                        this.cachedValues[splN] = this.cachedValues[splN % currentPoint[0]];
                    }else{
                        this.cachedValues[splN] = currentPoint[1]; //this.cachedValues[splN % currentPoint[0]];
                    }

                }
            }

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_EnvelopeGenerator = (EnvelopeGenerator);
;// CONCATENATED MODULE: ./src/SoundModules/Chebyshev.js



/**
 * @namespace SoundModules.Chebyshev
 */

/** 
 * @typedef {Object} ChebyshevSettings
 * @property {number} [amplitude]
 * @property {number} [bias]
 * @property {number} [length]
 * @property {0|1|2|3|4} [order]
 */

/** @type {ChebyshevSettings} */
const Chebyshev_defaultSettings={
    amplitude:1,
    bias:0,
    length:1,
    order:3,
};
//TODO: only third order is producing anything useful
/**
 * @class Chebyshev 
 * @extends Module
 */
class Chebyshev extends SoundModules_Module{
    /**
     * @param {ChebyshevSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Chebyshev_defaultSettings);
        Object.assign(settings, userSettings);
        
        let phaseAccumulator = 0;

        //todo: lookup table
        //todo: auto nth order
        const orders=[
            (x)=>1,                                 //0
            (x)=>x,                                 //1
            (x)=>2 * Math.pow(x,2) - 1,             //2
            (x)=>4 * Math.pow(x,3) - 3 * x,         //3
            (x)=>8 * Math.pow(x,4) - 8 * x * x + 1, //4
        ];

        super(settings);

        this.hasInput("main");

        this.setOrder = (to) => {
            settings.order = to;
            this.changed({
                order: to
            });
            this.cacheObsolete();
            return this;
        };

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            //only one input, thus we need not to add or anything
            this.eachInput((input) => {
                const inputValues = input.getValues(recursion);
                this.cachedValues = inputValues.map(orders[settings.order]);
            });
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Chebyshev = (Chebyshev);
;// CONCATENATED MODULE: ./src/SoundModules/WaveFolder.js



/**
 * @namespace SoundModules.WaveFolder
 */

/** 
 * @typedef {Object} WaveFolderSettings
 * @property {number} [bias]
 * @property {number} [amplitude]
 * @property {number} [fold]
 */

/** @type {WaveFolderSettings} */
const WaveFolder_defaultSettings={
    amplitude:1,
    bias:0,
    fold:1,
};
//TODO: only third order is producing anything useful
/**
 * @class WaveFolder 
 * @extends Module
 */
class WaveFolder extends SoundModules_Module{
    /**
     * @param {WaveFolderSettings} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, WaveFolder_defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.hasInput("main");

        this.setPreamp = (to) => {
            return this.set({amplitude:to});
        };
        this.setBias = (to) => {
            return this.set({bias:to});
        };
        this.setCeiling = (to) => {
            return this.set({fold:to});
        };

        const actualModulo = (a,m) => ((a%m)+m)%m;       


        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            const {
                amplitude, bias, fold,
            } = settings;
            const halffold = fold/2;
            const inputValues = this.inputs.main.getValues(recursion);
            this.cachedValues = inputValues.map((val)=>{
                const result = (
                    actualModulo(
                        ( val + fold + bias),
                        fold
                    ) - halffold
                ) / fold;
                return result * amplitude;
            });
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_WaveFolder = (WaveFolder);
;// CONCATENATED MODULE: ./src/SoundModules/Filter.js












//todo: find more interesting filters. Eg. https://www.musicdsp.org/en/latest/Filters/index.html
/**
 * @namespace SoundModules.Filter
 */
/** @typedef {"none"
 *      |"LpBoxcar"
 *      |"HpBoxcar"
 *      |"LpMoog"
 *      |"Pinking"
 * } filterType */

/** 
 * @typedef {Object} FilterSettings
 * @property {number} [length]
 * @property {number} [frequency]
 * @property {number} [gain]
 * @property {number} [reso]
 * @property {filterType} [type]
 * @property {0|1|2|3|4} [order]
 * @property {boolean} [saturate]
 */

/**
 * @typedef {Object} CommonFilterProperties
 * @property {number} frequency
 * @property {number} reso 
 * @property {number} gain 
 * @property {number} order 
*/


const Filter_filterProtos={
    none:operators_Operator,
    LpMoog: operators_LpMoog,
    LpBoxcar: operators_LpBoxcar,
    LpNBoxcar: operators_LpNBoxcar,
    HpBoxcar: operators_HpBoxcar,
    HpNBoxcar: operators_HpNBoxcar,
    Comb: operators_Comb,
    Pinking: operators_Pinking
}




/** @type {FilterSettings} */
const Filter_defaultSettings={
    gain:1,
    reso:0.2,
    length:1,
    type:"LpMoog",
    order:1,
    frequency:100,
    saturate:false,
};


/**
 * @class Filter 
 * @extends Module
 */
class Filter extends SoundModules_Module{
    /**
     * @param {FilterSettings} userSettings
     */
    constructor(userSettings = {}) {

        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Filter_defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);

        this.hasInput("main");
        this.hasInput("frequency");
        this.hasInput("gain");
        this.hasInput("reso");

        this.setOrder = (to) => {
            settings.order = to;
            this.changed({
                order: to
            });
            this.cacheObsolete();
            return this;
        };
        this.setFrequency = (to) => {
            settings.frequency = to;
            this.changed({
                frequency: to
            });
            this.cacheObsolete();
            return this;
        };
        /** @param {filterType} to */
        this.setType = (to) => {
            if(!Filter_filterProtos[to]){
                return Object.keys(Filter_filterProtos);
            }

            settings.type = to;
            this.changed({
                type: to
            });
            this.cacheObsolete();
            return this;
        };

        this.recalculate = (recursion = 0) => {
            
            //create an interface for the filter
            let filter = new Filter_filterProtos[settings.type]();
            const order = settings.order;
            const frequencies = this.inputs.frequency.getValues(recursion);
            const gains = this.inputs.gain.getValues(recursion);
            const resos = this.inputs.reso.getValues(recursion);
            
            this.cachedValues = [];
            const inputValues=this.inputs.main.getValues(recursion);

            filter.reset();

            this.cachedValues = inputValues.map((inputValue,sampleNumber)=>filter.calculateSample(
                inputValue,
                valueOrZero(frequencies[sampleNumber]) + settings.frequency,
                valueOrZero(resos[sampleNumber]) + settings.reso,
                valueOrZero(gains[sampleNumber]) + settings.gain,
                order,settings.saturate
            ));
        
            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Filter = (Filter);
;// CONCATENATED MODULE: ./src/SoundModules/MixerTesselator.js



/**
 * @namespace SoundModules.MixerTesselator
 */

const MixerTesselator_defaultSettings={
    amplitude:1,
    levela:0.5,
    levelb:0.5,
    levelc:0.5,
    leveld:0.5,
};
/**
 * mixes channels and also tesselates them using sine shaped window.
 * this removes clicks upon loop
 * @class MixerTesselator
 * @extends Module
 */
class MixerTesselator extends SoundModules_Module{
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, MixerTesselator_defaultSettings);
        Object.assign(settings, userSettings);

        const { amplitude } = settings;
        
        super(settings);

        this.hasInput("a");
        this.hasInput("b");
        this.hasInput("c");
        this.hasInput("d");

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];
            let result=[];
            let first = true;
            this.eachInput((input,inputno,inputName) => {
                const inputValues = input.getValues(recursion);
                inputValues.map((val, index) => {
                    if(!result[index]) result[index]=0;
                    result[index] += (val) * amplitude * settings["level"+inputName];
                });
            });
            
            let lengthSamples=result.length;
            let half = Math.floor(lengthSamples/2);
            
            this.cachedValues = result.map((v,i)=>{
                let awindow = Math.cos(2 * Math.PI * i/lengthSamples) / 2 + 0.5;
                let window = 1 - awindow; 
                if(i>half){
                    return v * window + result[i - half] * awindow
                }else if(i<half){
                    return v * window + result[i + half] * awindow
                }else{
                    return v;
                }
            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_MixerTesselator = (MixerTesselator);
;// CONCATENATED MODULE: ./src/SoundModules/Repeater.js



/**
 * @namespace SoundModules.Repeater
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} RepeaterOptions
 * @property {number} [length]
 * @property {Array<EnvelopePoint>} [points]
 * @property {boolean} [loop]
 * @property {boolean} [monophonic]
 * @property {number} [gain]
 */

/** @type {RepeaterOptions} */
const Repeater_defaultSettings = {
    length: 1,
    points: [],
    loop: false,
    gain:1,
};

/**
 * @class Repeater 
 * @extends Module
 */
class Repeater extends SoundModules_Module {
    /**
     * @param {RepeaterOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Repeater_defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);
        
        this.hasInput("main");

        this.setLength = (to) => {
            return this.set({
                length: to
            });
        }
        this.setPoints = (pointsList) => {
            settings.points = pointsList;
            this.changed({
                points: settings.points
            });
            // console.log(pointsList);
            this.cacheObsolete();
            return this;
        };

        const sortPointsByTime = () => {
            settings.points.sort((a, b) => a[0] - b[0]);
            this.changed({ points: settings.points });
        }

        this.recalculate = (recursion = 0) => {
            this.cachedValues = [];

            sortPointsByTime();
            /** @returns {EnvelopePoint|false} */
            const getNextPoint = (spl) => {

                /** @type {EnvelopePoint|false} */
                let selected = false;
                for (let pnum = 0; pnum < settings.points.length; pnum++) {
                    const point = settings.points[pnum];
                    selected = point;
                    if (point[0] > spl) return selected;
                };
                return false;
            }

            const lengthSamples = settings.length * sampleRate;

            let inputSamples = this.inputs.main.getValues(recursion);

            let nextPoint = getNextPoint(0);
            let currentPoint = [0, 0];

            for (let splN = 0; splN < lengthSamples; splN++) {
                if (nextPoint) {
                    if (splN >= nextPoint[0]) {
                        currentPoint = nextPoint;
                        nextPoint = getNextPoint(splN);
                    }
                }

                this.cachedValues[splN] = inputSamples[
                    splN - currentPoint[0]
                ] * settings.gain * currentPoint[1];
            }

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Repeater = (Repeater);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/WaveDisplay.js




class WaveDisplay extends scaffolding_elements.Path{
    /** @param {ValuePixelTranslator} translator */
    constructor(translator) {

        const settings=translator.settings;

        super({
            d: `M ${0},${settings.height / 2}
            L ${0},${settings.height / 2} ${settings.width},${settings.height / 2}`,
            fill: "transparent",
            stroke: "black"
        });
        

        const superSet = this.set;
        /** 
         * @param {String} what
         * @param {any} value
         */
        this.set = (what,value) => {
            
            if (what == "wave" || what == "width") {
                const theWave = value;
                let str = `M ${0},${settings.height / 2}`;
                
                let end = Math.min(
                    settings.width,
                    translator.sampleNumberToX(theWave.length)
                );
                
                //todo: take whichever has less: pixels or samples.
                //when multi samples per pixel, use max and a filled area
                //otherwise, it's a line
                for (let pixelNumber = 0; pixelNumber < end; pixelNumber++) {
                    const index=translator.xToSampleNumber(pixelNumber);
                    const top = translator.amplitudeToY(theWave[index]);
                    str += `L ${pixelNumber},${top}`;
                }

                str += `L ${end},${translator.amplitudeToY(0)}`;
                str += `L ${0},${translator.amplitudeToY(0)} `;
                str += `z`;

                superSet('d',str);
            }
        };
    }
}
/* harmony default export */ const components_WaveDisplay = (WaveDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/components/VerticalZoom.js






const zoomSettings={
    width:10,
    zoomHeight:10,
    range:1200,
}

class VerticalZoom extends scaffolding_elements.Group{
    /** @param {ValuePixelTranslator} translator */
    constructor(translator) {
        const settings=translator.settings;
        
        super();

        const yToRange=(y)=>{
            const r = zoomSettings.range;
            const h = settings.height;
            return (Math.pow(2, Math.pow(y / h,12)) - 1) * r;
        }

        const rangeToY=(zoom)=>{
            const z = zoom;
            const r = zoomSettings.range;
            const h = settings.height;
            return h * Math.pow(Math.log((z/r)+1)/Math.LN2,1/12);
        }

        // console.log(` ${33.44} ==? ${yToRange(rangeToY(33.44))}`);
        // console.log(` ${33.44} ==? ${yToRange(rangeToY(33.44))}`);

        // console.log(` ${24.421} ==? ${yToRange(rangeToY(24.421))}`);
        // console.log(` ${24.421} ==? ${yToRange(rangeToY(24.421))}`);

        const readoutText =  new scaffolding_elements.Text({
            class:"zoom-level",
            x:settings.width + 5,
            text:"---",
        });
        this.add(readoutText);

        const handleRect = new scaffolding_elements.Rectangle({
            width: zoomSettings.width,
            height: zoomSettings.zoomHeight,
            x: settings.width-zoomSettings.width,
            y: settings.height,
        });
        this.add(handleRect);
        



        const draggable = new components_Draggable(handleRect.domElement);
        draggable.setPosition(new Vector2.default({
            x: handleRect.attributes.x,
            y: handleRect.attributes.y,
        }));

        draggable.dragStartCallback = (mouse) => {};
        draggable.dragEndCallback = (mouse) => {};
        
        draggable.positionChanged = (newPosition) => {
            // settings.rangeAmplitude = yToRange(newPosition.y);
            translator.change({
                rangeAmplitude:yToRange(newPosition.y)
            });

            handleRect.set("y",newPosition.y);

            Object.assign(readoutText.attributes,{
                y:handleRect.attributes.y + 5,
                text:utils_round(settings.rangeAmplitude,2),
            });

            readoutText.update();
        };

        //if something else changes zoom, update the scroller
        translator.onChange((changes)=>{
            if(changes.rangeAmplitude){
                const ypos=rangeToY(changes.rangeAmplitude);
                handleRect.set("y",ypos);
                draggable.setPosition({y:ypos},false)
                Object.assign(readoutText.attributes,{
                    y:ypos + 5,
                    text:utils_round(settings.rangeAmplitude,2),
                });

            }
            if(changes.width){
                readoutText.set("x",settings.width + 5);
                handleRect.set("x", settings.width-zoomSettings.width);
            }
        });

        const superSet = this.set;

        this.set = (...p) => {
            superSet(...p);
        };
    }
}
/* harmony default export */ const components_VerticalZoom = (VerticalZoom);

;// CONCATENATED MODULE: ./src/DomInterfaces/LaneTypes/WaveLane.js







/**
 * @typedef {Object} WaveLaneOptions
 * @property {Module} model
 * @property {string} [name]
 */
class WaveLane extends components_Lane{
    /**
     * @param {ValuePixelTranslator} translator
     * @param {import("../components/Lane").LaneOptions} options
     */
    constructor(translator,options){
        const {model,drawBoard}=options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Wave";
        Object.assign(settings,options);
        super(translator,options);
        

        const contents=this.contents;

        const waveDisplay=this.waveDisplay = new components_WaveDisplay(translator);
        waveDisplay.domElement.classList.add("wave-display");
        waveDisplay.domElement.classList.add("no-mouse");
        contents.add(waveDisplay);
        

        const zoom = new components_VerticalZoom(translator);


        this.autoZoom = () => {
            this.normalizeView();
        }

        zoom.domElement.addEventListener('dblclick',()=>{
            this.normalizeView();
        });
        
        contents.add(zoom);

        new Array().map

        translator.onChange((changes)=>{
            waveDisplay.set("wave",model.cachedValues);
        });

        // zoom.changeCallback=()=>{
        // }

        model.onUpdate((changes)=>{
            if(changes.cachedValues){
                waveDisplay.set("wave",changes.cachedValues);
            }
        });

        // drawBoard.size.onChange(()=>{
            // waveDisplay.set("width",drawBoard.size.width);
        // });

        /**
         * handy function that sets the ValuePixelTranslator (i.e. zoom/pan) 
         * in such a way that the whole range of the contents are visible and maximized 
         */ 
        this.normalizeView=(centered=true)=>{
            //find level range in the audio
            //non zero initial value prevents infinite zoom
            let maxValue = 0;
            let minValue = 0;

            model.cachedValues.map((v)=>{
                if(v>maxValue) maxValue=v;
                if(v<minValue) minValue=v;
            });

            if(centered){
                maxValue = Math.abs(maxValue);
                minValue = Math.abs(minValue);
                let biggest=maxValue;
                if(minValue>biggest) biggest=minValue;
                maxValue=biggest;
                minValue=-biggest;
            }

            if(maxValue === minValue && minValue === 0){
                translator.coverVerticalRange(-1,1);
            }else{
                translator.coverVerticalRange(minValue,maxValue);
            }
        }
    }
}
/* harmony default export */ const LaneTypes_WaveLane = (WaveLane);
;// CONCATENATED MODULE: ./src/DomInterfaces/components/Hoverable.js

/**
 * @typedef {Node} NodeWithClassList
 * @property {Set<string>} classList
 * @exports NodeWithClassList
 */

/**
 * thing that can be hovered.
 */
/** @param {HTMLElement|SVGElement} domElement */
function Hoverable(domElement){

    const position = new Vector2.default();

    domElement.addEventListener("mouseenter",(evt)=>{
        domElement.classList.add("active");
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseEnterCallback(position);
    });
    
    domElement.addEventListener("mouseleave",(evt)=>{
        domElement.classList.remove("active");
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseLeaveCallback(position);
    });

    domElement.addEventListener("mousemove",(evt)=>{
        const position={
            x:evt.clientX,
            y:evt.clientY,
        }
        this.mouseMoveCallback(position);
    });


    this.mouseEnterCallback=(position)=>{
    }
    this.mouseLeaveCallback=(position)=>{
    }
    this.mouseMoveCallback=(position)=>{
    }

    /** @param {Vector2|{x:number,y:number}} newPosition */
    this.setPosition=(newPosition)=>{
        position.set(newPosition);
        this.positionChanged(newPosition);
    }

    domElement.classList.add("draggable");
}

/* harmony default export */ const components_Hoverable = (Hoverable);
;// CONCATENATED MODULE: ./src/DomInterfaces/GenericDisplay.js







/**
 * @namespace DomInterface.GenericDisplay
 */
/** 
 * @class GenericDisplay
 * @extends WaveLane
 */
class GenericDisplay extends LaneTypes_WaveLane{

    /** @param {import("./components/Lane").LaneOptions} options */
    constructor(options){
        const {model,drawBoard} = options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        Object.assign(settings,options);
        const translator=new utils_ValuePixelTranslator(settings);
        super(translator,settings);
        //lane has a contents sprite.
        const contents=this.contents;
        
        const hoverText=new scaffolding_elements.Text();
        hoverText.attributes.class="hover-text";

        const hoverable=new components_Hoverable(this.domElement);

        hoverable.mouseMoveCallback=(position)=>{
            const sampleNumberHere = translator.xToSampleNumber(
                position.x
            );
            let levelHere = model.cachedValues[
                sampleNumberHere
            ];
            let yhere=translator.amplitudeToY(levelHere);
            if(isNaN(levelHere)) levelHere=translator.amplitudeToY(0);
            hoverText.attributes.y=yhere;
            //position.x - settings.x;
            hoverText.attributes.x=position.x - settings.x;
            hoverText.attributes.text=utils_round(levelHere,2)+", "+sampleNumberHere;
            hoverText.update();
        }
        hoverable.mouseEnterCallback=(position)=>{
            hoverText.domElement.classList.add("active");
        }
        hoverable.mouseLeaveCallback=(position)=>{
            hoverText.domElement.classList.remove("active");
        }
        contents.add(hoverText);

        model.triggerInitialState();
    }
};

/* harmony default export */ const DomInterfaces_GenericDisplay = (GenericDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/FilterDisplay.js


class FilterDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("gain");
        this.addKnob("reso");
        this.addKnob("frequency");
        this.addKnob("order");
        this.addToggle("saturate");

    }
}
/* harmony default export */ const DomInterfaces_FilterDisplay = (FilterDisplay);
;// CONCATENATED MODULE: ./src/SoundModules/Hipparchus.js



/**
 * @namespace SoundModules.Hipparchus
 */

/**
 * @typedef {Array<number>} EnvelopePoint a tuple containing two numbers: first is sample number (integers only), and the second is level (float)
 */

/** 
 * @typedef {Object} HipparchusOptions
 * @property {number} [gain]
 * @property {number} [rotation] rotation in ratio, zero equals 0 degrees and 1 equals 360 degrees
 */

/** @type {HipparchusOptions} */
const Hipparchus_defaultSettings = {
    rotation: 0,
    gain:1,
};

//from Vectoidal

/**
 * convert x,y into th,r polar coords around 0,0
 * @param {{x:number,y:number}} cartesian
 * @param {number?} dcOffset
 * @returns {{th:number,r:number}} polar
 */
const cartesianToPolar=({x,y},dcOffset=0)=>{
    return{
        r:Math.sqrt(x*x+y*y)-dcOffset,
        th:Math.atan2(y,x)
    }
};
const polarToCartesian=({th,r},dcOffset=0)=>{
    return {
        x:Math.cos(th)*(r+dcOffset),
        y:Math.sin(th)*(r+dcOffset)
    }
}
/**
 * convert th,r into x,y coords around 0,0. 
 * X is not calculated and set to 0
 * @param {{th:number,r:number}} polar
 * @param {number?} dcOffset
 * @returns {{x:0,y:number}} 
 */
const polarToCartesianAndSquashX=({th,r},dcOffset=0)=>{
    return {
        x:0,
        y:Math.sin(th)*(r+dcOffset)
    }
}

const Hipparchus_voz=(val)=>val?val:0;

/**
 * @class Hipparchus 
 * @extends Module
 */
class Hipparchus extends SoundModules_Module {
    /**
     * @param {HipparchusOptions} userSettings
     */
    constructor(userSettings = {}) {
        //apply default settings for all the settings user did not provide
        const settings = {};
        Object.assign(settings, Hipparchus_defaultSettings);
        Object.assign(settings, userSettings);
        
        super(settings);
        
        this.hasInput("x");
        this.hasInput("y");
        this.hasInput("rotation");

        this.setAngle = (to) => {
            return this.set({
                rotation: to
            });
        }
        this.setGain = (to) => {
            return this.set({
                gain: to
            });
        }


        this.recalculate = (recursion = 0) => {

            let gain = settings.gain;
            let xIn = this.inputs.x.getValues(recursion);
            let yIn = this.inputs.y.getValues(recursion);
            let rotationIn = this.inputs.rotation.getValues(recursion);

            this.cachedValues=[];

            xIn.map((x,sampleNumber)=>{
                let y = Hipparchus_voz(yIn[sampleNumber]);
                let rotationSample = Hipparchus_voz(rotationIn[sampleNumber]);

                let polarRotation = (rotationSample + settings.rotation)  * Math.PI;
                
                const polar = cartesianToPolar({x,y},0);
                polar.th += polarRotation;
                const result = polarToCartesianAndSquashX(polar).y;

                this.cachedValues[sampleNumber] = result * gain;

            });

            this.changed({ cachedValues: this.cachedValues });
        };
    }
}

/* harmony default export */ const SoundModules_Hipparchus = (Hipparchus);
;// CONCATENATED MODULE: ./src/DomInterfaces/DelayDisplay.js


class DelayDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 

        const timeKnob = this.addKnob("time");
        const feedbackKnob = this.addKnob("feedback");
        const wetKnob = this.addKnob("wet");
        const dryKnob = this.addKnob("dry");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");

    }
}
/* harmony default export */ const DomInterfaces_DelayDisplay = (DelayDisplay);
;// CONCATENATED MODULE: ./src/DomInterfaces/DelayWithFilterDisplay.js


class DelayWithFilterDisplay_DelayDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 

        const timeKnob = this.addKnob("time");
        const feedbackKnob = this.addKnob("feedback");
        const wetKnob = this.addKnob("wet");
        const dryKnob = this.addKnob("dry");
        
        this.addKnob("gain");
        this.addKnob("reso");
        this.addKnob("frequency");
        this.addKnob("order");
        this.addToggle("saturate");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");

    }
}
/* harmony default export */ const DelayWithFilterDisplay = (DelayWithFilterDisplay_DelayDisplay);
;// CONCATENATED MODULE: ./src/DomInterfaces/ReverbDisplay.js


class ReverbDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 

        const timeKnob = this.addKnob("time");
        const difussionKnob = this.addKnob("diffusion");
        const feedbackKnob = this.addKnob("feedback");
        const wetKnob = this.addKnob("wet");
        const dryKnob = this.addKnob("dry");

        // timeKnob.step=1/10000;
        timeKnob.setDeltaCurve("periodseconds");
        difussionKnob.setDeltaCurve("periodseconds");

    }
}
/* harmony default export */ const DomInterfaces_ReverbDisplay = (ReverbDisplay);
;// CONCATENATED MODULE: ./src/DomInterfaces/MixerDisplay.js


class MixerDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 

        const levels=[
            this.addKnob("levela"),
            this.addKnob("levelb"),
            this.addKnob("levelc"),
            this.addKnob("leveld")
        ];

        levels.map((k)=>
            k.setMinMax(0,4)
            .setDeltaCurve("channelvol")
        );
        
        options.model.triggerInitialState();

    }
}
/* harmony default export */ const DomInterfaces_MixerDisplay = (MixerDisplay);
;// CONCATENATED MODULE: ./src/DomInterfaces/OscillatorDisplay.js













/**
 * @namespace DomInterface.OscillatorDisplay
 */

/** 
 * @class OscillatorDisplay
 * @extends WaveLane
 */
class OscillatorDisplay extends LaneTypes_WaveLane{
    /**
     * @param {object} options
     * @param {Oscillator} options.model
     * @param {Canvas} options.drawBoard
     **/
    constructor (options){
        const {model,drawBoard} = options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Oscillator";
        Object.assign(settings,options);

        const translator=new utils_ValuePixelTranslator(settings);

        super(translator,settings);

        const frequencyKnob = this.addKnob("frequency");
        const phaseKnob = this.addKnob("phase").setMinMax(0,1);
        const amplitudeKnob = this.addKnob("amplitude");
        const biasKnob = this.addKnob("bias");
        const lengthKnob = this.addKnob("length");
        // const xToFrequency = (x)=>{
        //     const pixelRange=settings.width;
        //     return Math.pow(2,(x/pixelRange)*15);
        // }
        const xToFrequency = (x)=>{
            const period = translator.xToSeconds(x);
            const freq = 1/period;
            return freq;
        }
        const freqToX = (freq)=>{
            const period = 1/freq;
            const x = translator.secondsToX(period);
            return x;
        }

        const yToAmplitude = translator.yToAmplitude;

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new scaffolding_elements.Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);


        //TODO: some knob or text field
        const frequencyHandle = new scaffolding_elements.Circle({r:10});

        const frequencyDraggable=new components_Draggable(frequencyHandle.domElement);

        frequencyDraggable.positionChanged=(newPosition)=>{
            frequencyHandle.attributes.cx=newPosition.x;
            frequencyHandle.attributes.cy=newPosition.y;
            frequencyHandle.update();
            model.setFrequency(xToFrequency(newPosition.x));
            model.setAmplitude(yToAmplitude(newPosition.y));
        }

        let pixFreqOnDragStart;

        contents.add(frequencyHandle);

        frequencyDraggable.setPosition({x:0,y:0});

        frequencyDraggable.dragStartCallback=(mouse)=>{
            frequencyHandle.set("r",1);
        }
        frequencyDraggable.dragEndCallback=(mouse)=>{
            frequencyHandle.set("r",10);
        }

        model.onUpdate((changes)=>{
            if(
                changes.frequency!==undefined ||
                changes.amplitude!==undefined
            ){
                readoutText.set("text",
                    `${
                        utils_round(model.settings.frequency,4)
                    }Hz; ${
                        utils_round(model.settings.amplitude,4)
                    }U ${
                        model.settings.frequency>(settings.rangeSamples/10)?"(ALIASED)":""
                    }`);
            }
        });

        model.triggerInitialState();
    }
};

/* harmony default export */ const DomInterfaces_OscillatorDisplay = (OscillatorDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/EnvelopeGeneratorDisplay.js











const vectorTypes = __webpack_require__(147);
/** @typedef {vectorTypes.MiniVector} MiniVector
/**
 * @namespace DomInterface.EnvelopeGeneratorDisplay
 */
/** 
 * @class EnvelopeGeneratorDisplay
 * @extends WaveLane
 */
class EnvelopeGeneratorDisplay extends LaneTypes_WaveLane{
    /** @param {import("./components/Lane").LaneOptions} options */
    constructor (options){

        const {model,drawBoard} = options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Envelope";
        Object.assign(settings,options);

        const translator=new utils_ValuePixelTranslator(settings);
        super(translator,settings);


        const lengthKnob = this.addKnob("length");
        const loopToggle = this.addToggle("loop");


        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new scaffolding_elements.Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);

        class Handle extends scaffolding_elements.Circle {
            constructor(settings){
                let circleSettings = {r:10};
                Object.apply(circleSettings,settings);
                super(circleSettings);
                this.point=[0,0];
                const draggable = this.draggable = new components_Draggable(this.domElement);
                
                /** @param {MiniVector} pos */
                draggable.positionChanged=(pos)=>{
                    this.handleGuiChangedPoint(pos);
                }

                let activated=false;
                
                /**
                 * change handle position visually and propagate the result to the model. 
                 * @param {MiniVector} pos
                 **/
                this.handleGuiChangedPoint = (pos) =>{
                    let changes = {};
                    //display the change in the gui
                    this.attributes.cx=pos.x;
                    this.attributes.cy=pos.y;
                    this.update();

                    //update the point belonging to the model
                    this.point[0]=translator.xToSampleNumber(pos.x);
                    this.point[1]=translator.yToAmplitude(pos.y);

                    //let the model know of the change
                    let newPoints=handles.map((h)=>h.point);//.sort();
                    // model.setPoints(model.settings.points);

                    changes.points=newPoints;

                    //find the last handle, so that it's used to set the length of the envelope
                    let latestSpl = 0;
                    handles.map((handle)=>{
                        if(handle.point[0]>latestSpl) latestSpl=handle.point[0];
                    }); 

                    //to use last point as length selector
                    // if(!model.settings.loop)
                    //     changes.length=(latestSpl / sampleRate);

                    model.set(changes);
                }
                /**
                 * update the handle's point coordinates and cause
                 * this change to be reflected visually
                 */
                this.handleModelChangedPoint = () => {
                    const point = this.point;
                    let pos = {
                        x:translator.sampleNumberToX(point[0]),
                        y:translator.amplitudeToY(point[1]),
                    }
                    draggable.setPosition(pos,false);
                    this.attributes.cx=pos.x;
                    this.attributes.cy=pos.y;
                    this.update();
                }

                this.activate = ()=>{ 
                    if(!activated) contents.add(this);
                    activated=true;
                }
                this.deactivate = ()=>{
                    if(activated)contents.remove(this);
                    activated=false;
                }
            }
        }
        
        const handles=[
            new Handle(),
        ];

        //udpate the display of the draggable points according to the provided poits list and the translator
        function updatePointsPositions(points){
            points.map((point,index)=>{
                if(!handles[index]){
                    handles[index]=new Handle();
                    handles[index].point=point;
                }
                handles[index].handleModelChangedPoint();
                handles[index].activate();
            });
            //undisplay remaining handles, if any
            for(let index = points.length; index < handles.length; index++){
                handles[index].deactivate();
            }
        }

        
        handles.map((handle)=>{
            const frequencyDraggable=handle.draggable;
            handle.activate();
        });

        //helps moving points according to zoom level
        translator.onChange((changes)=>{
            updatePointsPositions(model.settings.points);
        });
        
        //let us represent changes in the module graphically
        model.onUpdate((changes)=>{
            if(
                changes.frequency!==undefined ||
                changes.amplitude!==undefined
            ){
                readoutText.set("text",
                    `${
                        utils_round(model.settings.frequency,4)
                    }Hz; ${
                        utils_round(model.settings.amplitude,4)
                    }U ${
                        model.settings.frequency>(settings.rangeSamples/10)?"(ALIASED)":""
                    }`);
            }
            if(changes.points){
                updatePointsPositions(changes.points);
            }
        });

        model.triggerInitialState();
    }
};

/* harmony default export */ const DomInterfaces_EnvelopeGeneratorDisplay = (EnvelopeGeneratorDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/ChebyshevDisplay.js


class ChebyshevDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("amplitude");
        this.addKnob("bias");
        this.addKnob("order").setMinMax(0,4);
    }
}
/* harmony default export */ const DomInterfaces_ChebyshevDisplay = (ChebyshevDisplay);
;// CONCATENATED MODULE: ./src/DomInterfaces/RepeaterDisplay.js












const RepeaterDisplay_vectorTypes = __webpack_require__(147);
/** @typedef {vectorTypes.MiniVector} MiniVector
/**
 * @namespace DomInterface.RepeaterDisplay
 */
/** 
 * @class RepeaterDisplay
 * @extends WaveLane
 */
class RepeaterDisplay extends LaneTypes_WaveLane{
    /**
     * @param {object} options
     * @param {Repeater} options.model
     * @param {Canvas} options.drawBoard
     **/
    constructor (options){
        const {model,drawBoard} = options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Repeater";
        Object.assign(settings,options);

        const translator=new utils_ValuePixelTranslator(settings);
        super(translator,settings);

        const lengthKnob = this.addKnob("length");
        // const loopToggle = this.addToggle("loop");
        this.addKnob("gain");

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new scaffolding_elements.Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);

        class Handle extends scaffolding_elements.Circle {
            constructor(settings){
                let circleSettings = {r:10};
                Object.apply(circleSettings,settings);
                super(circleSettings);
                this.point=[0,0];
                const draggable = this.draggable = new components_Draggable(this.domElement);
                
                /** @param {MiniVector} pos */
                draggable.positionChanged=(pos)=>{
                    this.handleGuiChangedPoint(pos);
                }

                let activated=false;
                
                /**
                 * change handle position visually and propagate the result to the model. 
                 * @param {MiniVector} pos
                 **/
                this.handleGuiChangedPoint = (pos) =>{
                    let changes = {};
                    //display the change in the gui
                    this.attributes.cx=pos.x;
                    this.attributes.cy=pos.y;
                    this.update();

                    //update the point belonging to the model
                    this.point[0]=translator.xToSampleNumber(pos.x);
                    this.point[1]=translator.yToAmplitude(pos.y);

                    //let the model know of the change
                    let newPoints=handles.map((h)=>h.point);//.sort();
                    // model.setPoints(model.settings.points);

                    changes.points=newPoints;

                    //find the last handle, so that it's used to set the length of the envelope
                    let latestSpl = 0;
                    handles.map((handle)=>{
                        if(handle.point[0]>latestSpl) latestSpl=handle.point[0];
                    }); 

                    //to use last point as length selector
                    // if(!model.settings.loop)
                    //     changes.length=(latestSpl / sampleRate);

                    model.set(changes);
                }
                /**
                 * update the handle's point coordinates and cause
                 * this change to be reflected visually
                 */
                this.handleModelChangedPoint = () => {
                    const point = this.point;
                    let pos = {
                        x:translator.sampleNumberToX(point[0]),
                        y:translator.amplitudeToY(point[1]),
                    }
                    draggable.setPosition(pos,false);
                    this.attributes.cx=pos.x;
                    this.attributes.cy=pos.y;
                    this.update();
                }

                this.activate = ()=>{ 
                    if(!activated) contents.add(this);
                    activated=true;
                }
                this.deactivate = ()=>{
                    if(activated)contents.remove(this);
                    activated=false;
                }
            }
        }
        
        const handles=[
            new Handle(),
        ];

        //udpate the display of the draggable points according to the provided poits list and the translator
        function updatePointsPositions(points){
            points.map((point,index)=>{
                if(!handles[index]){
                    handles[index]=new Handle();
                    handles[index].point=point;
                }
                handles[index].handleModelChangedPoint();
                handles[index].activate();
            });
            //undisplay remaining handles, if any
            for(let index = points.length; index < handles.length; index++){
                handles[index].deactivate();
            }
        }

        
        handles.map((handle)=>{
            const frequencyDraggable=handle.draggable;
            handle.activate();
        });

        //helps moving points according to zoom level
        translator.onChange((changes)=>{
            updatePointsPositions(model.settings.points);
        });
        
        //let us represent changes in the module graphically
        model.onUpdate((changes)=>{
            if(
                changes.frequency!==undefined ||
                changes.amplitude!==undefined
            ){
                readoutText.set("text",
                    `${
                        utils_round(model.settings.frequency,4)
                    }Hz; ${
                        utils_round(model.settings.amplitude,4)
                    }U ${
                        model.settings.frequency>(settings.rangeSamples/10)?"(ALIASED)":""
                    }`);
            }
            if(changes.points){
                updatePointsPositions(changes.points);
            }
        });

        model.triggerInitialState();
    }
};

/* harmony default export */ const DomInterfaces_RepeaterDisplay = (RepeaterDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/HipparchusDisplay.js













/**
 * @namespace DomInterface.HipparchusDisplay
 */

/** 
 * @class HipparchusDisplay
 * @extends WaveLane
 */
class HipparchusDisplay extends LaneTypes_WaveLane{
    /**
     * @param {object} options
     * @param {Hipparchus} options.model
     * @param {Canvas} options.drawBoard
     **/
    constructor (options){
        const {model,drawBoard} = options;
        const settings=const_typicalLaneSettings(model,drawBoard);
        //plave for defaults
        settings.name="Hipparchus";
        Object.assign(settings,options);

        const translator=new utils_ValuePixelTranslator(settings);

        super(translator,options);

        this.addKnob("rotation").setMinMax(0,2);
        this.addKnob("gain").setMinMax(0,2);
        

        //lane has a contents sprite.
        const contents=this.contents;

        const readoutText =  new scaffolding_elements.Text({
            class:"freq-times-amp",
            x:10, y:settings.height,
            text:"---",
        });
        contents.add(readoutText);


    }
};

/* harmony default export */ const DomInterfaces_HipparchusDisplay = (HipparchusDisplay);

;// CONCATENATED MODULE: ./src/DomInterfaces/WaveFolderDisplay.js


class WaveFolderDisplay extends DomInterfaces_GenericDisplay{
    constructor(options){
        super(options); 
        this.addKnob("amplitude");
        this.addKnob("bias");
        this.addKnob("fold");
    }
}
/* harmony default export */ const DomInterfaces_WaveFolderDisplay = (WaveFolderDisplay);
;// CONCATENATED MODULE: ./src/LiveCodingInterface/index.js

































function giveHelp(){

    console.log(`
    use command "create(<module>,<myName>)", where module is any of the prototypes contained in the "modules" object, and myname is a custom name you wish to give to this module. Type "modules" and then press enter to get the list of them.
    Then type "modules.<myName>" and tab, to see the available methods.
    `);
    console.log(`instanced modules are present in modules array`);
    console.log(`to display how to re-create the patch in screen, run "dumpPatch()". This is a good way to save patches for later use, too.`);

}

class LiveCodingInterface{
    constructor({drawBoard}){
        let count=0;

        setTimeout(giveHelp,1000);
        const moduleCreationListeners = [];

        /** @param {Function} callback */
        this.onModuleCreated=(callback)=>{
            moduleCreationListeners.push(callback);
        }

        this.modules = {};

        let first=true;
        /** 
         * @param {string|false} name
         * @returns {Module} 
         **/
        this.create=function(Which,name=false){
            if(first){
                first=false;
                let helpDom = document.getElementById("notes");
                if(helpDom) helpDom.classList.add("hide");
            }

            let protoname=Which.name;
            if(!name) name=protoname+" "+count;

            let usableName = name.match(/[A-Za-z0-9]/gi).join("");

            if(this.modules[usableName]) usableName = usableName+count;
            
            console.log(`this module will be available as "modules.${usableName}"`);
            
            const newModule=new Which();

            this.modules[usableName]=newModule;
            if(window[name]===undefined) window[name]=newModule;

            const props = {
                model:newModule,
                name:usableName, drawBoard
            }

            let newInterface;
            switch (protoname){
                case "Oscillator":
                    newInterface=new DomInterfaces_OscillatorDisplay(props);
                break;
                case "Hipparchus":
                    newInterface=new DomInterfaces_HipparchusDisplay(props);
                break;
                case "WaveFolder":
                    newInterface=new DomInterfaces_WaveFolderDisplay(props);
                break;
                case "EnvelopeGenerator":
                    newInterface=new DomInterfaces_EnvelopeGeneratorDisplay(props);
                break;
                case "Repeater":
                    newInterface=new DomInterfaces_RepeaterDisplay(props);
                break;
                case "Filter":
                    newInterface=new DomInterfaces_FilterDisplay(props);
                break;
                case "Chebyshev":
                    newInterface=new DomInterfaces_ChebyshevDisplay(props);
                break;
                case "Delay":
                    newInterface=new DomInterfaces_DelayDisplay(props);
                break;
                case "DelayWithFilter":
                    newInterface=new DelayWithFilterDisplay(props);
                break;
                case "NaiveReverb":
                    newInterface=new DomInterfaces_ReverbDisplay(props);
                break;
                case "MixerTesselator":
                    newInterface=new DomInterfaces_MixerDisplay(props);
                break;
                case "Mixer":
                    newInterface=new DomInterfaces_MixerDisplay(props);
                break;
                default:
                    newInterface=new DomInterfaces_GenericDisplay(props);
            }
            moduleCreationListeners.map((cb)=>cb(newModule,newInterface,count));

            
            newInterface.handyPosition(count + 3);

            count++;
            return newModule;
        }
        //TODO: the dumped file assumes the modules contain a property called "name" which contains exactly the name to which this patcher refers to as that module, thus it's limited to modules created with "create" functioon
        //creates a procedure to recreate the current patch
        const dumpPatch = () => {
            let instanceStrings = [];
            let connectionStrings = [];
            let settingStrings = [];
            let autozoomStrings = [];
            
            /** @type {Array<Module>} */
            let modulesList = [];

            Object.keys(this.modules).map((mname)=>{
                modulesList.push(this.modules[mname]);
            });

            modulesList.sort((a,b)=>{
                return a.getInterface().attributes.y - b.getInterface().attributes.y;
            });
            
            modulesList.map((module)=>{
                //make creation string
                let constructorName = module.constructor.name;
                let name = module.name;
                instanceStrings.push(`create(possibleModules.${constructorName},"${name}");`);
                /** @type {Set<InputNode>} */
                let outputs=module.outputs;
                outputs.forEach((inputNode)=>{
                    /** @type {Module} */
                    let inputNodeOwner = inputNode.owner;
                    /* the key under which this inputNode is kept in owner module */
                    let inputNodeNameInOwner = Object.keys(inputNodeOwner.inputs)
                        .find((inputName)=>inputNodeOwner.inputs[inputName]===inputNode);
                    
                    connectionStrings.push(`modules["${name}"].connectTo(modules["${this.modules[inputNodeOwner.name].name}"].inputs.${inputNodeNameInOwner});`);
                });
                const setts = JSON.stringify(module.settings,null, 2);
                settingStrings.push('modules["'+name+'"].set('+setts+');');
                autozoomStrings.push('modules["'+name+'"].getInterface().autoZoom();');

            });
            return [instanceStrings,connectionStrings,settingStrings,autozoomStrings].flat().join("\n").replace(/\"/g,"'");
        }

        //export stuff to window, so that you can call it from webinspector

        window.possibleModules=this.possibleModules={
            Oscillator: SoundModules_Oscillator,
            Mixer: SoundModules_Mixer,
            MixerTesselator: SoundModules_MixerTesselator,
            Delay: SoundModules_Delay,
            DelayWithFilter: SoundModules_DelayWithFilter,
            EnvelopeGenerator: SoundModules_EnvelopeGenerator,
            Chebyshev: SoundModules_Chebyshev,
            Filter: SoundModules_Filter,
            Repeater: SoundModules_Repeater,
            Hipparchus: SoundModules_Hipparchus,
            WaveFolder: SoundModules_WaveFolder,
            NaiveReverb: SoundModules_NaiveReverb,
        };

        Object.keys(this.possibleModules).map((mname)=>{
            if(window[mname]===undefined) window[mname]=this.possibleModules[mname];
        });
        
        window.create=(module,name)=>{
            if(!module){
                console.error("create: provided module is",module);
                return Object.keys(this.possibleModules);
            }
            return this.create(module,name)
        };
        window.modules=this.modules;
        window.dumpPatch=()=>{return dumpPatch()};
        window.connect=(from,to)=>{
            from=([from]).flat();
            to=([to]).flat();
            from.map((source)=>{
                to.map((destination)=>{
                    source.connectTo(destination);
                })
            });
        }

    }
}

/* harmony default export */ const src_LiveCodingInterface = (LiveCodingInterface);
;// CONCATENATED MODULE: ./src/patches/rotator.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function run(codeInterface) {
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
;// CONCATENATED MODULE: ./src/patches/goodstart.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function goodstart_run(codeInterface) {
  create(possibleModules.MixerTesselator,'main');
  create(possibleModules.Oscillator,'sqw');
  create(possibleModules.EnvelopeGenerator,'envelope');
  create(possibleModules.Filter,'envFilter');
  create(possibleModules.Filter,'filter');
  create(possibleModules.Filter,'filter2');
  modules['sqw'].connectTo(modules['filter'].inputs.main);
  modules['sqw'].connectTo(modules['filter2'].inputs.main);
  modules['envelope'].connectTo(modules['envFilter'].inputs.main);
  modules['envFilter'].connectTo(modules['filter2'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  modules['filter2'].connectTo(modules['main'].inputs.b);
  modules['main'].set({
    'amplitude': 1,
    'levela': 0.65,
    'levelb': 0,
    'levelc': 0.5,
    'leveld': 0.5
  });
  modules['sqw'].set({
    'amplitude': 0.7333333333333333,
    'bias': 0,
    'length': 1,
    'frequency': 4.825,
    'phase': 0,
    'shape': 'square'
  });
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
        7056,
        -1318.7308762243943
      ],
      [
        8985,
        -3048.401900606446
      ]
    ],
    'loop': true
  });
  modules['envFilter'].set({
    'gain': 0.6,
    'reso': 1.9100000000000001,
    'length': 1,
    'type': 'HpBoxcar',
    'order': 1,
    'frequency': 58.64999999999992,
    'saturate': false
  });
  modules['filter'].set({
    'gain': 3.4400000000000004,
    'reso': 3.2399999999999967,
    'length': 1,
    'type': 'LpMoog',
    'order': 3,
    'frequency': 427.97777777777776,
    'saturate': true
  });
  modules['filter2'].set({
    'gain': 0.40000000000000013,
    'reso': 1.6600000000000006,
    'length': 1,
    'type': 'Comb',
    'order': 1,
    'frequency': 757.2222222222222,
    'saturate': true,
    'Reso': 1.95
  });
  modules['main'].getInterface().autoZoom();
  modules['sqw'].getInterface().autoZoom();
  modules['envelope'].getInterface().autoZoom();
  modules['envFilter'].getInterface().autoZoom();
  modules['filter'].getInterface().autoZoom();
  modules['filter2'].getInterface().autoZoom();
}
;// CONCATENATED MODULE: ./src/patches/reverb1.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function reverb1_run(codeInterface) {


  create(possibleModules.NaiveReverb, 'reverb');
  create(possibleModules.Filter, 'noiseFilter');
  create(possibleModules.Oscillator, 'noise');
  create(possibleModules.EnvelopeGenerator, 'noiseEnvelope');
  modules['noiseFilter'].connectTo(modules['reverb'].inputs.main);
  modules['noise'].connectTo(modules['noiseFilter'].inputs.main);
  modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
  modules['reverb'].set({
    'feedback': 1,
    'diffusion': 0.01,
    'time': 0.05,
    'dry': 1,
    'wet': 1
  });
  modules['noiseFilter'].set({
    'gain': 6.930000000000001,
    'reso': 0.5799999999999966,
    'length': 1,
    'type': 'LpMoog',
    'order': 2.000000000000001,
    'frequency': 9962,
    'saturate': true
  });
  modules['noise'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 3917.6666666666665,
    'phase': 0,
    'shape': 'noise'
  });
  modules['noiseEnvelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        0,
        0
      ],
      [
        1598,
        1
      ],
      [
        2315,
        0
      ],
      [
        7111,
        0
      ],
      [
        22050,
        0
      ]
    ],
    'loop': false
  });
  // modules['reverb'].getInterface().autoZoom();
  modules['noiseFilter'].getInterface().autoZoom();
  modules['noise'].getInterface().autoZoom();
  modules['noiseEnvelope'].getInterface().autoZoom();



}
;// CONCATENATED MODULE: ./src/patches/delay.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function delay_run(codeInterface) {
  create(possibleModules.Delay, 'delay');
  create(possibleModules.DelayWithFilter, 'filteredDelay');
  create(possibleModules.Filter, 'noiseFilter');
  create(possibleModules.Oscillator, 'noise');
  create(possibleModules.EnvelopeGenerator, 'noiseEnvelope');
  modules['noise'].connectTo(modules['delay'].inputs.main);
  modules['noise'].connectTo(modules['filteredDelay'].inputs.main);
  modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
  modules['delay'].set({
    'feedback': 0.83,
    'time': 0.01167222222222214,
    'dry': 0.57,
    'wet': 0.35,
    'diffusion': 0.01
  });
  modules['filteredDelay'].set({
    'feedback': 0.9600000000000001,
    'time': 0.007255555555555494,
    'dry': 0.2900000000000002,
    'wet': 1.4400000000000002,
    'gain': 0.5499999999999998,
    'reso': 2.0700000000000007,
    'length': 1,
    'type': 'LpMoog',
    'order': 0,
    'frequency': 10336,
    'saturate': true,
    'diffusion': 0.01
  });
  modules['noiseFilter'].set({
    'gain': 6.930000000000001,
    'reso': 0.5799999999999966,
    'length': 1,
    'type': 'LpMoog',
    'order': 2.000000000000001,
    'frequency': 9962,
    'saturate': true
  });
  modules['noise'].set({
    'amplitude': 0,
    'bias': 0,
    'length': 1,
    'frequency': 3917.6666666666665,
    'phase': 0,
    'shape': 'noise'
  });
  modules['noiseEnvelope'].set({
    'amplitude': 1,
    'bias': 0,
    'length': 1,
    'points': [
      [
        0,
        0
      ],
      [
        2315,
        0
      ],
      [
        3142,
        1.3833333333333333
      ],
      [
        3913,
        0.016666666666666666
      ],
      [
        22050,
        0
      ]
    ],
    'loop': false
  });
  modules['delay'].getInterface().autoZoom();
  modules['filteredDelay'].getInterface().autoZoom();
  modules['noiseFilter'].getInterface().autoZoom();
  modules['noise'].getInterface().autoZoom();
  modules['noiseEnvelope'].getInterface().autoZoom();
}
;// CONCATENATED MODULE: ./src/patches/drumpat.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function drumpat_run(codeInterface) {
  
  create(possibleModules.MixerTesselator,'main');
create(possibleModules.Oscillator,'sine');
create(possibleModules.Filter,'filter');
create(possibleModules.EnvelopeGenerator,'envelope');
create(possibleModules.Repeater,'repet');
create(possibleModules.Filter,'noiseFilter');
create(possibleModules.Oscillator,'noise');
create(possibleModules.EnvelopeGenerator,'noiseEnvelope');
modules['sine'].connectTo(modules['main'].inputs.b);
modules['filter'].connectTo(modules['sine'].inputs.frequency);
modules['envelope'].connectTo(modules['filter'].inputs.main);
modules['repet'].connectTo(modules['main'].inputs.d);
modules['noiseFilter'].connectTo(modules['repet'].inputs.main);
modules['noise'].connectTo(modules['noiseFilter'].inputs.main);
modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
modules['main'].set({
  'amplitude': 1,
  'levela': 1,
  'levelb': 1,
  'levelc': 1,
  'leveld': 0.6499999999999999
});
modules['sine'].set({
  'amplitude': 0.7567991480823322,
  'bias': 0,
  'length': 1,
  'frequency': 34.806629834254146,
  'shape': 'sin'
});
modules['filter'].set({
  'gain': 0.6799999999999999,
  'reso': 0.9400000000000001,
  'length': 1,
  'type': 'HpBoxcar',
  'order': 1,
  'frequency': 36.66666666666667,
  'saturate': false
});
modules['envelope'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'points': [
    [
      16041,
      35.72758709124256
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
    ],
    [
      33405,
      0
    ]
  ],
  'loop': false
});
modules['repet'].set({
  'length': 1,
  'points': [
    [
      6063,
      -0.003124281261118767
    ],
    [
      15490,
      0.02316965514238813
    ],
    [
      20837,
      0.06979094792778547
    ],
    [
      25578,
      -0.028227657315016162
    ],
    [
      32578,
      0.009688721856098103
    ]
  ],
  'loop': false,
  'gain': 12.44
});
modules['noiseFilter'].set({
  'gain': 6.420000000000001,
  'reso': 0.7099999999999966,
  'length': 1,
  'type': 'Comb',
  'order': 2.000000000000001,
  'frequency': 341,
  'saturate': true
});
modules['noise'].set({
  'amplitude': -0.009999999999999992,
  'bias': 0,
  'length': 1,
  'frequency': 3917.6666666666665,
  'shape': 'noise'
});
modules['noiseEnvelope'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'points': [
    [
      0,
      0
    ],
    [
      1598,
      0.12049330558547815
    ],
    [
      2315,
      0.04550038057594907
    ],
    [
      7111,
      -0.0001969597369755695
    ],
    [
      22050,
      0.0006278946322569583
    ]
  ],
  'loop': false
});
modules['main'].getInterface().autoZoom();
modules['sine'].getInterface().autoZoom();
modules['filter'].getInterface().autoZoom();
modules['envelope'].getInterface().autoZoom();
modules['repet'].getInterface().autoZoom();
modules['noiseFilter'].getInterface().autoZoom();
modules['noise'].getInterface().autoZoom();
modules['noiseEnvelope'].getInterface().autoZoom();



}
;// CONCATENATED MODULE: ./src/patches/filterTester.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function filterTester_run(codeInterface) {
  create(possibleModules.MixerTesselator, 'main');
  create(possibleModules.Oscillator, 'square');
  create(possibleModules.EnvelopeGenerator, 'envelope');
  create(possibleModules.Filter, 'envFilter');
  create(possibleModules.Filter, 'filter');
  create(possibleModules.Filter, 'filter2');
  modules['square'].connectTo(modules['filter'].inputs.main);
  modules['square'].connectTo(modules['filter2'].inputs.main);
  modules['envelope'].connectTo(modules['envFilter'].inputs.main);
  modules['envelope'].connectTo(modules['filter2'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter'].inputs.frequency);
  modules['envFilter'].connectTo(modules['filter2'].inputs.frequency);
  modules['filter'].connectTo(modules['main'].inputs.a);
  modules['filter2'].connectTo(modules['main'].inputs.b);
  modules['main'].set({
    'amplitude': 1,
    'levela': 1.183333333333333,
    'levelb': 1.05,
    'levelc': 1.3333333333333335,
    'leveld': 0.5
  });
  modules['main'].getInterface().autoZoom();
  modules['square'].set({
    'amplitude': 0.7791666666666667,
    'bias': 0,
    'length': 1,
    'frequency': 32,
    'shape': 'square'
  });
  modules['square'].getInterface().autoZoom();
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
        10363,
        -4394.160876794359
      ],
      [
        12844,
        -9315.818506205853
      ]
    ],
    'loop': true
  });
  modules['envelope'].getInterface().autoZoom();
  modules['envFilter'].set({
    'gain': 0.8599999999999999,
    'reso': 2.1500000000000004,
    'length': 1,
    'type': 'HpBoxcar',
    'order': 1,
    'frequency': 283.6666666666627,
    'saturate': false
  });
  modules['envFilter'].getInterface().autoZoom();
  modules['filter'].set({
    'gain': 1.5100000000000007,
    'reso': 21.32,
    'length': 1,
    'type': 'LpMoog',
    'order': 10,
    'frequency': 705.2222222222247,
    'saturate': true
  });
  modules['filter'].getInterface().autoZoom();
  modules['filter2'].set({
    'gain': 0.08999999999999997,
    'reso': 2.0300000000000007,
    'length': 1,
    'type': 'Comb',
    'order': 5,
    'frequency': 447.5555555555555,
    'saturate': true
  });
  modules['filter2'].getInterface().autoZoom();
}
;// CONCATENATED MODULE: ./src/patches/multireso.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function multireso_run(codeInterface) {create(possibleModules.Mixer,'main');
create(possibleModules.DelayWithFilter,'filteredDelay1');
create(possibleModules.DelayWithFilter,'filteredDelay2');
create(possibleModules.DelayWithFilter,'filteredDelay3');
create(possibleModules.DelayWithFilter,'filteredDelay4');
create(possibleModules.Oscillator,'noise');
create(possibleModules.EnvelopeGenerator,'noiseEnvelope');
modules['filteredDelay1'].connectTo(modules['filteredDelay2'].inputs.main);
modules['filteredDelay1'].connectTo(modules['filteredDelay3'].inputs.main);
modules['filteredDelay1'].connectTo(modules['filteredDelay4'].inputs.main);
modules['filteredDelay1'].connectTo(modules['main'].inputs.a);
modules['filteredDelay2'].connectTo(modules['main'].inputs.b);
modules['filteredDelay3'].connectTo(modules['main'].inputs.c);
modules['filteredDelay4'].connectTo(modules['main'].inputs.d);
modules['noise'].connectTo(modules['filteredDelay1'].inputs.main);
modules['noiseEnvelope'].connectTo(modules['noise'].inputs.amplitude);
modules['main'].set({
  'amplitude': 1,
  'levela': 1.7666666666666675,
  'levelb': 2.483333333333334,
  'levelc': 2.083333333333334,
  'leveld': 0.7
});
modules['filteredDelay1'].set({
  'feedback': -0.8900000000000007,
  'time': 0.023645555555555517,
  'dry': 0.1700000000000002,
  'wet': 0.9400000000000001,
  'gain': 0.34999999999999976,
  'reso': 2.9400000000000013,
  'length': 1,
  'type': 'LpMoog',
  'order': 1,
  'frequency': 8662.44444444444,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay2'].set({
  'feedback': -0.9300000000000003,
  'time': 0.005702222222222172,
  'dry': 0.8600000000000001,
  'wet': 5.66,
  'gain': 0.18999999999999975,
  'reso': 2.0700000000000007,
  'length': 1,
  'type': 'Pinking',
  'order': 1,
  'frequency': 6480.777777777777,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay3'].set({
  'feedback': 0.9699999999999993,
  'time': 0.006964444444444384,
  'dry': 0.2900000000000002,
  'wet': 1.4400000000000002,
  'gain': 0.7999999999999998,
  'reso': 0.1400000000000008,
  'length': 1,
  'type': 'LpMoog',
  'order': 0,
  'frequency': 4225.555555555555,
  'saturate': true,
  'diffusion': 0.01
});
modules['filteredDelay4'].set({
  'feedback': -0.9500000000000004,
  'time': 0.00673999999999994,
  'dry': 1.6653345369377348e-16,
  'wet': 8.860000000000001,
  'gain': 0.13999999999999974,
  'reso': 4.050000000000001,
  'length': 1,
  'type': 'LpMoog',
  'order': 1,
  'frequency': 8081.1111111111095,
  'saturate': false,
  'diffusion': 0.01
});
modules['noise'].set({
  'amplitude': 0,
  'bias': 0,
  'length': 1,
  'frequency': 3917.6666666666665,
  'phase': 0,
  'shape': 'noise'
});
modules['noiseEnvelope'].set({
  'amplitude': 1,
  'bias': 0,
  'length': 1,
  'points': [
    [
      0,
      0
    ],
    [
      2315,
      0
    ],
    [
      3142,
      1.3833333333333333
    ],
    [
      3913,
      0.016666666666666666
    ],
    [
      22050,
      0
    ]
  ],
  'loop': false
});
modules['main'].getInterface().autoZoom();
modules['filteredDelay1'].getInterface().autoZoom();
modules['filteredDelay2'].getInterface().autoZoom();
modules['filteredDelay3'].getInterface().autoZoom();
modules['filteredDelay4'].getInterface().autoZoom();
modules['noise'].getInterface().autoZoom();
modules['noiseEnvelope'].getInterface().autoZoom();
}
;// CONCATENATED MODULE: ./src/patches/wave1.js
// @ts-nocheck



/** @param {LiveCodingInterface} codeInterface */
function wave1_run(codeInterface) {
  create(possibleModules.Oscillator,'oscillator');
  create(possibleModules.WaveFolder,'wavefolder');
  create(possibleModules.Filter,'filter');
  modules['oscillator'].connectTo(modules['wavefolder'].inputs.main);
  modules['wavefolder'].connectTo(modules['filter'].inputs.main);
  modules['oscillator'].set({
    'amplitude': 0.5124999650447224,
    'bias': 0,
    'length': 1,
    'frequency': 306.53733528550447,
    'phase': 0,
    'shape': 'sin'
  });
  modules['wavefolder'].set({
    'amplitude': 0.39,
    'bias': -0.9400000000000002,
    'fold': 0.9400000000000002,
    'preamp': 1,
    'ceiling': 1.1400000000000001
  });
  modules['filter'].set({
    'gain': 3,
    'reso': 2.72,
    'length': 1,
    'type': 'LpMoog',
    'order': 0,
    'frequency': 9000.555555555558,
    'saturate': true
  });
  modules['oscillator'].getInterface().autoZoom();
  modules['wavefolder'].getInterface().autoZoom();
  modules['filter'].getInterface().autoZoom();
}
;// CONCATENATED MODULE: ./src/utils/asanoboy-makewav.js

var Wav = function(opt_params){
    
    let hasContents = false;
	/**
	 * @private
	 */
	let sampleRate = opt_params && opt_params.sampleRate ? opt_params.sampleRate : 44100;
	
	/**
	 * @private
	 */
	let channels = opt_params && opt_params.channels ? opt_params.channels : 2;  
	
	/**
	 * @private
	 */
	let eof = true;
	
	/**
	 * @private
	 */
	let bufferNeedle = 0;
	
	/**
	 * @private
	 */
    let buffer;
    let internalBuffer;
    let hasOutputHeader;
    
	this.setBuffer = (to) => {
        buffer = this.getWavInt16Array(to);
        bufferNeedle = 0;
        internalBuffer = '';
        hasOutputHeader = false;
        eof = false;
        hasContents=true;
    }
    this.getBuffer = (len) => {
        if(!hasContents) throw new Error("requested buffer, but the buffer has not been set yet.");
        var rt;
        if( bufferNeedle + len >= buffer.length ){
            rt = new Int16Array(buffer.length - bufferNeedle);
            eof = true;
        }
        else {
            rt = new Int16Array(len);
        }
        
        for(var i=0; i<rt.length; i++){
            rt[i] = buffer[i+bufferNeedle];
        }
        bufferNeedle += rt.length;
        
        return  rt.buffer;
    };

    this.getBlob = () => {
        const srclist = [];
        while( !this.eof() ){
            srclist.push(this.getBuffer(1000));
        }
        return new Blob(srclist, {type:'audio/wav'});
    }

    this.getDownload = () => {
        const b = this.getBlob();
        const URLObject = window.webkitURL || window.URL;
        return URLObject.createObjectURL(b);
    }

    this.eof = function(){
        return eof;
    };

    this.getWavInt16Array = (buffer) => {
		
        var intBuffer = new Int16Array(buffer.length + 23), tmp;
        
        intBuffer[0] = 0x4952; // "RI"
        intBuffer[1] = 0x4646; // "FF"
        
        intBuffer[2] = (2*buffer.length + 15) & 0x0000ffff; // RIFF size
        intBuffer[3] = ((2*buffer.length + 15) & 0xffff0000) >> 16; // RIFF size
        
        intBuffer[4] = 0x4157; // "WA"
        intBuffer[5] = 0x4556; // "VE"
            
        intBuffer[6] = 0x6d66; // "fm"
        intBuffer[7] = 0x2074; // "t "
            
        intBuffer[8] = 0x0012; // fmt chunksize: 18
        intBuffer[9] = 0x0000; //
            
        intBuffer[10] = 0x0001; // format tag : 1 
        intBuffer[11] = channels; // channels: 2
        
        intBuffer[12] = sampleRate & 0x0000ffff; // sample per sec
        intBuffer[13] = (sampleRate & 0xffff0000) >> 16; // sample per sec
        
        intBuffer[14] = (2*channels*sampleRate) & 0x0000ffff; // byte per sec
        intBuffer[15] = ((2*channels*sampleRate) & 0xffff0000) >> 16; // byte per sec
        
        intBuffer[16] = 0x0004; // block align
        intBuffer[17] = 0x0010; // bit per sample
        intBuffer[18] = 0x0000; // cb size
        intBuffer[19] = 0x6164; // "da"
        intBuffer[20] = 0x6174; // "ta"
        intBuffer[21] = (2*buffer.length) & 0x0000ffff; // data size[byte]
        intBuffer[22] = ((2*buffer.length) & 0xffff0000) >> 16; // data size[byte]	
    
        for (var i = 0; i < buffer.length; i++) {
            tmp = buffer[i];
            if (tmp >= 1) {
                intBuffer[i+23] = (1 << 15) - 1;
            }
            else if (tmp <= -1) {
                intBuffer[i+23] = -(1 << 15);
            }
            else {
                intBuffer[i+23] = Math.round(tmp * (1 << 15));
            }
        }
        
        return intBuffer;
    };
};



/* harmony default export */ const asanoboy_makewav = (Wav);
;// CONCATENATED MODULE: ./src/scaffolding/SoundDownloader.js







class SoundDownloader{
    constructor(){
        
        /** @type {Module|false} */
        let myModule = false;

        let position={
            x:0,
            y:0,
            width:20,
            height:20,
            spacing:5,
        }

        const everyPlayButton=[];
        /** @param {Module} module */
        this.appendModule = (module)=>{
            console.log("module appended to downloader");

            let topLine = position.y - position.height / 2;
            let bottomLine = position.y + position.height / 2;
            let leftLine = position.x - position.width / 2;
            let rightLine = position.x + position.width / 2;

            let innerLeftLine = position.x - position.width / 4;
            let innerRightLine = position.x + position.width / 4;
            let arrowMiddleLine = position.y + position.height / 10;

            //arrow
            let c1=`${innerLeftLine}, ${topLine}`;
            let c2=`${innerRightLine}, ${topLine}`;
            let c3=`${innerRightLine}, ${arrowMiddleLine}`;
            let c4=`${rightLine}, ${arrowMiddleLine}`;

            let c5=`${position.x}, ${bottomLine}`;

            let c6=`${leftLine}, ${arrowMiddleLine}`;
            let c7=`${innerLeftLine}, ${arrowMiddleLine}`;
            let c8=`${innerLeftLine}, ${topLine}`;

            const downloadButton = new scaffolding_elements.Group();

            let path = new scaffolding_elements.Path({
                d: `M ${c1}
                    L ${c2} 
                    L ${c3} 
                    L ${c4}
                    L ${c5}
                    L ${c6}
                    L ${c7}
                    L ${c8}
                    z`,
            });

            downloadButton.add(path);

            downloadButton.domElement.setAttribute("class","button download");
            everyPlayButton.push(downloadButton);
            module.getInterface().appendToControlPanel(
                downloadButton, position.width +10
            );
            
            module.onUpdate((changes)=>{
                if(changes.cachedValues){
                    // this.updateBuffer();
                }
            });
            
            downloadButton.domElement.addEventListener('mousedown',(evt)=>{
                downloadButton.domElement.classList.add("active");
                this.download(module);
            });

            downloadButton.domElement.addEventListener('mousedown',(evt)=>{
                downloadButton.domElement.classList.remove("active");
            });
            
        }
        let downloadno = 0;
        /** @param {Module} module */
        this.download=(module)=>{
            
            function namedDownload(blob, filename) {
                var a = document.createElement('a');
                a.download = filename;
                a.href = blob;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            
            const wav = new asanoboy_makewav({sampleRate: sampleRate, channels: 1});
            const buffer = new Float32Array(module.cachedValues);
            wav.setBuffer(buffer);
            const link = wav.getDownload();

            namedDownload(link,
                "soundsculpt-"
                + module.name
                + "-"
                + (downloadno++)
            );
        }

        // this.updateBuffer = ()=>{
        //     if(!buffer) return;
        //     if(!myModule) return;
        //     //not possible for now
        // }

        // /** @type {AudioBuffer|false} */
        // let buffer=false;

    }
}
/* harmony default export */ const scaffolding_SoundDownloader = (SoundDownloader);
;// CONCATENATED MODULE: ./src/index.js
//DOM gui





__webpack_require__.e(/* import() */ 801).then(__webpack_require__.bind(__webpack_require__, 488)).then((lib) => {
    // lib is the wasm library you can now use.
    console.log(`2 + 2 = ${lib.add(2, 2)}`)
})

const drawBoard=new scaffolding_Canvas();
drawBoard.element.classList.add("drawboard");
const navBoard=new scaffolding_Canvas();
navBoard.element.classList.add("nav");


//other interfaces



const webInspectorInterface=new src_LiveCodingInterface({drawBoard});


const patchDisplay = new DomInterfaces_PatchDisplay(drawBoard);

const timeZoomer = new DomInterfaces_TimeZoomer();
navBoard.add(timeZoomer);

const player=new scaffolding_SoundPlayer();
const downloader = new scaffolding_SoundDownloader();

webInspectorInterface.onModuleCreated((newModule,newInterface,count)=>{
    patchDisplay.appendModules(newModule);
    player.appendModule(newModule);
    downloader.appendModule(newModule);
    drawBoard.add(newInterface);
});

drawBoard.add(patchDisplay);

components_Draggable.setCanvas();

//pre-run a live-coded patch











window.demos = {
    "rotator": ()=>run(webInspectorInterface),
    "drumpat2": ()=>goodstart_run(webInspectorInterface),
    "reverb1": ()=>reverb1_run(webInspectorInterface),
    "delay": ()=>delay_run(webInspectorInterface),
    "drumpat": ()=>drumpat_run(webInspectorInterface),
    "filterTester": ()=>filterTester_run(webInspectorInterface),
    "multireso": ()=>multireso_run(webInspectorInterface),
    "wavefolder": ()=>wave1_run(webInspectorInterface),
}

let hashBefore = window.location.hash;
const hashchange=()=>{
    if(window.location.hash){
        let hashval = window.location.hash.slice(1);
        if(window.demos[hashval]){
            console.log("trying load of",hashval);
            window.demos[hashval]();
        }
    }else{
        if(hashBefore){
            
        }
    }
}

window.addEventListener('DOMContentLoaded', hashchange);

window.addEventListener("hashchange",hashchange);

window.onpopstate = ()=>window.location.reload();

/***/ }),

/***/ 147:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @typedef {Object} MiniVector
 * @property {number} [x]
 * @property {number} [y]
 * @export MiniVector
 */

/**
 * @class Vector 2
 * @param {Vector2|MiniVector} options
 */
function Vector2(options={x:0,y:0}){
    this.x=options.x;
    this.y=options.y;
    /** @param {Vector2} to */
    this.add=(to)=>{
        this.x+=to.x;
        this.y+=to.y;
        return this;
    }
    /** @param {Vector2} to */
    this.sub=(to)=>{
        this.x-=to.x;
        this.y-=to.y;
        return this;
    }
    this.clone=()=>{
        return new Vector2(this);
    }
    /** @param {Vector2|MiniVector} to */
    this.set=(to)=>{
        if(to.x!==undefined) this.x=to.x;
        if(to.y!==undefined) this.y=to.y;
    }
    this.set(options);
}

/** 
 * @param {Vector2|MiniVector} vec1 
 * @param {Vector2} vec2 
 **/
Vector2.add=(vec1, vec2)=>{
    return (new Vector2(vec1)).add(vec2);
}

/** 
 * @param {Vector2|MiniVector} vec1 
 * @param {Vector2} vec2 
 **/
Vector2.sub=(vec1, vec2)=>{
    return (new Vector2(vec1)).sub(vec2);
}

/** 
 * @param {Vector2|MiniVector} vec1
 **/
Vector2.clone=(vec1)=>{
    return (new Vector2(vec1));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector2);

/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ Component),
/* harmony export */   "Circle": () => (/* binding */ Circle),
/* harmony export */   "Path": () => (/* binding */ Path),
/* harmony export */   "Line": () => (/* binding */ Line),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle),
/* harmony export */   "Group": () => (/* binding */ Group),
/* harmony export */   "Text": () => (/* binding */ Text)
/* harmony export */ });


/**
 * @typedef {Object<String,any>} ComponentOptions
 * @property {number} [x]
 * @property {number} [y]
 */

/**
 * Defines a drawable object which can be attached to a Sprite or a Group
 */
class Component {
    /** @param {ComponentOptions} myOptions */
    constructor(myOptions = { x: 0, y: 0 }) {
        /** @type {SVGElement|undefined} */
        this.domElement=undefined;
        this.attributes = {};
        this.appliedAttributes = {};
        this.update = () => {
            if (!this.domElement)
                return console.warn("this.domElement is", this.domElement);
            //apply what has been modified to the dom element
            //it also keeps track of modified attributes to prevent redundant changes
            Object.keys(this.attributes).map((attrName) => {
                const attr = this.attributes[attrName];
                const appliedAttr = this.appliedAttributes[attrName];
                if (attr !== appliedAttr) {
                    this.domElement.setAttribute(attrName, attr);
                    this.attributes[attrName] = attr;
                }
            });
        };
        this.set = (attrname, attrval) => {
            this.attributes[attrname] = attrval;
            this.update();
        };
        Object.assign(this.attributes, myOptions);
    }
}

/**
 * @typedef {ComponentOptions} CircleOptions
 * @param {number} [radius]
 */
class Circle extends Component{
    /**
     * @param {CircleOptions} myOptions
     **/
    constructor(myOptions = {
        cx: 0, cy: 0, r: 50
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} PathOptions
 */
class Path extends Component{
    /**
     * @param {PathOptions} myOptions
     **/
    constructor(myOptions = {
        d: `M 10,30
    A 20,20 0,0,1 50,30
    A 20,20 0,0,1 90,30
    Q 90,60 50,90
    Q 10,60 10,30 z`
    }) {
        // Component.call(this, myOptions);
        super(myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} RectangleOptions
 * @property {string} [fill]
 * @property {number} [width]
 * @property {number} [height]
 */
class Rectangle extends Component {
    /**
     * @param {RectangleOptions} myOptions
     **/
    constructor(myOptions = {
        x: 0, y: 0, width: 100, height: 100
    }) {
        super(myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} LineOptions
 */
class Line extends Component {
    /**
     * @param {LineOptions} myOptions
     **/
    constructor(myOptions = {
        x1: 0, y1: 80, x2: 100, y2: 20
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} GroupOptions
 */
class Group extends Component {
    /** @param {GroupOptions} myOptions */
    constructor(myOptions = {
        x: 0, y: 0,
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        /** @param {Component} elem */
        this.add = (elem) => {
            this.domElement.appendChild(elem.domElement);
            return this;
        };
        this.remove = (elem) => {
            this.domElement.removeChild(elem.domElement);
        }
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} TextOptions
 * @property {"middle"|"left"|"right"} 'text-anchor'
 */
class Text extends Component {

    /** @param {ComponentOptions} myOptions */
    constructor(myOptions = {
        x: 0, y: 0, text: "---"
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        
        const superUpdate = this.update;
        this.update = () => {
            this.domElement.innerHTML = this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}





/***/ }),

/***/ 42:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".main.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "fields:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfields"] = self["webpackChunkfields"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm chunk loading */
/******/ 	(() => {
/******/ 		// object to store loaded and loading wasm modules
/******/ 		var installedWasmModules = {};
/******/ 		
/******/ 		function promiseResolve() { return Promise.resolve(); }
/******/ 		
/******/ 		
/******/ 		var wasmImportObjects = {
/******/ 			637: function() {
/******/ 				return {
/******/ 		
/******/ 				};
/******/ 			},
/******/ 		};
/******/ 		
/******/ 		var wasmModuleMap = {
/******/ 			"801": [
/******/ 				637
/******/ 			]
/******/ 		};
/******/ 		
/******/ 		// object with all WebAssembly.instance exports
/******/ 		__webpack_require__.w = {};
/******/ 		
/******/ 		// Fetch + compile chunk loading for webassembly
/******/ 		__webpack_require__.f.wasm = function(chunkId, promises) {
/******/ 		
/******/ 			var wasmModules = wasmModuleMap[chunkId] || [];
/******/ 		
/******/ 			wasmModules.forEach(function(wasmModuleId, idx) {
/******/ 				var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/ 		
/******/ 				// a Promise means "currently loading" or "already loaded".
/******/ 				if(installedWasmModuleData)
/******/ 					promises.push(installedWasmModuleData);
/******/ 				else {
/******/ 					var importObject = wasmImportObjects[wasmModuleId]();
/******/ 					var req = fetch(__webpack_require__.p + "" + {"801":{"637":"7e272d37442e5d331d00"}}[chunkId][wasmModuleId] + ".module.wasm");
/******/ 					var promise;
/******/ 					if(importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
/******/ 						promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 							return WebAssembly.instantiate(items[0], items[1]);
/******/ 						});
/******/ 					} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 						promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 					} else {
/******/ 						var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 						promise = bytesPromise.then(function(bytes) {
/******/ 							return WebAssembly.instantiate(bytes, importObject);
/******/ 						});
/******/ 					}
/******/ 					promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 						return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 					}));
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(679);
/******/ 	
/******/ })()
;