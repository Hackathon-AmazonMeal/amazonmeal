# Recipe Recommendation Platform - Project Structure

## Frontend Structure (src/)
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, inputs, etc.)
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── LoadingSpinner.js
│   │   └── SuccessModal.js
│   ├── layout/          # Layout components (header, footer, sidebar)
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   └── Layout.js
│   ├── preferences/     # Preference-related components
│   │   ├── DietaryRestrictions.js
│   │   ├── AllergySelector.js
│   │   ├── HealthGoals.js
│   │   └── DietTypeSelector.js
│   ├── recipes/         # Recipe-related components
│   │   ├── RecipeCard.js
│   │   ├── RecipeCarousel.js
│   │   ├── RecipeInstructions.js
│   │   └── RecipeNavigation.js
│   ├── ingredients/     # Ingredient-related components
│   │   ├── IngredientList.js
│   │   ├── IngredientItem.js
│   │   ├── QuantityAdjuster.js
│   │   └── CartSidebar.js
│   └── history/         # User history components
│       ├── OrderHistory.js
│       ├── SavedPreferences.js
│       └── QuickSelect.js
├── pages/               # Main application pages
│   ├── Welcome/         # Landing page for new users
│   │   └── Welcome.js
│   ├── Preferences/     # User preference setup
│   │   └── PreferencesPage.js
│   ├── Recipes/         # Recipe display and interaction
│   │   └── RecipesPage.js
│   ├── Dashboard/       # Returning user dashboard
│   │   └── Dashboard.js
│   └── Checkout/        # Checkout success page
│       └── CheckoutSuccess.js
├── contexts/            # React contexts for state management
│   ├── UserContext.js   # User preferences and profile
│   ├── RecipeContext.js # Recipe data and state
│   └── CartContext.js   # Shopping cart state
├── hooks/               # Custom React hooks
│   ├── useUserPreferences.js # User preference management
│   ├── useRecipes.js    # Recipe data fetching
│   ├── useCart.js       # Cart management
│   └── useLocalStorage.js # Local storage persistence
├── services/            # API service functions
│   ├── api.js          # Base API configuration
│   ├── userService.js  # User management API calls
│   ├── recipeService.js # Recipe-related API calls
│   ├── recommendationService.js # AI recommendation API
│   └── cartService.js  # Cart and checkout API calls
├── utils/               # Utility functions and helpers
│   ├── constants.js    # Application constants
│   ├── helpers.js      # General helper functions
│   ├── validators.js   # Form validation utilities
│   └── recipeUtils.js  # Recipe-specific utilities
└── styles/              # Global styles and themes
    ├── theme.js        # Material UI theme configuration
    ├── globals.css     # Global CSS styles
    └── components.css  # Component-specific styles
```

## Backend Structure (lambda/)
```
lambda/
├── userService/            # User management and preferences
│   ├── handler.js         # User CRUD operations
│   ├── preferencesHandler.js # Preference management
│   └── package.json       # Dependencies
├── recipeService/          # Recipe data and management
│   ├── handler.js         # Recipe CRUD operations
│   ├── searchHandler.js   # Recipe search and filtering
│   └── package.json       # Dependencies
├── recommendationService/  # AI-powered recipe recommendations
│   ├── handler.js         # Recommendation logic
│   ├── aiService.js       # LLM integration for personalization
│   ├── personalizationEngine.js # Preference-based filtering
│   └── package.json       # Dependencies
├── cartService/            # Shopping cart and order management
│   ├── handler.js         # Cart operations
│   ├── orderHandler.js    # Order history management
│   └── package.json       # Dependencies
└── shared/                 # Shared utilities across services
    ├── database.js        # Database connection utilities
    ├── auth.js            # Authentication helpers
    └── constants.js       # Shared constants
```

## Data Structure (data/)
```
data/
├── recipes/               # Recipe database
│   ├── breakfast.json    # Breakfast recipes with nutrition info
│   ├── lunch.json        # Lunch recipes with nutrition info
│   ├── dinner.json       # Dinner recipes with nutrition info
│   ├── snacks.json       # Snack recipes with nutrition info
│   └── ingredients.json  # Ingredient database with nutritional data
├── preferences/           # User preference templates
│   ├── dietary-restrictions.json # Available dietary restrictions
│   ├── allergies.json    # Common allergies list
│   ├── health-goals.json # Available health goals
│   └── diet-types.json   # Diet type options
└── users/                 # Sample user data
    ├── profiles.json     # User profile examples
    └── order-history.json # Sample order history
```

## Key Features Implementation
- **First-Time User Flow**: Comprehensive preference collection with LLM integration
- **Recipe Display**: 3-recipe carousel with detailed instructions and ingredient sidebar
- **Returning User Flow**: Dashboard with order history and preference editing
- **Cart Management**: Interactive ingredient quantities with checkout flow
- **Personalization**: AI-driven recipe recommendations based on user preferences
- **State Management**: Efficient React context and local storage integration
