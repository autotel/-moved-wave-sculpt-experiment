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
        const {model,drawBoard} = options;
        const settings=typicalLaneSettings(model,drawBoard);
        Object.assign(settings,options);
        super(settings);
        

        Object.keys(model.settings).forEach((settingName,settingNumber)=>{
            const settingValue = model.settings[settingName];
            const settingType = typeof settingValue;
            if(settingType === "number"){
                this.addKnob(settingName);
            }else if(settingType === "boolean"){
                this.addToggle(settingName);
            }
        });
        model.triggerInitialState();
    }
};

export default GenericDisplay;
