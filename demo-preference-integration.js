#!/usr/bin/env node

/**
 * Demo script for the complete preference integration flow
 * This simulates what happens when a user completes the preferences form
 */

const axios = require('axios');

const PREFERENCE_API_URL = 'https://user-ms-iimt.vercel.app/api/preference';

// Simulate different user scenarios that would come from the UI
const userScenarios = [
  {
    name: "Health-Conscious User",
    userEmail: "health@example.com",
    preferences: {
      dietType: "vegetarian",
      healthGoals: ["weight-loss", "maintain-weight"],
      mealType: "dinner",
      cookingTime: "medium",
      cookingMethod: "stovetop",
      prepFor: 2,
      allergies: ["nuts", "dairy"]
    }
  },
  {
    name: "Busy Professional",
    userEmail: "busy@example.com",
    preferences: {
      dietType: "eggetarian",
      healthGoals: ["muscle-gain"],
      mealType: "lunch",
      cookingTime: "quick",
      cookingMethod: "microwave",
      prepFor: 1,
      allergies: []
    }
  },
  {
    name: "Family Cook",
    userEmail: "family@example.com",
    preferences: {
      dietType: "non-vegetarian",
      healthGoals: ["maintain-weight", "diabetes-management"],
      mealType: "dinner",
      cookingTime: "long",
      cookingMethod: "slow-cook",
      prepFor: 4,
      allergies: ["shellfish"]
    }
  },
  {
    name: "Fitness Enthusiast",
    userEmail: "fitness@example.com",
    preferences: {
      dietType: "vegan",
      healthGoals: ["muscle-gain", "weight-loss"],
      mealType: "breakfast",
      cookingTime: "quick",
      cookingMethod: "stovetop",
      prepFor: 1,
      allergies: ["soy"]
    }
  }
];

async function simulatePreferenceSubmission(scenario) {
  console.log(`\n👤 Simulating: ${scenario.name}`);
  console.log(`📧 Email: ${scenario.userEmail}`);
  console.log(`🍽️  Preferences:`, JSON.stringify(scenario.preferences, null, 2));
  
  try {
    const payload = {
      email: scenario.userEmail,
      preferences: scenario.preferences
    };
    
    console.log(`🔄 Submitting to external API...`);
    const startTime = Date.now();
    
    const response = await axios.post(PREFERENCE_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log(`✅ SUCCESS! (${responseTime}ms)`);
    console.log(`📥 Response:`, JSON.stringify(response.data, null, 2));
    
    // Simulate what would happen next in the UI
    console.log(`🎯 Next Steps (simulated):`);
    console.log(`   1. ✅ External API call completed`);
    console.log(`   2. 💾 Saving preferences locally...`);
    console.log(`   3. 🔍 Generating recipe recommendations...`);
    console.log(`   4. 🚀 Redirecting to /recipes page...`);
    
    return {
      success: true,
      responseTime,
      data: response.data
    };
    
  } catch (error) {
    console.log(`❌ FAILED!`);
    
    if (error.code === 'ECONNABORTED') {
      console.log(`⏰ Timeout: Request took longer than 10 seconds`);
    } else if (error.response) {
      console.log(`📥 Server Error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.log(`🌐 Network Error: Could not connect to API`);
    } else {
      console.log(`❓ Error:`, error.message);
    }
    
    // Simulate error handling in UI
    console.log(`🔄 Fallback Actions (simulated):`);
    console.log(`   1. ⚠️  External API failed, continuing locally...`);
    console.log(`   2. 💾 Saving preferences locally only...`);
    console.log(`   3. 🔍 Using local recipe recommendations...`);
    console.log(`   4. 🚀 Still redirecting to /recipes page...`);
    
    return {
      success: false,
      error: error.message
    };
  }
}

async function runPreferenceDemo() {
  console.log('🎭 AmazonMeal Preference Integration Demo');
  console.log('=' .repeat(60));
  console.log('🔗 External API:', PREFERENCE_API_URL);
  console.log('📱 Simulating user preference submissions from UI...');
  
  const results = [];
  
  for (const scenario of userScenarios) {
    const result = await simulatePreferenceSubmission(scenario);
    results.push({
      scenario: scenario.name,
      ...result
    });
    
    // Wait between requests
    console.log(`⏳ Waiting 2 seconds before next test...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 INTEGRATION DEMO SUMMARY');
  console.log('=' .repeat(60));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful API calls: ${successful}/${results.length}`);
  console.log(`❌ Failed API calls: ${failed}/${results.length}`);
  
  if (successful > 0) {
    const avgResponseTime = results
      .filter(r => r.responseTime)
      .reduce((sum, r) => sum + r.responseTime, 0) / successful;
    
    console.log(`⚡ Average response time: ${Math.round(avgResponseTime)}ms`);
  }
  
  console.log('\n🎯 Integration Status:');
  if (successful === results.length) {
    console.log('🟢 EXCELLENT: All preference submissions working perfectly!');
    console.log('✨ Users will have a seamless experience in the PreferencesPage');
  } else if (successful > 0) {
    console.log('🟡 GOOD: Most submissions working, with graceful fallback for failures');
    console.log('✨ Users will still get a good experience even if API is intermittent');
  } else {
    console.log('🔴 ATTENTION: External API not responding');
    console.log('✨ Users will still work with local preferences only');
  }
  
  console.log('\n📋 User Experience Flow:');
  console.log('1. 👤 User completes 7-step preference form');
  console.log('2. 🔄 Clicks "Get My Recipes" button');
  console.log('3. 📡 App submits preferences to external API');
  console.log('4. 💾 App saves preferences locally (always)');
  console.log('5. 🔍 App generates personalized recommendations');
  console.log('6. 🚀 User redirected to recipes page with results');
  
  console.log('\n🛡️  Error Handling:');
  console.log('• If external API fails: Continue with local processing');
  console.log('• If local API fails: Still save preferences in memory');
  console.log('• User always gets to recipes page with recommendations');
  
  console.log('\n🧪 To test manually:');
  console.log('1. npm run dev');
  console.log('2. Navigate to /preferences');
  console.log('3. Complete the 7-step form');
  console.log('4. Click "Get My Recipes"');
  console.log('5. Check browser console for API call logs');
}

// Run demo if script is executed directly
if (require.main === module) {
  runPreferenceDemo().catch(console.error);
}

module.exports = {
  simulatePreferenceSubmission,
  runPreferenceDemo,
  userScenarios
};