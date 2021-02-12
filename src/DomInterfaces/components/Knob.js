import Module from "../../SoundModules/Module";
import { Group, Text, Path } from "../../scaffolding/elements";
import round from "../../utils/round";
import Draggable from "./Draggable";

let defaultKnobOptions = {
    x: 0, y:0,
    radius:20,
    name:"knob",
    class:"knob",
    min:false, max:false,
    deltaCurve:"gain",
}

//TODO:
const deltaCurves = {
    period:(deltaval)=> Math.pow(deltaval,3),
    frequency:(deltaval)=>Math.pow(2,deltaval),
    gain:(deltaval)=>(deltaval),
    channelvol:(deltaval)=>deltaval,
}

class Knob extends Group{
    constructor(userOptions){
        const options = {};
        Object.assign(options,defaultKnobOptions);
        Object.assign(options,userOptions);
        super(options);

        let text = new Text({
            x:-options.radius,
            y: options.radius + 5
        });

        this.add(text);


        let knobShape = new Path();
        this.add(knobShape);
        
        const remakePath=()=>{
            let corners = 9;
            let lastPoint = [];
            let pathString = "";

            for(let corner = 0; corner<corners; corner++){
                let nowPoint=[
                    Math.sin(Math.PI * 2 * corner/corners) * options.radius,
                    Math.cos(Math.PI * 2 * corner/corners) * options.radius,
                ];
                if(corner > 0){
                    pathString += `Q ${lastPoint[0]},${lastPoint[1]} ${nowPoint[0]},${nowPoint[1]} `
                }else{
                    pathString += `M ${nowPoint[0]},${nowPoint[1]}`;
                }
                lastPoint=nowPoint;
            }
            
            pathString += `z`;

            if(options.min !==false && options.max !==false){
                pathString += `M ${-options.radius},${0}`;
                pathString += `Q ${-options.radius},${0} ${0},${0}`
            }

            
            knobShape.set("d",pathString);
        }

        remakePath();

        const changeCallbacks=[];
        
        this.step=1/300;
        
        let pixValueOnDragStart;

        const distanceToValue=(pixels)=> pixels * this.step;
        const valueToPixels=(value)=> value / this.step ;
        const getAngle=()=>{
            let rpv = this.step * 300;
            if(options.min!==false && options.max!==false){
                let range = options.max - options.min;
                rpv = 1/range;
            }
            return rpv * this.value * 360;
        }

        const draggable = new Draggable(knobShape.domElement);

        draggable.dragStartCallback=()=>{
            pixValueOnDragStart = valueToPixels(this.value);
            if(isNaN(pixValueOnDragStart)) pixValueOnDragStart=0;
        }
        draggable.positionChanged=(newPosition)=>{

            //choose the lengthiest coord to define delta
            let theDistance = -newPosition.delta.y;

            let valueDelta = distanceToValue(theDistance);
            
            let newValue = deltaCurves[options.deltaCurve](valueDelta);
            
            // console.log("delta",theDistance,"yields",newValue);

            newValue+=distanceToValue(pixValueOnDragStart);

            if(options.min !== false){
                if(newValue < options.min) newValue = options.min;
            }
            if(options.max !== false){
                if(newValue > options.max) newValue = options.max;
            }
            this.changeValue(
                newValue
            );
        }

        this.value=0;
        /** @param {Function} cb */
        this.onChange=(cb)=>{
            changeCallbacks.push(cb);
        }
        const handleChanged=(changes)=> changeCallbacks.map((cb)=>cb(changes));
        
        this.updateGraphic=()=>{
            knobShape.set("transform",`rotate(${getAngle()})`);
            text.set("text",options.name);// + round(this.value,2));
        }

        this.changeValue=(to)=>{
            this.value=to;
            this.updateGraphic();
            handleChanged({value:to});
        }
        
        /** 
         * @param {Module} module
         * @param {string} parameterName
         */
        this.setToModuleParameter=(module,parameterName)=>{
            let propertyObject = {};
            options.name=parameterName;
            this.onChange(({value})=>{
                propertyObject[parameterName] = value;
                module.set(propertyObject);
            });
            module.onUpdate((changes)=>{
                if(changes[parameterName]){
                    this.value=changes[parameterName];
                    this.updateGraphic();
                }
            });
            this.value=propertyObject[parameterName];
            this.updateGraphic();

            if(parameterName == "frequency") options.min = 0;
            if(parameterName == "length") options.min = 0;

            remakePath();
        }
        this.setMinMax=(min,max)=>{
            options.min=min;
            options.max=max;
            remakePath();
            return this;
        }
        /**
         * @param {"period"|"frequency"|"gain"|"channelvol"} deltaCurve
         **/
        this.setDeltaCurve=(deltaCurve)=>{
            options.deltaCurve=deltaCurve;
            return this;
        }
    }
}

export default Knob;