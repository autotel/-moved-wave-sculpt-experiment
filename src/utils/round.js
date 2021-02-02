const round=(num,precision)=>{
    let ratio = 10*precision;
    return Math.round(num*ratio)/ratio;
}
export default round;