import React, {useState} from 'react'
import axios from "axios"
const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        try{
            await axios.post("http://localhost:3000/users/register", {
                username,
                password,
            });
            alert("Registration completed! Now login!")
        }catch(err) {
            console.error(err)
        }
    }

  return (
    <div className='auth-container'>
        <form onSubmit={onSubmit}>
            <h2>Register</h2>
            <div className="form-group">
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" onChange={(event) => setUsername(event.target.value)} value={username}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" onChange={(event) => setPassword(event.target.value)} value={password}/>
            </div>

            <button type='submit'>Register</button>
        </form>
    </div>
  )
}

export default Register