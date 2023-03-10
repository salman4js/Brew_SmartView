import React from 'react'

const ValueModal = (props) => {
    
    if(props.methodid === "checkout"){
        return(
        <div>
            <p>
                Customer Name: {props.data.username}
            </p>
            <p>
                Phone Number: {props.data.phonenumber}
            </p>
            <p>
                Second Phone Number: {props.data.secondphonenumber}
            </p>
            <p>
                Adults: {props.data.adults}
            </p>
            <p>
                Childrens: {props.data.childrens}
            </p>
            <p>
                Date of check-in: {props.data.dateofcheckin}
            </p>
            <p>
                Date of check-out: {props.data.dateofcheckout}
            </p>
            <p>
                Discount: {props.data.discount}
            </p>
            <p>
            Advance: {props.data.advance}
            </p>
        </div>
        )
    } else if(props.methodid === "prebook") {
       return(
        <div>
            <p>
                Customer Name: {props.data.prebookUsername}
            </p>
            <p>
                Phone Number: {props.data.prebookPhonenumber}
            </p>
            <p>
                Second Phone Number: {props.data.prebookSecondNumber}
            </p>
            <p>
                Adults: {props.data.prebookAdults}
            </p>
            <p>
                Childrens: {props.data.prebookChildren}
            </p>
            <p>
                Date of check-in: {props.data.prebookDateofCheckin}
            </p>
            <p>
                Date of check-out: {props.data.prebookDateofCheckout}
            </p>
            <p>
                Discount: {props.data.prebookdiscount}
            </p>
            <p>
            Advance: {props.data.prebookAdvance}
            </p>
        </div>
       )
    } else if(props.methodid === "favourites"){
        return(
            <div>
            <p>
                Customer Name: {props.data.username}
            </p>
            <p>
                Phone Number: {props.data.phonenumber}
            </p>
            <p>
                Second Phone Number: {props.data.secondphonenumber}
            </p>
            <p>
                Aadhar Card: {props.data.aadharcard}
            </p>
        </div>
        )
    } else if(props.methodid === "recent"){
        return(
            <div>
            <p>
                Customer Name: {props.data.username}
            </p>
            <p>
                Phone Number: {props.data.phonenumber}
            </p>
            <p>
                Second Phone Number: {props.data.secondphonenumber}
            </p>
            <p>
                Aadhar Card: {props.data.aadharcard}
            </p>
            {
                props.data.prebooked ==  true ? (
                  <p className="font-big">
                    PreBooked -- Yes
                  </p>
                ) : (
                  <p className="font-big">
                    PreBooked -- No
                  </p>
                )
              }
            <p className="font-big">
              Adults -- {props.data.adults}
            </p>
            <p className="font-big">
              Childrens -- {props.data.childrens}
            </p>
            <p className="font-big">
              Aadhar Number -- {props.data.aadharcard}
            </p>
            <p className="font-big">
              Checked In Days -- {props.data.stayedDays}
            </p>
            <p className="font-big">
              Checked In  -- {props.data.dateofcheckin}
            </p>
            <p className="font-big">
              Checked Out -- {props.data.dateofcheckout}
            </p>
            {
              props.data.discount ===  undefined || props.data.discount === null ? (
                <p className="font-big">
                  Discount Applied - False
                </p>
              ) : (
                <p className="font-big">
                  Discount Applied - True
                </p>
              )
            }
            {
             props.data.advance === undefined || props.data.advance === null ? (
              <p className="font-big">
                Advance Applied - False
              </p>
             ) : (
              <p className="font-big">
                Advance Applied - True
              </p>
             )
            }
            <p className="">
                Dish Amount : {props.data.dishbill}
            </p>
            <p className='font-big'>
              Dish GST Amount: {props.data.foodGst}
            </p>
            <p className="font-big">
                Stay Amount : {props.data.bill}
            </p>
            <p className = 'font-big'>
              Stay GST Amount: {props.data.stayGst}
            </p>
            <p className='font-big'>
              Total Paid Amount: {props.data.totalAmount}
            </p>
        </div>
        )
    }
}

export default ValueModal;