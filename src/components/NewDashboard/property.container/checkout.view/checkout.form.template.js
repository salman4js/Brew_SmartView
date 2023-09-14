export function templateHelpers(userModel, billingInfo){
  return(
      <div className = 'row'>
      {/* Customer Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            Customer Details
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Customer Name </label>
              <p style = {{color: 'black'}}> {userModel.username} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Customer Phone Number </label>
              <p style = {{color: 'black'}}> {userModel.phonenumber} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Customer Second Number </label>
              <p style = {{color: 'black'}}> {userModel.secondphonenumber} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> ID Number </label>
              <p style = {{color: 'black'}}> {userModel.aadharcard} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Adults Head Count </label>
              <p style = {{color: 'black'}}> {userModel.adults} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Childrens Head Count </label>
              <p style = {{color: 'black'}}> {userModel.childrens} </p>
            </div>
        </div>
        {/* Stayed Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            Stayed Details
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Check-In Date </label>
              <p style = {{color: 'black'}}> {userModel.dateofcheckin} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Check-In Time </label>
              <p style = {{color: 'black'}}> {userModel.checkinTime} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Check-Out Date </label>
              <p style = {{color: 'black'}}> {userModel.dateofcheckout} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Check-Out Time </label>
              <p style = {{color: 'black'}}> {userModel.currentTime} </p>
            </div>
        </div>
        {/* Bill Details */}
        <div className = 'col'>
          <div className = 'dashboard-container-fields-header'>
            Bill Details
          </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Room Price </label>
              <p style = {{color: 'black'}}> {billingInfo.roomPrice} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> GST Deduction </label>
              <p style = {{color: 'black'}}> {billingInfo.gstPrice} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Given Advance Amount </label>
              <p style = {{color: 'black'}}> {billingInfo.advanceAmount} </p>
            </div>
            <div className = 'modal-gap'>
              <label style = {{color: 'black'}}> Given Discount Amount </label>
              <p style = {{color: 'black'}}> {billingInfo.discountAmount} </p>
            </div>
            {!billingInfo.isNegativeValue && (
              <>
                <div className = 'modal-gap'>
                  <label style = {{color: 'black'}}> Balance without GST </label>
                  <p style = {{color: 'black'}}> {billingInfo.withoutGST} </p>
                </div>
                <div className = 'modal-gap'>
                  <label style = {{color: 'black'}}> Balance with GST </label>
                  <p style = {{color: 'black'}}> {billingInfo.totalPrice} </p>
                </div>
                <div className = 'modal-gap'>
                  <label style = {{color: 'green', fontWeight: 'bold'}}> Total Payabale Amount </label>
                  <p style = {{color: 'green', fontWeight: 'bold'}}> {billingInfo.totalPrice} </p>
                </div>
              </>
            )}
            {billingInfo.isNegativeValue && (
              <>
                <div className = 'modal-gap'>
                  <label style = {{color: 'black'}}> Amount has to be returned to the guest </label>
                  <p style = {{color: 'black'}}> {billingInfo.totalPrice.slice(1)} </p>
                </div>
              </>
            )}
        </div>
      </div>
  )
};