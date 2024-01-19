import {templateHelpers} from "./property.read.template";
import propertyReadViewConstants from "./property.read.view.constants";
import PropertyBaseView from "../property.base.view";
import {renderCustomHTMLContent} from "../../../../common.functions/node.convertor";
import {getStorage} from "../../../../../Controller/Storage/Storage";

class PropertyReadView extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            isTemplateFieldOptionsPopulated: false,
            templateFieldOptions: [],
        };
        this.templateLabel = propertyReadViewConstants.TEMPLATE_LABEL;
        this.params = this.props.params;
        this.roomConstantKey = propertyReadViewConstants.CUSTOM_TEMPLATE_CONSTANT;
        this.customTemplateFileName = this.params.accIdAndName[1] + '-' + this.roomConstantKey + '.html';
        this.customHtmlContent = {
            content: undefined
        }
    };

    isCustomPropertyReadConfigured(){
      return JSON.parse(getStorage('customHtmlForPropertyRead'));
    };

    templateHelpers(){
      if(this.state.isTemplateFieldOptionsPopulated){
          return this.isCustomPropertyReadConfigured() ? renderCustomHTMLContent(this.customHtmlContent, this.state.data, this.props.height) : templateHelpers(this.state.templateFieldOptions, propertyReadViewConstants);
      } else {
          return this._triggerActivityLoader();
      }
    };

    async populateTemplateFieldOptsObject(){
        this.state.templateFieldOptions = [];
        var templateLabelKeys = Object.keys(this.templateLabel);
        for(const key in this.state.data){
           if(templateLabelKeys.includes(key)){
             var templateFieldOptions = {};
             templateFieldOptions['templateLabel'] = this.templateLabel[key];
             templateFieldOptions['templateValue'] =  Array.isArray(this.state.data[key]) ? this.state.data[key].length : this.state.data[key];
             this.state.templateFieldOptions.push(templateFieldOptions);
           }
       };
       if(this.isCustomPropertyReadConfigured()){
           this.customHtmlContent.content = await this.fetchHtmlContent();
       }
       this._updateComponentState({key: 'templateFieldOptions', value: this.state.templateFieldOptions}, () => this._toggleComponentLoader(true))
    };
};

export default PropertyReadView;