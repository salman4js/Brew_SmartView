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
    }
}

export default ValueModal;