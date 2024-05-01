import { formatDate } from "../../../common.functions/common.functions";
import brewDate from "brew-date";

var checkoutViewConstants = Object.freeze({
  TEMPLATE_LABEL_CUSTOMER_DETAILS: Object.freeze({
    customerDetailsHeaders: 'Customer Details',
    customerNameLabel: 'Customer Name',
    customerPhoneNumberLabel: 'Customer Phone Number',
    customerSecondNumberLabel: 'Customer Second Number',
    customerIdNumber: 'Customer ID Number',
    customerAddress: 'Customer Address',
    adultsHeadCount: 'Adult Head Count',
    childrensHeadCount: 'Childrens Head Count'
  }),
  TEMPLATE_LABEL_STAYED_DETAILS: Object.freeze({
    stayedDetailsHeader: 'Stayed Details',
    dateOfCheckinHeader: 'Date of Checkin',
    dateOfCheckoutHeader: 'Date of Checkout',
    timeOfCheckinHeader: 'Time of Checkin',
    timeOfCheckoutHeader: 'Time of Checkout',
    extraBedCountHeader: 'Extra Bed Count',
    extraBedPriceHeaderWithExtraCalc: 'Extra Bed Price based on count and stayed days',
    extraBedPriceHeaderWithoutExtraCalc: 'Extra Bed Price based on count',
    stayedDaysHeader: 'Number of Stayed Days'
  }),
  TEMPLATE_LABEL_BILL_DETAILS: Object.freeze({
    billDetailsHeader: 'Bill Details',
    roomPriceHeader: 'Room Price Per Day',
    roomPricePerStays: 'Room Price Per Stay Days',
    gstDedeuction: 'GST Deduction',
    advanceAmount: 'Advance Amount',
    cashAndDeposit: 'Cash and Deposit',
    discountAmount: 'Discount Amount',
    balWithoutGST: 'Balance Without GST',
    balWithGST: 'Balance With GST',
    totalPayableAmount: 'Total Payable Amount',
    totalPayableAmountWithRoomTransfer: 'Total Payable Amount with Last Room',
    refundAmount: 'Amount has to be returned to the customer'
  }),
  TEMPLATE_LABEL_ROOM_TRANSFER_DETAILS: Object.freeze({
    roomTransferDetailsHeader: 'Room Transfer Details',
    oldRoomNo: 'Previous Room No',
    oldRoomPrice: 'Previous Room Price',
    oldRoomStayDays: 'Previous Room Stayed Days',
    alertMessage: {
      status: 'error',
      message: 'This guest has room transfer history, verify before checkout.'
    }
  }),
  ROOM_TRANSFER: Object.freeze({
    filteredRoomStatusConstant: 'afterCleaned',
    dashboardMode: 'filterTableView'
  }),
  BUTTON_FIELDS: Object.freeze({
    getBill: 'Get Bill',
    getInvoice: 'Get Invoice',
    editCustomerDetails: 'Edit Customer Details',
    maintainanceLog: 'Add Maintainance Log',
    roomTransfer: 'Tranfer Room',
    checkout: 'Checkout',
    addLog: 'Add Log',
    cancel: 'Cancel'
  }),
  MAINTAINANCE_LOG: Object.freeze({
    logDialogHeader: 'Add New Maintainance Log'
  }),
  TEMPLATE_LABEL_FOR_EDIT_CUSTOMER_DETAILS: Object.freeze({
    username: {
      placeholder: 'Customer Name',
      label: 'Customer Name'
    },
    phonenumber: {
      placeholder: 'Phone Number',
      label: 'Phone Number'
    },
    advance: {
      placeholder: 'Advance Amount',
      label: 'Advance Amount',
      isChanged: false
    },
    adults: {
      placeholder: 'Adults',
      label: 'Adults'
    },
    childrens: {
      placeholder: 'Children',
      label: 'Children'
    },
    aadharcard: {
      placeholder: 'ID Number',
      label: 'ID Number'
    },
    dateofcheckin: {
      minDate: '',
      placeholder: 'Date of Check-In',
      label: 'Date of Check-In',
      attribute: 'dateField',
      conversionInNodeConvertor: true,
      conversionMethod: function(value){
        return formatDate(value);
      },
      style: {
        width: '500px'
      },
    },
    dateofcheckout: {
      placeholder: 'Date of Check-Out',
      label: 'Date of Check-Out',
      attribute: 'dateField',
      conversionInNodeConvertor: true,
      conversionMethod: function(value){
        return formatDate(value);
      },
      style: {
        width: '500px'
      },
    },
    updatedAdvance: {
      value: 0,
      attribute: 'textField',
      restrictShow: true,
      postValidateAction: {job: {value: 'advance:value', action: '+'}, condition: {value: 'advance:isChanged', result: true}}
    },
    room: {
      value: undefined,
      attribute: 'textField',
      restrictShow: true
    },
    amountFor: {
      value: "In between advance payment",
      attribute: 'textField',
      restrictShow: true
    },
    dateTime: {
      value: brewDate.getFullDate('dd/mmm') + " " + brewDate.timeFormat(brewDate.getTime()),
      attribute: 'textField',
      restrictShow: true
    }
  }),
  checkoutViewPerspectiveConstant: 'property-container',
  checkoutFailureError: 'Checkout failed, please try again!',
  constantKey: 'bill-preview',
  paymentConstantLang: {
    InitialPayment: "Initial check-in payment",
    editCustomerDetailsAdvance: "In between advance payment",
    prebookInBetweenAdvance: "In between prebook advance payment",
    InitialPrebookPayment: "Initial prebook advance payment",
    prebookCancelAlertMessage: "This prebook user has paid some amount, Cannot cancel the prebooking without refunding"
  }
});

export default checkoutViewConstants;