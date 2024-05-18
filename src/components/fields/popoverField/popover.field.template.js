import React from "react";
import TableToolbarView from "../../NewDashboard/table.toolbar.view/table.toolbar.view";
import _ from "lodash";

class PopoverFieldTemplate {
    constructor(signatureOptions) {
        this.status = signatureOptions;
    };

    _renderMenuActions(commands){
        return commands && commands?.map((options) => {
            if(!options.disabled && !_.isFunction(options.icon)){
                return(
                    <span className = "brew-tabletemplate-left-toolbar" onClick = {() => options.onClick(options)}>
                        {options.value}
                    </span>
                )
            }
        })
    };

    _renderCommandOptions(){
        return <TableToolbarView options = {this.status.originatingViewOptions} customMenuActionView = {(commands) => this._renderMenuActions(commands)}/>
    };

    _renderPopOverFieldTemplate(){
        return (
            <div className="popover-container">
            <span className='brew-statustableview-lefttoolbar-header-control' onClick = {() => this.status.eventHelpers._togglePopOverMenu()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              </svg>
            </span>
                {this.status.options.isOpen && (
                    <div className="popover-menu"
                         style={{top: this.status.options.anchorPosition.top, left: this.status.options.anchorPosition.left}}>
                        <ul onClick={() => this.status.eventHelpers._togglePopOverMenu()}>
                            {this._renderCommandOptions()}
                        </ul>
                    </div>
                )}
            </div>
        )
    }
};

export default PopoverFieldTemplate;