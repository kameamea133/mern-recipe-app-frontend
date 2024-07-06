import { useState } from 'react'
import axios from "axios"
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUserToStore } from '../reducers/users'



 
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
   
    const dispatch = useDispatch()
    
    
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

   

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/users/login', {
            username, 
            password,
          });
    
          if (response.data.token) {
            setCookies("access_token", response.data.token);
            window.localStorage.setItem("userId", response.data.userID);
    
            
            dispatch(addUserToStore({
              userID: response.data.userID,
              username: response.data.username
            }));
    
            navigate('/');
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error(error);
        }
      };
    

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