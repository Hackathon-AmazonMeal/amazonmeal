# AmazonMeal - AI-Powered Meal Planning Assistant

An innovative AI-powered meal planning and grocery shopping solution that integrates with Amazon Fresh, developed for a 3-day hackathon. AmazonMeal addresses decision fatigue in meal planning, nutrition management complexity, and shopping inefficiency through intelligent personalization and seamless integration.

## 🚀 Key Features

### Core Functionality
- **AI-Powered Meal Recommendations**: Personalized meal suggestions based on dietary preferences
- **One-Click Meal Planning**: Generate complete weekly meal plans with smart filtering
- **Smart Shopping Lists**: Automatic ingredient aggregation with quantity calculations
- **External Order Processing**: Integrated checkout with external fulfillment service
- **Nutrition Analysis**: Dietary goal tracking and nutritional information display
- **Recipe Management**: Browse, search, and view detailed cooking instructions

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Interface**: Material UI components for modern, accessible design
- **Seamless Checkout**: Robust order processing with error handling and status updates
- **Personalization**: Adapts to dietary restrictions, allergies, and cooking preferences

## 🏗️ Architecture Overview

### Frontend (React Application)
- **React 18** with Material UI 5 for modern, responsive design
- **React Router 6** for seamless navigation
- **Context API** for efficient state management
- **Custom hooks** for data fetching and business logic

### Backend (Development & Production)
- **Express.js Development Server**: Local API server with mock data
- **AWS Lambda** functions for scalable serverless compute (production)
- **Amazon API Gateway** for RESTful API endpoints (production)
- **Amazon DynamoDB** for high-performance data storage (production)
- **Amazon Bedrock** for AI/ML capabilities (production)

### AI/ML Integration
- **Meal Recommendation Engine**: Personalized suggestions based on user preferences
- **Ingredient Substitution Engine**: Smart product alternatives
- **Nutrition Analysis Engine**: Dietary goal optimization
- **Voice Command Processor**: Natural language understanding

### Development Server Features
The Express.js development server (`server.js`) provides:
- Mock recipe data from JSON files
- Personalized recommendation API with dietary filtering
- CORS support for frontend-backend communication
- Static file serving for production builds
- RESTful API endpoints matching production design

## 📁 Project Structure

```
AmazonMeal/
├── design-docs/                       # Comprehensive design documentation
│   ├── api_specification.md           # Complete API documentation
│   ├── component_diagram.md           # System architecture diagrams
│   ├── high_level_design.md           # Overall system design
│   ├── low_level_design.md            # Detailed implementation specs
│   ├── implementation_plan.md         # 3-day development roadmap
│   ├── requirements_spec.md           # Functional requirements
│   ├── sequence_diagram.md            # User flow interactions
│   └── genai_codegen_guide.md         # AI-assisted development guide
├── src/                               # Frontend React application
│   ├── components/                    # Reusable UI components
│   │   ├── common/                    # Shared components
│   │   ├── layout/                    # Layout components (Header, Layout)
│   │   ├── preferences/               # Preference-related components
│   │   │   ├── AllergySelector.js     # Allergy selection component
│   │   │   ├── DietaryRestrictions.js # Dietary restrictions selector
│   │   │   ├── DietTypeSelector.js    # Diet type selection
│   │   │   └── HealthGoals.js         # Health goals configuration
│   │   ├── recipes/                   # Recipe-related components
│   │   │   └── RecipeInstructions.js  # Recipe instruction display
│   │   ├── ingredients/               # Ingredient and cart components
│   │   │   └── CartSidebar.js         # Shopping cart sidebar
│   │   ├── history/                   # Order history components
│   │   ├── AppHeader.js               # Main application header
│   │   ├── AppFooter.js               # Application footer
│   │   └── Navbar.js                  # Navigation bar
│   ├── pages/                         # Main application pages
│   │   ├── Checkout/                  # Checkout flow pages
│   │   │   └── CheckoutSuccess.js     # Order confirmation page
│   │   ├── Dashboard/                 # Dashboard pages
│   │   │   └── Dashboard.js           # Main dashboard component
│   │   ├── Preferences/               # User preference pages
│   │   │   └── PreferencesPage.js     # Preferences management
│   │   ├── Recipes/                   # Recipe browsing pages
│   │   │   └── RecipesPage.js         # Recipe listing and search
│   │   ├── Welcome/                   # Onboarding pages
│   │   │   └── Welcome.js             # Welcome and setup flow
│   │   ├── Cart.js                    # Shopping cart page
│   │   ├── Dashboard.js               # Main dashboard (legacy)
│   │   ├── Home.js                    # Home page
│   │   ├── Login.js                   # User authentication
│   │   ├── MealPlanner.js             # Meal planning interface
│   │   ├── MealPlanCreator.js         # Meal plan creation
│   │   ├── OrderConfirmation.js       # Order confirmation
│   │   ├── PreferenceSetup.js         # Initial preference setup
│   │   ├── Profile.js                 # User profile management
│   │   ├── RecipeBrowser.js           # Recipe browsing
│   │   ├── RecipeDetail.js            # Individual recipe details
│   │   └── ShoppingList.js            # Shopping list management
│   ├── contexts/                      # React contexts for state management
│   │   ├── AuthContext.js             # Authentication state
│   │   ├── CartContext.js             # Shopping cart state
│   │   ├── RecipeContext.js           # Recipe data and filtering
│   │   └── UserContext.js             # User profile and preferences
│   ├── hooks/                         # Custom React hooks
│   │   ├── useLocalStorage.js         # Local storage management
│   │   └── useUserPreferences.js      # User preference management
│   ├── services/                      # API service functions
│   │   ├── api.js                     # Base API configuration
│   │   ├── cartService.js             # Cart management API
│   │   ├── recipeService.js           # Recipe data API
│   │   ├── recommendationService.js   # AI recommendation API
│   │   └── userService.js             # User management API
│   ├── data/                          # Mock data and seed files
│   │   ├── preferences/               # User preference data
│   │   │   ├── allergies.json         # Available allergies
│   │   │   ├── diet-types.json        # Diet type options
│   │   │   ├── dietary-restrictions.json # Dietary restrictions
│   │   │   └── health-goals.json      # Health goal options
│   │   ├── recipes/                   # Recipe data by meal type
│   │   │   ├── breakfast.json         # Breakfast recipes
│   │   │   ├── lunch.json             # Lunch recipes
│   │   │   └── dinner.json            # Dinner recipes
│   │   ├── users/                     # User profile data
│   │   ├── products.json              # Product catalog
│   │   └── recipes.json               # Combined recipe data
│   ├── styles/                        # Styling and theme
│   │   └── theme.js                   # Material-UI theme configuration
│   ├── utils/                         # Utility functions and helpers
│   │   └── constants.js               # Application constants
│   ├── App.js                         # Main application component
│   ├── index.js                       # Application entry point
│   └── index.css                      # Global styles
├── lambda/                            # AWS Lambda functions (serverless backend)
│   ├── recommendationService/         # AI-powered meal recommendations
│   │   ├── index.js                   # Main recommendation logic
│   │   └── package.json               # Lambda dependencies
│   ├── userProfileService/            # User management and preferences
│   ├── recipeService/                 # Recipe data and filtering
│   ├── shoppingService/               # Shopping list management
│   ├── cartService/                   # Shopping cart operations
│   ├── voiceService/                  # Voice command processing
│   ├── userService/                   # User account management
│   ├── shared/                        # Shared Lambda utilities
│   ├── recommendationService.js       # Legacy recommendation service
│   └── shoppingService.js             # Legacy shopping service
├── infrastructure/                    # AWS infrastructure configuration
│   └── dynamodb-tables.json           # DynamoDB table definitions
├── tests/                             # Test suites
│   ├── components/                    # Component tests
│   ├── services/                      # Service tests
│   └── integration/                   # Integration tests
├── docs/                              # Additional documentation
│   └── deployment-guide.md            # Deployment instructions
├── build/                             # Production build output
├── public/                            # Static assets
│   └── index.html                     # HTML template
├── server.js                          # Express.js development server
├── package.json                       # Project dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── project-structure.md               # Detailed project structure
└── README.md                          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- AWS CLI configured (for backend deployment)
- Modern web browser with Web Speech API support

### Development Setup
```bash
# Clone the repository
git clone https://github.com/amazon/amazonmeal
cd amazonmeal

# Install dependencies
npm install

# Start development server with backend API
npm run dev

# Or start frontend and backend separately
npm run server  # Backend API on port 3001
npm start       # Frontend on port 3000
```

### Available Scripts
```bash
# Development
npm start          # Start React development server
npm run server     # Start Express.js backend server
npm run dev        # Start both frontend and backend concurrently

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues automatically
npm run format     # Format code with Prettier

# Testing & Validation
npm test           # Run test suite
npm run build      # Create production build
npm run validate   # Run linting and build checks
npm run check      # Complete pre-flight checks

# Quick Checks
npm run quick-check # Fast code quality validation
```

### Environment Setup
```bash
# Create .env file for local development
echo "REACT_APP_API_URL=http://localhost:3001/api" > .env
echo "PORT=3001" >> .env

# For production deployment
echo "REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com" > .env.production
```

### Backend Setup (Production)
```bash
# Navigate to lambda functions
cd lambda/

# Deploy Lambda functions (requires AWS CLI)
# See infrastructure/ directory for deployment scripts
aws lambda create-function --function-name amazonmeal-recommendations \
  --runtime nodejs18.x --role arn:aws:iam::account:role/lambda-role \
  --handler index.handler --zip-file fileb://recommendationService.zip
```

## 🎯 Demo Scenarios

### 1. New User Onboarding
- Create profile with dietary preferences and restrictions
- Set cooking skill level and time preferences
- Configure cuisine preferences and allergies

### 2. AI-Powered Meal Planning
- Generate personalized weekly meal plan
- View nutritional analysis and balance
- Customize recommendations with voice commands

### 3. Smart Shopping Integration
- One-click shopping list generation from meal plan
- Product substitution suggestions
- Mock Amazon Fresh cart integration

### 4. Voice Interaction
- "Create a meal plan for the week"
- "What's for dinner tonight?"
- "Add ingredients to my shopping list"

## 🔧 Current Implementation Status

### ✅ Completed Features
- **React Frontend**: Fully functional UI with Material-UI components
- **User Preferences**: Complete preference management with dietary restrictions and allergies
- **Recipe Management**: Browse, search, filter, and view detailed recipes with instructions
- **Shopping Cart**: Add ingredients, manage quantities, and cart persistence
- **External Order Processing**: Robust integration with external fulfillment API
- **Checkout Flow**: Complete order processing with error handling and status updates
- **Responsive Design**: Mobile and desktop optimized layouts
- **Express.js Backend**: Development API server with mock data and CORS support
- **State Management**: React Context for authentication, cart, recipes, and user data
- **Routing**: Multi-page navigation with React Router and protected routes

### 🚧 In Development
- **Enhanced AI Recommendations**: Machine learning-based personalization
- **Voice Interface**: Speech recognition and natural language commands
- **AWS Lambda Integration**: Serverless backend functions
- **Real-time Notifications**: Order status and recommendation updates

### 📋 Future Enhancements
- **Amazon Fresh API**: Real product catalog and inventory integration
- **Advanced Payment Processing**: Multiple payment methods and saved cards
- **Detailed Nutrition Tracking**: Comprehensive dietary analysis and goal monitoring
- **Calendar-based Meal Planning**: Weekly and monthly meal scheduling

## 🔗 External Integrations

### Order Processing API
The application integrates with an external order processing service:
- **Endpoint**: `https://order-processing-backend.vercel.app/orders`
- **Trigger**: Activated when users complete checkout
- **Data Sent**: Order ID, customer info, items, and total amount
- **Response**: Order confirmation and tracking information

For detailed integration documentation, see [ORDER_INTEGRATION.md](./ORDER_INTEGRATION.md).

## 🛠️ Technologies

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **Material UI 5**: Comprehensive component library with custom theming
- **React Router 6**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Date-fns**: Modern date utility library
- **Context API**: State management for user preferences, cart, and recipes

### Backend Stack
- **Express.js**: Development server for API endpoints
- **AWS Lambda**: Serverless compute functions (production)
- **Amazon API Gateway**: RESTful API management (production)
- **Amazon DynamoDB**: NoSQL database for scalable storage (production)
- **Amazon Bedrock**: AI/ML services for personalization (production)

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Concurrently**: Run multiple npm scripts simultaneously
- **CORS**: Cross-origin resource sharing middleware

### AI/ML Services
- **Amazon Bedrock**: Foundation models for recommendations
- **Natural Language Processing**: Voice command interpretation
- **Recommendation Algorithms**: Personalized meal suggestions

## 🧩 Component Architecture

### Core Components

#### State Management (Contexts)
- **AuthContext**: User authentication and session management
- **UserContext**: User profile and preferences
- **RecipeContext**: Recipe data, filtering, and search
- **CartContext**: Shopping cart state and operations

#### Page Components
- **Dashboard**: Main user dashboard with meal plans and recommendations
- **RecipesPage**: Recipe browsing with search and filtering
- **PreferencesPage**: User preference management
- **Welcome**: Onboarding flow for new users
- **CheckoutSuccess**: Order confirmation and success page

#### Feature Components
- **DietTypeSelector**: Diet preference selection (vegetarian, vegan, etc.)
- **AllergySelector**: Allergy and intolerance management
- **HealthGoals**: Health and nutrition goal setting
- **RecipeInstructions**: Step-by-step cooking instructions
- **CartSidebar**: Shopping cart with item management

#### Service Layer
- **recipeService**: Recipe data fetching and management
- **recommendationService**: AI-powered meal recommendations
- **cartService**: Shopping cart operations
- **userService**: User profile and authentication
- **api**: Base API configuration and utilities

### Data Structure

#### Recipe Data Model
```javascript
{
  id: "string",
  name: "string",
  description: "string",
  mealType: "breakfast|lunch|dinner",
  prepTime: "number (minutes)",
  cookTime: "number (minutes)",
  servings: "number",
  difficulty: "easy|medium|hard",
  ingredients: [
    {
      name: "string",
      amount: "string",
      unit: "string"
    }
  ],
  instructions: ["string"],
  nutritionInfo: {
    calories: "number",
    protein: "number",
    carbs: "number",
    fat: "number"
  },
  dietaryInfo: {
    vegetarian: "boolean",
    vegan: "boolean",
    glutenFree: "boolean",
    dairyFree: "boolean"
  }
}
```

#### User Preferences Model
```javascript
{
  dietaryRestrictions: ["string"],
  allergies: ["string"],
  healthGoals: ["string"],
  cuisinePreferences: ["string"],
  cookingSkillLevel: "beginner|intermediate|advanced",
  timePreferences: {
    maxPrepTime: "number",
    maxCookTime: "number"
  }
}
```

## 📊 Data Models

### Core Entities
- **Users**: Profiles, preferences, dietary restrictions
- **Recipes**: Ingredients, instructions, nutrition data
- **Products**: Mock Amazon Fresh product catalog
- **MealPlans**: Generated meal recommendations with scheduling
- **ShoppingLists**: Aggregated ingredients with product mapping

## 🔌 API Endpoints

### Current Development API (Express.js)
```
GET    /api/recipes                    # Get all recipes
GET    /api/recipes/:id                # Get specific recipe
POST   /api/recommendations/personalized # Get AI recommendations
```

### Planned Production API (AWS Lambda)
```
# User Management
POST   /api/users/register             # User registration
POST   /api/users/login                # User authentication
GET    /api/users/profile              # Get user profile
PUT    /api/users/profile              # Update user profile

# Recipe Management
GET    /api/recipes                    # Get recipes with filters
GET    /api/recipes/:id                # Get recipe details
POST   /api/recipes/search             # Search recipes

# Recommendations
POST   /api/recommendations/generate    # Generate meal plan
GET    /api/recommendations/history     # Get recommendation history

# Shopping & Cart
POST   /api/cart/add                   # Add items to cart
GET    /api/cart                       # Get cart contents
POST   /api/cart/checkout              # Process checkout

# Voice Commands
POST   /api/voice/process              # Process voice commands
```

## 🎨 Design Principles

### User Experience
- **Simplicity**: Minimal clicks to achieve goals
- **Personalization**: Adapts to individual preferences
- **Accessibility**: WCAG compliant design patterns
- **Performance**: Fast loading and responsive interactions

### Technical Excellence
- **Scalability**: Serverless architecture for elastic scaling
- **Maintainability**: Clean code structure and documentation
- **Security**: AWS best practices for data protection
- **Innovation**: Creative use of AI for meal planning

## 🚧 Development Notes

### Hackathon Considerations
- **Mock Authentication**: Simplified auth for demo purposes
- **Simulated Integration**: Mock Amazon Fresh API responses
- **Rapid Development**: Focus on core features and user experience
- **Demo-Ready**: Optimized for presentation and judging criteria

### Current Limitations
- **Development Mode**: Uses Express.js server with mock data
- **Limited AI**: Basic filtering instead of full ML recommendations
- **No Real Payments**: Checkout flow is simulated
- **Static Data**: Recipe and product data from JSON files

### Future Enhancements
- Real AWS Cognito authentication
- Actual Amazon Fresh API integration
- Machine learning model training with user data
- Multi-language support
- Advanced voice processing capabilities

### Key Dependencies
- **React 18** with Material-UI 5 for modern UI components
- **React Router 6** for client-side navigation
- **Axios** for HTTP requests and API communication
- **Express.js** for development server and API endpoints
- **ESLint & Prettier** for code quality and formatting
- **Concurrently** for running multiple development processes

## 📈 Business Impact

### Customer Benefits
- **Time Savings**: Reduce meal planning time by 80%
- **Better Nutrition**: Automated dietary goal tracking
- **Reduced Waste**: Precise ingredient quantities
- **Convenience**: Seamless shopping experience

### Amazon Benefits
- **Increased Engagement**: Higher platform usage frequency
- **Order Value**: Larger basket sizes through meal planning
- **Customer Retention**: Solving real customer problems
- **Competitive Advantage**: Differentiated grocery experience

## 🏆 Hackathon Success Metrics

### Technical Innovation
- Creative use of Amazon Bedrock for personalization
- Seamless integration of multiple AWS services
- Novel approach to voice-enabled shopping

### User Experience
- Intuitive interface design and user flows
- Compelling demonstration scenarios
- Clear value proposition presentation

### Business Viability
- Quantifiable impact metrics
- Scalable architecture design
- Clear path to production implementation

## 🧪 Testing

### Manual Testing
- Complete checkout flow with external API integration
- Recipe browsing and filtering functionality
- User preference management and persistence
- Responsive design across different screen sizes
- Error handling for network failures and API timeouts

### Automated Testing Scripts
```bash
# Test external API connectivity
node test-external-api.js

# Demo complete integration flow
node demo-integration.js

# Run React test suite
npm test
```

### Integration Testing
The application includes comprehensive integration testing for:
- External order processing API
- Cart to checkout flow
- Recipe recommendation system
- User preference persistence

For detailed testing documentation, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md).

---

**Built with ❤️ for Amazon's Internal Hackathon**

*This project demonstrates the potential for AI-powered meal planning to transform the grocery shopping experience while showcasing innovative use of Amazon's technology stack.*