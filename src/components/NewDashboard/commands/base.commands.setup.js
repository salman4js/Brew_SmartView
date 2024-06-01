import BaseCommands from "./base.commands";
import commandOptions from './extended.commands.path.json';

const setupCommandsInstances = (signatureOptions) => {
    const baseCommands = new BaseCommands();
    baseCommands.setupInstancesFromConfig(commandOptions, signatureOptions);
    return baseCommands;
};

export default setupCommandsInstances;
