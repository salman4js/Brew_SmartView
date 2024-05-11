class SidepanelContainerBusinessToolkitTemplate {
    constructor(options) {
        this.options = options;
    };

    onClickInlineMenu(e,configName){
      e.stopPropagation();
      e.preventDefault();
      this.options.onClickInlineMenu(configName);
    };

    _renderInlineAction(configName) {
        return(
            <span className = 'inline-menu' style = {{color: 'black', padding: '0px 2px 0px 2px'}} onClick = {(e) => this.onClickInlineMenu(e, configName)}>
                <i className="bi bi-plus-circle"></i>
            </span>
        )
    };
}

export default SidepanelContainerBusinessToolkitTemplate;