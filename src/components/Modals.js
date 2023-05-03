import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const Modals = (props) => {

    const [show, setShow] = useState(props.options.show);
    
    // State handler for GST selection!
    const [choice, setChoice] = useState({
        igst: false,
        cgst: false
    })

    const handleClose = () => {
        props.setShow(false);
    }

    // Update choice function!
    function handleChoiceUpdate(data){
        if(data === "IGST"){
            updateIGST();
        } else {
            updateCGST();
        }
    }

    function updateIGST(){
        setChoice(prevState => ({...prevState, igst: !choice.igst, cgst: false }))
    }

    function updateCGST(){
        setChoice(prevState => ({...prevState, cgst: !choice.cgst, igst: false }))
    }

    // Declare className
    function defineClass(){
        return props.options.className;
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                {props.options && props.options.header && (
                    <Modal.Header closeButton>
                        {props.options.headerText}
                    </Modal.Header>
                )}
                <Modal.Body className= {defineClass()}>
                    {props.options.message}

                    {/* Error message renderer! */}
                    {props.options && props.options.error && (
                        <div className="text-center">
                            {props.options.errorView}
                        </div>
                    )}

                    {/* // Choice options GST options! */}
                    {props.options && props.options.choiceAttr && (
                        <div className="choiceBtns">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked = {choice.igst} onChange={() => handleChoiceUpdate(props.options.choiceBtn.btn1)} />   
                                    <label class="form-check-label" for="flexCheckDefault">
                                        {props.options.choiceBtn.btn1}
                                    </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked = {choice.cgst} onChange={() => handleChoiceUpdate(props.options.choiceBtn.btn2)} />
                                    <label class="form-check-label" for="flexCheckChecked">
                                        {props.options.choiceBtn.btn2} (Default Value)
                                    </label>
                            </div>
                        </div>
                    )}

                </Modal.Body>
                {props.options && props.options.footer && (
                    <Modal.Footer>
                        <Button variant="btn btn-info" onClick={() => props.generateInvoice(choice)}>
                            {props.options.footerAttr.btn.btn1}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        </div>

    )
}

export default Modals