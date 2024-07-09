import { useState, useEffect } from 'react'
import axios from "axios"
import { useCookies } from "react-cookie"
import Hero from '../../components/Hero'
import { useDispatch, useSelector } from 'react-redux'
import { addRecipeToStore, addStartersToStore, addDishesToStore, addDessertsToStore } from "../../reducers/recipes"
import RecipeModal from '../../components/RecipeModal'
import { useGetUserID } from "../hooks/useGetUserID"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cookies] = useCookies(["access_token"]);
  
  const userID = useGetUserID()
  const dispatch = useDispatch()
  const user = useSelector(state => state.users.value)
  const recipeFromStore = useSelector(state => state.recipes.value)
  const starters = useSelector(state => state.recipes.starters)
  const dishes = useSelector(state => state.recipes.dishes)
  const desserts = useSelector(state => state.recipes.desserts)

   const isRecipeSaved = (id) => savedRecipes.includes(id)

  // Fetch all recipes and user data when the component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes`);
        dispatch(addRecipeToStore(response.data));       
      } catch (err) {
        console.log(err)
      }
    };

    // Fetch saved recipes for the logged-in user
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(`${API_URL}/recipes/savedRecipes/ids/${userID}`)
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.log(err)
      }
    };

    // Fetch user data
    const fetchUsers = async () => {
      try {
        await axios(`${API_URL}/users`);
      } catch (err) {
        console.log(err)
      }
    }

    fetchRecipe();

    if (cookies.access_token) {
      fetchSavedRecipe();
      fetchUsers();
    }
  }, [dispatch, cookies.access_token, userID])

  // Save a recipe to the user's saved recipes
  const saveRecipe = async (recipeID) => {
    if (!cookies.access_token) {
      
      toast.error('You need to be connected to save a recipe');
      return;
    }
    try {
      const response = await axios.put(
        `${API_URL}/recipes`,
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

  // Fetch recipes based on selected category
  const fetchRecipesByCategory = async (category) => {
    setSelectedCategory(category);
    try {
      const url = category === 'all' ? `${API_URL}/recipes` : `${API_URL}/recipes/category/${category}`;
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

  // Get recipes to display based on selected category
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

  // Fetch recipes based on search query
  const fetchRecipesBySearch = async (query) => {
    if (query.length < 3) return; 
    try {
      const response = await axios.get(`${API_URL}/recipes/search/${query}`);
      dispatch(addRecipeToStore(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  // Open the modal to display selected recipe details
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; 
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
    document.body.style.overflow = 'auto'; 
  };

  // Fetch recipes when the search query changes
  useEffect(() => {
    if (searchQuery.length >= 3) {
      fetchRecipesBySearch(searchQuery);
    } else if (searchQuery === '') {
      fetchRecipesByCategory('all'); 
    }
  }, [searchQuery]);

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

      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
        className='searchBar'
      />

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
        <RecipeModal recipe={selectedRecipe} onClose={closeModal} /> 
      )}
    </div>
  )
}

export default Home
