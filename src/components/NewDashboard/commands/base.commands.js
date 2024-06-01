import _ from 'lodash';
class BaseCommandClass {
    constructor() {
        this.defaults = [];
    };

    _getCommands(commandSignature){
        this.commands = _.flatten(this.defaults);
        if(commandSignature) return _.filter(this.commands, commandSignature);
        return this.commands;
    };

    registerDefaults(defaults) {
        this.defaults.push(defaults);
    };

    setupInstance(classPath, signatureOptions) {
        const ExtendedClass = require(`${classPath}`).default;
        const instance = new ExtendedClass(signatureOptions || {});
        this.registerDefaults(instance.defaults);
    };

    setupInstancesFromConfig(commandsPath, signatureOptions) {
        commandsPath.map((classPath) => this.setupInstance(classPath, signatureOptions));
    };
}

export default BaseCommandClass;
