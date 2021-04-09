import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import typicalLaneSettings from "../utils/const typicalLaneSettings";
import WaveLane from "./LaneTypes/WaveLane";
import Hoverable from "./components/Hoverable";
import round from "../utils/round";

/**
 * @namespace DomInterface.GenericDisplay
 */
/** 
 * @class GenericDisplay
 * @extends WaveLane
 */
class GenericDisplay extends WaveLane{

    /** @param {import("./components/Lane").LaneOptions} options */
    constructor(options){
        const {module,drawBoard} = options;
        const settings=typicalLaneSettings(module,drawBoard);
        Object.assign(settings,options);
        super(settings);
        

        Object.keys(module.settings).forEach((settingName,settingNumber)=>{
            const settingValue = module.settings[settingName];
            const settingType = typeof settingValue;
            if(settingType === "number"){
                this.addKnob(settingName);
            }else if(settingType === "boolean"){
                this.addToggle(settingName);
            }else if(settingValue.constructor && settingValue.constructor.name === "Float32Array"){
                this.addSoundDecoder(settingName);
            }
        });
        module.triggerInitialState();
    }
};

export default GenericDisplay;
