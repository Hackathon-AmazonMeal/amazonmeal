# AmazonMeal Deployment Guide

This guide provides step-by-step instructions for deploying the AmazonMeal application during your 3-day hackathon.

## Prerequisites

- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm installed
- Access to AWS services: Lambda, API Gateway, DynamoDB, Bedrock

## Quick Deployment Steps

### 1. Frontend Deployment

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to S3 (or run locally for demo)
npm start  # For local development
```

### 2. Backend Infrastructure Setup

#### Create DynamoDB Tables

```bash
# Navigate to infrastructure directory
cd infrastructure/

# Create tables using AWS CLI
aws dynamodb create-table --cli-input-json file://dynamodb-tables.json --region us-east-1

# Or create tables individually
aws dynamodb create-table \
  --table-name AmazonMeal-Users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

#### Deploy Lambda Functions

```bash
# Navigate to Lambda function directory
cd lambda/recommendationService/

# Install dependencies
npm install

# Create deployment package
npm run package

# Deploy using AWS CLI
aws lambda create-function \
  --function-name AmazonMeal-RecommendationService \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://recommendation-service.zip \
  --timeout 30 \
  --memory-size 256 \
  --region us-east-1
```

#### Set up API Gateway

```bash
# Create API Gateway
aws apigateway create-rest-api \
  --name AmazonMeal-API \
  --description "API for AmazonMeal application" \
  --region us-east-1

# Configure routes and integrate with Lambda functions
# (This would typically be done through AWS Console for hackathon speed)
```

### 3. Environment Configuration

Create environment variables for your Lambda functions:

```bash
# Set environment variables for Lambda
aws lambda update-function-configuration \
  --function-name AmazonMeal-RecommendationService \
  --environment Variables='{
    "USERS_TABLE":"AmazonMeal-Users",
    "RECIPES_TABLE":"AmazonMeal-Recipes",
    "MEAL_PLANS_TABLE":"AmazonMeal-MealPlans",
    "PRODUCTS_TABLE":"AmazonMeal-Products",
    "SHOPPING_LISTS_TABLE":"AmazonMeal-ShoppingLists"
  }' \
  --region us-east-1
```

### 4. Seed Data

```bash
# Load sample data into DynamoDB tables
cd data/

# Load recipes
aws dynamodb batch-write-item \
  --request-items file://recipes-batch.json \
  --region us-east-1

# Load products
aws dynamodb batch-write-item \
  --request-items file://products-batch.json \
  --region us-east-1
```

## Local Development Setup

For faster development during the hackathon:

```bash
# Start frontend development server
npm start

# The app will run on http://localhost:3000
# API calls will be mocked for development
```

## Demo Environment Setup

### Mock Data Configuration

1. Ensure mock data files are in place:
   - `data/recipes.json`
   - `data/products.json`
   - `data/users.json`

2. Configure frontend to use mock mode:
   ```javascript
   // In src/services/api.js
   export const enableMockMode = () => {
     // Override API calls with mock data
   };
   ```

### Demo User Accounts

Pre-configured demo users for presentation:

1. **healthyeater@example.com**
   - Vegetarian preferences
   - Quick cooking time
   - Italian/Mexican cuisine

2. **familychef@example.com**
   - Family-friendly recipes
   - Medium cooking time
   - American/Italian cuisine

3. **fitnessfan@example.com**
   - Gluten-free, low-carb
   - Advanced cooking skills
   - Mediterranean/Asian cuisine

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Ensure API Gateway has CORS enabled
   # Add headers to Lambda responses
   ```

2. **DynamoDB Access Issues**
   ```bash
   # Check IAM roles and permissions
   # Verify table names match environment variables
   ```

3. **Lambda Timeout**
   ```bash
   # Increase timeout in Lambda configuration
   # Optimize code for faster execution
   ```

### Quick Fixes

```bash
# Restart development server
npm start

# Clear browser cache
# Check browser console for errors
# Verify API endpoints are accessible
```

## Production Considerations

For future production deployment:

1. **Security**
   - Implement proper authentication with AWS Cognito
   - Use IAM roles with least privilege
   - Enable API Gateway authentication

2. **Scalability**
   - Configure DynamoDB auto-scaling
   - Set up Lambda concurrency limits
   - Implement caching strategies

3. **Monitoring**
   - Set up CloudWatch alarms
   - Enable X-Ray tracing
   - Configure log aggregation

4. **CI/CD**
   - Set up automated deployment pipeline
   - Implement testing stages
   - Configure environment promotion

## Demo Day Checklist

- [ ] All services are running
- [ ] Demo data is loaded
- [ ] Test user accounts work
- [ ] Voice interface is functional
- [ ] All demo scenarios tested
- [ ] Backup plans in place

## Support

For hackathon support:
- Check AWS documentation
- Use AWS CLI help commands
- Refer to design documents in `design-docs/`
- Test with mock data first
