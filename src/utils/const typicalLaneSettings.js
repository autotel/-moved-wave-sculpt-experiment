import Model from "../scaffolding/Model";

/**@param {Model} model */
const typicalLaneSettings=(model)=>({
    x:0,y:0,
    centerAmplitude:0,rangeAmplitude:2,
    centerSample:0, rangeSamples:44100,
    width:800, height:100,
    model,
    name:"Lane"
})

export default typicalLaneSettings;