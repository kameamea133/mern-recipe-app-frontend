import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [{
        userID: null,
        username: null
    }],
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUserToStore: (state, action) => {
            state.value = action.payload
        },
        logoutUser: (state) => {
            state.value = { userID: null, username: null };
          },
    },
})

export const { addUserToStore, logoutUser } = usersSlice.actions;
export default usersSlice.reducer