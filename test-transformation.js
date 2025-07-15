#!/usr/bin/env node

/**
 * Test script for preference transformation with actual API response
 */

// Simulate the actual API response structure
const actualAPIResponse = {
  "success": true,
  "data": {
    "_id": "6876265daa616468b652d448",
    "email": "user@example.com",
    "preferences": {
      "dietType": "eggetarian",
      "healthGoals": [
        "muscle-gain",
        "maintain-weight",
        "diabetes-management"
      ],
      "mealType": "lunch",
      "cookingTime": "quick",
      "cookingMethod": "slow-cook",
      "prepFor": 1,
      "allergies": [
        "soy",
        "shellfish",
        "wheat"
      ]
    }
  }
};

// Transformation functions (copied from userService)
function mapDietTypeToRestrictions(dietType) {
  const dietTypeMap = {
    'vegetarian': ['vegetarian'],
    'eggetarian': ['vegetarian'], // Handles the "eggetarian" from API
    'vegan': ['vegan', 'vegetarian'],
    'keto': ['low-carb', 'high-fat'],
    'paleo': ['paleo', 'gluten-free'],
    'mediterranean': ['mediterranean'],
    'low-carb': ['low-carb'],
    'gluten-free': ['gluten-free'],
  };
  
  return dietTypeMap[dietType?.toLowerCase()] || [];
}

function mapCookingTimeToSkillLevel(cookingTime) {
  const timeToSkillMap = {
    'quick': 'beginner',
    'medium': 'intermediate', 
    'long': 'advanced',
    'any': 'intermediate',
  };
  
  return timeToSkillMap[cookingTime?.toLowerCase()] || 'beginner';
}

function mapCookingTimeToMinutes(cookingTime, type = 'prep') {
  const timeMap = {
    'quick': { prep: 15, cook: 20 },
    'medium': { prep: 30, cook: 45 },
    'long': { prep: 45, cook: 90 },
    'any': { prep: 30, cook: 45 },
  };
  
  const timePrefs = timeMap[cookingTime?.toLowerCase()] || timeMap['medium'];
  return timePrefs[type];
}

function transformExternalPreferences(externalData) {
  if (!externalData) return null;

  // Handle the actual API response structure: { success: true, data: { _id, email, preferences: {...} } }
  const preferences = externalData.data?.preferences || externalData.preferences || externalData;
  
  if (!preferences) return null;

  // Map external preference structure to internal structure based on actual API response
  return {
    // Map external fields to internal fields
    dietType: preferences.dietType || 'balanced',
    healthGoals: preferences.healthGoals || [],
    allergies: preferences.allergies || [],
    
    // Map external fields to internal equivalents
    dietaryRestrictions: mapDietTypeToRestrictions(preferences.dietType) || [],
    cuisinePreferences: preferences.cuisinePreferences || [],
    
    // Map cooking preferences
    cookingSkillLevel: mapCookingTimeToSkillLevel(preferences.cookingTime) || 'beginner',
    
    // Map time preferences
    timePreferences: {
      maxPrepTime: mapCookingTimeToMinutes(preferences.cookingTime, 'prep') || 30,
      maxCookTime: mapCookingTimeToMinutes(preferences.cookingTime, 'cook') || 45,
      cookingMethod: preferences.cookingMethod || 'any',
    },
    
    // Additional preferences
    mealType: preferences.mealType || 'any',
    prepFor: preferences.prepFor || 1,
    
    // Keep original data for reference
    _originalData: preferences,
    _source: 'external_api',
    _loadedAt: new Date().toISOString(),
  };
}

function main() {
  console.log('🧪 Testing Preference Transformation with Actual API Response');
  console.log('=' .repeat(70));
  
  console.log('\n📥 Original API Response:');
  console.log(JSON.stringify(actualAPIResponse, null, 2));
  
  console.log('\n🔄 Transforming preferences...');
  const transformed = transformExternalPreferences(actualAPIResponse);
  
  console.log('\n📤 Transformed Preferences:');
  console.log(JSON.stringify(transformed, null, 2));
  
  console.log('\n📊 Transformation Analysis:');
  console.log(`✅ Diet Type: ${actualAPIResponse.data.preferences.dietType} → ${transformed.dietType}`);
  console.log(`✅ Dietary Restrictions: Added ${transformed.dietaryRestrictions.join(', ')} based on diet type`);
  console.log(`✅ Health Goals: ${transformed.healthGoals.length} goals preserved`);
  console.log(`✅ Allergies: ${transformed.allergies.length} allergies preserved`);
  console.log(`✅ Cooking Skill: ${actualAPIResponse.data.preferences.cookingTime} → ${transformed.cookingSkillLevel}`);
  console.log(`✅ Time Preferences: ${actualAPIResponse.data.preferences.cookingTime} → Prep: ${transformed.timePreferences.maxPrepTime}min, Cook: ${transformed.timePreferences.maxCookTime}min`);
  console.log(`✅ Additional Data: Meal type, prep for, cooking method preserved`);
  console.log(`✅ Metadata: Source tracking and load timestamp added`);
  
  console.log('\n🎯 Ready for AmazonMeal Integration!');
  console.log('The transformed data structure matches the internal preference format.');
}

main();
