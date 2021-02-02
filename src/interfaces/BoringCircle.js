import Sprite from "../scaffolding/Sprite";
import { Circle, Line } from "../scaffolding/elements";
import Draggable from "./components/Draggable";
import Vector2 from "../scaffolding/Vector2";

const defaultSettings = {x:10,y:10};

function BoringCircle(userSettings){
    const settings = {x:0,y:0};

    Object.assign(settings,defaultSettings);
    Object.assign(settings,userSettings);

    Sprite.call(this,"boring circle");
    
    const circle = new Circle({
        // "stroke-width":"4",
        // fill:"yellow",
        r:10
    });

    const draggable=new Draggable(circle.domElement);

    draggable.positionChanged=(newPosition)=>{
        circle.attributes.cx=newPosition.x;
        circle.attributes.cy=newPosition.y;
        circle.update();
    }

    this.add(circle);
    
    draggable.setPosition(new Vector2(settings));

    draggable.dragStartCallback=(mouse)=>{
        circle.set("r",1);
    }
    draggable.dragEndCallback=(mouse)=>{
        circle.set("r",10);
    }
    
    const line = new Line();
    this.add(line);
    
};

export default BoringCircle;