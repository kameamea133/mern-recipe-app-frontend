import { useState, useEffect } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"
import { useCookies } from "react-cookie"
import Hero from '../../components/Hero'

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"])
  const userID = useGetUserID()
  
  useEffect(() => {
    const fetchRecipe = async () => {
      try{
        const response = await axios.get('http://localhost:3000/recipes');
        setRecipes(response.data);       
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
    }

    fetchRecipe();

    if(cookies.access_token) fetchSavedRecipe();
  }, [])


  const saveRecipe = async (recipeID) => {
    try{
      const response = await axios.put('http://localhost:3000/recipes', { recipeID, userID}, {headers: {authorization: cookies.access_token}})
      setSavedRecipes(response.data.savedRecipes)
    }catch(err) {
      console.log(err)
    }
  }


const isRecipeSaved = (id) => savedRecipes.includes(id)


  return (
    <div>
    <Hero />
    <h1>Recipes</h1>
      <ul className="recipes-grid">
        {recipes.map((recipe) => (
          <li key={recipe._id} className="recipe-card">
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home