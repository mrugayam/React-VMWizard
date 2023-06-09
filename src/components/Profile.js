import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import "../styles/Profile.css";

function Profile(props) {
    const [userData, setUserData] = useState(null);
    const decodedToken = jwtDecode(props.token);
    const userID = decodedToken.sub;

    useEffect(() => {
        fetch('http://localhost:5000/users/' + userID , {
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + props.token
            }
        })
            .then(response => response.json())
            .then(data => {
                data.access_token && props.setToken(data.access_token)
                setUserData(data)
                console.log(data)
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }, []);

    if (!userData) {
        return null;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>
            <br></br>
            <br></br>
            <div className="profile-content">
                <div className="profile-content-left">
                    <img
                        className="profile-avatar"
                        src="https://img.freepik.com/free-icon/user_318-563642.jpg?w=2000"
                        alt="Profile Picture"
                    />
                    <div className="profile-information">
                        <p>
                            <span className="profile-information-label">Name:</span>{" "}
                            {userData.firstName} {userData.lastName}
                        </p>
                        <p>
                            <span className="profile-information-label">Email:</span>{" "}
                            {userData.email}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;