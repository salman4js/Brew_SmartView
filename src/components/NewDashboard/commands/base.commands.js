import _ from 'lodash';
class BaseCommandClass {
    constructor() {
        this.defaults = [];
    };

    _getCommands(options, nodes, roomConstant){
        this.commands = _.flatten(this.defaults);
        this.commands.map((command) => {
           command['options'] = options;
           command['nodes'] = nodes;
           command['roomConstant'] = roomConstant
        });
        return this.commands;
    };

    registerDefaults(defaults) {
        this.defaults.push(defaults);
    };

    setupInstance(classPath, commandSignatureKey) {
        const ExtendedClass = require(`${classPath}`).default;
        const instance = new ExtendedClass(commandSignatureKey);
        this.registerDefaults(instance.defaults);
    };

    setupInstancesFromConfig(config, commandSignatureKey) {
        config.map((classPath) => this.setupInstance(classPath, commandSignatureKey));
    };
}

export default BaseCommandClass;
