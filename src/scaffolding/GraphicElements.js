

/**
 * @typedef {Object<String,any>} ComponentOptions
 * @property {number} [x]
 * @property {number} [y]
 */

/**
 * Defines a drawable object which can be attached to a Sprite or a SVGGroup
 */
class Component {
    /** @param {ComponentOptions} myOptions */
    constructor(myOptions = { x: 0, y: 0 }) {
        /** @type {SVGElement|HTMLElement|undefined} */
        this.domElement=undefined;
        this.attributes = {};
        this.appliedAttributes = {};
        this.update = () => {
            if (!this.domElement)
                return console.warn("this.domElement is", this.domElement);
            //apply what has been modified to the dom element
            //it also keeps track of modified attributes to prevent redundant changes
            Object.keys(this.attributes).map((attrName) => {
                const attr = this.attributes[attrName];
                const appliedAttr = this.appliedAttributes[attrName];
                if (attr !== appliedAttr) {
                    this.domElement.setAttribute(attrName, attr);
                    this.attributes[attrName] = attr;
                    this.appliedAttributes[attrName] = attr;
                }
            });
        };
        this.set = (attrname, attrval) => {
            this.attributes[attrname] = attrval;
            this.update();
        };
        Object.assign(this.attributes, myOptions);
    }
}

class HTMLComponent extends Component{
    /** @param {GroupOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        this.appliedAttributes.innerHTML="";
        /** @param {Component} elem */
        this.add = (...elems) => {
            elems.forEach((elem)=>{
                if(
                    !(
                        elem.domElement instanceof HTMLElement 
                        || elem.domElement instanceof SVGSVGElement
                    )
                ) throw new Error("you can only add HTMLElements to HTMLElements.");
                this.domElement.appendChild(elem.domElement);
            });
            return this;
        };
        const superUpdate = this.update;
        this.update = () => {
            superUpdate();
            this.domElement.innerHTML=this.appliedAttributes.innerHTML;
        };

        this.remove = (elem) => {
            this.domElement.removeChild(elem.domElement);
        }
    }
}

class Div extends HTMLComponent{
    /** @param {GroupOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        this.domElement = document.createElement("div");

        this.update();
    }
}

class P extends HTMLComponent{
    /** @param {TextOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        this.domElement = document.createElement("p");

        const superUpdate = this.update;
        
        this.update = () => {
            this.attributes.innerHTML=this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}

class Textarea extends HTMLComponent{
    /** @param {TextOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        this.domElement = document.createElement("textarea");

        const superUpdate = this.update;

        this.onInput=(callback)=>{
            this.domElement.addEventListener('input',callback);
        }
        
        this.update = () => {
            this.attributes.innerHTML=this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}

class TextField extends HTMLComponent{
    /** @param {TextOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        
        this.domElement = document.createElement("input");
        this.domElement.setAttribute("type","text");

        const superUpdate = this.update;

        this.onInput=(callback)=>{
            this.domElement.addEventListener('input',callback);
        }

        this.update = () => {
            this.attributes.value=this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}

class UploadField extends HTMLComponent{
    /** @param {TextOptions} myOptions */
    constructor(myOptions={}) {
        super(myOptions);
        /** @type {HTMLInputElement} */
        this.domElement = document.createElement("input");
        this.domElement.setAttribute("type","file");

        const superUpdate = this.update;

        this.onInput=(callback)=>{
            this.domElement.addEventListener('input',callback);
        }

        this.update = () => {
            this.attributes.value=this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} CircleOptions
 * @param {number} [radius]
 */
class Circle extends Component{
    /**
     * @param {CircleOptions} myOptions
     **/
    constructor(myOptions = {
        cx: 0, cy: 0, r: 50
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} PathOptions
 */
class Path extends Component{
    /**
     * @param {PathOptions} myOptions
     **/
    constructor(myOptions = {
        d: ``
    }) {
        // Component.call(this, myOptions);
        super(myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} RectangleOptions
 * @property {string} [fill]
 * @property {number} [width]
 * @property {number} [height]
 */
class Rectangle extends Component {
    /**
     * @param {RectangleOptions} myOptions
     **/
    constructor(myOptions = {
        x: 0, y: 0, width: 100, height: 100
    }) {
        super(myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} LineOptions
 */
class Line extends Component {
    /**
     * @param {LineOptions} myOptions
     **/
    constructor(myOptions = {
        x1: 0, y1: 80, x2: 100, y2: 20
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        this.update();
    }
}

/**
 * @typedef {ComponentOptions} SVGOptions
 */
class SVG extends Component {
    /** @param {SVGOptions} myOptions */
    constructor(myOptions = {
        x: 0, y: 0,
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        /** @param {Array<Component>} elems */
        this.add = (...elems) => {
            elems.forEach((elem)=>{
                if(!(elem.domElement instanceof SVGElement)) throw new Error("you can only add SVG elements to SVG group.");
                this.domElement.appendChild(elem.domElement);
            });
            return this;
        };
        this.remove = (elem) => {
            this.domElement.removeChild(elem.domElement);
        }
        this.update();
    }
}
/**
 * @typedef {ComponentOptions} SVGOptions
 */
class SVGGroup extends SVG {
}

/**
 * @typedef {ComponentOptions} TextOptions
 * @property {"middle"|"left"|"right"} 'text-anchor'
 */
class Text extends Component {

    /** @param {ComponentOptions} myOptions */
    constructor(myOptions = {
        x: 0, y: 0, text: "---"
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        
        const superUpdate = this.update;
        this.update = () => {
            this.domElement.innerHTML = this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}
/**
 * @typedef {ComponentOptions} TextOptions
 * @property {"middle"|"left"|"right"} 'text-anchor'
 */
class BoxedText extends SVG {

    /** @param {ComponentOptions} myOptions */
    constructor(myOptions = {
        x: 0, y: 0, text: "---"
    }) {
        super();
        
        const textEl = new Text();
        const box = new Rectangle();
        this.add(box,textEl);

        this.domElement.classList.add("boxed-text");
        const superUpdate = this.update;
        this.update = () => {
            if(this.attributes.text){
                textEl.attributes.text=this.attributes.text;
                delete this.attributes.text;
            }

            textEl.update();
            
            setTimeout(()=>{
                const SVGRect = textEl.domElement.getBBox();
                box.attributes.x = SVGRect.x;
                box.attributes.y = SVGRect.y;
                box.attributes.width = SVGRect.width;
                box.attributes.height = SVGRect.height;
                box.update();
            },300);

            superUpdate();
        };
        //todo: fix this bug
        setTimeout(()=>{
            this.update();
        },10);
    }
}



export {
    Component,
    HTMLComponent,
    Div,
    P,
    Textarea,
    TextField,
    UploadField,
    Circle,
    Path,
    Line,
    Rectangle,
    SVG,
    SVGGroup,
    Text,
    BoxedText,
}
