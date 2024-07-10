import { useState, useEffect, useCallback } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import { deleteRecipeFromStore, addSavedRecipesToStore } from "../../reducers/recipes"
import { useCookies } from "react-cookie";




const SavedRecipes = () => {
  const [filteredRecipes, setFilteredRecipes] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedCategory, setSelectedCategory] = useState('all'); 

  const dispatch = useDispatch();
  const userID = useGetUserID()
  const [cookies] = useCookies(["access_token"]);
  const savedRecipes = useSelector(state => state.recipes.saved); 


  // Function to delete a recipe by its ID
  const deleteRecipe = useCallback(async (recipeID) => {
    try {
      await axios.delete(`https://mern-recipe-app-backend-theta.vercel.app/recipes/${recipeID}`, {
        data: { userID },
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      });
      dispatch(deleteRecipeFromStore(recipeID));
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, userID, cookies.access_token]);
 

  // Effect to fetch saved recipes when component mounts
  useEffect(() => {
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(`https://mern-recipe-app-backend-theta.vercel.app/recipes/savedRecipes/${userID}`)
        dispatch(addSavedRecipesToStore(response.data.savedRecipes));
        setFilteredRecipes(response.data.savedRecipes); 
      } catch (err) {
        console.log(err);
      }
    }

    fetchSavedRecipe()
  }, [userID, dispatch]);

  
  // Function to filter recipes by category
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredRecipes(savedRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      setFilteredRecipes(savedRecipes.filter(recipe => recipe.category === category && recipe.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  };

  
  // Effect to filter recipes based on search query and selected category
  useEffect(() => {
    if (searchQuery.length >= 3 || searchQuery === '') {
      filterByCategory(selectedCategory);
    }
  }, [searchQuery, savedRecipes, selectedCategory, filterByCategory]);

  return (
    <div className='savedRecipesPage'>
      <h1>My Saved Recipes</h1>

      <div className="category-buttons">
        <button onClick={() => filterByCategory('all')}>All</button>
        <button onClick={() => filterByCategory('starter')}>Starter</button>
        <button onClick={() => filterByCategory('dish')}>Dish</button>
        <button onClick={() => filterByCategory('dessert')}>Dessert</button>
      </div>

      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchQuery}
        className='searchBar'
        onChange={(e) => setSearchQuery(e.target.value)} 
      />

      <ul className='savedRecipes-grid'>
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id} className='savedRecipes-card'>
            <div className='savedRecipes-content'>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <h2>{recipe.name}</h2>
              <h4>Category: <span>{recipe.category}</span></h4>
              <MdDelete className='delete-icon' onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe._id); }}  size={30}/>
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
