import NativeProcess from '../scaffolding/NativeProcess';
import { sampleRate } from '../SoundModules/vars';

class RustProcessor extends NativeProcess{
    constructor (){
        super();


        import('./pkg/').then((lib) => {
            this.add=(a,b)=>lib.add(a,b);
            this.arrGenSin = (duration,frequency)=>lib.array_sine(sampleRate,duration,frequency);
            this.arrCombFilter = (samplesArray,
                frequency,dampening_inverse,dampening,feedback) => lib.array_filter_comb(
                sampleRate,samplesArray,
                frequency,dampening_inverse,dampening,feedback
            );
            this._handleReady(this);
        });

    }
}

export default RustProcessor;