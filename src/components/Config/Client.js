import React from 'react';
import Modal from "react-bootstrap/Modal";

const Client = () => {
    return (
        <div className = "container">
            <Modal 
                show = {true}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <table border="1">
                    <tr>
                        <th></th>
                        <th>Enable/Disable</th>
                    </tr>
                    <tr>
                        <th>Options</th>
                        <td>Data</td>
                    </tr>
                </table>
            </Modal>
        </div>
    )
}

export default Client