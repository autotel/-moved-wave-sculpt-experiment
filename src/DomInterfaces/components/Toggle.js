import Module from "../../SoundModules/Module";
import { Group, Text, Path, Rectangle } from "../../scaffolding/elements";
import round from "../../utils/round";
import Draggable from "./Draggable";
import Clickable from "./Clickable";

let defaultToggleOptions = {
    x: 0, y: 0,
    width: 20,
    name: "toggle",
    class: "toggle",
    min: false, max: false,
}

class Toggle extends Group {
    constructor(userOptions) {
        const options = {};
        Object.assign(options, defaultToggleOptions);
        Object.assign(options, userOptions);
        super(options);

        let nameText = new Text({
            x: -options.radius,
            y: options.radius + 5
        });

        this.add(nameText);

        let buttonShape = new Rectangle();
        let valueShape = new Rectangle();
        this.add(valueShape);
        this.add(buttonShape);
        valueShape.set("fill", "none");
        valueShape.domElement.classList.add("knob-value-arc");

        const remakeValueShape = () => {
            valueShape.attributes.width = options.width - 6;
            valueShape.attributes.height = options.width - 6;

            valueShape.attributes.x = 3 - options.width/2;
            if (this.value) {
                valueShape.attributes.y = 3 - options.width;
            } else {
                valueShape.attributes.y = 3;
            }

            valueShape.update();
        }

        const remakePath = () => {
            buttonShape.attributes.width = options.width;
            buttonShape.attributes.height = options.width * 2;

            buttonShape.attributes.x = -options.width/2;
            buttonShape.attributes.y = -options.width;

            nameText.attributes["text-anchor"]="middle";
            nameText.attributes.y = options.width * 1.5;

            nameText.update();
            buttonShape.update();
            remakeValueShape();
        }

        remakePath();

        const changeCallbacks = [];

        const clickable = new Clickable(buttonShape.domElement);

        clickable.releaseCallback = () => {
            this.changeValue(this.value ? false : true);
        }

        this.value = false;

        /** @param {Function} cb */
        this.onChange = (cb) => {
            changeCallbacks.push(cb);
        }
        const handleChanged = (changes) => changeCallbacks.map((cb) => cb(changes));

        this.updateGraphic = () => {
            nameText.set("text", options.name);
            remakeValueShape();
        }

        this.changeValue = (to) => {
            this.value = to;
            this.updateGraphic();
            handleChanged({ value: to });
        }

        /** 
         * @param {Module} module
         * @param {string} parameterName
         */
        this.setToModuleParameter = (module, parameterName) => {

            let propertyObject = {};
            propertyObject = module.settings;
            options.name = parameterName;
            this.value = propertyObject[parameterName];

            this.onChange(({ value }) => {
                propertyObject[parameterName] = value;
                module.set(propertyObject);
            });

            module.onUpdate((changes) => {
                if (changes[parameterName]) {
                    this.value = changes[parameterName];
                    this.updateGraphic();
                }
            });
            this.updateGraphic();
        }
    }
}

export default Toggle;