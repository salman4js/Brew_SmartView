import {templateHelpers} from "./property.read.template";
import propertyReadViewConstants from "./property.read.view.constants";
import PropertyBaseView from "../property.base.view";
import {
    createReplacementsDataFromMetadataFields,
    renderCustomHTMLContent
} from "../../../../common.functions/node.convertor";
import {getStorage} from "../../../../../Controller/Storage/Storage";
import propertyBaseConstants from "../property.base.constants";

class PropertyReadView extends PropertyBaseView {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            isTemplateFieldOptionsPopulated: false,
            templateFieldOptions: [],
        };
        this.roomConstantKey = this.props.data.selectedRoomConstant;
        this.customTemplateFileName = this.props.params.accIdAndName[1] + '-' + this.roomConstantKey + '.html';
        this.customHtmlContent = {
            content: undefined
        };
        this.templateHelpersData = {
            VIEW_HEADER: propertyBaseConstants.READ_VIEW_HEADER[this.props.data.selectedRoomConstant],
            height: this.props.height
        }
    };

    isCustomPropertyReadConfigured(){
      return JSON.parse(getStorage('customHtmlForPropertyRead'));
    };

    templateHelpers(){
      if(this.state.isTemplateFieldOptionsPopulated){
          if(this.isCustomPropertyReadConfigured()){
              // Convert property state data into replacements data.
              var replacementsData = createReplacementsDataFromMetadataFields(this.state.data);
              return renderCustomHTMLContent(this.customHtmlContent, replacementsData, this.props.height);
          } else {
              return templateHelpers(this.state.templateFieldOptions, this.templateHelpersData);
          }
      } else {
          return this._triggerActivityLoader();
      }
    };

    async populateTemplateFieldOptsObject(){
        this.state.templateFieldOptions = [];
        var templateLabelKeys = Object.keys(this.state.data);
        for(const key in this.state.data){
           if(templateLabelKeys.includes(key)){
             var templateFieldOptions = {};
             templateFieldOptions['templateLabel'] = this.state.data[key].label;
             templateFieldOptions['templateValue'] =  Array.isArray(this.state.data[key].value) ? this.state.data[key].value.length : this.state.data[key].value;
             templateFieldOptions['restrictShow'] = this.state.data[key].restrictShow;
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