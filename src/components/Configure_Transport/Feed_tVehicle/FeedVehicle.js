import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Panel from '../../Panel/Panel';
import PanelFooter from '../../Panel/PanelFooter';

const FeedVehicle = (props) => {

    // Button Handler!
    const [success, setSuccess] = useState("Yes");
    const [failure, setFailure] = useState("Cancel");
    const [showfooter, setShowfooter] = useState(true);
    const [func, setFunc] = useState();

    // Panel options handler!
    const [panel, setPanel] = useState(false);
    const [text, setText] = useState();
    const panelHandler = (job) => {
        setShowfooter(true);
        if (job === "edit") {
            setFunc(job);
            setText("You sure want to change the state of the vehicle?");
        } else if (job === "delete") {
            setFunc(job);
            setText("You sure want to delete the entry of the vehicle?");
        } else {
            setText("Some internal error occured, please try again later!");
            setShowfooter(false);
            setFailure("Cancel");
        }
        setPanel(!panel);

    }

    return (
        <div>
            <div className="t_mode">
                <div style={{ color: "black" }}>
                    <div className="row">
                        <div className={`col-sm-8 ${props.duty ? "onDuty" : "offDuty"}`} align="left">
                            {props.vehicle}
                        </div>
                        <div className="col">
                            <div className='row'>
                                <div className='col-2'>
                                    <i class="bi bi-bag-x-fill" onClick={() => panelHandler("delete")}></i>
                                </div>
                                <div className="col">
                                    <i class="bi bi-bag-check-fill" onClick={() => panelHandler("edit")}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Panel */}
                <Modal
                    show={panel}
                    onHide={() => panelHandler()}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Sure to make changes?</Modal.Title>
                    </Modal.Header>
                    <Panel text={text} />
                    {
                        func === "edit" ? (
                            showfooter ? (
                                <PanelFooter success={success} failure={failure} onSuccess={() => props.onToggle(props.id)} onFailure={() => panelHandler()} />
                            ) : (
                                <div>

                                </div>
                            )
                        ) : (
                            showfooter ? (
                                <PanelFooter success={success} failure={failure} onSuccess={() => props.onDelete(props.id)} onFailure={() => panelHandler()} />
                            ) : (
                                <div>

                                </div>
                            )
                        )
                    }
                </Modal>
            </div>
        </div>
    )
}

export default FeedVehicle;