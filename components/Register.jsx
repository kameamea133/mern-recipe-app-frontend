import { useState, useEffect } from 'react'
import axios from "axios"
import { motion } from "framer-motion" 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [startAnimation, setStartAnimation] = useState(false); 

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/users/register`, {
              username: username.trim(),
              password: password.trim(),
            });
            alert(response.data.message)
            setUsername("")
            setPassword("")
        }catch(err) {
            console.error(err)
        }
    }

    const FADE_DOWN_ANIMATION_VARIANTS = {
      hidden: { opacity: 0, y: -10 },
      show: { opacity: 1, y: 0, transition: { type: "spring" } },
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setStartAnimation(true); 
      }, 900);
      return () => clearTimeout(timer); 
    }, []);

    return (
      <motion.div
        initial="hidden"
        animate={startAnimation ? "show" : "hidden"} s
        variants={FADE_DOWN_ANIMATION_VARIANTS} 
        className='auth-container'
      >
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
          <button type='submit' className='auth-button'>Register</button>
        </form>
      </motion.div>
    )
}

export default Register
