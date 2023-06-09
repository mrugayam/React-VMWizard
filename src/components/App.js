import React from 'react';
import '../styles/App.css';
import Menu from '../include/menu/Menu';
import Dashboard from './Dashboard.js';
import useToken from '../include/authorisation/useToken'
import Login from './Login.js';
import Profile from './Profile.js';
import Audit from './Audit.js';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
    const { token, removeToken, setToken } = useToken();

    return (
        <BrowserRouter>
            <div>
                <Menu token={removeToken} />
                {!token && token !== "" && token !== undefined ?
                    <Login setToken={setToken} />
                    : (
                        <>
                            <Routes>
                                <Route path="/" element={<Dashboard token={token} setToken={setToken} />}></Route>
                                <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />}></Route>
                                <Route path="/profile" element={<Profile token={token} setToken={setToken} />}></Route>
                                <Route path="/audit" element={<Audit token={token} setToken={setToken} />}></Route>
                                <Route path="/login" element={<Login token={token} setToken={setToken} />}></Route>
                            </Routes>
                        </>
                    )}
            </div>
        </BrowserRouter>
    )
}
export default App;