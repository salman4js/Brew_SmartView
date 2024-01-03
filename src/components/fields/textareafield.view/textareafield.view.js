import TextField from "../textfield/textfield.view";
import React from "react";

class TextareaField extends TextField {
    constructor(props) {
        super(props);
        this.props = props;
    };

    render(){
      return (
          <div className="modal-gap" style={{width: this.props.data.width, padding: this.props.data.padding}}>
              {this.props.data.label && (
                  <label style={{color: "black"}}> {this.props.data.label} </label>
              )}
              <textarea rows = {this.props.data.rows} type={this.getType()} className="form-control" aria-describedby="input-field"
                     value={this.getValue()}
                     placeholder={this.getValueForPlaceholder()} onKeyDown={(event) => this.handleEvents(event)}
                     onChange={(event) => this.checkLimit(event)}/>
              {this.props.data?.inlineToast !== undefined && (
                  this._showInlineToast()
              )}
          </div>
      )
    };
}

export default TextareaField;