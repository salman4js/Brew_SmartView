import React from 'react';
import _ from 'lodash';
import windowPrintConstants from "./window.print.constants";
import {extractQueryParams, renderCustomHTMLContent} from '../../common.functions/node.convertor';
import { activityLoader } from "../../common.functions/common.functions.view";
import { getStorage } from "../../../Controller/Storage/Storage";
import InvoiceView from '../../Invoice/invoice.view';
import {getLodgeId} from "../../common.functions/common.functions";
import CommandsConnector from "../commands/commands.connector";

class WindowPrint extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      canPrint: false
    }
    this.supportedActions = {
      invoice: 'customTemplateForBill',
      tInvoice: 'customTemplateForInvoice'
    }; // Here, only one of the values should be true always as per the design.
    this.customTemplate = {
      content: undefined,
      replacements: undefined,
      propertyContainerHeight: window.innerHeight
    }
  };

  isCustomTemplateConfigured(){
    Object.keys(this.supportedActions).forEach((action) => {
      if(this.params[action] === 'true'){
        if(JSON.parse(getStorage(this.supportedActions[action]))){
          this.customTemplateConfigured = {templateName: this.supportedActions[action]};
        }
      }
    });
    if(!this.customTemplateConfigured){
      this._updateComponentState({key: 'isLoading', value: false});
    } else {
      this.fetchCustomTemplate();
    }
  };

  _togglePrintAction(value){
    this._updateComponentState({key: 'canPrint', value: value});
  };

  _updateComponentState(options, nextFunction){
    this.setState({[options.key]: options.value}, () => {
      _.isFunction(nextFunction) && nextFunction();
    });
  };

  fetchCustomTemplate(){
    var options = {
      accId: getLodgeId(),
      filename: windowPrintConstants.templateFileName[this.customTemplateConfigured.templateName],
      templateName: windowPrintConstants.templateConstantKey[this.customTemplateConfigured.templateName]
    };
    CommandsConnector.fetchCustomHTMLConfiguredTemplate(options).then((result) => {
      if(result){
        this.customTemplate.content = result;
        this.customTemplate.replacements = this.params;
        this._updateComponentState({key: 'isLoading', value: false}, () => {
          this._togglePrintAction(true);
        });
      }
    });
  };

  getExtractQueryParams(){
    this.params = extractQueryParams();
    // Check if the current action has custom template configured.
    this.isCustomTemplateConfigured();
  };

  _showLoader(){
    var opts = {
      color: "white",
      marginTop: (window.innerHeight / 2.5) + "px",
      textCenter: true
    };
    return activityLoader(opts);
  };

  _renderPrintingTemplate(){
    if(this.customTemplateConfigured){
      return renderCustomHTMLContent(this.customTemplate, this.customTemplate.replacements, this.customTemplate.propertyContainerHeight);
    } else {
      return <InvoiceView node = {this.params} />
    }
  };

  // Template Helpers!
  templateHelpers(){
    if(this.state.isLoading){
      return this._showLoader();
    } else {
      return this._renderPrintingTemplate();
    }
  };

  // Render function!
  render(){
    return this.templateHelpers();
  };

  componentDidMount() {
    this.getExtractQueryParams();
  };

  componentDidUpdate(){
    if(this.state.canPrint){
      window.print();
      this._togglePrintAction(false);
    }
  };
};

export default WindowPrint;