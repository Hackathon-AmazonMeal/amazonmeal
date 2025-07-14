# AmazonMeal - Project Structure

Based on the Pippin design documents, here's the recommended project structure:

```
AmazonMeal/
├── README.md                          # Updated project overview
├── design-docs/                       # Design documentation from Pippin
│   ├── api_specification.md
│   ├── component_diagram.md
│   ├── genai_codegen_guide.md
│   ├── high_level_design.md
│   ├── implementation_plan.md
│   ├── low_level_design.md
│   ├── requirements_spec.md
│   └── sequence_diagram.md
├── src/                               # Frontend React application
│   ├── components/                    # Reusable UI components
│   │   ├── AppHeader.js
│   │   ├── AppFooter.js
│   │   ├── VoiceInterface.js
│   │   ├── MealPlanCalendar.js
│   │   ├── MealPlanSummary.js
│   │   ├── RecommendedRecipes.js
│   │   ├── ShoppingListSummary.js
│   │   ├── RecipeCard.js
│   │   └── NutritionSummary.js
│   ├── pages/                         # Main application pages
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Profile.js
│   │   ├── RecipeBrowser.js
│   │   ├── RecipeDetail.js
│   │   ├── MealPlanCreator.js
│   │   └── ShoppingList.js
│   ├── contexts/                      # React contexts
│   │   ├── AuthContext.js
│   │   └── AppContext.js
│   ├── hooks/                         # Custom React hooks
│   │   ├── useMealPlans.js
│   │   ├── useShoppingList.js
│   │   └── useRecommendations.js
│   ├── services/                      # API service functions
│   │   ├── api.js                     # Main API client
│   │   ├── authService.js
│   │   ├── recipeService.js
│   │   ├── recommendationService.js
│   │   └── shoppingService.js
│   ├── utils/                         # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── mockData.js
│   ├── styles/                        # CSS/SCSS files
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── pages.css
│   └── App.js                         # Main application component
├── lambda/                            # AWS Lambda functions
│   ├── userProfileService/
│   │   ├── index.js
│   │   ├── handler.js
│   │   └── package.json
│   ├── recipeService/
│   │   ├── index.js
│   │   ├── handler.js
│   │   └── package.json
│   ├── recommendationService/
│   │   ├── index.js
│   │   ├── handler.js
│   │   └── package.json
│   ├── shoppingService/
│   │   ├── index.js
│   │   ├── handler.js
│   │   └── package.json
│   └── voiceService/
│       ├── index.js
│       ├── handler.js
│       └── package.json
├── data/                              # Mock data and seed files
│   ├── recipes.json
│   ├── products.json
│   ├── users.json
│   └── seedData.js
├── infrastructure/                    # AWS infrastructure code
│   ├── dynamodb-tables.json
│   ├── api-gateway-config.json
│   └── lambda-deployment.json
├── tests/                            # Test files
│   ├── components/
│   ├── services/
│   └── integration/
├── docs/                             # Additional documentation
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   └── demo-scenarios.md
├── package.json                      # Frontend dependencies
├── package-lock.json
└── .gitignore
```

## Key Components Overview

### Frontend Architecture
- **React 18** with Material UI 5 for modern, responsive design
- **React Router 6** for navigation
- **Context API** for state management
- **Custom hooks** for data fetching and business logic

### Backend Architecture
- **AWS Lambda** functions for serverless compute
- **Amazon API Gateway** for REST API endpoints
- **Amazon DynamoDB** for data storage
- **Amazon Bedrock** for AI/ML capabilities

### Data Models
- **Users**: Profile and preferences
- **Recipes**: Ingredients, instructions, nutrition
- **Products**: Mock Amazon Fresh catalog
- **MealPlans**: Generated meal recommendations
- **ShoppingLists**: Ingredient aggregation

### Key Features
1. **AI-Powered Recommendations**: Personalized meal suggestions
2. **Voice Interface**: Voice commands for meal planning
3. **Shopping Integration**: One-click shopping list generation
4. **Nutrition Analysis**: Dietary goal tracking
5. **Responsive Design**: Mobile and desktop optimized
