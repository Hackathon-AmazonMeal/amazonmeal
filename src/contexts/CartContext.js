import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Action types
const CART_ACTIONS = {
  ADD_INGREDIENT: 'ADD_INGREDIENT',
  REMOVE_INGREDIENT: 'REMOVE_INGREDIENT',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_RECIPE: 'SET_RECIPE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SAVE_INGREDIENTS: 'SAVE_INGREDIENTS', // New action type for saving ingredients
};

// Initial state
const initialState = {
  items: [],
  currentRecipe: null,
  totalItems: 0,
  isLoading: false,
  error: null,
  savedIngredients: [], // New field to store saved ingredients
};

// Helper function to calculate total items
function calculateTotalItems(items) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_INGREDIENT: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: calculateTotalItems(newItems),
      };
    }
    
    case CART_ACTIONS.REMOVE_INGREDIENT: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        totalItems: calculateTotalItems(newItems),
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: newItems,
        totalItems: calculateTotalItems(newItems),
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        currentRecipe: null,
      };
    
    case CART_ACTIONS.SET_RECIPE:
      return {
        ...state,
        currentRecipe: action.payload,
      };
    
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    
    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case CART_ACTIONS.SAVE_INGREDIENTS:
      return {
        ...state,
        savedIngredients: [...state.savedIngredients, action.payload],
      };
    
    default:
      return state;
  }
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Action creators
  const actions = {
    addIngredient: (ingredient) => {
      const cartItem = {
        id: `${ingredient.name}-${Date.now()}`,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        category: ingredient.category,
        quantity: 1,
        originalAmount: ingredient.amount,
        originalUnit: ingredient.unit,
        price: ingredient.price || 2.50, // Default price if not provided
      };
      dispatch({ type: CART_ACTIONS.ADD_INGREDIENT, payload: cartItem });
    },

    removeIngredient: (id) => {
      dispatch({ type: CART_ACTIONS.REMOVE_INGREDIENT, payload: id });
    },

    updateQuantity: (id, quantity) => {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });
    },

    increaseQuantity: (id) => {
      const item = state.items.find(item => item.id === id);
      if (item) {
        dispatch({ 
          type: CART_ACTIONS.UPDATE_QUANTITY, 
          payload: { id, quantity: item.quantity + 1 } 
        });
      }
    },

    decreaseQuantity: (id) => {
      const item = state.items.find(item => item.id === id);
      if (item && item.quantity > 1) {
        dispatch({ 
          type: CART_ACTIONS.UPDATE_QUANTITY, 
          payload: { id, quantity: item.quantity - 1 } 
        });
      }
    },

    clearCart: () => {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    },

    setCurrentRecipe: (recipe) => {
      dispatch({ type: CART_ACTIONS.SET_RECIPE, payload: recipe });
    },

    // Save ingredients from a recipe
    saveIngredients: (recipe) => {
      if (!recipe || !recipe.ingredients) {
        console.error('Invalid recipe or missing ingredients:', recipe);
        return;
      }

      // Save the ingredients
      dispatch({ 
        type: CART_ACTIONS.SAVE_INGREDIENTS, 
        payload: {
          recipeId: recipe.id,
          recipeName: recipe.name || recipe.title,
          ingredients: recipe.ingredients
        }
      });
    },

    // Get saved ingredients
    getSavedIngredients: () => {
      return state.savedIngredients;
    },

    addRecipeToCart: (recipe) => {
      // Validate recipe object
      if (!recipe || !recipe.id) {
        console.error('Invalid recipe object:', recipe);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid recipe data' });
        return;
      }

      // Clear existing items
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      // Set current recipe
      dispatch({ type: CART_ACTIONS.SET_RECIPE, payload: recipe });
      
      // Save the ingredients for later use
      actions.saveIngredients(recipe);
      
      // Handle different ingredient formats
      if (Array.isArray(recipe.ingredients)) {
        // Handle traditional ingredients array
        recipe.ingredients.forEach(ingredient => {
          const cartItem = {
            id: `${ingredient.name}-${recipe.id}-${Date.now()}`,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            category: ingredient.category,
            quantity: 1,
            originalAmount: ingredient.amount,
            originalUnit: ingredient.unit,
            recipeId: recipe.id,
            recipeName: recipe.name,
            price: ingredient.price || 2.50, // Default price if not provided
          };
          dispatch({ type: CART_ACTIONS.ADD_INGREDIENT, payload: cartItem });
        });
      } else if (recipe.ingredients && (recipe.ingredients.necessary_items || recipe.ingredients.optional_items)) {
        // Handle API response format with necessary_items and optional_items
        
        // Add necessary items to cart
        if (recipe.ingredients.necessary_items && recipe.ingredients.necessary_items.length > 0) {
          recipe.ingredients.necessary_items.forEach(item => {
            const cartItem = {
              id: item._id || `${item.item_name}-${recipe.id}-${Date.now()}`,
              name: item.item_name,
              amount: item.packet_weight_grams,
              unit: 'g',
              category: 'necessary',
              quantity: item.quantity || 1,
              originalAmount: item.packet_weight_grams,
              originalUnit: 'g',
              recipeId: recipe.id,
              recipeName: recipe.name || recipe.title,
              price: item.price || 2.50,
              weight: item.packet_weight_grams
            };
            dispatch({ type: CART_ACTIONS.ADD_INGREDIENT, payload: cartItem });
          });
        }
        
        // Add optional items to cart
        if (recipe.ingredients.optional_items && recipe.ingredients.optional_items.length > 0) {
          recipe.ingredients.optional_items.forEach(item => {
            const cartItem = {
              id: item._id || `${item.item_name}-${recipe.id}-${Date.now()}`,
              name: item.item_name,
              amount: item.packet_weight_grams,
              unit: 'g',
              category: 'optional',
              quantity: item.quantity || 1,
              originalAmount: item.packet_weight_grams,
              originalUnit: 'g',
              recipeId: recipe.id,
              recipeName: recipe.name || recipe.title,
              price: item.price || 2.50,
              weight: item.packet_weight_grams,
              optional: true
            };
            dispatch({ type: CART_ACTIONS.ADD_INGREDIENT, payload: cartItem });
          });
        }
      } else if (recipe.cartItems && Array.isArray(recipe.cartItems)) {
        // Handle case where cart items are provided directly
        recipe.cartItems.forEach(item => {
          dispatch({ type: CART_ACTIONS.ADD_INGREDIENT, payload: item });
        });
      }
    },

    setLoading: (loading) => {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
    },

    // Get cart summary
    getCartSummary: () => {
      const itemsByCategory = state.items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      return {
        totalItems: state.totalItems,
        totalUniqueItems: state.items.length,
        itemsByCategory,
        currentRecipe: state.currentRecipe,
      };
    },

    // Calculate adjusted amounts based on quantity
    getAdjustedAmount: (item) => {
      return item.originalAmount * item.quantity;
    },

    // Check if cart is empty
    isEmpty: () => {
      return state.items.length === 0;
    },

    // Get total estimated cost (mock calculation)
    getEstimatedTotal: () => {
      // Calculate total based on item prices and quantities
      return state.items.reduce((total, item) => {
        const itemPrice = item.price || 2.50; // Default price if not set
        return total + (itemPrice * item.quantity);
      }, 0);
    },
  };

  // Add computed properties
  const computedValues = {
    cartItems: state.items, // Alias for easier access
    cartTotal: actions.getEstimatedTotal(), // Total cart value
    savedIngredients: state.savedIngredients, // Expose saved ingredients
  };

  const value = {
    ...state,
    ...actions,
    ...computedValues,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CART_ACTIONS };
