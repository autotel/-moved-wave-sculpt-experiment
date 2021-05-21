import {  SVGGroup, Rectangle, Text } from "../../dom-model-gui/GuiComponents/SVGElements";
import ValuePixelTranslator from "../../utils/ValuePixelTranslator";
import Draggable from "../../dom-model-gui/Interactive/Draggable";
import Vector2 from "../../dom-model-gui/utils/Vector2";
import round from "../../utils/round";

const zoomSettings={
    width:10,
    zoomHeight:10,
    range:1200,
}

class VerticalZoom extends SVGGroup{
    /** @param {ValuePixelTranslator} translator */
    constructor(translator) {
        const settings=translator.settings;
        
        super();

        const yToRange=(y)=>{
            const r = zoomSettings.range;
            const h = settings.height;
            return (Math.pow(2, Math.pow(y / h,12)) - 1) * r;
        }

        const rangeToY=(zoom)=>{
            const z = zoom;
            const r = zoomSettings.range;
            const h = settings.height;
            return h * Math.pow(Math.log((z/r)+1)/Math.LN2,1/12);
        }

        // console.log(` ${33.44} ==? ${yToRange(rangeToY(33.44))}`);
        // console.log(` ${33.44} ==? ${yToRange(rangeToY(33.44))}`);

        // console.log(` ${24.421} ==? ${yToRange(rangeToY(24.421))}`);
        // console.log(` ${24.421} ==? ${yToRange(rangeToY(24.421))}`);

        const readoutText =  new Text({
            class:"zoom-level",
            x:settings.width + 5,
            text:"---",
        });
        this.add(readoutText);

        const handleRect = new Rectangle({
            width: zoomSettings.width,
            height: zoomSettings.zoomHeight,
            x: settings.width-zoomSettings.width,
            y: settings.height,
        });
        this.add(handleRect);
        



        const draggable = new Draggable(handleRect.domElement);
        draggable.setPosition(new Vector2({
            x: handleRect.attributes.x,
            y: handleRect.attributes.y,
        }));

        draggable.dragStartCallback = (mouse) => {};
        draggable.dragEndCallback = (mouse) => {};
        
        draggable.positionChanged = (newPosition) => {
            // settings.rangeAmplitude = yToRange(newPosition.y);
            translator.change({
                rangeAmplitude:yToRange(newPosition.y)
            });

            handleRect.set({"y":newPosition.y});

            Object.assign(readoutText.attributes,{
                y:handleRect.attributes.y + 5,
                text:round(settings.rangeAmplitude,2),
            });

            readoutText.update();
        };

        //if something else changes zoom, update the scroller
        translator.onChange((changes)=>{
            if(changes.rangeAmplitude){
                const ypos=rangeToY(changes.rangeAmplitude);
                handleRect.set({"y":ypos});
                draggable.setPosition({y:ypos},false)
                Object.assign(readoutText.attributes,{
                    y:ypos + 5,
                    text:round(settings.rangeAmplitude,2),
                });

            }
            if(changes.width){
                readoutText.set({"x":settings.width + 5});
                handleRect.set({"x": settings.width-zoomSettings.width});
            }
        });

        const superSet = this.set;

        this.set = (...p) => {
            superSet(...p);
        };
    }
}
export default VerticalZoom;
