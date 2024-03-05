import React from 'react';
import './popover.field.css';
import _ from 'lodash';
import PopoverFieldTemplate from "./popover.field.template";

class PopoverField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            anchorPosition: {
                top: undefined,
                left: undefined
            }
        };
        this.popoverRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    };

    templateHelpers(){
        this._templateHelpersData();
        var popOverFieldTemplate = new PopoverFieldTemplate(this.templateHelpersData);
        return popOverFieldTemplate._renderPopOverFieldTemplate();
    };

    _templateHelpersData(){
      this.templateHelpersData = {
          options: this.state,
          originatingViewOptions: this.props?.data?.options,
          eventHelpers: {
              _togglePopOverMenu: () => this.togglePopOverMenu()
          }
      };
    };

    togglePopOverMenu(){
        const anchorElement = document.getElementById('anchor-element');
        if (anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            this._updateComponentState({key: 'anchorPosition', value:{ top: rect.bottom, left: rect.right }});
            this._updateComponentState({key: 'isOpen', value: !this.state.isOpen});
        }
    };

    _updateComponentState(options){
        this.setState({[options.key]: options.value}, () => {
            _.isFunction(options.nextFunc) && options.nextFunc();
        });
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    };

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    };

    handleClickOutside(event) {
        if (this.popoverRef && !this.popoverRef.current.contains(event.target)) {
            this._updateComponentState({key: 'isOpen', value: false});
        }
    };

    render(){
      return(
          <div ref={this.popoverRef}>
              {this.templateHelpers()}
          </div>
      )
    };
}

export default PopoverField;