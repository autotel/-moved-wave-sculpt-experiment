//todo: un-hardcode this.
const sampleRate = 44100;

class RustProcessor {
    constructor (){
        
        if(RustProcessor.instance) console.warn("more than one instance of rustProcessor");
        RustProcessor.instance=this;

        this.ready=false;


        /**
         * @callback onReadyCallback
         * @param {RustProcessor} rustProcessor loaded wasm or other worker process 
         */
        /** @type  {Array<onReadyCallback>} */
        const onReadyCallbacks = [];
        /**
         * @param {onReadyCallback} callback
         **/
        this.onReady = (callback)=>{
            if(this.ready){
                callback(this);
            }else{
                onReadyCallbacks.push(callback);
            }
        }

        /** @returns {Promise<RustProcessor>} */
        this.wait=()=>new Promise((resolve)=>this.onReady(()=>{
            resolve(this);
        }));

        this._handleReady=(caller)=>{
            console.log("rust process is now ready");
            onReadyCallbacks.forEach((callback)=>callback(caller));
            this.ready=true;
        }

        import('./pkg').then((lib) => {
            this.add=(a,b)=>lib.add(a,b);
            /**
             * @param {number} values
             * @returns {Float64Array} result
             **/
            this.arrGenSin = (duration,frequency)=>lib.array_sine(sampleRate,duration,frequency);
            /**
             * @param {Array<number>} values
             * @returns {Float64Array} result
             **/
            this.arrCombFilter = (samplesArray,
                frequency,dampening_inverse,dampening,feedback) => lib.array_filter_comb(
                sampleRate,samplesArray,
                frequency,dampening_inverse,dampening,feedback
            );

            /**
             * @param {object} settings
             * @param {Float32Array} settings.inputs_l
             * @param {Float32Array} settings.inputs_r
             * @param {number} settings.dampening
             * @param {boolean} settings.freeze
             * @param {number} settings.wet
             * @param {number} settings.width
             * @param {number} settings.dry
             * @param {number} settings.roomSize
             * @returns {Array<Float32Array>} result
             **/
            this.freeverb = ({
                    inputs_l,inputs_r,
                    dampening,
                    freeze,
                    wet,
                    width,
                    dry,
                    roomSize,
                }) => {
                let ret_l = new Float32Array(inputs_l.length);
                let ret_r = new Float32Array(inputs_l.length);
                
                let freeverb = new lib.Freeverb(sampleRate);

                freeverb.set_dampening(dampening);
                freeverb.set_freeze(freeze);
                freeverb.set_wet(wet);
                freeverb.set_width(width);
                freeverb.set_dry(dry);
                freeverb.set_room_size(roomSize);

                freeverb.process(inputs_l,inputs_r,ret_l,ret_r);

                return [ret_l,ret_r];
            }
            this._handleReady(this);
        });

    }
}

/** @type {RustProcessor | false} */
RustProcessor.instance = false;

/** @returns {RustProcessor} */
RustProcessor.get = () => RustProcessor.instance?RustProcessor.instance:(new RustProcessor());

export default RustProcessor;