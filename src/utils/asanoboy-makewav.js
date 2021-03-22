
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



export default Wav;