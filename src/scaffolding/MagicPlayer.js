/** @typedef {import("./AudioWorkletProcessor.type")}*/

//get a curve to fade in/out old and new "peeked" buffer (click prevention)
const fadeCurveFunction = (v) => {
    return (1 - Math.cos(Math.PI * v)) / 2;
}

//the crossfading into new audio functionality broke after making it into AudioWorklet.
//i suspect it has to do with the sample period now being different to the interpolation samples period
//I think it needs to keep a copy of the whole audio just for playing separate from the audio
//that might be changed in runtime, as the period now is shorter than interpolationSpls

registerProcessor('magic-player', class extends AudioWorkletProcessor {
    //playing position in the original module, from where we source sound
    sourcePlayhead = 0;

    interpolationSpls = 128;

    /** @type {Array<Array<number>>} */
    audio = [];
    /** @type {false|Array<Array<number>>} */
    incomingAudio = false;

    isPlaying = false;

    constructor(...a) {
        super(...a);

        this.port.onmessage = (event) => {
            if (event.data.audio) {
                if (!this.incomingAudio) this.incomingAudio = [];
                //just so the error happens here instead of in the process
                //perhaps sample by sample is too much, revise later.
                event.data.audio.forEach((channel, channelNo) => {
                    channel.forEach((sample, sampleNo) => {
                        if (!this.incomingAudio[channelNo]) this.incomingAudio[channelNo] = [];
                        this.incomingAudio[channelNo][sampleNo] = (sample);
                    });
                });

                // this.port.postMessage(
                //     [
                //         '(new audio)',
                //         event.data.audio.length,
                //         typeof event.data.audio,
                //         event.data.audio[0].length
                //     ]);
            }
            if (event.data.play !== undefined) {
                this.isPlaying = event.data.play;

                this.port.postMessage('(play)');
            }
            if (event.data.stop) {
                this.isPlaying = false;

                this.port.postMessage('(stop)');
            }

            // this.port.postMessage(Object.keys(event.data).join());

        };

    }

    getAudioChannelCount = () => {
        return this.audio.length;
    }
    getAudioLengthSamples = () => {
        if (this.audio[0]) return this.audio[0].length;
        return 0;
    }


    //makes a slice from the module's buffer in a circular way
    getCircularSliceFromChannel = (audioSource, start, length, chanNo = 0) => {
        /** @type {Array<number>} */
        let returnBuffer = [];
        if (audioSource[chanNo]) {
            start %= audioSource[chanNo].length;
            let sliceStart = start;
            let sliceEnd = (start + length) % audioSource[chanNo].length

            returnBuffer = (
                audioSource[chanNo]
            ).slice(
                start,
                start + length
            );

            //if the current period will reach beyond the length of audio loop
            if (sliceEnd < sliceStart) {
                let append = (
                    audioSource[chanNo]
                ).slice(
                    0,
                    sliceStart - sliceEnd
                );
                returnBuffer = returnBuffer.concat(append);
            }
        }
        return returnBuffer;
    }

    getCircularSlice = (audioSource,start, length) => {
        return this.audio.map((channel, channelNo) => {
            return this.getCircularSliceFromChannel(audioSource,start, length, channelNo);
        });
    }

    fadeInProgress = 0;

    process(inputs, outputs, parameters) {

        // var input = e.inputBuffer.getChannelData(0);
        // var output = e.outputBuffer.getChannelData(0);
        const output = outputs[0];
        const playing = this.isPlaying;

        let audioLength = this.getAudioLengthSamples();

        let bufferSize = output[0].length;
        //make a copy of the audio for this period. This will let us interpolate,
        //preventing the clicks caused by buffer changes while playing.
        //note that the frequency response of the interpolation changes 
        //in function of the bufferSize selection.
        let currentAudio = this.getCircularSlice(
            this.audio,
            this.sourcePlayhead,
            bufferSize
        );

        /**
         * precise way, couldnt get it to work;
         * 
        // this way we know that we are fading in to new audio
        if (this.incomingAudio) {
            let fadingInAudio = this.getCircularSlice(
                this.incomingAudio,
                this.sourcePlayhead,
                bufferSize
            );

            currentAudio = fadingInAudio.map((chan,chanN)=>chan.map((spl,splN)=>{
                this.fadeInProgress += this.fadeInStep;
                spl *= this.fadeInProgress;
                spl += (1-this.fadeInProgress) * currentAudio[chanN][splN];
                //detect whether fade in is ready, in which case delete incoming audio
                if(this.fadeInProgress>=1){
                    if(this.incomingAudio){ //redundant but ok
                        this.incomingAudio.forEach((channel,chanN)=>channel.forEach((spl,n)=>{
                            if(!this.audio[chanN]) this.audio[chanN]
                            this.audio[chanN][n]=spl;
                        }));
                    }
                    this.incomingAudio=false;
                    this.fadeInProgress=0;
                }
                return spl;
            }));
        }
        */

        // imprecise fade in: it will keep looping the "fade in" sequence
        // I couldn't discern a difference by listening though.
        if (this.incomingAudio) {

            this.fadeInProgress += 1/this.interpolationSpls;

            this.audio = this.incomingAudio.map((chan,chanN) => {
                if(!this.audio[chanN])this.audio[chanN]=[];
                return chan.map((sample,sampleN)=>{
                    if(sampleN > this.interpolationSpls){
                        return sample;
                    }else{
                        const newWeight = sampleN / this.interpolationSpls;
                        const oldWeight = 1-newWeight;
                        let spl=sample * newWeight + this.audio[chanN][sampleN] * oldWeight;
                        if(isNaN(spl)) spl=sample;
                        return spl;
                    }
                });
            });
            this.incomingAudio = false;
        }

        output.forEach((channel, channelNo) => {
            
            if (!currentAudio[channelNo]) return;
            let ownPlayhead = 0;
            for (var bufferPlayhead = 0; bufferPlayhead < bufferSize; bufferPlayhead++) {
                if (playing) {
                    ownPlayhead = this.sourcePlayhead + bufferPlayhead;
                    ownPlayhead %= audioLength;
                    // const theSample = currentAudio[channelNo][bufferPlayhead];
                    const theSample = this.audio[channelNo][this.sourcePlayhead + bufferPlayhead];
                    if (theSample === undefined) {
                        channel[bufferPlayhead] = (Math.random() - 0.5) * 0.05;
                    } else {
                        channel[bufferPlayhead] = theSample;
                    }
                    // let nowWeight = fadeCurveFunction(
                    //     ownPlayhead / this.interpolationSpls
                    // );

                } else {
                    channel[bufferPlayhead] = 0;
                }
            }

            this.sourcePlayhead = ownPlayhead;

        });

        return true;

    }
});
