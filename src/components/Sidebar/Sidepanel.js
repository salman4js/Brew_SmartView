import React from "react";
import {Nav} from "react-bootstrap";


// Not using this component currently, keeping it here for the future updates!
const Side = () => {
   
    return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
            >
                <div className="sidebar-sticky"></div>
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                Disabled
                </Nav.Link>
            </Nav.Item>
            </Nav>
          
        </>
        );
  };

  export default Side;
