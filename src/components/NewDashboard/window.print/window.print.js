import React from 'react';
import { extractQueryParams } from '../../common.functions/node.convertor';
import InvoiceView from '../../Invoice/invoice.view';

class WindowPrint extends React.Component {
  
  constructor(props){
    super(props);
    this.getExtractQueryParams();
  };
  
  getExtractQueryParams(){
    this.params = extractQueryParams();
  };

  // Template Helpers!
  templateHelpers(){
    return <InvoiceView node = {this.params}/>
  };
  
  // Render function!
  render(){
    return this.templateHelpers();
  };
};

export default WindowPrint;