import { useState, useEffect } from 'react'
import axios from "axios"
import { useCookies } from "react-cookie"
import { useGetUserID } from "../hooks/useGetUserID"
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes/userRecipes/${userID}`, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`
          }
        });
        setMyRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyRecipes();
  }, [userID, cookies.access_token]);

  const deleteRecipe = async (recipeID) => {
    try {
      await axios.delete(`${API_URL}/recipes/${recipeID}`, {
        data: { userID },
        headers: {
          Authorization: `Bearer ${cookies.access_token}`
        }
      });
      setMyRecipes(myRecipes.filter(recipe => recipe._id !== recipeID));
      toast.success('Recipe deleted successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Error deleting recipe');
    }
  };

  const editRecipe = (recipeID) => {
    navigate(`/edit-recipe/${recipeID}`);
  };

  return (
    <div className='myRecipesPage'>
      <h1>My Recipes</h1>
      <ul className='myRecipes-grid'>
        {myRecipes.map((recipe) => (
          <li key={recipe._id} className='myRecipes-card'>
            <div className='myRecipes-content'>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <h2>{recipe.name}</h2>
              <h4>Category: <span>{recipe.category}</span></h4>
              <div className='iconsBox'>
              <MdEdit className='edit-icon' onClick={() => editRecipe(recipe._id)} size={30} />
              <MdDelete className='delete-icon' onClick={() => deleteRecipe(recipe._id)} size={30} />
              </div>
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
  );
};

export default MyRecipes;
