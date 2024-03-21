import React from 'react';
import _ from "lodash";
import brewDate from 'brew-date';
import CheckoutUtils from "../../../utils/checkout.form.utils";
import checkoutViewConstants from './checkout.form.constants';
import MetadataModelState from './metadata.model.state/maintainance.log.model.state';
import metadataFieldTemplatestate from "../../../fields/metadata.field.templatestate";
import CustomModal from "../../../fields/customModalField/custom.modal.view";
import MetadataFields from '../../../fields/metadata.fields.view';
import CollectionInstance from '../../../../global.collection/widgettile.collection/widgettile.collection';
import {templateHelpers} from './checkout.form.template';
import PropertyAlertContainer from '../property.alert.container/property.alert.container.view';
import {activityLoader} from '../../../common.functions/common.functions.view';
import {determineGSTPercent, getTimeDate} from '../../../common.functions/common.functions';
import {
    createMetadataFieldsWithBaseObj,
    filterKeysInObj,
    formQueryParams,
    getBaseUrl,
    getCurrentUser,
    nodeConvertor,
    updateMetadataFields,
    validateFieldData
} from '../../../common.functions/node.convertor';
import {getStorage} from '../../../../Controller/Storage/Storage';
import propertyContainerConstants from "../property.container.constants";

class CheckOutView extends React.Component {
    
    constructor(props){
      super(props);
      this.state = {
        data: props.data,
        params: props.params,
        userModel: [],
        header: 'Check-Out Form',
        isFetched: false,
        isLoading: false,
        height: props.height,
        matchCheckoutDate: "Provided checkout date is matching with today's date, Customer is good to checkout!",
        stayeddays: undefined,
        billingDetails: undefined,
        billingInfo: {
          gstPrice: undefined,
          roomPrice: undefined,
          totalPrice: undefined,
          isNegativeValue: false
        },
        customModal: {
          show: false,
          onHide: this.onCloseCustomModal.bind(this),
          header: undefined,
          centered: true,
          isSuccessToast: false,
          isErrorToast: false,
          restrictBody: true,
          modalSize: "medium",
          footerEnabled: false,
          footerButtons: undefined
        },
        printingDetails: {
          invoice: true,
          tInvoice: false,
          igst: undefined,
          cgst: true,
          gstin: undefined
        },
        templateConstants: checkoutViewConstants,
        maintainanceLog: MetadataModelState.maintainanceLogInput,
        htmlContent: {
            content: undefined,
            filename: props.params.accIdAndName[1] + '-bill.html'
        }
      };
      this.propertyController = {
        reloadSidepanel: false,
        persistStatusView: false,
        widgetTileModel: undefined,
        updatedModel: undefined,
        updateUserCollection: undefined
      };
      this.routerController = props.routerController;
      this.isStateRouterNotified = false;
      this.checkoutUtils = new CheckoutUtils({accId: props.params.accIdAndName[0]});
    };
    
    // Update state with state name!
    _updateState(data, modelName){
      this.setState({[modelName]: data});
    };
    
    // Trigger alert message! --> Alert message will always be centered false, no custom body, only header!
    _triggerAlertMessage(options){
      var alertMessageOptions = {
        isCentered: false,
        isRestrictBody: true,
        header: options.message
      };
      this.setCustomModal(alertMessageOptions);
    };

    // Notify the state router model when the perspective is ready!
    _notifyStateRouter(){
      var opts = {
          routerOptions: {
              currentRouter: checkoutViewConstants.checkoutViewPerspectiveConstant,
              action: 'ADD',
              currentTableMode: this.state.data.roomModel.roomStatusConstant,
              currentDashboardMode: propertyContainerConstants.DASHBOARD_MODE.read
          }
      };
      this.routerController()._notifyStateRouter(opts);
      this.isStateRouterNotified = true;
    };
    
    templateHelpers(){
      if(this.state.isFetched){
        // Prepare config options which are applicable for template helpers label!
        this.prepareConfigOptions();
        // Add current time to the userModel!
        this.state.userModel['currentTime'] = getTimeDate().getTime;
        this.state.userModel['currentCheckoutDate'] = this.getTodayDate(); // Have this to update checkout date in bill preview, currently it shows user model date of checkout!
        // Update the state router model when the perspective is ready!
        !this.isStateRouterNotified && this._notifyStateRouter();
        return templateHelpers(this.state, this.configOptions, undefined, this.state.height);
      } else {
        var opts = {
          color: "black",
          marginTop: (this.state.height / 2.5) + "px",
          textCenter: true
        };
        return this._triggerActivityLoader(opts);
      }
    };
    
    // Put a activity loader on any view!
    _triggerActivityLoader(opts){
      return activityLoader(opts);
    };
    
    getIsHourly(){
      return JSON.parse(getStorage('isHourly'));
    };
    
    getIsGSTEnabled(){
      return JSON.parse(getStorage('isGst'));
    };
    
    getIsExtraCalcEnabled(){
      return JSON.parse(getStorage('extraCalc'));
    };
    
    getIsAdvanceRestricted(){
      return JSON.parse(getStorage('isAdvanceRestricted'));
    };

    getIsDateOfCheckinEditable(){
      return JSON.parse(getStorage('isCheckinDateEditable'));
    };
    
    getIsExclusive(){
      return JSON.parse(getStorage('isExclusive'));
    };
    
    getExtraBedCalcConfig(){
      return JSON.parse(getStorage('extraCalc')); // This indicates if we have to calculate extra bed based on stayed days or not!
    };

    getIsCustomHtmlConfigured(){
        return JSON.parse(getStorage('customHtmlForBillPreview'));
    };
    
    getProvidedCheckoutDate(){
      return this.state.userModel?.dateofcheckout;
    };
    
    getTodayDate(){
      return brewDate.getFullDate('yyyy/mm/dd');
    };
    
    isTodayCheckoutDate(){
      var todayDate = this.getTodayDate(),
        providedCheckoutDate = this.getProvidedCheckoutDate();
      return (todayDate === providedCheckoutDate);
    };
    
    getDateTime(){
      return brewDate.getFullDate("dd/mmm") + " " + brewDate.timeFormat(brewDate.getTime());
    };
    
    // Prepare config options which are applicable for template helpers label!
    prepareConfigOptions(){
      this.configOptions = {
        isExtraCalc: this.getExtraBedCalcConfig(),
        isAdvanceRestricted: this.getIsAdvanceRestricted()
      };
    };
    
    // Render custom modal!
    _renderCustomModal(){
      return <CustomModal modalData = {this.state.customModal} />
    };
    
    // Update property container controller!
    _updatePropertyController(opts){
      this.propertyController.reloadSidepanel = opts.reloadSidepanel;
      this.propertyController.persistStatusView = opts.persistStatusView;
      this.propertyController.widgetTileModel = opts.widgetTileModel;
      this.propertyController.updatedModel = opts.updatedModel;
      this.propertyController.updateUserCollection = opts.updateUserCollection;
    };
    
    // Trigger custom modal!
    _triggerCustomModal(opts){
      this.setState(prevState => ({
        ...prevState,
        customModal: {
          ...prevState.customModal,
          show: opts.show,
          header: opts.header,
          centered: opts.centered,
          isSuccessToast: opts.isSuccessToast,
          isErrorToast: opts.isErrorToast,
          restrictBody: opts.restrictBody,
          showBodyItemView: opts.showBodyItemView,
          footerEnabled: opts.footerEnabled,
          footerButtons: opts.footerButtons
        }
      }))
    };
    
    // On close custom modal!
    onCloseCustomModal(){
        this.setState(prevState => ({
            ...prevState,
            customModal: {
            ...prevState.customModal,
            show: false
            }
        }));
        // Update the selectedModel onCheckout value in dashboard wrapper!
        this.props.cancelCheckoutPrompt(this.propertyController);
        if(this.state.customModal.isSuccessToast){
          this.routerController()._notifyStateRouter({routerOptions: {action: 'DELETE'}}).then((result) => {
             this.props.dashboardController(this.props.routerOptions(result));
          });
        }
    };
    
    _toggleLoader(value){
      this.setState({isFetched: !value}); // As per the template helpers design, Toggle isFetched should 
      // render the loader on the screen!
    };
    
    // When checkout has been confirmed!
    async handleCheckoutConfirmed(){
      this.onCloseCustomModal();
      this._toggleLoader(true);
      await this.performCheckout();
    };
    
    // Trigger success alert container!
    successAlertContainerData(){
      var data = [{status: 'success', message: this.state.matchCheckoutDate}];
      this.checkForRoomTransferAlert(data);
      return data;
    };
    
    // Trigger failure alert container!
    errorAlertContainerData(){
      var misMatchCheckoutDate = `Provided checkout date ${this.getProvidedCheckoutDate()} is not matching with the today's date ${this.getTodayDate()}!`
      var data = [{status: 'error', message: misMatchCheckoutDate}, {status: 'error', message: "Please verify customer details before checkout."}];
      this.checkForRoomTransferAlert(data);
      return data;
    };
    
    // Check for room transfer alert message!
    checkForRoomTransferAlert(data){
      if(this.state.userModel.isRoomTransfered){
        data.push(checkoutViewConstants.TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS.alertMessage);
      };
    };
    
    // Alert container language pack!
    getAlertContainerLang(){
      // check if today's date is same as the checkout date!
      var isTodayCheckoutDate = this.isTodayCheckoutDate();
      if(isTodayCheckoutDate){
        return this.successAlertContainerData();
      } else {
        return this.errorAlertContainerData();
      }
    };

    // Alert container renderer!
    renderAlertContainer(){
      if(this.state.isFetched){
        var getAlertContainerLang = this.getAlertContainerLang();
        return <PropertyAlertContainer data = {getAlertContainerLang} viewRefHeight = {(alertContainerHeight) => this._updateState((this.state.height - alertContainerHeight), 'height')} />
      }
    };
    
    // Calculate stayed days!
    calculateStayedDays(){
      var checkInDateTime = this.state.userModel.dateofcheckin + " " + this.state.userModel.checkinTime,
       checkOutDateTime = this.getTodayDate() + " " + getTimeDate().getTime;
      if(this.getIsHourly()){
        var difference = brewDate.diffHours(checkInDateTime, checkOutDateTime);
        return difference;
      } else {
        var checkinDate = new Date(this.state.userModel.dateofcheckin);
        var checkoutDate = new Date(this.getTodayDate());
        var diffTime = Math.abs(checkoutDate - checkinDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // diffDays == 0 ? this.updateStayedDays(diffDays + 1 + " Days")  : this.updateStayedDays(diffDays + " Days");
        return diffDays == 0 ? diffDays + 1 : diffDays;
      }
    };
    
    // Update stayed days and fetch billing details!
    updateStayedDays(){
      var stayeddays = this.calculateStayedDays(),
        stayedDays = stayeddays +" Days";
      this.setState({stayeddays}, async () => {
        await this.fetchBillingDetails();
      })
    };
    
    // Calculate GST price!
    calculateGSTPrice(){
      this.gstPercent = determineGSTPercent(this.state.data.roomModel.price);
      this.isChannel = this.state.userModel.channel !== 'Walk-In';
      if(!this.isChannel){
        this.getIsExclusive() ? this.getGSTForExclusive() : this.getGSTForInclusive();
      } else {
        this.getGSTForInclusive();
      }
      this.setBillingInformation();
    };
    
    // Set billing information to the state handler!
    setBillingInformation(){
      this.setState(prevState => ({
        ...prevState,
        billingInfo: {
          ...prevState.billingInfo,
          gstPrice: this.gstPrice, 
          roomPrice: this.getRoomPrice() + " Rs", 
          totalPrice: this.getTotalPayableAmount() + (this.getIsExclusive() ? this.gstPrice : 0), // In case of inclusive, GST amount would be in the
            // total amount, hence we don't have to add gst price with the total payable amount.
          advanceAmount: this.state.billingDetails.advanceCheckin,
          discountAmount: this.state.billingDetails.discountPrice,
          withoutGST: this.getAmountWithoutGST(),
          roomPricePerStays: this.getAmountForStayedDays(),
          isNegativeValue: this.getTotalPayableAmount() <= 0
        }
      }), () => {
        this.prepareUserCheckoutDetails();
      });
    };

    // Get total amount with advance and discount but without GST!
    // In case of inclusive, GST amount would be in the total amount, hence we would have to reduce the gstPrice from the result.
    getAmountWithoutGST(){
      var extraBedPrice = Number(this.getExtraBedPrice());
      var result = ((this.getRoomPrice() * this.state.stayeddays) - this.state.billingDetails.advanceCheckin - this.state.billingDetails.discountPrice) + extraBedPrice;
      return this.getIsExclusive() ? result : (result - this.gstPrice);
    };

    // Calculate GST for inclusive calculation!
    getGSTForInclusive(){
      var amountForStayedDays = (this.getAmountForStayedDays() + Number(this.getExtraBedPrice())) - this.state.billingDetails.discountPrice;
      var inclusiveGSTAmount = Math.round(amountForStayedDays / (1 + determineGSTPercent(this.state.data.roomModel.price)));
      this.gstPrice = amountForStayedDays - inclusiveGSTAmount;
    };

    // Calculate GST for exclusive calculation!
    getGSTForExclusive(){
      var amountForStayedDays = (this.getAmountForStayedDays() + Number(this.getExtraBedPrice())) - this.state.billingDetails.discountPrice;
      var exclusiveGSTAmount = Math.round(amountForStayedDays * determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = exclusiveGSTAmount;
    };

    // Get room price only!
    getRoomPrice(){
      var roomPrice = this.state.billingDetails.isChannel ? Number(this.state.billingDetails.totalAmount) : Number(this.state.data.roomModel.price); // Total amount being the updatePrice amount, If the price has been updated.
      // Use the room price amount!
      return roomPrice; 
    };

    // Get amount for stayed days!
    getAmountForStayedDays(){
      var roomPrice = this.getRoomPrice(),
        stayedDays = this.calculateStayedDays();
      return Number(roomPrice) * Number(stayedDays);
    };

    // Calculate total amount!
    getTotalPayableAmount(){
      var amountForStayedDays = this.getAmountForStayedDays(),
        advanceAmount = Number(this.state.billingDetails.advanceCheckin),
        discountAmount = Number(this.state.billingDetails.discountPrice),
        extraBedPrice = Number(this.getExtraBedPrice());
      return (amountForStayedDays - advanceAmount - discountAmount) + extraBedPrice;
    };

    // Get extra bed price!
    getExtraBedPrice(){
      var isExtraCalcEnabled = this.getExtraBedCalcConfig(),
        extraBedPricePerDay = Number(this.state.billingDetails.extraBedCount) * Number(this.state.billingDetails.extraBedPrice),
        extraBedPriceForStayedDays = this.state.stayeddays * extraBedPricePerDay;
      return isExtraCalcEnabled ? extraBedPriceForStayedDays : extraBedPricePerDay; // Here we are honoring the config for extra bed calculation!
      // Based on days or based on count only!
    };
    
    // Fetch required details!
    async fetchDetails(){
      this._toggleLoader(true);
      await this.fetchUserDetails();
    };
    
    // Get checkedin customer user details!
    async fetchUserDetails(){
      var isHourly = this.getIsHourly();
      var params = {roomid: this.state.data.roomModel._id, isHourly};
      var result = await this.checkoutUtils.fetchUserDetails(params);
      if(result.data.success){
        this.setState({userModel: result.data.message[0]}, () => {
          this.updateStayedDays();
        });
      };
    };
    
    // Get billing details data!
    async fetchBillingDetails(){
      var params = {roomtype: this.state.data.roomModel.suiteName,
        stayeddays: this.state.stayeddays + ' Days',
        roomid:this.state.data.roomModel._id,
        isHourly: this.getIsHourly(), extraCalc: this.getIsExtraCalcEnabled()}
      var result = await this.checkoutUtils.fetchBillingDetails(params);
      if(result.data.success){
        this.setState({billingDetails: result.data, isFetched: true}, () => {
          this.calculateGSTPrice();
        }); 
      }
    };
    
    // Calculate the refund amount and return!
    getRefundAmount(){
      var refundAmount;
      if(typeof this.state.billingInfo.totalPrice === 'string'){
        refundAmount = Number(this.state.billingInfo.totalPrice.slice(0, -3));
      } else {
        refundAmount = this.state.billingInfo.totalPrice < 0 ? this.state.billingInfo.totalPrice : 0;
      };
      
      return Math.abs(refundAmount);
    };
    
    // Prepare user checkout details!
    prepareUserCheckoutDetails(){
      this.checkoutDetails = {userid: this.state.userModel._id, username: this.state.userModel.username,
        roomid: this.state.data.roomModel._id, stayeddays: this.state.stayeddays,
        checkoutdate: this.getTodayDate(), checkoutTime: getTimeDate().getTime,
          checkinDate: this.state.userModel.dateofcheckin, checkinTime: this.state.userModel.checkinTime, roomtype: this.state.data.roomModel.suiteName,
        prebook: this.state.data.roomModel.preBooked, amount: this.getTotalPayableAmount(), refund: this.getRefundAmount(), 
        totalDishAmount: 0, isGst: this.getIsGSTEnabled(), foodGst: 0, stayGst: this.state.billingInfo.gstPrice,
        roomno: this.state.data.roomModel.roomno, dateTime: this.getDateTime(), checkoutBy: getCurrentUser()};
      this.props.updateSelectedModel({roomModel: this.state.data.roomModel, userModel: this.checkoutDetails});
    };
    
    // Perform checkout!
    async performCheckout(){
      // Form up the params!
      var data = this.checkoutDetails,
          modalData,
          result = await this.checkoutUtils.onCheckout(data);
      if(result.data.success){
          this._toggleLoader(false);
          this._updatePropertyController({reloadSidepanel: {silent: true}, persistStatusView: false, widgetTileModel: {objectIdToBeUpdated: result.data.updatedModel._id,
                  selectedConstant: [this.props.data.userStatusMap[this.props.data.roomModel.roomStatusConstant], this.props.data?.originatingTableView?.userStatus],
                  action: 'REMOVE', keysToCompare: ['_id', 'room']}, // After clearing the data from the
              // widget tile model, clear the model from the room status model too to keep the data in sync.
          updateUserCollection: {id: result.data.updatedModel._id, action: 'CHECK-OUT'}, updatedModel: result.data.updatedModel});
          modalData = {header: result.data.message, isCentered: false, isRestrictBody: true, isSuccessToast: true,
        isFooterEnabled: false};
      } else {
          modalData = {header: checkoutViewConstants.checkoutFailureError, isCentered: false, isRestrictBody: true, isErrorToast: true, isFooterEnabled: true};
      }
      this.setCustomModal(modalData);
    };
    
    // Form the object to send it as the query params to window print handler!
    formPrintDetailsObj(){
      this.printDetails = {
        customerName: this.state.userModel.username,
        phoneNumber: this.state.userModel.phonenumber,
        roomRent: this.state.billingDetails.message,
        discount: this.state.userModel.discount,
        advance: this.state.userModel.advance,
        dateofCheckIn: this.state.userModel.dateofcheckin,
        dateofCheckout: this.state.userModel.dateofcheckout,
        receiptId: this.state.userModel.receiptId,
        roomno: this.state.userModel.roomno,
        checkinTime: brewDate.timeFormat(this.state.userModel.checkinTime),
        checkoutTime: this.state.userModel.currentTime,
        extraBedAmount: this.state.userModel.extraBedPrice,
        address: this.state.userModel.address,
        stayedDays: this.state.stayeddays,
        gstPercent: this.gstPercent,
        isGst: true, // Force set the GST enabled flag to true as per business requirement.
        gst: this.state.billingInfo.gstPrice,
        extraBeds: this.state.userModel.extraBeds,
        // amount: this.state.billingInfo.totalPrice,
        cgst: this.state.printingDetails.cgst,
        igst: this.state.printingDetails.igst,
        invoice: this.state.printingDetails.invoice,
        tInvoice: this.state.printingDetails.tInvoice,
        totalAmount: this.state.billingInfo.totalPrice,
        totalTaxableValue: this.state.billingInfo.withoutGST
      };
    };
    
    // Update printing details preference!
    updatePrintingDetailsPref(pref){
      this.onCloseCustomModal();
      this.setState(prevState => ({
        ...prevState,
        printingDetails: {
          ...prevState.printingDetails,
          invoice: pref.invoice,
          tInvoice: pref.tInvoice
        }
      }), () => {
        this.windowPrint();
      })
    };
    
    // Trigger room transfer!
    _triggerRoomTransfer(){
      this.onCloseCustomModal();
      // Options to handle locate table view!
      var options = {
        navigateToStatusTableView: true,
        selectedRoomConstant: checkoutViewConstants.ROOM_TRANSFER.filteredRoomStatusConstant,
        dashboardMode: checkoutViewConstants.ROOM_TRANSFER.dashboardMode,
        isRoomTransferCommand: true
      };
      this.props.dashboardController(options);
    };

    // Trigger edit customer details from this checkout.form.view.
    _triggerEditCustomerDetails(){
        var requiredKeys, propertyData, metadataFieldState, propertyConstants, userModel;
        userModel = _.clone(this.state.userModel);
        userModel['amountFor'] = undefined; userModel['dateTime'] = undefined; userModel['updatedAdvance'] = undefined; userModel['roomId'] = undefined;
        metadataFieldState = _.clone(metadataFieldTemplatestate.metadataFieldState);
        propertyConstants = _.clone(checkoutViewConstants.TEMPLATE_LABEL_FOR_EDIT_CUSTOMER_DETAILS);
        // Check if date of checkin editable is configured or not...
        if(!this.getIsDateOfCheckinEditable()){
            delete propertyConstants['dateofcheckin'];
        }
        // Required data for edit customer details...
        propertyConstants.room.value = this.state.userModel.room;
        propertyConstants.updatedAdvance.value = this.state.userModel.advance;
        propertyConstants['roomId'] = propertyConstants.room;
        // End of required data for edit customer details...
        requiredKeys = Object.keys(propertyConstants);
        propertyData = createMetadataFieldsWithBaseObj(filterKeysInObj(userModel, requiredKeys), propertyConstants, metadataFieldState);
        this.onCloseCustomModal(); // Close the custom modal to prevent unexpected behaviour.
        this.props.dashboardController({dashboardMode: propertyContainerConstants.DASHBOARD_MODE.propertyReadView,
            queryParams: [{key: 'selectedModel', value: this.state.userModel._id}, {key: 'isEditable', value: 'true'}, {key: 'method', value: 'edit-user-model'},
                {key: 'uniqueId', value: 'userId'}, {key: 'clientModelKey', value: 'updatedUserModel'}, {key: 'serverModelKey', value: 'updatedUserModel'}],
            selectedRoomConstant: propertyContainerConstants.PROPERTY_VIEW.propertyUser, userModel: this.state.userModel, propertyData: propertyData, goToLocation: true});
    };
    
    // Window print for invoice and bill!
    windowPrint(){
      this.formPrintDetailsObj(); // Form the printing details as an object
      var baseUrl = getBaseUrl(),
        queryParams = formQueryParams(this.printDetails);
      window.open(baseUrl + '/windowprint' + "?" + queryParams); // This will open a new tab along with the all the datas
      // neccessary for print the data in the url.
    };
    
    // Prompt maintainance log dialog!
    _promptMaintainanceLogDialog(){
      this.onCloseCustomModal(); // First close the existing modal.
      var logDialogModalOptions = {
        header: checkoutViewConstants.MAINTAINANCE_LOG.logDialogHeader,
        isCentered: true,
        bodyItemView: this.logDialogBodyItemView.bind(this),
        isFooterEnabled: true,
        footerButtons: [{
          btnId: checkoutViewConstants.BUTTON_FIELDS.cancel,
          variant: 'secondary',
          onClick: this.onCloseCustomModal.bind(this)
        }, {
          btnId: checkoutViewConstants.BUTTON_FIELDS.addLog,
          variant: 'primary',
          onClick: this.addNewLog.bind(this)
        }]
      };
      this.setCustomModal(logDialogModalOptions);
    };
    
    // Add new log!
    async addNewLog(){
      var isDataValid = await validateFieldData(this.state.maintainanceLog, (updatedData) => this._updateState(updatedData, this.state.maintainanceLog));
      if(isDataValid.length === 0){
        this.onCloseCustomModal();
        this._toggleLoader(true);
        var fieldData = nodeConvertor(this.state.maintainanceLog);
        // Add userId, that is mandatory for the REST to store the log!
        fieldData['userId'] = this.state.userModel._id;
        fieldData['dateTime'] = brewDate.getFullDate("dd/mmm") + " " + brewDate.timeFormat(brewDate.getTime());
        var result = await this.checkoutUtils.addNewLog(fieldData);
        this._toggleLoader(false);
        this._triggerAlertMessage(result.data);
      };
    };
    
    // Fetch maintainance log type!
    async fetchMaintainanceLogType(){
      var result = await this.checkoutUtils.fetchMaintainanceLogType();
      updateMetadataFields('priceType', {options: result}, this.state.maintainanceLog, (updatedData) => this._updateState(updatedData, this.state.maintainanceLog));
      this.setState({maintainanceLog: this.state.maintainanceLog});
    };
    
    // Log dialog body item view!
    logDialogBodyItemView(){
      var maintainanceLogType = CollectionInstance.getCollections('maintainanceLogType');
      if(maintainanceLogType?.data){
        return <MetadataFields data = {this.state.maintainanceLog} updateData = {(updatedData) => this._updateState(updatedData, this.state.maintainanceLog)}/>
      } else {
        this.fetchMaintainanceLogType();
        var opts = {
          color: "black",
          textCenter: true
        };
        return this._triggerActivityLoader(opts);
      }
    };
    
    // Checkout modal body item view!
    checkoutModalBodyItemView(){
      // this.updatePrintingDetailsPref.bind(this, {invoice: true, tInvoice: false})
      var buttonFields = [{
          btnValue: checkoutViewConstants.BUTTON_FIELDS.getBill,
          onClick: this.updatePrintingDetailsPref.bind(this, {invoice: true, tInvoice: false}),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }, {
          btnValue: checkoutViewConstants.BUTTON_FIELDS.getInvoice,
          onClick: this.updatePrintingDetailsPref.bind(this, {invoice: false, tInvoice: true}),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }, {
          btnValue: checkoutViewConstants.BUTTON_FIELDS.editCustomerDetails,
          onClick: this._triggerEditCustomerDetails.bind(this),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }, {
        btnValue: checkoutViewConstants.BUTTON_FIELDS.maintainanceLog,
        onClick: this._promptMaintainanceLogDialog.bind(this),
        isDark: true,
        occupyFullSpace: true,
        attribute: 'buttonField'
      }, {
        btnValue: checkoutViewConstants.BUTTON_FIELDS.roomTransfer,
        onClick: this._triggerRoomTransfer.bind(this),
        restrictShow: false,
        isDark: true,
        occupyFullSpace: true,
        attribute: 'buttonField'
      }, {
          btnValue: checkoutViewConstants.BUTTON_FIELDS.checkout,
          onClick: this.onCheckout.bind(this),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }
    ];
      return <MetadataFields data = {buttonFields} />
    };
    
    // On continue checkout, Prompt a modal for different checkout actions!
    onContinueCheckout(){
      var data = {
        header: 'What action would you like to perform?',
        isCentered: true,
        bodyItemView: this.checkoutModalBodyItemView.bind(this)
      };
      this.setCustomModal(data);
    };
    
    // When checkout action triggered in property container!
    onCheckout(){
      var data = {
        header: 'You are about to checkout this customer, Are you sure to checkout?',
        isCentered: true,
        isRestrictBody: true,
        isFooterEnabled: true,
        footerButtons: [{
          btnId: 'Cancel',
          variant: 'secondary',
          onClick: this.onCloseCustomModal.bind(this)
        },
        {
          btnId: 'Checkout',
          variant: 'success',
          onClick: this.handleCheckoutConfirmed.bind(this)
        }]
      };
      this.setCustomModal(data);
    };
    
    // When the room model has been changed!
    updateRoomModel(updatedData){
      this.setState({data: updatedData}, () => {
        this.fetchDetails();
      })
    };
    
    // On checkout triggered!
    setCustomModal(data){
      var customModalOpts = {
        show: true,
        header: data.header,
        centered: data.isCentered,
        isSuccessToast: data.isSuccessToast,
        isErrorToast: data.isErrorToast,
        restrictBody: data.isRestrictBody,
        showBodyItemView: data.bodyItemView,
        footerEnabled: data.isFooterEnabled,
        footerButtons: data.footerButtons
      };
      this._triggerCustomModal(customModalOpts);
    };

    // Fetch the corresponding html file content.
    fetchHTMLContent(){
        var options = {
            filename: this.state.htmlContent.filename, // TODO: Change this into dynamic name.
            accId: this.state.params.accIdAndName[0],
            templateName: checkoutViewConstants.constantKey
        };
        this.checkoutUtils._getHTMLContent(options).then((result) => {
            this.setState({htmlContent: {content: result}});
        });
    };
    
    // On update lifecyle method!
    async componentDidUpdate(prevProps, prevState){
      if(this.props.data.onCheckout && !prevProps.data.onCheckout){
        this.onContinueCheckout();
      };
      
      if(this.props.data.roomModel._id !== prevProps.data.roomModel._id){
        await this.updateRoomModel(this.props.data);
      };
    };
    
    // On render lifecyle method!
    async componentDidMount(){
      await this.fetchDetails(); // Fetch user details and billing information!
      this.getIsCustomHtmlConfigured() && await this.fetchHTMLContent();
    };
    
    render(){
      return(
        <>
          <div>
            {this.renderAlertContainer()}
          </div>
          <div>
            {this.templateHelpers()}
          </div>
          {this.state.customModal.show && this._renderCustomModal()}
        </>
      )
    };
};

export default CheckOutView;