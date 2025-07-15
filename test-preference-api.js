#!/usr/bin/env node

/**
 * Test script for external preference API integration
 * Tests the exact curl command provided by the user
 */

const axios = require('axios');

const PREFERENCE_API_URL = 'https://user-ms-iimt.vercel.app/api/preference';

// Test data matching the user's curl example
const testPayload = {
  email: "user@example.com",
  preferences: {
    dietType: "eggetarian",
    healthGoals: [
      "muscle-gain",
      "maintain-weight",
      "diabetes-management"
    ],
    mealType: "lunch",
    cookingTime: "quick",
    cookingMethod: "slow-cook",
    prepFor: 1,
    allergies: [
      "soy",
      "shellfish",
      "wheat"
    ]
  }
};

// Test with different user scenarios
const testScenarios = [
  {
    name: "User's Example Payload",
    payload: testPayload
  },
  {
    name: "Vegetarian User",
    payload: {
      email: "vegetarian@example.com",
      preferences: {
        dietType: "vegetarian",
        healthGoals: ["weight-loss", "maintain-weight"],
        mealType: "dinner",
        cookingTime: "medium",
        cookingMethod: "stovetop",
        prepFor: 2,
        allergies: ["nuts"]
      }
    }
  },
  {
    name: "Vegan User with No Allergies",
    payload: {
      email: "vegan@example.com",
      preferences: {
        dietType: "vegan",
        healthGoals: ["muscle-gain"],
        mealType: "breakfast",
        cookingTime: "quick",
        cookingMethod: "microwave",
        prepFor: 1,
        allergies: []
      }
    }
  }
];

async function testPreferenceAPI(scenario) {
  try {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log('📤 Payload:', JSON.stringify(scenario.payload, null, 2));
    
    const startTime = Date.now();
    
    const response = await axios.post(PREFERENCE_API_URL, scenario.payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ SUCCESS! (${responseTime}ms)`);
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      responseTime
    };
    
  } catch (error) {
    console.log(`❌ FAILED!`);
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Error: Request timed out');
    } else if (error.response) {
      console.log('📥 Response Status:', error.response.status);
      console.log('📥 Response Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('🌐 Network Error: Unable to connect to API');
    } else {
      console.log('❓ Unknown Error:', error.message);
    }
    
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

async function runAllTests() {
  console.log('🚀 Starting External Preference API Tests');
  console.log('🔗 API Endpoint:', PREFERENCE_API_URL);
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const scenario of testScenarios) {
    const result = await testPreferenceAPI(scenario);
    results.push({
      scenario: scenario.name,
      ...result
    });
    
    // Wait a bit between requests to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  
  if (successful > 0) {
    console.log('\n🎉 External preference API is working!');
    console.log('✨ The PreferencesPage integration should work correctly.');
  } else {
    console.log('\n⚠️  All tests failed. Check API endpoint and network connection.');
  }
  
  // Detailed results
  console.log('\n📋 Detailed Results:');
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
    console.log(`${index + 1}. ${status} ${result.scenario}${time}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  });
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testPreferenceAPI,
  runAllTests,
  testScenarios
};