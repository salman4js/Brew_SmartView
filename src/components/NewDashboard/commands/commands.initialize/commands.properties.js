class CommandsProperties {
    constructor() {
        this.defaults = {
            value: 'Properties',
            onClick: () => this.execute()
        }
    };

    execute(){
      console.log('Properties command executed');
    };
}

export default CommandsProperties;