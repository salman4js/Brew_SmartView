import _ from 'lodash';
class BaseCommandClass {
    constructor() {
        this.defaults = [];
    };

    _getCommands(){
      return _.flatten(this.defaults);
    };

    registerDefaults(defaults) {
        this.defaults.push(defaults);
    };

    setupInstance(classPath) {
        const ExtendedClass = require(`${classPath}`).default;
        const instance = new ExtendedClass();
        this.registerDefaults(instance.defaults);
    };

    setupInstancesFromConfig(config) {
        config.map((classPath) => this.setupInstance(classPath));
    };
}

export default BaseCommandClass;
