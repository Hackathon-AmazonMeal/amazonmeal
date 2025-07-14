# AmazonMeal - AI-Powered Meal Planning Assistant

An innovative AI-powered meal planning and grocery shopping solution that integrates with Amazon Fresh, developed for a 3-day hackathon. AmazonMeal addresses decision fatigue in meal planning, nutrition management complexity, and shopping inefficiency through intelligent personalization and seamless integration.

## 🚀 Key Features

### Core Functionality
- **AI-Powered Meal Recommendations**: Personalized meal suggestions using Amazon Bedrock
- **One-Click Meal Planning**: Generate complete weekly meal plans based on preferences
- **Smart Shopping Lists**: Automatic ingredient aggregation with product mapping
- **Voice Interface**: Voice commands for hands-free meal planning and shopping
- **Nutrition Analysis**: Dietary goal tracking and nutritional balance optimization
- **Product Substitutions**: Intelligent alternatives when preferred items are unavailable

### User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Interface**: Material UI components for modern, accessible design
- **Real-time Updates**: Live synchronization between meal plans and shopping lists
- **Personalization**: Adapts to dietary restrictions, allergies, and preferences

## 🏗️ Architecture Overview

### Frontend (React Application)
- **React 18** with Material UI 5 for modern, responsive design
- **React Router 6** for seamless navigation
- **Context API** for efficient state management
- **Custom hooks** for data fetching and business logic

### Backend (AWS Serverless)
- **AWS Lambda** functions for scalable serverless compute
- **Amazon API Gateway** for RESTful API endpoints
- **Amazon DynamoDB** for high-performance data storage
- **Amazon Bedrock** for AI/ML capabilities

### AI/ML Integration
- **Meal Recommendation Engine**: Personalized suggestions based on user preferences
- **Ingredient Substitution Engine**: Smart product alternatives
- **Nutrition Analysis Engine**: Dietary goal optimization
- **Voice Command Processor**: Natural language understanding

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
│   ├── pages/                         # Main application pages
│   ├── contexts/                      # React contexts (Auth, etc.)
│   ├── hooks/                         # Custom React hooks
│   ├── services/                      # API service functions
│   └── utils/                         # Utility functions and helpers
├── lambda/                            # AWS Lambda functions
│   ├── userProfileService/            # User management and preferences
│   ├── recipeService/                 # Recipe data and filtering
│   ├── recommendationService/         # AI-powered meal recommendations
│   ├── shoppingService/               # Shopping list and cart management
│   └── voiceService/                  # Voice command processing
├── data/                              # Mock data and seed files
├── infrastructure/                    # AWS infrastructure configuration
└── docs/                              # Additional documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS CLI configured (for backend deployment)
- Modern web browser with Web Speech API support

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000
```

### Backend Setup
```bash
# Navigate to lambda functions
cd lambda/

# Deploy Lambda functions (requires AWS CLI)
# See infrastructure/ directory for deployment scripts
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

## 🛠️ Technologies

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **Material UI 5**: Comprehensive component library
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API communication

### Backend Stack
- **AWS Lambda**: Serverless compute functions
- **Amazon API Gateway**: RESTful API management
- **Amazon DynamoDB**: NoSQL database for scalable storage
- **Amazon Bedrock**: AI/ML services for personalization

### AI/ML Services
- **Amazon Bedrock**: Foundation models for recommendations
- **Natural Language Processing**: Voice command interpretation
- **Recommendation Algorithms**: Personalized meal suggestions

## 📊 Data Models

### Core Entities
- **Users**: Profiles, preferences, dietary restrictions
- **Recipes**: Ingredients, instructions, nutrition data
- **Products**: Mock Amazon Fresh product catalog
- **MealPlans**: Generated meal recommendations with scheduling
- **ShoppingLists**: Aggregated ingredients with product mapping

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

### Future Enhancements
- Real AWS Cognito authentication
- Actual Amazon Fresh API integration
- Machine learning model training with user data
- Multi-language support
- Advanced voice processing capabilities

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

---

**Built with ❤️ for Amazon's Internal Hackathon**

*This project demonstrates the potential for AI-powered meal planning to transform the grocery shopping experience while showcasing innovative use of Amazon's technology stack.*