import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
}

export const recipesSlice = createSlice({
    name: "recipes",
    initialState,
    reducers: {
        addRecipeToStore: (state, action) => {
            state.value = action.payload
        },
        deleteRecipeFromStore: (state, action) => {
            state.value = state.value.filter(recipe => recipe._id !== action.payload);
        },
    }
})

export const { addRecipeToStore, deleteRecipeFromStore } = recipesSlice.actions
export default recipesSlice.reducer