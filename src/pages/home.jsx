import { useState, useEffect } from 'react'
import axios from "axios"


const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try{
        const response = await axios.get('http://localhost:3000/recipes');
        setRecipes(response.data);
        console.log(response.data)        
      }catch(err) {
        console.log(err)
      }
    }
    fetchRecipe()
  }, [])

  return (
    <div>
      <h1>Recipes</h1>
    </div>
  )
}

export default Home