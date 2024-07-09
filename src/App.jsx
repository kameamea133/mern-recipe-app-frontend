import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from "redux-persist/integration/react";
import storage from 'redux-persist/lib/storage';
import users from "../reducers/users";
import  recipes from "../reducers/recipes"; 
import Home from './pages/home';
import Auth from './pages/auth';
import CreateRecipe from './pages/create-recipe';
import MyRecipes from './pages/my-recipes';
import SavedRecipe from './pages/saved-recipes';
import EditRecipe from './pages/edit-recipe';
import Navbar from '../components/Navbar';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const reducers = combineReducers({
  users,
  recipes
});


const persistConfig = { key: 'recipeApp', storage };


const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});


const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <div className='App'>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/auth" element={<Auth />}/>
              <Route path="/create-recipe" element={<CreateRecipe />}/>
              <Route path="/saved-recipes" element={<SavedRecipe />}/>
              <Route path="/my-recipes" element={<MyRecipes />}/>
              <Route path="/edit-recipe/:id" element={<EditRecipe />}/>
            </Routes>
          </Router>
          <ToastContainer />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
