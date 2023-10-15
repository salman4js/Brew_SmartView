var checkoutViewConstants = Object.freeze({
  TEMPLATE_LABEL_CUSTOMER_DETAILS: Object.freeze({
    customerDetailsHeaders: 'Customer Details',
    customerNameLabel: 'Customer Name',
    customerPhoneNumberLabel: 'Customer Phone Number',
    customerSecondNumberLabel: 'Customer Second Number',
    customerIdNumber: 'Customer ID Number',
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
    discountAmount: 'Discount Amount',
    balWithoutGST: 'Balance Without GST',
    balWithGST: 'Balance With GST',
    totalPayableAmount: 'Total Payable Amount',
    refundAmount: 'Amount has to be returned to the customer'
  })
});

export default checkoutViewConstants;