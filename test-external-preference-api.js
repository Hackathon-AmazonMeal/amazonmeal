#!/usr/bin/env node

/**
 * Test script for external preference API integration
 * Tests the integration with https://user-ms-iimt.vercel.app/api/preference
 */

const EXTERNAL_API_URL = 'https://user-ms-iimt.vercel.app/api/preference';

// Test emails to check
const TEST_EMAILS = [
  'user@example.com',
  'demo@example.com',
  'test@example.com',
  'nonexistent@example.com'
];

async function testExternalAPI(email) {
  console.log(`\n🔍 Testing API for email: ${email}`);
  console.log(`📡 URL: ${EXTERNAL_API_URL}?email=${encodeURIComponent(email)}`);
  
  try {
    const response = await fetch(`${EXTERNAL_API_URL}?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response data:');
      console.log(JSON.stringify(data, null, 2));
      
      // Analyze the response structure
      if (data) {
        console.log('\n📋 Data Analysis:');
        console.log(`- Type: ${typeof data}`);
        console.log(`- Keys: ${Object.keys(data).join(', ')}`);
        
        // Check for common preference fields
        const commonFields = ['dietaryRestrictions', 'allergies', 'healthGoals', 'dietType', 'cuisinePreferences'];
        const foundFields = commonFields.filter(field => data.hasOwnProperty(field));
        const missingFields = commonFields.filter(field => !data.hasOwnProperty(field));
        
        if (foundFields.length > 0) {
          console.log(`- Found preference fields: ${foundFields.join(', ')}`);
        }
        if (missingFields.length > 0) {
          console.log(`- Missing common fields: ${missingFields.join(', ')}`);
        }
      }
    } else if (response.status === 404) {
      console.log('ℹ️  User not found (404) - This is expected for non-existent users');
    } else {
      const errorText = await response.text();
      console.log(`❌ Error response: ${errorText}`);
    }
  } catch (error) {
    console.log(`💥 Network/Request Error: ${error.message}`);
  }
}

async function testTransformation(sampleData) {
  console.log('\n🔄 Testing data transformation...');
  
  // Simulate the transformation function from userService
  function transformExternalPreferences(externalData) {
    if (!externalData) return null;

    return {
      dietaryRestrictions: externalData.dietaryRestrictions || [],
      allergies: externalData.allergies || [],
      healthGoals: externalData.healthGoals || [],
      dietType: externalData.dietType || 'balanced',
      cuisinePreferences: externalData.cuisinePreferences || [],
      cookingSkillLevel: externalData.cookingSkillLevel || 'beginner',
      timePreferences: {
        maxPrepTime: externalData.maxPrepTime || 30,
        maxCookTime: externalData.maxCookTime || 45,
      },
      ...externalData,
    };
  }

  const transformed = transformExternalPreferences(sampleData);
  console.log('📤 Original data:');
  console.log(JSON.stringify(sampleData, null, 2));
  console.log('\n📥 Transformed data:');
  console.log(JSON.stringify(transformed, null, 2));
}

async function main() {
  console.log('🚀 AmazonMeal External Preference API Integration Test');
  console.log('=' .repeat(60));
  
  // Test API connectivity and responses
  for (const email of TEST_EMAILS) {
    await testExternalAPI(email);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  // Test data transformation with sample data
  const sampleExternalData = {
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    allergies: ['nuts', 'dairy'],
    healthGoals: ['weight-loss', 'muscle-gain'],
    dietType: 'mediterranean',
    cuisinePreferences: ['italian', 'mexican'],
    cookingSkillLevel: 'intermediate',
    maxPrepTime: 20,
    maxCookTime: 30,
    customField: 'custom value'
  };
  
  await testTransformation(sampleExternalData);
  
  console.log('\n✨ Test completed!');
  console.log('\n📝 Integration Notes:');
  console.log('1. Update the transformExternalPreferences function based on actual API response structure');
  console.log('2. Handle different response formats gracefully');
  console.log('3. Implement proper error handling for network failures');
  console.log('4. Consider caching preferences to reduce API calls');
  console.log('5. Add loading states in the UI for better user experience');
}

// Run the test
main().catch(console.error);
