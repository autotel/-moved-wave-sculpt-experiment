const getMyNameInObject=(me,inObject)=>{
    let keys = Object.keys(inObject);
    for(let keyName of keys){
        if(inObject[keyName] == me) return keyName;
    }
    return false;
}
export default getMyNameInObject;