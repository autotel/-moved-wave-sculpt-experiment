import Lane from "../DomInterfaces/components/Lane";

class Model {
    constructor(settings) {
        const redrawList = [];
        /** @type {Set<Lane>} */
        this.interfaces=new Set();
        /** @returns {Lane|undefined} */
        this.getInterface = ()=>this.interfaces.values().next().value;
        this.settings = settings;
        //interface uses this method to conect changes in model to redrawss
        this.onUpdate = (newCallback) => {
            if (typeof newCallback !== "function")
                throw new Error(`Callback has to be function but it is ${typeof newCallback}`);
            redrawList.push(newCallback);
        };
        //model uses this method to notify changes to the interface
        this.changed = (changes = {}) => {
            redrawList.map((cb) => { cb(changes); });
        };
        //get the initial state of the model
        this.triggerInitialState = () => { };
    }
}
export default Model;