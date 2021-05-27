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

    //the foreseen period, in the state it was on the last period
    /** @type {Array<Array<number>>} */
    peekedPeriod = [];
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
    getCircularSliceFromChannel = (start, length, chanNo = 0) => {
        /** @type {Array<number>} */
        let returnBuffer = [];
        if (this.audio[chanNo]) {
            start %= this.audio[chanNo].length;
            let sliceStart = start;
            let sliceEnd = (start + length) % this.audio[chanNo].length

            returnBuffer = (
                this.audio[chanNo]
            ).slice(
                start,
                start + length
            );

            //if the current period will reach beyond the length of audio loop
            if (sliceEnd < sliceStart) {
                let append = (
                    this.audio[chanNo]
                ).slice(
                    0,
                    sliceStart - sliceEnd
                );
                returnBuffer = returnBuffer.concat(append);
            }
        }
        return returnBuffer;
    }

    getCircularSlice = (start, length) => {
        return this.audio.map((channel, channelNo) => {
            return this.getCircularSliceFromChannel(start, length, channelNo);
        });
    }

    process(inputs, outputs, parameters) {

        if (this.incomingAudio) {
            this.audio = this.incomingAudio.map((chan) => [...chan]);
            this.incomingAudio = false;
        }
        // var input = e.inputBuffer.getChannelData(0);
        // var output = e.outputBuffer.getChannelData(0);
        const output = outputs[0];
        const playing = this.isPlaying;

        let audioLength = this.getAudioLengthSamples();

        output.forEach((channel, channelNo) => {
            let bufferSize = channel.length;
            //make a copy of the audio for this period. This will let us interpolate,
            //preventing the clicks caused by buffer changes while playing.
            //note that the frequency response of the interpolation changes 
            //in function of the bufferSize selection.
            let currentAudio = this.getCircularSlice(
                this.sourcePlayhead,
                bufferSize
            );

            if (!currentAudio[channelNo]) return;
            let ownPlayhead = 0;
            for (var bufferPlayhead = 0; bufferPlayhead < bufferSize; bufferPlayhead++) {
                if (playing) {
                    ownPlayhead = this.sourcePlayhead + bufferPlayhead;
                    ownPlayhead %= audioLength;
                    // const theSample = currentAudio[channelNo][bufferPlayhead];
                    const theSample = this.audio[channelNo][this.sourcePlayhead + bufferPlayhead];
                    if (theSample === undefined) {
                        // channel[bufferPlayhead] = (Math.random() - 0.5) * 0.05;
                    } else {
                        channel[bufferPlayhead] = theSample;
                    }
                    let nowWeight = fadeCurveFunction(
                        ownPlayhead / this.interpolationSpls
                    );
                    if (nowWeight > 1) nowWeight = 1;
                    let nextWeight = 1 - nowWeight;
                    //current sonic contents fading in...
                    channel[bufferPlayhead] = currentAudio[channelNo][bufferPlayhead] * nowWeight;
                    if (this.peekedPeriod[channelNo]) {
                        //and the previously expected sonic contents fading out.
                        //clipped, for security.
                        channel[bufferPlayhead] += this.peekedPeriod[channelNo][bufferPlayhead] * nextWeight;
                    }

                } else {
                    channel[bufferPlayhead] = 0;
                }
            }

            this.sourcePlayhead = ownPlayhead;

            //peek into next period, so that in next lap we interpolate
            this.peekedPeriod = this.getCircularSlice(
                this.sourcePlayhead,
                bufferSize,
            );
        });

        return true;

    }
});
