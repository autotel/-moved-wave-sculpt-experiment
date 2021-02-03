
/**
 * Defines a drawable object which can be attached to a Sprite or a Group
 */
class Component {
    /** @param {Object} myOptions */
    constructor(myOptions = { x: 0, y: 0 }) {
        /** @type {HTMLElement|SVGElement|undefined} */
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
/**
 * @constructor {Component}
 * @param {Object} myOptions
 **/
class Circle extends Component{
    constructor(myOptions = {
        cx: 0, cy: 0, r: 50
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        this.update();
    }
}

class Path extends Component{
    constructor(myOptions = {
        d: `M 10,30
    A 20,20 0,0,1 50,30
    A 20,20 0,0,1 90,30
    Q 90,60 50,90
    Q 10,60 10,30 z`
    }) {
        // Component.call(this, myOptions);
        super(myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        this.update();
    }
}

class Rectangle extends Component {
    constructor(myOptions = {
        x: 0, y: 0, width: 100, height: 100
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        this.update();
    }
}

class Line extends Component {
    constructor(myOptions = {
        x1: 0, y1: 80, x2: 100, y2: 20
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        this.update();
    }
}

class Group extends Component {
    constructor(myOptions = {
        x: 0, y: 0,
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        /** @param {Component} elem */
        this.add = (elem) => {
            this.domElement.appendChild(elem.domElement);
        };
        this.update();
    }
}
class Text extends Component {
    constructor(myOptions = {
        x: 0, y: 0, text: "---"
    }) {
        super(myOptions);
        // Component.call(this, myOptions);
        this.domElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        /** @param {Component} elem */
        this.add = (elem) => {
            this.domElement.appendChild(elem.domElement);
        };
        const superUpdate = this.update;
        this.update = () => {
            this.domElement.innerHTML = this.attributes.text;
            superUpdate();
        };
        this.update();
    }
}


export {
    Component,
    Circle,
    Path,
    Line,
    Rectangle,
    Group,
    Text,
}
