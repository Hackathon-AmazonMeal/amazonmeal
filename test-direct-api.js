#!/usr/bin/env node

const axios = require('axios');

// Test the direct API call to the external preference service
async function testDirectAPI() {
  console.log('🧪 Testing direct API call to external preference service...\n');
  
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

  try {
    console.log('📤 Sending request to: https://user-ms-iimt.vercel.app/api/preference');
    console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
    console.log('\n⏳ Making request...\n');

    const response = await axios.post(
      'https://user-ms-iimt.vercel.app/api/preference',
      testPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ SUCCESS! API call completed successfully');
    console.log('📊 Status:', response.status);
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ FAILED! API call failed');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📥 Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('🌐 Network Error: No response received');
      console.error('📡 Request details:', error.message);
    } else {
      console.error('⚠️ Error:', error.message);
    }
  }
}

// Run the test
testDirectAPI();
