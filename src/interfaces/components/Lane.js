import Sprite from "../../scaffolding/Sprite";
import { Line, Rectangle, Path, Group, Text } from "../../scaffolding/elements";
import Draggable from "./Draggable";
import Vector2 from "../../scaffolding/Vector2";
import typicalLaneSettings from "../../utils/const typicalLaneSettings";
import Model from "../../scaffolding/Model";
import Module from "../../models/Module";
import InputNode from "../../models/InputNode";

/**
 * @typedef {{x:number,y:number}} MiniVector
 */

class Lane extends Sprite{
    /**
     * @param {{
     *  x?:number,y?:number,model:Module,name?:string
     * }} options
     */
    constructor(options) {
        
        const {model} = options;
        const settings = typicalLaneSettings(model);
        settings.handleHeight=10;
        super(options.name || "lane");
        Object.assign(settings, options);
        // this.settings=settings;
        
        /** @type {function[]} */
        const movedCallbacks=[];
        /** @param {function} callback */
        this.onMoved=(callback)=>{
            movedCallbacks.push(callback);
        }
        const handleMoved=()=>{
            movedCallbacks.map((cb)=>cb());
        }

        model.interfaces.add(this);

        const handleRect = new Rectangle({
            x: settings.x,
            y: settings.y,
            width: settings.width,
            height: settings.handleHeight,
            fill: "transparent",
        });

        const draggable = new Draggable(handleRect.domElement);
        draggable.setPosition(settings);
        draggable.positionChanged = (newPosition) => {
            settings.y=newPosition.y;

            // handleRect.attributes.x = settings.x;
            handleRect.attributes.y = settings.y;
            handleRect.update();
            
            // this.contents.attributes.x = settings.x;
            this.contents.attributes.y = settings.y + settings.handleHeight;
            this.contents.update();
            handleMoved();
        };
        
        this.contents = new Group({
            x: settings.x, y: settings.y,
            width: settings.width, height: settings.height,
            name: "contents"
        });

        //add graphs to input and output
        //TODO: encapsulate
        this.add(this.contents);
        /** @typedef {{x:number,y:number,input:InputNode,absolute:MiniVector}} inputPosition */
        /** @type {Object<String,inputPosition>|undefined} */
        let inputPositions;
        /** @returns {Object<String,inputPosition>} */
        this.getInputPositions=()=>{
            // if(!inputPositions) {
                inputPositions={};
                Object.keys(model.inputs).map((inputName,index)=>{
                    const newInputPosition={
                        x:settings.width + index * 20 + 10,
                        y:settings.height - index * 20 + 10,
                        absolute:{},
                        input:model.inputs[inputName],
                    };
                    newInputPosition.absolute.x=newInputPosition.x + settings.x;
                    newInputPosition.absolute.y=newInputPosition.y + settings.y;
                    inputPositions[inputName] = newInputPosition;
                });
            // }
            return inputPositions;
        }
        this.getOutputPosition=()=>{
            let ret = {
                x:settings.width+10,
                y:0,
            }
            ret.absolute={
                x:ret.x + settings.x,
                y:ret.y + settings.y,
            };
            return ret;
        };
        
        
        /** @param {inputPosition} inputPosition */
        const InputGraph=function(inputPosition,name,num,container){
            const optxt = new Text({
                x: inputPosition.x + 10, y: inputPosition.y + 5,
                text:name,
            });
            container.add(optxt);
            const rect = new Rectangle({
                x: inputPosition.x - 5,
                y: inputPosition.y - 5,
                width: 10,
                height: 10,
            });
            container.add(rect);
        }


        /** @param {MiniVector} position */
        const OutputGraph=function(position,container){

            const rect = new Rectangle({
                x: position.x,
                y: position.y - settings.handleHeight,
                width: 80,
                height: 10,
            });
            container.add(rect);

        }

        this.getInputPositions()
        Object.keys(inputPositions).map((a,b)=>{
            new InputGraph(inputPositions[a],a,b,this.contents)
        });
        const myOutputGraph = new OutputGraph(this.getOutputPosition(),this.contents);


        const title = new Text({
            x: 10, y: 0,
            text: settings.name
        });
        this.contents.add(title);


        this.add(handleRect);
    }
}
;

export default Lane;