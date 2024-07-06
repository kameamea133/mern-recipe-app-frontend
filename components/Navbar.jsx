import { Link } from 'react-router-dom'
import {useCookies} from "react-cookie"
import { useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/users'

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  
  const dispatch = useDispatch()

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    dispatch(logoutUser());
  }

  return (
    <div className='navbar'>
        <Link to="/" className='logo'>
          <img src="/logoRecipe.png" alt="logo" className='logo'/>
        </Link>
        
        <Link to="/create-recipe">Create Recipe</Link>
        {!cookies.access_token ? ( <Link to="/auth">Login/Register</Link>) : <><Link to="/saved-recipes">Saved Recipes</Link><button onClick={logout}>Logout</button></>}
       
    </div>
  )
}

export default Navbar