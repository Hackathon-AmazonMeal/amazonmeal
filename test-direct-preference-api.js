const axios = require('axios');

// Direct external API endpoint
const EXTERNAL_PREFERENCE_API_URL = 'https://user-ms-iimt.vercel.app/api/preference';

async function testDirectPreferenceAPI() {
  console.log('🧪 Testing Direct External Preference API Integration');
  console.log('=' .repeat(60));
  
  const testPayload = {
    email: 'test@amazonmeal.com',
    preferences: {
      dietType: 'vegetarian',
      healthGoals: ['weight_loss', 'muscle_gain'],
      mealType: 'dinner',
      cookingTime: 'medium',
      cookingMethod: 'stovetop',
      prepFor: 2,
      allergies: ['nuts', 'dairy']
    }
  };

  try {
    console.log('📤 Sending request to:', EXTERNAL_PREFERENCE_API_URL);
    console.log('📋 Payload:', JSON.stringify(testPayload, null, 2));
    console.log('');

    const startTime = Date.now();
    
    const response = await axios.post(EXTERNAL_PREFERENCE_API_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'AmazonMeal-Frontend/1.0.0'
      },
      timeout: 15000
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log('✅ SUCCESS! Direct API call completed');
    console.log('⏱️  Response time:', responseTime + 'ms');
    console.log('📊 Status:', response.status);
    console.log('📥 Response data:', JSON.stringify(response.data, null, 2));
    console.log('');
    
    // Validate response structure
    if (response.data) {
      console.log('🔍 Response validation:');
      console.log('  - Has data:', !!response.data);
      console.log('  - Response type:', typeof response.data);
      
      if (response.data.id) {
        console.log('  - Has ID:', response.data.id);
      }
      
      if (response.data.message) {
        console.log('  - Message:', response.data.message);
      }
    }

    console.log('');
    console.log('🎉 Direct external API integration is working correctly!');
    console.log('✨ No proxy needed - frontend calls external API directly');
    
    return {
      success: true,
      responseTime,
      data: response.data
    };

  } catch (error) {
    console.error('❌ FAILED! Direct API call error:');
    console.error('');
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timed out after 15 seconds');
    } else if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📄 Status text:', error.response.statusText);
      console.error('📥 Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('🔗 Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      console.error('📡 Request details:', error.request);
    } else {
      console.error('⚠️  Other error:', error.message);
    }
    
    console.error('');
    console.error('🔧 Troubleshooting tips:');
    console.error('  1. Check if external API is accessible');
    console.error('  2. Verify payload format matches API expectations');
    console.error('  3. Check network connectivity');
    console.error('  4. Verify API endpoint URL is correct');
    
    return {
      success: false,
      error: error.message,
      details: error.response?.data
    };
  }
}

// Test different payload formats
async function testPayloadVariations() {
  console.log('');
  console.log('🔄 Testing different payload variations...');
  console.log('=' .repeat(60));
  
  const variations = [
    {
      name: 'Minimal payload',
      payload: {
        email: 'minimal@test.com',
        preferences: {
          dietType: 'vegetarian',
          mealType: 'dinner'
        }
      }
    },
    {
      name: 'Complete payload',
      payload: {
        email: 'complete@test.com',
        preferences: {
          dietType: 'vegan',
          healthGoals: ['weight_loss'],
          mealType: 'lunch',
          cookingTime: 'quick',
          cookingMethod: 'microwave',
          prepFor: 1,
          allergies: []
        }
      }
    }
  ];

  for (const variation of variations) {
    console.log(`\n📋 Testing: ${variation.name}`);
    console.log('📤 Payload:', JSON.stringify(variation.payload, null, 2));
    
    try {
      const response = await axios.post(EXTERNAL_PREFERENCE_API_URL, variation.payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'AmazonMeal-Frontend/1.0.0'
        },
        timeout: 10000
      });
      
      console.log(`✅ ${variation.name} - SUCCESS`);
      console.log('📥 Response:', JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ ${variation.name} - FAILED`);
      console.log('💥 Error:', error.response?.data || error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 AmazonMeal - Direct External API Integration Test');
  console.log('🎯 Testing: POST https://user-ms-iimt.vercel.app/api/preference');
  console.log('📅 Date:', new Date().toISOString());
  console.log('');

  // Test main functionality
  const result = await testDirectPreferenceAPI();
  
  if (result.success) {
    // Test payload variations if main test succeeds
    await testPayloadVariations();
  }
  
  console.log('');
  console.log('🏁 Test completed!');
  console.log('');
  
  if (result.success) {
    console.log('✅ Integration Status: WORKING');
    console.log('🔗 Frontend can call external API directly');
    console.log('🚫 No proxy server needed');
  } else {
    console.log('❌ Integration Status: FAILED');
    console.log('🔧 Check external API availability and payload format');
  }
}

// Run the test
main().catch(console.error);
