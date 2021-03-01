
const saturate1 = (val) => {
    if(val>1) val=1; 
    if(val<-1) val=-1;
    return val;
}

export default saturate1;