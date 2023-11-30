import BaseCommands from "./base.commands";
import commandOptions from './extended.commands.path.json';

const setupCommandsInstances = () => {
    var baseCommands = new BaseCommands();
    baseCommands.setupInstancesFromConfig(commandOptions);
    return baseCommands;
};

export default setupCommandsInstances;
