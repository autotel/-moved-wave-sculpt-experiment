
/**
 * @typedef {Object} timeInterval
 * @property {number} end
 * @property {number} start
 * @property {number} duration
 */

/** @returns {timeInterval} */
const measureExec=(cb)=>{

    let ret = {}
    ret.start = performance.now();
    cb();
    ret.end = performance.now();
    ret.duration = ret.end-ret.start;
    return ret;
    
}

module.exports = measureExec;