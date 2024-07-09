import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [cookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const quillRef = useRef(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setRecipe(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipe();
  }, [id, cookies.access_token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const handleQuillChange = (value) => {
    setRecipe({ ...recipe, instructions: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:3000/recipes/${id}`, recipe, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      toast.success('Recipe updated successfully!');
      navigate('/my-recipes');
    } catch (err) {
      console.log(err);
      toast.error('Error updating recipe');
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className='create-recipe-container'>
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit} className='create-recipe-form'>
        <div className='form-group'>
          <label htmlFor="name">Name</label>
          <input type="text" id='name' name="name" value={recipe.name} onChange={handleChange} />
        </div>

        <div className='form-group'>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={recipe.category} onChange={handleChange}>
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
            onChange={handleQuillChange}
            className='quill-editor'
          />
        </div>

        <div className='form-group'>
          <label htmlFor="imageUrl">Image URL</label>
          <input type="text" id='imageUrl' name='imageUrl' value={recipe.imageUrl} onChange={handleChange} />
        </div>

        <div className='form-group'>
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input type="number" id='cookingTime' name="cookingTime" value={recipe.cookingTime} onChange={handleChange} />
        </div>

        <button type="submit" className='create-recipe-button'>Update Recipe</button>
      </form>
    </div>
  );
};

export default EditRecipe;
