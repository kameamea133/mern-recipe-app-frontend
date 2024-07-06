import { useState, useEffect, useCallback } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"
import { MdDelete } from "react-icons/md";
import { useDispatch } from 'react-redux'
import { deleteRecipeFromStore } from "../../reducers/recipes"
import { useCookies } from "react-cookie";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const dispatch = useDispatch();
  const userID = useGetUserID()
  const [cookies] = useCookies(["access_token"]);

  const deleteRecipe = useCallback(async (recipeID) => {
    try {
      await axios.delete(`http://localhost:3000/recipes/${recipeID}`, {
        data: { userID },
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      });
      dispatch(deleteRecipeFromStore(recipeID));
      setSavedRecipes(prevSavedRecipes => prevSavedRecipes.filter(recipe => recipe._id !== recipeID));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, userID, cookies.access_token]);
 
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
  }, [userID, deleteRecipe])


  
 



  return (
    <div className='savedRecipesPage'>
    <h1>Saved Recipes</h1>
    <ul className='recipes-grid'>
      {savedRecipes.map((recipe) => (
        <li key={recipe._id} className='recipe-card'>
          <div className='recipe-content'>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <h2>{recipe.name}</h2>
            <h4>Category: {recipe.category}</h4>
            <MdDelete className='delete-icon' onClick={() => deleteRecipe(recipe._id)} />
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
          <p>Cooking Time: {recipe.cookingTime}</p>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default SavedRecipes