function Vector2(options={x:0,y:0}){
    /** @param {Vector2} to */
    this.add=(to)=>{
        this.x+=to.x;
        this.y+=to.y;
        return this;
    }
    /** @param {Vector2} to */
    this.sub=(to)=>{
        this.x-=to.x;
        this.y-=to.y;
        return this;
    }
    this.clone=()=>{
        return new Vector2(this);
    }
    /** @param {Vector2} to */
    this.set=(to)=>{
        this.x=to.x|0;
        this.y=to.y|0;
    }
    this.set(options);
}

/** 
 * @param {Vector2} vec1 
 * @param {Vector2} vec2 
 **/
Vector2.add=(vec1, vec2)=>{
    return (new Vector2(vec1)).add(vec2);
}

/** 
 * @param {Vector2} vec1 
 * @param {Vector2} vec2 
 **/
Vector2.sub=(vec1, vec2)=>{
    return (new Vector2(vec1)).sub(vec2);
}

/** 
 * @param {Vector2} vec1
 **/
Vector2.clone=(vec1)=>{
    return (new Vector2(vec1));
}

export default Vector2;