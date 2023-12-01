import BaseCommands from "./base.commands";
import commandOptions from './extended.commands.path.json';

const setupCommandsInstances = (commandSignatureKey) => {
    var baseCommands = new BaseCommands();
    baseCommands.setupInstancesFromConfig(commandOptions, commandSignatureKey);
    return baseCommands;
};

export default setupCommandsInstances;
