import React, { useState } from 'react'
import axios from "axios"
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
 
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();


    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await axios.post('http://localhost:3000/users/login', {
            username, 
            password,
        });

        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userId", response.data.userID);
        navigate('/')
    }

  return (
    <div className='auth-container'>
    <form onSubmit={onSubmit}>
        <h2>Login</h2>
        <div className="form-group">
            <label htmlFor="usernameLogin">Username: </label>
            <input type="text" id="usernameLogin" onChange={(event) => setUsername(event.target.value)} value={username}/>
        </div>
        <div className="form-group">
            <label htmlFor="passwordLogin">Password: </label>
            <input type="password" id="passwordLogin" onChange={(event) => setPassword(event.target.value)} value={password}/>
        </div>

        <button type='submit'>Register</button>
    </form>
</div>
  )
}

export default Login