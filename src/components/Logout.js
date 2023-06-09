import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import useToken from '../include/authorisation/useToken'

function Logout(props) {
    useEffect(() => {
        LogoutFunction(props);
    }, []);

    function LogoutFunction(props) {
        fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                props.token()
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }
    return null;
}

export default Logout;
