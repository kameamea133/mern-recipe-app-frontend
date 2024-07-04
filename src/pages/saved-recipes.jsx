import { useState, useEffect } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  const userID = useGetUserID()
  
  useEffect(() => {
    
    const fetchSavedRecipe = async () => {
      try{
        const response = await axios.get(`http://localhost:3000/recipes/savedRecipes/${userID}`)
       setSavedRecipes(response.data.savedRecipes)
       
      }catch(err) {
        console.log(err)
      }
    }

    fetchSavedRecipe()
  }, [userID])


  




  return (
    <div>
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
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

export default SavedRecipes