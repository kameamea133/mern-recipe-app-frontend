import  { useState } from 'react'
import axios from "axios"
import { useGetUserID } from '../hooks/useGetUserID'
import {useNavigate} from "react-router-dom"
import { useCookies } from 'react-cookie'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';



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

  const [instructions, setInstructions] = useState('');

  const navigate = useNavigate()


  const handleInstructionsChange = (value) => {
    setInstructions(value);
    setRecipe({ ...recipe, instructions: value });
  };


  const handleChange = (event) => {
    const {name, value} = event.target;
    setRecipe({...recipe, [name]: value})
  }  

  const handleIngredientChange = (event, idx) => {
    const {value} = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({...recipe, ingredients});
  }  

  const addIngredient = () => {
    setRecipe({...recipe, ingredients: [...recipe.ingredients, ""]})
  }




  
const onSubmit = async (event) => {
  event.preventDefault();
  if (!cookies.access_token) {
    alert('You must be registered to add your recipe');
    return;
  }
  try{
      await axios.post('http://localhost:3000/recipes', recipe, {headers: {authorization: `Bearer ${cookies.access_token}`}});
      alert('Recipe Created')
      navigate('/')
  }catch(err) {
    console.log(err)
  }
}




  return (
    <div className='create-recipe'>
    <h2>Create Recipe</h2>
    <form onSubmit={onSubmit}>
      <label htmlFor="name">Name</label>
      <input type="text" id='name' onChange={handleChange} name="name"/>

      <label htmlFor="category">Category</label>
        <select id="category" name="category" onChange={handleChange} value={recipe.category}>
          <option value="">Select a category</option>
          <option value="starter">Starter</option>
          <option value="dish">Dish</option>
          <option value="dessert">Dessert</option>
        </select>
      
      <label htmlFor="ingredients">Ingredients</label>
      {recipe.ingredients.map((ingredient, idx) => (
        <input 
        key={idx}
        type="text"
        name="ingredients"
        value={ingredient}
        onChange={(event) => handleIngredientChange(event, idx)}
        />
      ))}
      <button onClick={addIngredient} type="button">Add Ingredient</button>
      <label htmlFor="instructions">Instructions</label>
      <ReactQuill theme="snow" value={instructions} onChange={handleInstructionsChange} />
      <label htmlFor="imageUrl">Image URL</label>
      <input type="text" id='imageUrl' name='imageUrl' onChange={handleChange}/>
      <label htmlFor="cookingTime">Cooking Time (minutes)</label>
      <input type="number"  id='cookingTime' name="cookingTime" onChange={handleChange}/>
      <button type="submit">Create Recipe</button>
    </form>
    
    </div>
  )
}

export default CreateRecipe