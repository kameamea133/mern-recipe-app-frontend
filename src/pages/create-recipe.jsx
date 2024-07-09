import { useState, useRef } from 'react'
import axios from "axios"
import { useGetUserID } from '../hooks/useGetUserID'
import { useNavigate } from "react-router-dom"
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateRecipe = () => {
  const [cookies] = useCookies(["access_token"])
  const userID = useGetUserID()
 
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  })

  const quillRef = useRef(null);

  const navigate = useNavigate()

  // Handle change in instructions
  const handleInstructionsChange = (value) => {
    setRecipe({ ...recipe, instructions: value });
  };

  // Handle change in other input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value })
  }

  // Handle change in ingredients
  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  }

  // Add a new ingredient input field
  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] })
  }

  // Handle form submission
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!cookies.access_token) {
      // Show toast notification if the user is not logged in
      toast.error('You must be registered to add your recipe');
      return;
    }
    try {
      await axios.post(`${API_URL}/recipes`, recipe, { headers: { authorization: `Bearer ${cookies.access_token}` } });
      // Show toast notification on successful recipe creation
      toast.success('Recipe Created');
      navigate('/')
    } catch (err) {
      console.log(err);
      // Show toast notification on error
      toast.error('Error creating recipe');
    }
  }

  return (
    <div className='create-recipe-container'>
      <h2>Create Recipe</h2>
      <form onSubmit={onSubmit} className='create-recipe-form'>
        <div className='form-group'>
          <label htmlFor="name">Name</label>
          <input type="text" id='name' onChange={handleChange} name="name" />
        </div>

        <div className='form-group'>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" onChange={handleChange} value={recipe.category}>
            <option value="">Select a category</option>
            <option value="starter">Starter</option>
            <option value="dish">Dish</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, idx) => (
            <input
              key={idx}
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, idx)}
              className='ingredient-input'
            />
          ))}
          <button onClick={addIngredient} type="button" className='add-ingredient-button'>Add Ingredient</button>
        </div>

        <div className='form-group'>
          <label htmlFor="instructions">Instructions</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={recipe.instructions}
            onChange={handleInstructionsChange}
            className='quill-editor'
          />
        </div>

        <div className='form-group'>
          <label htmlFor="imageUrl">Image URL</label>
          <input type="text" id='imageUrl' name='imageUrl' onChange={handleChange} />
        </div>

        <div className='form-group'>
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input type="number" id='cookingTime' name="cookingTime" onChange={handleChange} />
        </div>

        <button type="submit" className='create-recipe-button'>Create Recipe</button>
      </form>
    </div>
  )
}

export default CreateRecipe
