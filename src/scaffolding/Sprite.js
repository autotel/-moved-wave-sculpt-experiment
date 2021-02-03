import { Component } from "./elements";

class Sprite {
    constructor(name = "sprite") {
        const element = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.domElement = element;
        /** @param {Component} elem */
        this.add = (elem) => {
            element.appendChild(elem.domElement);
        };
        this.domElement.classList.add(name.replace(/\s+/, "-"));
    }
}

export default Sprite;