const axios = require('axios');

async function testCORSFix() {
  console.log('🧪 Testing CORS fix for preference API...\n');
  
  const testData = {
    email: "test@example.com",
    preferences: {
      dietType: "non-vegetarian",
      healthGoals: ["energy-boost"],
      mealType: "lunch",
      cookingTime: "quick",
      cookingMethod: "microwave",
      prepFor: 1,
      allergies: []
    }
  };

  try {
    console.log('📤 Sending request to local proxy...');
    console.log('URL: http://localhost:3001/api/preferences');
    console.log('Data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/preferences', testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000
    });
    
    console.log('\n✅ Success! Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.externalApiSuccess) {
      console.log('\n🎉 External API was successfully called via proxy!');
    } else {
      console.log('\n⚠️  External API failed, but fallback worked!');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Make sure to run: npm run server');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testCORSFix();
