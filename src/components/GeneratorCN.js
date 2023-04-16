import React from 'react'

const GeneratorCN = (props) => {

  return (
      <div className="col-4" style={{ paddingBottom: '10vh' }}>
        <div class="card">
          <h5 class="card text-center" style={{ color: "black", fontWeight: "bold" }}>{props.checkin}</h5>
          <div class="card-body">
            <p style={{ color: "black" }}>
              Date of Checkout : {props.checkout}
            </p>
            <p style={{ color: "black" }}>
              Amount paid : {props.bill}
            </p>
            <p style={{ color: "black" }}>
              Room No : {props.roomno}
            </p>
            <p style={{ color: "black" }}>
              Stayed Days : {props.stayeddays}
            </p>
            <p style={{ color: "black" }}>
              Customer Name : {props.username}
            </p>
            {
              props.discount === undefined || props.discount === null ? (
                <p style={{ color: "black" }}>
                  Discount Amount : False
                </p>
              ) : (
                <div>
                  <p style={{ color: "black" }}>
                    Discount Amount : {props.discount === "" ? 0 : props.discount}
                  </p>
                </div>
              )
            }
            {
              props.advance === undefined || props.advance === null ? (
                <p style={{ color: "black" }}>
                  Advance Amount : False
                </p>
              ) : (
                <div>
                  <p style={{ color: "black" }}>
                    Advance Amount : {props.advance === "" ? 0 : props.advance}
                  </p>
                </div>
              )
            }
            <p style={{ color: "black" }}>
              Phone Number : {props.phonenumber}
            </p>
            <p style={{ color: "black" }}>
              Adults : {props.adults}
            </p>
            <p style={{ color: "black" }}>
              Childrens : {props.childrens}
            </p>
            <p style={{ color: "black" }}>
              ID Number : {props.aadharcard}
            </p>
          </div>
        </div>
      </div>
  )
}

export default GeneratorCN