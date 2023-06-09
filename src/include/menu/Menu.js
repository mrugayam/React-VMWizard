import React from 'react';
import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import './Menu.css';
import { Link } from 'react-router-dom';
import useToken from '../authorisation/useToken'

function Menu(props) {
    const { token, removeToken, setToken } = useToken();
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        if (token != null) {
            const decodedToken = jwtDecode(token);
            setUserRole(decodedToken.role);
        }
    }, []);
    
    function logout() {
        fetch('http://localhost:5000/logout', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                props.token()
                window.location.reload(true)

            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }
    return (
        <div className="navigation">
            <ul className="nav-links">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>   
                {userRole === "Admin" && (
                    <li><Link to="/audit">Audit</Link></li>
                )}
                {token && (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}
                {!token && (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </div>
    );
}

export default Menu;
