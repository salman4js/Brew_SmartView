import React from 'react';
import brewDate from 'brew-date';
import CheckoutUtils from './checkout.form.utils';
import CustomModal from '../../../CustomModal/custom.modal.view';
import WindowPrint from '../../window.print/window.print';
import MetadataFields from '../../../fields/metadata.fields.view';
import { templateHelpers } from './checkout.form.template';
import PropertyAlertContainer from '../property.alert.container/property.alert.container.view';
import { activityLoader } from '../../../common.functions/common.functions.view';
import { getTimeDate, determineGSTPercent } from '../../../common.functions/common.functions';
import { getBaseUrl, formQueryParams } from '../../../common.functions/node.convertor';
import { getStorage } from '../../../../Controller/Storage/Storage';


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
        }
      };
      this.propertyController = {
        reloadSidepanel: false,
        navigateToPropertyContainer: false,
        persistStatusView: false,
        updatedModel: undefined,
        updateUserCollection: undefined
      };
      this.checkoutUtils = new CheckoutUtils({accId: props.params.accIdAndName[0]});
    };
    
    templateHelpers(){
      if(this.state.isFetched){
        // Add current time to the userModel!
        this.state.userModel['currentTime'] = getTimeDate().getTime;
        return templateHelpers(this.state);
      } else {
        var opts = {
          color: "black",
          marginTop: (this.state.height / 2.5) + "px",
          textCenter: true
        }
        return activityLoader(opts);
      }
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
    
    getIsExclusive(){
      return JSON.parse(getStorage('isExclusive'));
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
    
    // Render custom modal!
    _renderCustomModal(){
      return <CustomModal modalData = {this.state.customModal} />
    };
    
    // Update property container controller!
    _updatePropertyController(opts){
      this.propertyController.reloadSidepanel = opts.reloadSidepanel;
      this.propertyController.navigateToPropertyContainer = opts.navigateToPropertyContainer;
      this.propertyController.persistStatusView = opts.persistStatusView;
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
      return data;
    };
    
    // Trigger failure alert container!
    errorAlertContainerData(){
      var misMatchCheckoutDate = `Provided checkout date ${this.getProvidedCheckoutDate()} is not matching with the today's date ${this.getTodayDate()}!`
      var data = [{status: 'error', message: misMatchCheckoutDate}, {status: 'error', message: "Please verify customer details before checkout."}];
      return data;
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
        return <PropertyAlertContainer data = {getAlertContainerLang} />
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
      this.isChannel = this.state.userModel.channel !== 'Walk-In' ? true : false;
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
          gstPrice: this.gstPrice + ' Rs', 
          roomPrice: this.getRoomPrice() + " Rs", 
          totalPrice: this.getTotalPayableAmount() + this.gstPrice + " Rs",
          advanceAmount: this.state.billingDetails.advanceCheckin + ' Rs',
          discountAmount: this.state.billingDetails.discountPrice + ' Rs',
          withoutGST: this.getAmountWithoutGST() + ' Rs',
          roomPricePerStays: this.getAmountForStayedDays(),
          isNegativeValue: this.getTotalPayableAmount() > 0 ? false : true
        }
      }));
    };

    // Get total amount with advance and discount but without GST!
    getAmountWithoutGST(){
      var extraBedPrice = Number(this.getExtraBedPrice());
      return ((this.getRoomPrice() * this.state.stayeddays) - this.state.billingDetails.advanceCheckin - this.state.billingDetails.discount) + extraBedPrice;
    };
    
    // Calculate GST for inclusive calculation!
    getGSTForInclusive(){ 
      var amountForStayedDays = this.getAmountForStayedDays() + Number(this.getExtraBedPrice());
      var inclusiveGSTAmount = amountForStayedDays / (1 + determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = inclusiveGSTAmount;
    };
    
    // Calculate GST for exclusive calculation!
    getGSTForExclusive(){
      var exclusiveGSTAmount = Math.round((this.getAmountForStayedDays() + Number(this.getExtraBedPrice())) * determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = exclusiveGSTAmount;
    };
    
    // Get room price only!
    getRoomPrice(){
      return Number(this.state.data.roomModel.price);
    };
    
    // Get amount for stayed days!
    getAmountForStayedDays(){
      var roomPrice = this.getRoomPrice(),
        stayedDays = this.calculateStayedDays();
      return Number(roomPrice) * Number(stayedDays);
    };
    
    // Calculate total amount!
    getTotalPayableAmount(){
      var roomPrice = Number(this.state.billingDetails.message),
        advanceAmount = Number(this.state.billingDetails.advanceCheckin),
        discountAmount = Number(this.state.billingDetails.discount),
        extraBedPrice = Number(this.getExtraBedPrice()),
        totalPayableAmount = (roomPrice - advanceAmount - discountAmount) + extraBedPrice;
      return totalPayableAmount;
    };

    // Get extra bed price!
    getExtraBedPrice(){
      return Number(this.state.billingDetails.extraBedCount) * Number(this.state.billingDetails.extraBedPrice);
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
    
    // Perform checkout!
    async performCheckout(){
      // Form up the params!
      var data = {userid: this.state.userModel._id, username: this.state.userModel.username,
        roomid: this.state.data.roomModel._id, stayeddays: this.state.stayeddays,
        checkoutdate: this.getTodayDate(), checkoutTime: getTimeDate().getTime, roomtype: this.state.data.roomModel.suiteName,
        prebook: this.state.data.roomModel.preBooked, amount: this.getTotalPayableAmount(), refund: this.getRefundAmount(), 
        totalDishAmount: 0, isGst: this.getIsGSTEnabled(), foodGst: 0, stayGst: this.state.billingInfo.gstPrice,
        roomno: this.state.data.roomModel.roomno, dateTime: this.getDateTime()};
      var result = await this.checkoutUtils.onCheckout(data);
      if(result.data.success){
        this._updatePropertyController({reloadSidepanel: {silent: true}, persistStatusView: false, navigateToPropertyContainer: true, 
          updateUserCollection: {id: result.data.updatedModel._id, action: 'CHECK-OUT'}, updatedModel: result.data.updatedModel});
        var data = {header: result.data.message, isCentered: false, isRestrictBody: true, 
        isFooterEnabled: false};
        this._toggleLoader(false);
        this.setCustomModal(data);
      }
    };
    
    // Form the object to send it as the query params to window print handler!
    formPrintDetailsObj(){
      this.printDetails = {
        customerName: this.state.userModel.username,
        phoneNumber: this.state.userModel.phonenumber,
        roomRent: this.state.billingInfo.roomPrice,
        discount: this.state.userModel.discount,
        advance: this.state.userModel.advance,
        dateofCheckIn: this.state.userModel.dateofcheckin,
        dateofCheckout: this.state.userModel.dateofcheckout,
        receiptId: this.state.userModel.receiptId,
        roomno: this.state.userModel.roomno,
        checkinTime: this.state.userModel.checkinTime,
        checkoutTime: this.state.userModel.checkoutTime,
        extraBedAmount: this.state.userModel.extraBedPrice,
        address: this.state.userModel.address,
        stayedDays: this.state.stayeddays,
        gstPercent: this.gstPercent,
        gst: this.state.billingInfo.gstPrice,
        extraBeds: this.state.userModel.extraBeds,
        // amount: this.state.billingInfo.totalPrice,
        cgst: this.state.printingDetails.cgst,
        igst: this.state.printingDetails.igst,
        invoice: this.state.printingDetails.invoice,
        tInvoice: this.state.printingDetails.tInvoice,
      };
    };
    
    // Update printing details preference!
    updatePrintingDetailsPref(pref){
      this.setState(prevState => ({
        ...prevState,
        printingDetails: {
          ...prevState.printingDetails,
          invoice: pref.invoice,
          tInvoice: pref.tInvoice
        }
      }), () => {
        this.windowPrint()
      })
    };
    
    // Window print for invoice and bill!
    windowPrint(){
      this.formPrintDetailsObj(); // Form the printing details as an object
      var baseUrl = getBaseUrl(),
        queryParams = formQueryParams(this.printDetails);
      window.open(baseUrl + '/windowprint' + "?" + queryParams); // This will open a new tab along with the all the datas
      // neccessary for print the data in the url.
    };
    
    // Checkout modal body item view!
    checkoutModalBodyItemView(){
      // this.updatePrintingDetailsPref.bind(this, {invoice: true, tInvoice: false})
      var buttonFields = [{
          btnValue: 'Get bill',
          onClick: this.updatePrintingDetailsPref.bind(this, {invoice: true, tInvoice: false}),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }, {
          btnValue: 'Get Invoice',
          onClick: this.updatePrintingDetailsPref.bind(this, {invoice: false, tInvoice: true}),
          isDark: true,
          occupyFullSpace: true,
          attribute: 'buttonField'
      }, {
          btnValue: 'Checkout',
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
        restrictBody: data.isRestrictBody,
        showBodyItemView: data.bodyItemView,
        footerEnabled: data.isFooterEnabled,
        footerButtons: data.footerButtons
      };
      this._triggerCustomModal(customModalOpts);
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
    };
    
    render(){
      return(
        <>
          <div>
            {this.renderAlertContainer()}
          </div>
          <div className = "dashboard-container-fields-view" style = {{height: this.state.height}}>
            {this.templateHelpers()}
          </div>
          {this.state.customModal.show && this._renderCustomModal()}
        </>
      )
    };
};

export default CheckOutView;