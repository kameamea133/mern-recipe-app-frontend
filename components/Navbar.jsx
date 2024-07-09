import { Link } from 'react-router-dom'
import {useCookies} from "react-cookie"
import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/users'
import { IoMdLogOut } from "react-icons/io";


const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  
  const dispatch = useDispatch()


   // Function to handle user logout
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    dispatch(logoutUser());
  }

  return (
    <div className='navbar'>
        <Link to="/">
          <img src="/logoRecipe.png" alt="logo" className='logo'/>
        </Link>
        
        <Link to="/create-recipe">Create Recipe</Link>
        {!cookies.access_token ? ( <Link to="/auth">Login/Register</Link>) : <><Link to="/saved-recipes">My Saved Recipes</Link>
          <Link to="/my-recipes">My Recipes</Link>
        <button onClick={logout} className='logout-icon'><IoMdLogOut size={20} />
</button></>}
       
    </div>
  )
}

export default Navbar