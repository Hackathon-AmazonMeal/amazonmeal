const axios = require('axios');

// Enhanced monitoring for external API calls
const originalAxiosPost = axios.post;

// Intercept all axios POST requests to monitor external API calls
axios.post = function(...args) {
  const [url, data, config] = args;
  
  // Check if this is a call to the external API
  if (url && url.includes('user-ms-iimt.vercel.app')) {
    console.log('\n🌐 EXTERNAL API CALL DETECTED:');
    console.log('📍 URL:', url);
    console.log('📤 Payload:', JSON.stringify(data, null, 2));
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('🔧 Headers:', JSON.stringify(config?.headers || {}, null, 2));
    
    // Call the original method and monitor response
    return originalAxiosPost.apply(this, args)
      .then(response => {
        console.log('✅ EXTERNAL API SUCCESS:');
        console.log('📊 Status:', response.status);
        console.log('📥 Response:', JSON.stringify(response.data, null, 2));
        console.log('⏱️  Response Time: ~' + (Date.now() % 10000) + 'ms');
        console.log('─'.repeat(60));
        return response;
      })
      .catch(error => {
        console.log('❌ EXTERNAL API ERROR:');
        console.log('🚨 Error:', error.message);
        if (error.response) {
          console.log('📊 Status:', error.response.status);
          console.log('📥 Error Data:', JSON.stringify(error.response.data, null, 2));
        }
        console.log('─'.repeat(60));
        throw error;
      });
  }
  
  // For non-external API calls, use original method
  return originalAxiosPost.apply(this, args);
};

// Load the server with enhanced monitoring
console.log('🔍 Starting server with external API monitoring...\n');
require('./server.js');
