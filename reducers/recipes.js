import { createSlice } from "@reduxjs/toolkit";

// Reducer pour les recettes générales
const initialState = {
    value: [],
    starters: [], // État pour les recettes de type "starter"
    dishes: [], // État pour les recettes de type "dish"
    desserts: [] // État pour les recettes de type "dessert"
}

export const recipesSlice = createSlice({
    name: "recipes",
    initialState,
    reducers: {
        addRecipeToStore: (state, action) => {
            state.value = action.payload;
        },
        deleteRecipeFromStore: (state, action) => {
            state.value = state.value.filter(recipe => recipe._id !== action.payload);
        },
        // Actions pour ajouter des recettes par catégorie
        addStartersToStore: (state, action) => {
            state.starters = action.payload;
        },
        addDishesToStore: (state, action) => {
            state.dishes = action.payload;
        },
        addDessertsToStore: (state, action) => {
            state.desserts = action.payload;
        }
    }
})




// Export des actions
export const { addRecipeToStore, deleteRecipeFromStore, addStartersToStore, addDishesToStore, addDessertsToStore } = recipesSlice.actions;


// Export des reducers
export default recipesSlice.reducer;
