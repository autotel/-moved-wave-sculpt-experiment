import Sprite from "../../scaffolding/Sprite";
import { Line, Rectangle, Path, Group, Text } from "../../scaffolding/elements";
import Draggable from "./Draggable";
import Vector2 from "../../scaffolding/Vector2";

const defaultSettings = {
    x:0,y:0,
    width:800,
    height:100,
    handleHeight:10,
    name:"lane",
};

function Lane(userSettings={
    x:0,y:0,
    width:100,
    name:"lane",
}){
    const settings = {};

    Sprite.call(this,settings.name);

    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    Sprite.call(this,"lane frame");
    
    const handleRect = new Rectangle({
        x:settings.x,
        y:settings.y,
        width:settings.width,
        height:settings.handleHeight,
        fill:"transparent",
    });
    const draggable=new Draggable(handleRect.domElement);

    draggable.positionChanged=(newPosition)=>{
        handleRect.attributes.x=settings.x;
        handleRect.attributes.y=newPosition.y;
        handleRect.update();

        this.contents.attributes.x=settings.x;
        this.contents.attributes.y=newPosition.y+settings.handleHeight;
        this.contents.update();
    }

    this.contents=new Group({
        x:settings.x,y:settings.y,
        width:settings.width, height:settings.height,
        name:"contents"
    });

    this.add(this.contents);

    const text=new Text({
        x:10,y:0,
        text:settings.name
    });
    this.contents.add(text);

    //timeout to defer rect for later, so that it has higher z-index.
    //TODO: find more elegant solution to this problem

    this.add(handleRect);
    
    draggable.setPosition(new Vector2(settings));

    draggable.dragStartCallback=(mouse)=>{
    }
    draggable.dragEndCallback=(mouse)=>{
    }    
};

export default Lane;