import React from 'react';
import brewDate from 'brew-date';
import CheckoutUtils from './checkout.form.utils';
import CustomModal from '../../../CustomModal/custom.modal.view';
import { templateHelpers } from './checkout.form.template';
import PropertyAlertContainer from '../property.alert.container/property.alert.container.view';
import { activityLoader } from '../../../common.functions/common.functions.view';
import { getTimeDate, determineGSTPercent } from '../../../common.functions/common.functions';
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
        propertyController: {
          reloadSidepanel: false,
          reloadPropertyContainer: false
        }
      };
      this.checkoutUtils = new CheckoutUtils({accId: props.params.accIdAndName[0]});
    };
    
    templateHelpers(){
      if(this.state.isFetched){
        // Add current time to the userModel!
        this.state.userModel['currentTime'] = getTimeDate().getTime;
        return templateHelpers(this.state.userModel, this.state.billingInfo);
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
      this.setState(prevState => ({
        ...prevState,
        propertyController: {
          ...prevState.propertyController,
          reloadSidepanel: opts.reloadSidepanel,
          reloadPropertyContainer: opts.reloadPropertyContainer
        }
      }))
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
          footerEnabled: opts.footerEnabled,
          footerButtons: opts.footerButtons,
          propertyController: {
            ...prevState.propertyController,
            reloadSidepanel: opts.reloadSidepanel,
            reloadPropertyContainer: opts.reloadPropertyContainer
          }
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
      this.props.cancelCheckoutPrompt(this.state.propertyController);
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
          isNegativeValue: this.getTotalPayableAmount() > 0 ? false : true
        }
      }));
    };

    // Get total amount with advance and discount but without GST!
    getAmountWithoutGST(){
      return this.getRoomPrice() - this.state.billingDetails.advanceCheckin - this.state.billingDetails.discount;
    };
    
    // Calculate GST for inclusive calculation!
    getGSTForInclusive(){ 
      var amountForStayedDays = this.getAmountForStayedDays();
      var inclusiveGSTAmount = amountForStayedDays / (1 + determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = inclusiveGSTAmount;
    };
    
    // Calculate GST for exclusive calculation!
    getGSTForExclusive(){
      var exclusiveGSTAmount = Math.round(this.getAmountForStayedDays() * determineGSTPercent(this.state.data.roomModel.price));
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
        totalPayableAmount = roomPrice - advanceAmount - discountAmount + extraBedPrice;
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
    
    // Perform checkout!
    async performCheckout(){
      // Form up the params!
      var data = {userid: this.state.userModel._id, 
        roomid: this.state.data.roomModel._id, stayeddays: this.state.stayeddays,
        checkoutdate: this.getTodayDate(), checkoutTime: getTimeDate().getTime, roomtype: this.state.data.roomModel.suiteName,
        prebook: this.state.data.roomModel.preBooked, amount: this.getTotalPayableAmount(), refund: 0, 
        totalDishAmount: 0, isGst: this.getIsGSTEnabled(), foodGst: 0, stayGst: this.state.billingInfo.gstPrice,
        roomno: this.state.data.roomModel.roomno, dateTime: this.getDateTime()};
      var result = await this.checkoutUtils.onCheckout(data);
      if(result.data.success){
        this._updatePropertyController({reloadSidepanel: {silent: false}, reloadPropertyContainer: true});
        var data = {header: result.data.message, isCentered: false, isRestrictBody: true, 
        isFooterEnabled: false};
        this._toggleLoader(false);
        this.setCustomModal(data);
      }
    };
    
    // When checkout action triggered in property container!
    onCheckout(){
      var data = {
        header: 'You are about to checkout this customer, Are you sure to checkout?',
        isCentered: true,
        isRestrictBody: true,
        isFooterEnabled: true,
        secondaryBtnId: 'Cancel',
        primaryButtonId: 'Checkout'
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
        footerEnabled: data.isFooterEnabled,
        footerButtons: [{
          btnId: data.secondaryBtnId,
          variant: "secondary",
          onClick: this.onCloseCustomModal.bind(this)
        },
        {
          btnId: data.primaryButtonId,
          variant: "success",
          onClick: this.handleCheckoutConfirmed.bind(this)
        }]
      };
      this._triggerCustomModal(customModalOpts);
    };
    
    // On update lifecyle method!
    async componentDidUpdate(prevProps, prevState){
      if(this.props.data.onCheckout && !prevProps.data.onCheckout){
        this.onCheckout();
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