//todo: un-hardcode this.
const sampleRate = 44100;

class RustProcessor {
    constructor (){
        
        if(RustProcessor.instance) console.warn("more than one instance of rustProcessor");
        RustProcessor.instance=this;

        const notReady = (fname) => console.warn("not ready!",fname);

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

        this.add=(a,b)=>notReady("rustProcessor add");
        /**
         * @param {number} values
         * @returns {Float64Array} result
         **/
        this.arrGenSin=((duration,frequency)=>{
            notReady("rustProcessor arrSin")
            return new Float64Array();
        });
        /**
         * @param {Array<number>} values
         * @returns {Float64Array} result
         **/
        this.arrCombFilter=((...p)=>{
            notReady("rustProcessor arrSin")
            return new Float64Array();
        });
        /**
         * @param {Array<number>} values
         * @returns {Float64Array} result
         **/
        this.freeverb=((...p)=>{
            notReady("rustProcessor arrSin")
            return new Float64Array();
        });

        import('./pkg').then((lib) => {
            this.add=(a,b)=>lib.add(a,b);
            this.arrGenSin = (duration,frequency)=>lib.array_sine(sampleRate,duration,frequency);
            this.arrCombFilter = (samplesArray,
                frequency,dampening_inverse,dampening,feedback) => lib.array_filter_comb(
                sampleRate,samplesArray,
                frequency,dampening_inverse,dampening,feedback
            );

            this.freeverb = (values,...p) => {
                let ret = new Float64Array(values.length);
                let freeverb = new lib.Freeverb(sampleRate);
                freeverb.process(values,values,ret,ret);
                return ret;
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