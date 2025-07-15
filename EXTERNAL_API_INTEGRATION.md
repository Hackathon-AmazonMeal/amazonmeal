# External Preference API Integration Guide

## Overview

This document describes the integration of AmazonMeal with the external user preference API at `https://user-ms-iimt.vercel.app/api/preference`. This integration allows users with existing accounts to automatically load their preferences when logging in.

## API Details

### Endpoint
```
GET https://user-ms-iimt.vercel.app/api/preference?email={email}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "_id": "6876265daa616468b652d448",
    "email": "user@example.com",
    "preferences": {
      "dietType": "eggetarian",
      "healthGoals": ["muscle-gain", "maintain-weight", "diabetes-management"],
      "mealType": "lunch",
      "cookingTime": "quick",
      "cookingMethod": "slow-cook",
      "prepFor": 1,
      "allergies": ["soy", "shellfish", "wheat"]
    }
  }
}
```

### Error Responses
- `404 Not Found`: User not found (expected for new users)
- `500 Internal Server Error`: Server error

## Integration Architecture

### 1. Enhanced UserService (`src/services/userService.js`)

#### New Methods:
- `getUserPreferencesByEmail(email)`: Fetches preferences from external API
- `getUserPreferencesWithFallback(email, userId)`: Tries external API first, falls back to local
- `transformExternalPreferences(externalData)`: Transforms external format to internal format
- `loginWithEmail(email)`: Complete login flow with preference loading

#### Transformation Logic:
```javascript
// External API → Internal Format
{
  dietType: "eggetarian" → dietType: "eggetarian"
  healthGoals: [...] → healthGoals: [...] (preserved)
  allergies: [...] → allergies: [...] (preserved)
  cookingTime: "quick" → cookingSkillLevel: "beginner"
  cookingTime: "quick" → timePreferences: { maxPrepTime: 15, maxCookTime: 20 }
  dietType: "eggetarian" → dietaryRestrictions: ["vegetarian"]
}
```

### 2. Enhanced UserContext (`src/contexts/UserContext.js`)

#### New Actions:
- `SET_LOGIN_EMAIL`: Stores login email for reference
- `loginWithEmail(email)`: Integrated login with preference loading
- `loadExternalPreferences(email)`: Load preferences without full login

#### New State:
- `loginEmail`: Stores the email used for login
- Enhanced user object with email field

### 3. Enhanced Login Component (`src/pages/Login.js`)

#### New Features:
- **Check Preferences Button**: Test API before login
- **Enhanced Login Flow**: Automatic preference loading
- **Demo Login Options**: Quick test buttons for different scenarios
- **Status Feedback**: Real-time feedback on preference loading
- **Smart Navigation**: Routes to dashboard (existing prefs) or setup (new user)

## User Flow

### Existing User Login
1. User enters email and password
2. System authenticates user
3. System calls external API with email
4. If preferences found:
   - Load and transform preferences
   - Navigate to dashboard
   - Show success message
5. If no preferences found:
   - Navigate to preference setup
   - Show info message

### New User Login
1. User enters email and password
2. System authenticates user
3. System calls external API with email
4. API returns 404 (expected)
5. Navigate to preference setup
6. User creates new preferences

## Testing

### Test Scripts

#### 1. API Connectivity Test
```bash
node test-external-preference-api.js
```
Tests API connectivity and response format for multiple email addresses.

#### 2. Transformation Test
```bash
node test-transformation.js
```
Tests the preference transformation logic with actual API response data.

### Demo Component
Use `ExternalPreferenceDemo` component to test the integration in the UI:
```jsx
import ExternalPreferenceDemo from './components/ExternalPreferenceDemo';
```

### Test Emails
- `user@example.com`: Has existing preferences
- `demo@example.com`: No preferences (404)
- `test@example.com`: No preferences (404)

## Implementation Details

### Error Handling
- Network failures: Graceful fallback to local preferences
- API errors: User-friendly error messages
- Invalid responses: Data validation and sanitization

### Performance Considerations
- API calls only on login, not on every page load
- Caching of preferences in localStorage
- Timeout handling for slow API responses

### Security
- No sensitive data stored in external API calls
- Email validation before API calls
- Secure handling of user data

## Configuration

### Environment Variables
```bash
# Optional: Override external API URL
REACT_APP_EXTERNAL_PREFERENCE_API=https://user-ms-iimt.vercel.app/api/preference
```

### Feature Flags
```javascript
// In userService.js
const USE_EXTERNAL_API = process.env.REACT_APP_USE_EXTERNAL_API !== 'false';
```

## Deployment Considerations

### Production Checklist
- [ ] Test API connectivity from production environment
- [ ] Configure proper CORS headers if needed
- [ ] Set up monitoring for API failures
- [ ] Implement rate limiting protection
- [ ] Add analytics for preference loading success rates

### Monitoring
- Track API response times
- Monitor success/failure rates
- Log transformation errors
- User experience metrics

## Future Enhancements

### Planned Features
1. **Preference Sync**: Two-way sync between internal and external systems
2. **Caching Layer**: Redis cache for frequently accessed preferences
3. **Batch Loading**: Load preferences for multiple users
4. **Real-time Updates**: WebSocket integration for live preference updates

### API Improvements
1. **Pagination**: For users with extensive preference history
2. **Versioning**: API versioning for backward compatibility
3. **Filtering**: Load specific preference categories
4. **Validation**: Server-side preference validation

## Troubleshooting

### Common Issues

#### API Not Responding
```javascript
// Check network connectivity
curl -I https://user-ms-iimt.vercel.app/api/preference?email=test@example.com
```

#### Transformation Errors
```javascript
// Check console for transformation logs
console.log('External data:', externalData);
console.log('Transformed data:', transformedData);
```

#### User Not Found
- Expected behavior for new users
- System should gracefully handle 404 responses
- Users should be directed to preference setup

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug_preferences', 'true');
```

## Support

For issues with the external API integration:
1. Check the test scripts output
2. Verify API connectivity
3. Review transformation logic
4. Check browser console for errors
5. Test with known working email addresses

## API Response Examples

### Successful Response
```json
{
  "success": true,
  "data": {
    "_id": "6876265daa616468b652d448",
    "email": "user@example.com",
    "preferences": {
      "dietType": "eggetarian",
      "healthGoals": ["muscle-gain", "maintain-weight", "diabetes-management"],
      "mealType": "lunch",
      "cookingTime": "quick",
      "cookingMethod": "slow-cook",
      "prepFor": 1,
      "allergies": ["soy", "shellfish", "wheat"]
    }
  }
}
```

### User Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Transformed Internal Format
```json
{
  "dietType": "eggetarian",
  "healthGoals": ["muscle-gain", "maintain-weight", "diabetes-management"],
  "allergies": ["soy", "shellfish", "wheat"],
  "dietaryRestrictions": ["vegetarian"],
  "cuisinePreferences": [],
  "cookingSkillLevel": "beginner",
  "timePreferences": {
    "maxPrepTime": 15,
    "maxCookTime": 20,
    "cookingMethod": "slow-cook"
  },
  "mealType": "lunch",
  "prepFor": 1,
  "_source": "external_api",
  "_loadedAt": "2025-07-15T11:35:28.150Z"
}
```
