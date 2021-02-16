import Module from "../SoundModules/Module";

/**@param {Module} model */
const typicalLaneSettings=(model)=>({
    x:0,y:0,
    centerAmplitude:0,rangeAmplitude:2,
    firstSample:0, rangeSamples:44100,
    width:800, height:120,
    model,
    name:"Lane"
})

export default typicalLaneSettings;