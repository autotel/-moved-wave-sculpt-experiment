import Module from "../models/Module";

/**
 * @param {{
 *  centerValue:number,
 *  range:number,
 *  width:number,
 *  height:number,
 *  model:Module,
 * }} settings
*/
const ValuePixelTranslator=function(settings){

    this.centerValue=settings.centerValue;
    this.range=settings.range;
    this.width=settings.width;
    this.height=settings.height;

    const model=settings.model;
    const modelSettings=model.settings;

    this.yToAmplitude=(y)=>{
        return 1 - 2 * y / settings.height;
    }

    this.xToTime=(x)=>{
        return 1 - 2 * y / settings.height;
    }
}
export default ValuePixelTranslator;