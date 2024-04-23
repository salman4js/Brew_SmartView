class SidepanelContainerBusinessToolkitTemplate {
    constructor(options) {
        this.options = options;
    };

    onClickInlineMenu(e){
      e.stopPropagation();
      e.preventDefault();
      this.options.onClickInlineMenu();
    };

    _renderInlineAction() {
        return(
            <span className = 'inline-menu' style = {{color: 'black', padding: '0px 2px 0px 2px'}} onClick = {(e) => this.onClickInlineMenu(e)}>
                <i className="bi bi-plus-circle"></i>
            </span>
        )
    };
}

export default SidepanelContainerBusinessToolkitTemplate;