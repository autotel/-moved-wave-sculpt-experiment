const round=(num,precision=2)=>{
    let ratio = 10*precision;
    return Math.round(num*ratio)/ratio;
}
export default round;