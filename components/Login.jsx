import { useState, useEffect } from 'react'
import axios from "axios"
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUserToStore } from '../reducers/users'
import { motion } from "framer-motion" // Ajouté pour les animations

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [startAnimation, setStartAnimation] = useState(false); // Ajouté pour gérer le déclenchement des animations

    const dispatch = useDispatch()
    const [_, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('http://localhost:3000/users/login', {
            username: username.trim(), 
            password: password.trim(),
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

    const FADE_DOWN_ANIMATION_VARIANTS = {
      hidden: { opacity: 0, y: -10 },
      show: { opacity: 1, y: 0, transition: { type: "spring" } },
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setStartAnimation(true); // Déclenchement des animations après 2 secondes
      }, 700);
      return () => clearTimeout(timer); // Nettoyage du timer
    }, []);

    return (
      <motion.div
        initial="hidden"
        animate={startAnimation ? "show" : "hidden"} // Déclenchement conditionnel des animations
        variants={FADE_DOWN_ANIMATION_VARIANTS} // Ajouté pour les animations
        className='auth-container'
      >
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
          <button type='submit' className='auth-button'>Login</button>
        </form>
      </motion.div>
    )
}

export default Login
