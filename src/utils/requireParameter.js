const requireParameter = function(param, friendlyName=undefined){
    if(param===undefined){
        if(friendlyName){
            throw new Error("required parameter ("+friendlyName+") value is "+param);
        }else{
            throw new Error("required parameter value is "+param);
        }
    }
}
module.exports = requireParameter;