/**
 * @typedef {Object<string,any>} ChangedParameterList
 */

/**
 * @callback ChangesListener
 * @param {ChangedParameterList} changes an object containing only the changed parameters. Modify this object to alter the changes
 */

/**
 * @callback BeforeChangesListener
 * @param {ChangedParameterList} changes an object containing only the changed parameters. Modify this object to alter the changes
 * @param {Object<string,any>} settings an object containing all the model's properties.
 */

class Model {
    constructor(settings) {
        const beforeChangeListeners = [];
        const changeListeners = [];
        
        this.settings = settings;

        /** 
         * this is used to tie parameters together, for example if one setting is 
         * always 2 times other setting.
         * @param {BeforeChangesListener} newCallback
         **/
        this.beforeUpdate = (newCallback) => {
            if (typeof newCallback !== "function")
                throw new Error(`Callback has to be function but it is ${typeof newCallback}`);
            beforeChangeListeners.push(newCallback);
            newCallback(this.settings,this.settings);
        };
        /**
         * interface uses this method to connect changes in model to redraws
         * @param {ChangedParameterList} newCallback
         * */
        this.onUpdate = (newCallback) => {
            if (typeof newCallback !== "function")
                throw new Error(`Callback has to be function but it is ${typeof newCallback}`);
            changeListeners.push(newCallback);
            newCallback(this.settings);
        };

        /**
         * model uses this method to notify changes to the interface
         * it will not trigger "beforeUpdate" listeners.
         * @param {ChangedParameterList} [changes]
         **/
        this.changed = (changes = {}) => {
            changeListeners.forEach((cb) => { cb(changes); });
        };

        /**
         * change parameter values, triggering onchange listeners
         * @param {ChangedParameterList} [changes]
         **/
        this.set=(changes = {})=>{
            beforeChangeListeners.forEach((cb) => { cb(changes,this.settings); });
            Object.assign(this.settings,changes);
            this.changed(changes);
            return this;
        }

        //get the initial state of the model
        this.triggerInitialState = () => {
            this.set(settings);
        };
    }
}
export default Model;