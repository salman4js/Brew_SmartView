import _ from 'lodash';
class BaseCommandClass {
    constructor() {
        this.defaults = [];
    };

    _getCommands(){
        this.commands = _.flatten(this.defaults);
        return this.commands;
    };

    registerDefaults(defaults) {
        this.defaults.push(defaults);
    };

    setupInstance(classPath, signatureOptions) {
        const ExtendedClass = require(`${classPath}`).default;
        const instance = new ExtendedClass(signatureOptions);
        this.registerDefaults(instance.defaults);
    };

    setupInstancesFromConfig(config, signatureOptions) {
        config.map((classPath) => this.setupInstance(classPath, signatureOptions));
    };
}

export default BaseCommandClass;
