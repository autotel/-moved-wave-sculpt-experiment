import RustProcessor from "../../rust/RustProcessor";

const rustProcessor = RustProcessor.get();

self.onmessage = ({data}) => {

    rustProcessor.onReady(()=>{

        self.postMessage({
            log: "start freeberb thread",
        });
        

        self.postMessage({
            log: data,
        });

        let {
            settings,
            sampleRate,
            inputValues,
        } = data;

        const {
            dampening,
            freeze,
            wet,
            width,
            dry,
            roomSize,
            LROffset,
        } = settings;
        const inputs_l = new Float32Array(inputValues);
        const inputs_r = new Float32Array(inputValues);

        const outputs = rustProcessor.freeverb({
            inputs_l,
            inputs_r,

            dampening,
            freeze,
            wet,
            width,
            dry,
            roomSize,
        })

        //mix l and r.
        //in the future I want to have "pan" and "time offset" settings
        const audioArray = new Float32Array(
            outputs[0].map((n,i)=>(n + outputs[1][i])/2)
        );

        self.postMessage({
            audioArray
        });

    });
};
