import CardView from '../../../CardView/card.view/card.view';
import _ from 'lodash';
import ListView from "../../../fields/listview/list.view";

// Default template helpers!
export function templateHelpers(data){
  return(
    <div>
      <div className="brew-greetings">
          <div className = "brew-greetings-message">
              {data.greetingMessage}
          </div>
          <div className = 'brew-greetings-breif-message'>
              {data.detailsMessage}
          </div>
      </div>
      <div className = 'row widget-tile-container'>
        {data.state.widgetTile()}
      </div>
    </div>
  )
};

// Widget tile template helpers!
export function widgetTileTemplateHelpers(widgetModel){
  return(
    <div className = 'col-2 widget-tile-listitem'>
      <CardView data = {widgetModel} />
    </div>
  )
};

// List field view template helpers!
export function _renderListFieldTemplateHelpers(options){
    return <ListView options = {{templateData: options.data[options.propertyStatus], templateHelpersData: {allowSubData: true}}}/>
};

// Custom view field template helpers!
export function _renderCustomFieldTemplateHelpers(options){
  return(
      <div className = {options.viewClass}>

      </div>
  )
};

// Widget body child view template helpers!
export function widgetTileBodyTemplateHelpers(options){
  return(
    <div className = 'widget-tile-body'>
      {_.isFunction(options.stateCount) ? options.stateCount(options) : (options.stateCount > 90 ? '90+' : options.stateCount)}
    </div>
  )
};

