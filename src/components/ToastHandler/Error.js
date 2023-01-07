import React from 'react';
import Alert from 'react-bootstrap/Alert';

const Error = (props) => {
  return (
    <Alert show={props.error}>
      <div className="container text-center">
        {props.errorText}
      </div>
    </Alert>
  )
}

export default Error