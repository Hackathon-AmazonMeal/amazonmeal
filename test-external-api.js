#!/usr/bin/env node

const axios = require('axios');

// Test data matching your API specification
const testData = {
  email: "user@example.com",
  preferences: {
    dietType: "vegetarian",
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

async function testDirectAPI() {
  console.log('🧪 Testing Direct External API...');
  console.log('📤 Sending:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await axios.post(
      'https://user-ms-iimt.vercel.app/api/preference',
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Direct API Success!');
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Direct API Failed:', error.message);
    if (error.response) {
      console.error('📥 Error Response:', error.response.data);
      console.error('📥 Error Status:', error.response.status);
    }
    return false;
  }
}

async function testProxyAPI() {
  console.log('\n🧪 Testing Proxy API (through local server)...');
  console.log('📤 Sending:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await axios.post(
      'http://localhost:3001/api/external-preferences',
      testData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    console.log('✅ Proxy API Success!');
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Proxy API Failed:', error.message);
    if (error.response) {
      console.error('📥 Error Response:', error.response.data);
      console.error('📥 Error Status:', error.response.status);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting API Integration Tests\n');
  
  const directSuccess = await testDirectAPI();
  const proxySuccess = await testProxyAPI();
  
  console.log('\n📊 Test Results:');
  console.log(`Direct API: ${directSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Proxy API: ${proxySuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (directSuccess && proxySuccess) {
    console.log('\n🎉 All tests passed! Your integration is working correctly.');
  } else if (directSuccess && !proxySuccess) {
    console.log('\n⚠️ Direct API works but proxy fails. Check if your local server is running on port 3001.');
  } else if (!directSuccess && proxySuccess) {
    console.log('\n⚠️ Proxy works but direct API fails. There might be a network issue.');
  } else {
    console.log('\n❌ Both tests failed. Check your network connection and API endpoint.');
  }
}

// Run the tests
runTests().catch(console.error);
