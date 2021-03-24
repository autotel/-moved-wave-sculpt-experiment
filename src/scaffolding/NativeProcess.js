class NativeProcess {
    constructor(){
        const notReady = (fname) => console.warn("not ready!",fname);

        this.ready=false;

        /**
         * @callback onReadyCallback
         * @param {NativeProcess} nativeProcess loaded wasm or other worker process 
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

        this._handleReady=(caller)=>{
            onReadyCallbacks.forEach((callback)=>callback(caller));
        }

        this.add=(a,b)=>notReady("NativeProcess add");
        /**
         * @param {number} values
         **/
        this.arrGenSin=((duration,frequency)=>notReady("NativeProcess arrSin"));
        /**
         * @param {Array<number>} values
         **/
        this.arrCombFilter=((...p)=>notReady("NativeProcess arrSin"));
    }

}
export default NativeProcess;