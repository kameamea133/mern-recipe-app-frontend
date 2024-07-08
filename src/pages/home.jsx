import { useState, useEffect } from 'react'
import axios from "axios"
import {useGetUserID} from "../hooks/useGetUserID"
import { useCookies } from "react-cookie"
import Hero from '../../components/Hero'
import { useDispatch, useSelector } from 'react-redux'
import { addRecipeToStore, addStartersToStore, addDishesToStore, addDessertsToStore } from "../../reducers/recipes"
import RecipeModal from '../../components/RecipeModal'

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  
  const userID = useGetUserID()
const dispatch = useDispatch()
const user = useSelector(state => state.users.value)
const recipeFromStore = useSelector(state => state.recipes.value)
  const starters = useSelector(state => state.recipes.starters)
  const dishes = useSelector(state => state.recipes.dishes)
  const desserts = useSelector(state => state.recipes.desserts)

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
  

  const fetchRecipesByCategory = async (category) => {
    setSelectedCategory(category);
    try {
      const url = category === 'all' ? 'http://localhost:3000/recipes' : `http://localhost:3000/recipes/category/${category}`;
      const response = await axios.get(url);
     
      switch(category) {
        case 'starter':
          dispatch(addStartersToStore(response.data));
          
          break;
        case 'dish':
          dispatch(addDishesToStore(response.data));
          break;
        case 'dessert':
          dispatch(addDessertsToStore(response.data));
          break;
        default:
          dispatch(addRecipeToStore(response.data));
      }
    } catch (err) {
      console.log(err);
    }
  };



  const getRecipesToDisplay = () => {
    switch(selectedCategory) {
      case 'starter':
        return starters;
      case 'dish':
        return dishes;
      case 'dessert':
        return desserts;
      default:
        return recipeFromStore;
    }
  }
 
 // Fonction pour ouvrir la modal avec la recette sélectionnée
 const openModal = (recipe) => {
  setSelectedRecipe(recipe);
  setIsModalOpen(true);
  document.body.style.overflow = 'hidden'; // Empêche le défilement de l'arrière-plan
};


// Fonction pour fermer la modal
const closeModal = () => {
  setIsModalOpen(false);
  setSelectedRecipe(null);
  document.body.style.overflow = 'auto'; // Réactive le défilement de l'arrière-plan
};
  



  return (
    <div className='homePageContainer'>
    <Hero />
    {user && user.username ? (
      <h3>Welcome <span>{user.username}</span></h3>
    ) : null}
    <h1 className='titleHomePage'>Recipes</h1>
    <div className="category-buttons">
        <button onClick={() => fetchRecipesByCategory('all')}>All</button>
        <button onClick={() => fetchRecipesByCategory('starter')}>Starter</button>
        <button onClick={() => fetchRecipesByCategory('dish')}>Dish</button>
        <button onClick={() => fetchRecipesByCategory('dessert')}>Dessert</button>
      </div>


    <ul className='recipes-grid'>
      {getRecipesToDisplay().map((recipe) => (
        <li key={recipe._id} className='recipe-card' onClick={() => openModal(recipe)}>
          <div>
            <h2>{recipe.name}</h2>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <h4>category: {recipe.category}</h4>
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                saveRecipe(recipe._id);
              }}
              disabled={isRecipeSaved(recipe._id)}
              className={isRecipeSaved(recipe._id) ? 'button-disabled' : 'button-active'}
            >
              {isRecipeSaved(recipe._id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </li>
      ))}
    </ul>



    {isModalOpen && selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={closeModal} /> // Affiche la modal si elle est ouverte
      )}
  </div>
  )
}

export default Home