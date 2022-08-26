import React, {useEffect, useState} from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const Error = (props) => {

    const [show, setShow] = useState(props.show);

    const handleAlert = () => {
        setShow(!show)
    }

    useEffect(() => {
        handleAlert();
    }, [props])

    return(
        <Alert show = {show} variant="danger">
        This is a alert with{' '}
        <Alert.Link href="#">an example link</Alert.Link>. Give it a click if
        you like.
      </Alert>
    )
}

export default Error;