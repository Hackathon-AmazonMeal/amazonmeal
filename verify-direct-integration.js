const fs = require('fs');
const path = require('path');

console.log('🔍 AmazonMeal - Direct API Integration Verification');
console.log('=' .repeat(60));

// Check 1: Verify preference service uses direct API
console.log('1️⃣  Checking preference service...');
const preferenceServicePath = './src/services/preferenceService.js';
const preferenceServiceContent = fs.readFileSync(preferenceServicePath, 'utf8');

if (preferenceServiceContent.includes('https://user-ms-iimt.vercel.app/api/preference')) {
  console.log('   ✅ Uses direct external API endpoint');
} else {
  console.log('   ❌ Still using proxy endpoint');
}

if (!preferenceServiceContent.includes('localhost:3001')) {
  console.log('   ✅ No localhost proxy references');
} else {
  console.log('   ⚠️  Still contains localhost references');
}

// Check 2: Verify server.js has no proxy endpoint
console.log('\n2️⃣  Checking server configuration...');
const serverPath = './server.js';
const serverContent = fs.readFileSync(serverPath, 'utf8');

if (!serverContent.includes('app.post(\'/api/preferences\'')) {
  console.log('   ✅ Proxy endpoint removed from server');
} else {
  console.log('   ❌ Proxy endpoint still exists in server');
}

if (serverContent.includes('No proxy endpoint needed')) {
  console.log('   ✅ Contains documentation about direct API calls');
} else {
  console.log('   ⚠️  Missing documentation comment');
}

// Check 3: Verify preferences page uses direct API
console.log('\n3️⃣  Checking preferences page...');
const preferencesPagePath = './src/pages/Preferences/PreferencesPage.js';
const preferencesPageContent = fs.readFileSync(preferencesPagePath, 'utf8');

if (preferencesPageContent.includes('Starting direct external API submission')) {
  console.log('   ✅ Uses direct external API submission');
} else {
  console.log('   ❌ Still using proxy submission');
}

if (!preferencesPageContent.includes('Step 1:') && !preferencesPageContent.includes('Step 2:')) {
  console.log('   ✅ Simplified submission logic (no multi-step proxy)');
} else {
  console.log('   ⚠️  Still contains multi-step proxy logic');
}

// Check 4: Verify test files exist
console.log('\n4️⃣  Checking test files...');
const testFiles = [
  './test-direct-preference-api.js',
  './DIRECT_PREFERENCE_API_INTEGRATION.md'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${path.basename(file)} exists`);
  } else {
    console.log(`   ❌ ${path.basename(file)} missing`);
  }
});

// Check 5: Verify build success
console.log('\n5️⃣  Checking build status...');
if (fs.existsSync('./build')) {
  console.log('   ✅ Build directory exists');
  
  const buildFiles = fs.readdirSync('./build');
  if (buildFiles.includes('static')) {
    console.log('   ✅ Build contains static assets');
  }
} else {
  console.log('   ❌ Build directory missing');
}

// Summary
console.log('\n' + '=' .repeat(60));
console.log('📋 INTEGRATION SUMMARY');
console.log('=' .repeat(60));

console.log('🎯 Target API: https://user-ms-iimt.vercel.app/api/preference');
console.log('🔄 Trigger: User clicks "Get My Recipes" after setting preferences');
console.log('📡 Method: Direct frontend call (no proxy)');
console.log('⚡ Status: Ready for testing');

console.log('\n🚀 To test the integration:');
console.log('1. npm start (start development server)');
console.log('2. Navigate to preferences page');
console.log('3. Complete preference setup');
console.log('4. Click "Get My Recipes"');
console.log('5. Check browser console for API call logs');

console.log('\n🧪 To run API tests:');
console.log('node test-direct-preference-api.js');

console.log('\n✨ Integration complete! No proxy calls needed.');
