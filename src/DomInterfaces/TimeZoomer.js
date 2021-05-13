import ValuePixelTranslator from "../utils/ValuePixelTranslator";
import { Rectangle, SVGGroup }  from "../dom-model-gui/GuiComponents/SVGElements";
import Draggable from "../dom-model-gui/Interactive/Draggable";


class TimeZoomer extends SVGGroup {
    constructor() {
        super();
        const maxSample = 44100 * 4;

        let maxPixel;
        let samplePerPixel ;

        let minx;
        let maxx;

        console.log(maxPixel);

        const panRect = new Rectangle({
            class: "time-pan draggable",
        });
        const zoomRect = new Rectangle({
            class: "time-zoom draggable",
        });

        const rectXToSampleN=(x)=> maxSample * x / (window.innerWidth-panRect.attributes.width);

        const updateGraph = () => {
            
            maxPixel = window.innerWidth;
            samplePerPixel =  (maxPixel-(panRect.attributes.width||0))/maxSample;
            
            panRect.attributes.width = ValuePixelTranslator.shared.rangeSamples * samplePerPixel;
            panRect.attributes.x = ValuePixelTranslator.shared.firstSample * samplePerPixel;
            panRect.attributes.height = 10;

            const zoomSize = 10;

            zoomRect.attributes.width = panRect.attributes.width + zoomSize * 2;
            zoomRect.attributes.x = panRect.attributes.x - zoomSize;
            zoomRect.attributes.height = panRect.attributes.height;
            
            panRect.update();
            zoomRect.update();
        }

        updateGraph();

        ValuePixelTranslator.onChange(()=>updateGraph());
        
        //zoomrect lies behind, so that you can drag each side.
        this.add(zoomRect);
        this.add(panRect);

        let panDraggable = new Draggable(panRect.domElement);
        panDraggable.positionChanged = (pos)=>{
            let positionInRange = rectXToSampleN(pos.x);
            if(positionInRange<0) positionInRange=0;
            // if(pos.x>maxx) pos.x=maxx;
            // if(positionInRange>maxSample || positionInRange<0) return;
            this.pan(Math.floor(positionInRange));
        };

        let zoomDraggable = new Draggable(zoomRect.domElement);
        zoomDraggable.positionChanged = (pos)=>{
            let positionInRange = rectXToSampleN(pos.x);

            // if(positionInRange>maxSample || positionInRange<0) return;
            this.zoom(Math.floor(positionInRange));
        };

        this.zoom = (l) => {
            return ValuePixelTranslator.change({ rangeSamples: l });
        };
        this.pan = (l) => {
            // console.log("pan",l);
            return ValuePixelTranslator.change({ firstSample: l });
        };
    }

}

export default TimeZoomer;