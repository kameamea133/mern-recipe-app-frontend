import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md'; 
const RecipeModal = ({ recipe, onClose }) => {


   // Function to handle clicks on the overlay to close the modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <MdClose size={24} />
        </span>
        <h2>{recipe.name}</h2>
        <img src={recipe.imageUrl} alt={recipe.name} />
        <h4>Category: {recipe.category}</h4>
        <p>Cooking Time: {recipe.cookingTime} minutes</p>
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
      </div>
    </div>
  );
};

RecipeModal.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    cookingTime: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    instructions: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RecipeModal;
