import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    value: [],
    starters: [],
    dishes: [],
    desserts: [], 
    saved: [] 
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
            state.saved = state.saved.filter(recipe => recipe._id !== action.payload); 
        },
       
        addStartersToStore: (state, action) => {
            state.starters = action.payload;
        },
        addDishesToStore: (state, action) => {
            state.dishes = action.payload;
        },
        addDessertsToStore: (state, action) => {
            state.desserts = action.payload;
        },
        addSavedRecipesToStore: (state, action) => { 
            state.saved = action.payload;
        }
    }
})



export const { addRecipeToStore, deleteRecipeFromStore, addStartersToStore, addDishesToStore, addDessertsToStore,  addSavedRecipesToStore } = recipesSlice.actions;

export default recipesSlice.reducer;
