import { useState } from 'react'
import { Link } from 'react-router-dom'
import {useCookies} from "react-cookie"
import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/users'
import { IoMdLogOut } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";


const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch()


   // Function to handle user logout
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    dispatch(logoutUser());
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className='navbar'>
    <Link to="/">
      <img src="/logoRecipe.png" alt="logo" className='logo'/>
    </Link>
    <div className={`nav-links ${isOpen ? 'open' : ''}`}> 
      <Link to="/create-recipe">Create Recipe</Link>
      {!cookies.access_token ? ( <Link to="/auth">Login/Register</Link>) : (
        <>
          <Link to="/saved-recipes">My Saved Recipes</Link>
          <Link to="/my-recipes">My Recipes</Link>
          <button onClick={logout} className='logout-icon'><IoMdLogOut size={20} /></button>
        </>
      )}
    </div>
    <div className='menu-icon' onClick={toggleMenu}>
      {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />} 
    </div>
  </div>
  )
}

export default Navbar