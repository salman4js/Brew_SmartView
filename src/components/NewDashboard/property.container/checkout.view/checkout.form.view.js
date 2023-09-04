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
        height: props.height,
        matchCheckoutDate: "Provided checkout date is matching with today's date, Customer is good to checkout!",
        stayeddays: undefined,
        billingDetails: undefined,
        billingInfo: {
          gstPrice: undefined,
          roomPrice: undefined,
          totalPrice: undefined
        },
        customModal: {
          show: false,
          onHide: null,
          header: undefined,
          centered: true,
          restrictBody: true,
          modalSize: "medium",
          footerEnabled: false,
          footerButtons: undefined
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
    
    // Render custom modal!
    _renderCustomModal(){
      return <CustomModal modalData = {this.state.customModal} />
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
    };
    
    // When checkout has been confirmed!
    handleCheckoutConfirmed(){
      
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
        this.setState({stayedDays: difference});
      } else {
        var checkinDate = new Date(this.state.userModel.dateofcheckin);
        var checkoutDate = new Date(this.getTodayDate());
        var diffTime = Math.abs(checkoutDate - checkinDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diffDays == 0 ? this.updateStayedDays(diffDays + 1 + " Days")  : this.updateStayedDays(diffDays + " Days");
      }
    };
    
    // Update stayed days and fetch billing details!
    updateStayedDays(stayeddays){
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
          gstPrice: this.gstPrice + " Rs", 
          roomPrice: this.getTotalAmount() + " Rs", 
          totalPrice: this.getTotalAmount() + this.gstPrice + " Rs"
        }
      }));
    };
    
    // Calculate GST for inclusive calculation!
    getGSTForInclusive(){ 
      var totalPayableAmount = this.getTotalAmount();
      var inclusiveGSTAmount = totalPayableAmount / (1 + determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = inclusiveGSTAmount;
    };
    
    // Calculate GST for exclusive calculation!
    getGSTForExclusive(){
      var exclusiveGSTAmount = Math.round(this.getTotalAmount() * determineGSTPercent(this.state.data.roomModel.price));
      this.gstPrice = exclusiveGSTAmount;
    };
    
    // Calculate total amount!
    getTotalAmount(){
      return Number(this.state.billingDetails.message) + Number(this.state.billingDetails.advanceCheckin) + this.getExtraBedPrice();
    };
    
    // Get extra bed price!
    getExtraBedPrice(){
      return Number(this.state.billingDetails.extraBedCount) * Number(this.state.billingDetails.extraBedPrice);
    };
    
    // Fetch required details!
    async fetchDetails(){
      await this.fetchUserDetails();
    };
    
    // Get checkedin customer user details!
    async fetchUserDetails(){
      var isHourly = this.getIsHourly();
      var params = {roomid: this.state.data.roomModel._id, isHourly};
      var result = await this.checkoutUtils.fetchUserDetails(params);
      if(result.data.success){
        this.setState({userModel: result.data.message[0]}, () => {
          this.calculateStayedDays();
        });
      };
    };
    
    // Get billing details data!
    async fetchBillingDetails(){
      var params = {roomtype: this.state.data.roomModel.suiteName,
        stayeddays: this.state.stayeddays,
        roomid:this.state.data.roomModel._id,
        isHourly: this.getIsHourly(), extraCalc: this.getIsExtraCalcEnabled()}
      var result = await this.checkoutUtils.fetchBillingDetails(params);
      this.setState({billingDetails: result.data, isFetched: true}, () => {
        this.calculateGSTPrice();
      }); 
    };
    
    // On checkout triggered!
    onCheckout(){
      var customModalOpts = {
        show: true,
        header: 'You are about to checkout this customer, Are you sure to checkout?',
        centered: true,
        restrictBody: true,
        footerEnabled: true,
        footerButtons: [{
          btnId: "Cancel",
          variant: "secondary",
          onClick: this.onCloseCustomModal.bind(this)
        },
        {
          btnId: "Checkout",
          variant: "success",
          onClick: this.handleCheckoutConfirmed.bind(this)
        }]
      };
      this._triggerCustomModal(customModalOpts);
    };
    
    // On update lifecyle method!
    componentDidUpdate(prevProps, prevState){
      console.log(prevState, this.props.data);
      if(this.props.data.onCheckout && !prevProps.data.onCheckout){
        this.onCheckout();
      }
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