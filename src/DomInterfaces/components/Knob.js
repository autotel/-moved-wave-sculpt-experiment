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
    periodseconds:(deltaval)=> {
        const newVal = Math.pow(deltaval/10,2)*10 * Math.sign(deltaval);
        return newVal;
    },
    integer:(deltaval)=> {
        const newVal = Math.round(deltaval * 20);
        return newVal;
    },
    frequency:(deltaval)=>{
        deltaval*=100;
        return Math.pow(Math.abs(deltaval),2)*Math.sign(deltaval);
    },
    gain:(deltaval)=>(deltaval*3),
    channelvol:(deltaval)=>deltaval*5,
}

class Knob extends Group{
    constructor(userOptions){
        const options = {};
        Object.assign(options,defaultKnobOptions);
        Object.assign(options,userOptions);
        super(options);

        let nameText = new Text({
            x:0,
            y: options.radius + 5,
            'text-anchor':'middle'
        });
        let valueText = new Text({
            x:0,
            y: options.radius + 15,
            'text-anchor':'middle'
        });

        this.add(nameText);
        this.add(valueText);


        let knobShape = new Path();
        let valueShape = new Path();
        this.add(valueShape);
        this.add(knobShape);
        valueShape.set("fill","none");
        valueShape.domElement.classList.add("knob-value-arc");

        const remakeValueShape=()=>{
            let maxValue = options.max?options.max:1;
            // console.log(maxValue);
            // if(!maxValue) throw new Error("maxvalue"+maxValue);
            let endPortion = this.value / maxValue;
            if(endPortion>1) endPortion=1;
            //there's no good reason for using an arc.
            let maxCorners = 54;
            let lastPoint = [];
            let pathString = "";

            let corners = maxCorners * endPortion;

            for(let corner = 0; corner<corners; corner++){
                let nowPoint=[
                    Math.cos(Math.PI * 2 * corner/maxCorners) * options.radius,
                    Math.sin(Math.PI * 2 * corner/maxCorners) * options.radius,
                ];
                if(corner > 0){
                    pathString += `L ${nowPoint.join()} `
                }else{
                    pathString += `M ${nowPoint.join()}`;
                }
                lastPoint=nowPoint;
            }

            //add that last one bit
            let nowPoint=[
                Math.cos(Math.PI * 2 * endPortion) * options.radius,
                Math.sin(Math.PI * 2 * endPortion) * options.radius,
            ];
            pathString += `L ${nowPoint.join()} `
            

            valueShape.set("d",pathString);
        }
        
        const remakePath=()=>{
            let corners = 7;
            let lastPoint = [];
            let pathString = "";

            for(let corner = 0; corner<corners; corner++){
                let nowPoint=[
                    Math.cos(Math.PI * 2 * corner/corners) * options.radius * 0.6,
                    Math.sin(Math.PI * 2 * corner/corners) * options.radius * 0.6,
                ];
                if(corner > 0){
                    pathString += `L ${lastPoint.join()} ${nowPoint.join()} `
                }else{
                    pathString += `M ${nowPoint.join()}`;
                }
                lastPoint=nowPoint;
            }
            
            pathString += `z`;
            if(options.min !==false && options.max !==false){
                //knob direction indicator
                pathString += `M ${options.radius * 0.6},${0}`;
                pathString += `Q ${options.radius * 0.6},${0} ${0},${0}`
            }
            knobShape.set("d",pathString);
            remakeValueShape();
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
            this.domElement.classList.add("active");
        }

        draggable.dragEndCallback=()=>{
            this.domElement.classList.remove("active");
        }

        draggable.positionChanged=(newPosition)=>{
            //choose the lengthiest coord to define delta
            let theDistance = -newPosition.delta.y;
            let valueDelta = distanceToValue(theDistance);
            let newValue = deltaCurves[options.deltaCurve](valueDelta);
            
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
            nameText.set("text",options.name);
            valueText.set("text","~"+(round(this.value,2)));

            if(options.min!==false&&options.max!==false){
                remakeValueShape();
            }
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
            propertyObject=module.settings;
            options.name=parameterName;
            this.value=propertyObject[parameterName];

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
            switch (parameterName){
                case "frequency":
                    this.setDeltaCurve("frequency");
                    this.setMinMax(0,22000);
                break;
                case "order":
                    this.setDeltaCurve("integer");
                    this.setMinMax(0,10);
                break;

                case "time":
                case "length":
                    this.setMinMax(0,5);
                break;
            }

            this.updateGraphic();
        }

        this.setMinMax=(min,max)=>{
            if(max<=min) console.warn("max<=min",min,max);
            options.min=min;
            options.max=max;
            remakePath();
            return this;
        }
        /**
         * @param {"integer"|"frequency"|"gain"|"channelvol"|"integer"|"periodseconds"} deltaCurve
         **/
        this.setDeltaCurve=(deltaCurve)=>{
            options.deltaCurve=deltaCurve;
            return this;
        }
    }
}

export default Knob;