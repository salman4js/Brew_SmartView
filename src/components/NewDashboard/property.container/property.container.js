import React, {useEffect, useState} from 'react';
import MetadataFields from '../../fields/metadata.fields.view';
import TableViewTemplateHelpers from "./table.view/table.view.template";
import CheckInForm from './checkin.view/checkin.form.view';
import {formUtils} from "../../utils/checkin.form.utils";
import CheckOutView from './checkout.view/checkout.form.view';
import RoomStatusView from './room.status.view/room.status.view';
import DefaultView from './default.view/default.view';
import StatusTableView from './table.view/table.view';
import FilterTable from './filter.table.wrapper/filter.table.wrapper';
import LogTable from './log.table.wrapper/log.table.wrapper';
import PaymentTrackerWrapper from "./payment.tracker.view/payment.tracker.wrapper";
import VoucherTableWrapper from "./voucher.table.wrapper/voucher.table.wrapper";
import PropertyReadView from "./property.base.view/property.read.view/property.read.view";
import PropertyEditView from "./property.base.view/property.edit.view/property.edit.view";
import InsightsTableWrapper from "./insights.table.wrapper/insights.table.wrapper";
import propertyContainerConstants from './property.container.constants';
import {
  extractQueryParams,
  extractStateValue,
  renderCustomHTMLContent,
} from '../../common.functions/node.convertor';

const PropertyContainer = (props) => {

  // Panel fields state handler!
  const [panelField, setPanelField] = useState([]);

  // Custom modal state handler!
  const [customModal, setCustomModal] = useState({
    show: false,
    onHide: () => _updateCustomModalOptions({show:false}),
    header: undefined,
    centered: false,
    restrictBody: undefined,
    footerEnabled: false,
    footerButtons: undefined
  })

  // Table view template initializer.
  var TableViewTemplate = new TableViewTemplateHelpers(
      {options: {onBack: ()=> onBackClick(),
          selectedRoomConstant: propertyContainerConstants.WIDGET_CONSTANTS[props.data.dashboardMode]}});

  // On back click on table toolbar view for property container.
  function onBackClick(){
    props.routerController()._notifyStateRouter({routerOptions: {action: 'DELETE'}}).then((result) => {
      props.dashboardController(getRouterOptions(result));
    })
  };

  // For non-table view perspective, Use this method to notify the state router instead of writing the same code
  // for in all non-table view perspective.
  function notifyStateRouter(){
    var opts = {
      routerOptions: {
        currentRouter: propertyContainerConstants.PERSPECTIVE_CONSTANT[props.data.dashboardMode],
        currentTableMode: propertyContainerConstants.WIDGET_CONSTANTS[props.data.dashboardMode],
        currentDashboardMode: props.data.dashboardMode,
        action: 'ADD'
      }
    };
    props.routerController()._notifyStateRouter(opts);
  };

  // Get the router options!
  function getRouterOptions(stateRouter){
    var extendedTableOptions = {reloadSidepanel: {silent: true}, navigateToStatusTableView: true, dashboardMode: stateRouter.dashboardModel[stateRouter.dashboardModel.length - 1],
      selectedRoomConstant: stateRouter.tableModel[stateRouter.tableModel.length - 1]};
    var options = {
      'default-view': {reloadSidepanel: {silent: true}, navigateToPropertyContainer: true},
      'property-container': {reloadSidepanel: {silent: true}, persistStatusView:true, updatedModel: props.data.roomModel},
      'table-view': extendedTableOptions,
      'filter-table-view': extendedTableOptions,
      'payment-tracker-table-view': extendedTableOptions,
      'log-table-view': extendedTableOptions
    };
    return options[stateRouter.stateModel[stateRouter.stateModel.length -  1]];
  };
  
  // Get panel field data!
  function getPanelFieldData(){
    // Get panel field dropdown options!
    var panelFieldDropdownOptions = getPanelFieldDropdown();
    // Get panel field selected and default values!
    var selectedValues = getPanelFieldsValues();
    return [
      {
        value: selectedValues,
        actualValue: undefined,
        attribute: "dataListField",
        name: 'panelFieldDropdown',
        allowInputField: false,
        allowPanelField: propertyContainerConstants.ALLOW_PANEL_FIELD.includes(props.data.dashboardMode),
        allowRightSideControl: true,
        customPanelField: !propertyContainerConstants.ALLOW_PANEL_FIELD.includes(props.data.dashboardMode),
        renderCustomPanelField: () => TableViewTemplate.renderLeftSideController(),
        rightSideControl: _renderRightSideControl,
        height: 27,
        width: '200px',
        selectedValue: selectedValues,
        showListValue: function(){
          return props.data.dashboardMode !== propertyContainerConstants.DASHBOARD_MODE.roomStatus;
        },
        style: {
          width: "200",
          color: "black",
          fontSize: "15px",
          paddingRight: "10px",
          paddingLeft: "10px",
          cursor: "pointer",
        },
        options: panelFieldDropdownOptions
      }
    ]
  };

  // Should show panel dropdown for panel field.
  function shouldShowPanelDropdown(){
    return !propertyContainerConstants.IGNORE_PANEL_FIELD_DROPDOWN.includes(props.data.dashboardMode);
  };

  // Get panel field dropdown values!
  function getPanelFieldDropdown(){
    if(shouldShowPanelDropdown()){
       return propertyContainerConstants.PANEL_FIELD_VALUES[props.data.dashboardMode]
    } else {
      return []; // Return empty array as per the design of the panel field!
    }
  };

  // Sometimes, We want to update the panel field dropdown into different attribute rather than updating it in dashboardMode.
  // This method would be handy in those cases. (i.e): insights
  function _updateDashboardControllerOpts(options, panelFieldOptions){
    // Use this method in-case if needed to change the dashboard controller options.
  };
  
  // Update panel field data from the metadata fields!
  function _updatePanelFieldData(updatedData){
    setPanelField(updatedData);
    var panelFieldOptions = extractStateValue(updatedData, 'actualValue');
    // Options to handle perspective change!
    var options = {
      navigateToStatusTableView: true,
      selectedRoomConstant: propertyContainerConstants.TABLE_HEADERS[panelFieldOptions.panelFieldDropdown],
      dashboardMode: panelFieldOptions.panelFieldDropdown,
      routerOptions: {currentRouter: propertyContainerConstants.propertyContainerPerspectiveConstant, action: 'ADD'}
    };
    _updateDashboardControllerOpts(options, panelFieldOptions);
    props.dashboardController(options);
  };

  // Get panel field dropdown selectedValues and values!
  function getPanelFieldsValues(){
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.edit){
      return propertyContainerConstants.FORM_MODE.checkinForm;
    }
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.read){
      return propertyContainerConstants.FORM_MODE.checkoutForm;
    }
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.insights){
      return propertyContainerConstants.FORM_MODE.insightsForm;
    }
  };

  // Render property model!
  function _renderPropertyModel(){
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.edit){
      return <CheckInForm height = {props.propertyContainerHeight} data = {props.data} params = {props.params} routerController = {(opts) => props.routerController(opts)}
      afterFormSave = {(opts) => props.onCancel(opts)} routerOptions = {(opts) => getRouterOptions(opts)} dashboardController = {(opts) => props.dashboardController(opts)} />
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.read){
      return <CheckOutView height = {props.propertyContainerHeight} data = {props.data} params = {props.params} dashboardController = {(opts) => props.dashboardController(opts)}
      updateSelectedModel = {(options) => props.updateSelectedModel(options)} routerOptions = {(opts) => getRouterOptions(opts)}
      cancelCheckoutPrompt = {(opts) => props.cancelCheckoutPrompt(opts)} routerController = {(opts) => props.routerController(opts)} />
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.roomStatus){
      return <RoomStatusView height = {props.propertyContainerHeight} data = {props.data} params = {props.params}
      dashboardController = {(opts) => props.dashboardController(opts)} routerController = {(opts) => props.routerController(opts)} />
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.default){
      return <DefaultView data = {props.propertyDetails} params = {props.params} height = {props.propertyContainerHeight}
      dashboardController = {(opts) => props.dashboardController(opts)} routerController = {(opts) => props.routerController(opts)} />
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.statusTableView){
      return <StatusTableView data = {props.data}  params = {props.params} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      dashboardController = {(opts) => props.dashboardController(opts)} stateRouter = {props.stateRouter} routerController = {(opts) => props.routerController(opts)}
      updateSelectedModel = {(options) => props.updateSelectedModel(options)}/>
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.filterTableView){
      return <FilterTable data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} stateRouter = {props.stateRouter} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} routerController = {(opts) => props.routerController(opts)} />
    };
    
    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.logTableView){
      return <LogTable data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      routerController = {(opts) => props.routerController(opts)} stateRouter = {props.stateRouter} dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} />
    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.paymentTrackerView){
      return <PaymentTrackerWrapper data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      routerController = {(opts) => props.routerController(opts)} stateRouter = {props.stateRouter} dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} />
    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.voucherTrackerView){
      return <VoucherTableWrapper data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      routerController = {(opts) => props.routerController(opts)} stateRouter = {props.stateRouter} dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} />
    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.insights){
      return <InsightsTableWrapper data = {props.data} propertyDetails = {props.propertyDetails} height = {props.propertyContainerHeight} getRouterOptions = {(stateModel) => getRouterOptions(stateModel)}
      notifyStateRouter = {() => notifyStateRouter()} stateRouter = {props.stateRouter} dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} />
    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.propertyReadView){
      return <PropertyReadView data = {props.data} height = {props.propertyContainerHeight} routerController = {(opts) => props.routerController(opts)} params = {props.params} />

    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.propertyEditView){
      return <PropertyEditView  data = {props.data} height = {props.propertyContainerHeight} routerController = {(opts) => props.routerController(opts)}
      dashboardController = {(opts) => props.dashboardController(opts)} params = {props.params} modalOptions = {(options, nextFunc) => _updateCustomModalOptions(options, nextFunc)}/>
    };

    if(props.data.dashboardMode === propertyContainerConstants.DASHBOARD_MODE.customHTMLView){
      return renderCustomHTMLContent(props.htmlContent.customHtmlContent, props.htmlContent.replacements, props.propertyContainerHeight);
    };
  };

  // Get form models!
  function getFormModels(){
    var emptyFormModel = [];

    var checkinFormModel = [{
        btnValue: propertyContainerConstants.BUTTON_FIELDS.cancelButton,
        onClick: onCancel,
        attribute: 'buttonField'
      },{
        btnValue: propertyContainerConstants.BUTTON_FIELDS.checkinButton,
        onClick: onCheckIn,
        attribute: 'buttonField'
      }
    ];
    
    var checkoutFormModel = [{
        btnValue: propertyContainerConstants.BUTTON_FIELDS.cancelButton,
        onClick: onCancel,
        attribute: 'buttonField'
      },
      {
        btnValue: propertyContainerConstants.BUTTON_FIELDS.checkoutButton,
        onClick: onCheckout,
        attribute: 'buttonField'
      }
    ];

    var roomStatusFormModel = [{
        btnValue: propertyContainerConstants.BUTTON_FIELDS.cancelButton,
        onClick: onCancel,
        attribute: 'buttonField'
    }];

    var propertyReadViewModel = [{
      btnValue: propertyContainerConstants.BUTTON_FIELDS.editButton,
      onClick: switchToPropertyEditMode,
      attribute: 'buttonField'
    }];

    var propertyEditViewModel = [{
      btnValue: propertyContainerConstants.BUTTON_FIELDS.saveButton,
      onClick: onEditProperties,
      disabled: (props.data?.roomModel?.isOccupied === "true"),
      attribute: 'buttonField'
    }];
    
    return {edit: checkinFormModel, read: checkoutFormModel, roomStatus: roomStatusFormModel, default: emptyFormModel,
      propertyReadView: propertyReadViewModel, propertyEditView: propertyEditViewModel};
  };

  // Get panel field right side data!
  function getPanelRightSideData(){
    var formModels = getFormModels();
    return formModels[props.data.dashboardMode];
  };
  
  // Render right side control panel for datalist field!
  function _renderRightSideControl(){
    var panelRightSideData = getPanelRightSideData();
    return <MetadataFields data = {panelRightSideData} />
  };

  // On checkout!
  function onCheckout(){
    props.onCheckout(true);
  };
  
  // On Cancel!
  function onCancel(){
    return onBackClick();
  };

  // Switch to property edit mode,
  function switchToPropertyEditMode(){
    var options = {
      roomModel: props.data.roomModel,
      userModel: props.data.userModel,
      goToLocation: true,
      propertyData: props.data.propertyData,
      selectedRoomConstant: props.data.roomModel !== undefined ? propertyContainerConstants.PROPERTY_VIEW.propertyRoom : propertyContainerConstants.PROPERTY_VIEW.propertyUser,
      dashboardMode: propertyContainerConstants.DASHBOARD_MODE.propertyEditView
    }
    props.dashboardController(options);
  };

  // On Edit properties, Send the control to the property.edit.view along with the function that has to get called.
  function onEditProperties(){
    var funcMethodKey = extractQueryParams().method;
    var options = {
      onEditProperties: true,
      propertyDataCallBackFunc: (data) => formUtils()[funcMethodKey](data) // Second parameter is the key
      // which contains the actual model so that the key can be extracted.
    }
    props.dashboardController(options);
  };
  
  // On Save!
  function onCheckIn(){
    props.onSave(true); // this will trigger the onSave API call in checkin form view!
  };
  
  // Should show panel field and for statusTableView we render panel field separately!
  function shouldShowPanelField(){
    return !propertyContainerConstants.IGNORE_PANEL_FIELD.includes(props.data.dashboardMode);
  };

  // Update custom modal options!
  function _updateCustomModalOptions(opts, nextFunc){
    setCustomModal(prevState => ({...prevState,
      show: opts.show,
      header: opts.header,
      onHide: () => opts.onHide(),
      restrictBody: opts.restrictBody,
      centered: opts.centered,
      footerEnabled: opts.footerEnabled,
      footerButtons: opts.footerButtons
    }));
    if(nextFunc){
      nextFunc();
    }
  };

  // Should show modal alert!
  function _shouldRenderModalAlert(){
    return customModal.show;
  };

  // Render modal alert!
  function _renderModelAlert(){
    var tableTemplateHelpers = new TableViewTemplateHelpers();
    return tableTemplateHelpers._renderCustomModal(customModal);
  };
  
  // Force update when the props change!
  useEffect(() => {
    var panelFieldData = getPanelFieldData();
    setPanelField(panelFieldData); // Update the panel field data when the dashboardMode changes!
  }, [props.data.dashboardMode])
  
  return(
    <>
      {_shouldRenderModalAlert() && _renderModelAlert()}
      {shouldShowPanelField() && (
        <MetadataFields data = {panelField} updateData = {(updatedData) => _updatePanelFieldData(updatedData)} />
      )}
      {_renderPropertyModel()}
    </>
  )
}

export default PropertyContainer;