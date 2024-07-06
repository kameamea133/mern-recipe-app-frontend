import { useState, useEffect } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"
import { useCookies } from "react-cookie"
import Hero from '../../components/Hero'
import { useDispatch, useSelector } from 'react-redux'
import { addRecipeToStore } from "../../reducers/recipes"

const Home = () => {
 
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  
  const userID = useGetUserID()
const dispatch = useDispatch()
const user = useSelector(state => state.users.value)
const recipeFromStore = useSelector(state => state.recipes.value)

const isRecipeSaved = (id) => savedRecipes.includes(id)

  useEffect(() => {
    const fetchRecipe = async () => {
      try{
        const response = await axios.get('http://localhost:3000/recipes');
        dispatch(addRecipeToStore(response.data));       
      }catch(err) {
        console.log(err)
      }
    };

    const fetchSavedRecipe = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/recipes/savedRecipes/ids/${userID}`)
       setSavedRecipes(response.data.savedRecipes)
       
      }catch(err) {
        console.log(err)
      }
    };

    const fetchUsers = async () => {
      try{
        await axios('http://localhost:3000/users');
        
      }catch(err) {
        console.log(err)
      }
    }
    

    fetchRecipe();

    if(cookies.access_token) {
      fetchSavedRecipe();
      fetchUsers();
    }
  }, [dispatch, cookies.access_token, userID], isRecipeSaved)


  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        'http://localhost:3000/recipes',
        { recipeID, userID },
        {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`
          }
        }
      );
  
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };
  





  return (
    <div className='homePageContainer'>
    <Hero />
    <h1 className='titleHomePage'>Recipes</h1>
    {user && user.username ? (<h3 className='titleHomePage'>{`Welcome ${user.username}`}</h3>) : null}
    
      <ul className="recipes-grid">
        {recipeFromStore.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <div>
              <h2>{recipe.name}</h2>
            <img src={recipe.imageUrl} alt={recipe.name} />
              <h4>category: {recipe.category}</h4>
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}
              className={isRecipeSaved(recipe._id) ? 'button-disabled' : 'button-active'}
              >
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>
                <span>Ingredients:</span>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </p>
              <p>
                <span>Instructions:</span> <span dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home