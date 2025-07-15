const axios = require('axios');

class APICallTracker {
  constructor() {
    this.calls = [];
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      (config) => {
        if (config.url && config.url.includes('user-ms-iimt.vercel.app')) {
          const callId = Date.now() + Math.random().toString(36).substr(2, 9);
          config.metadata = { callId, startTime: Date.now() };
          
          console.log(`\n🚀 [${callId}] OUTGOING EXTERNAL API CALL`);
          console.log(`📍 URL: ${config.url}`);
          console.log(`📤 Method: ${config.method?.toUpperCase()}`);
          console.log(`📦 Data:`, JSON.stringify(config.data, null, 2));
          console.log(`⏰ Started: ${new Date().toISOString()}`);
          
          this.calls.push({
            id: callId,
            url: config.url,
            method: config.method,
            data: config.data,
            startTime: Date.now(),
            status: 'pending'
          });
        }
        return config;
      },
      (error) => {
        console.log('❌ Request setup error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axios.interceptors.response.use(
      (response) => {
        if (response.config.metadata) {
          const { callId, startTime } = response.config.metadata;
          const duration = Date.now() - startTime;
          
          console.log(`\n✅ [${callId}] EXTERNAL API SUCCESS`);
          console.log(`📊 Status: ${response.status} ${response.statusText}`);
          console.log(`📥 Response:`, JSON.stringify(response.data, null, 2));
          console.log(`⏱️  Duration: ${duration}ms`);
          console.log(`🏁 Completed: ${new Date().toISOString()}`);
          
          // Update call record
          const call = this.calls.find(c => c.id === callId);
          if (call) {
            call.status = 'success';
            call.response = response.data;
            call.duration = duration;
            call.statusCode = response.status;
          }
        }
        return response;
      },
      (error) => {
        if (error.config?.metadata) {
          const { callId, startTime } = error.config.metadata;
          const duration = Date.now() - startTime;
          
          console.log(`\n❌ [${callId}] EXTERNAL API ERROR`);
          console.log(`🚨 Error: ${error.message}`);
          console.log(`⏱️  Duration: ${duration}ms`);
          
          if (error.response) {
            console.log(`📊 Status: ${error.response.status}`);
            console.log(`📥 Error Data:`, JSON.stringify(error.response.data, null, 2));
          }
          
          // Update call record
          const call = this.calls.find(c => c.id === callId);
          if (call) {
            call.status = 'error';
            call.error = error.message;
            call.duration = duration;
            call.statusCode = error.response?.status;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  getCallSummary() {
    const total = this.calls.length;
    const successful = this.calls.filter(c => c.status === 'success').length;
    const failed = this.calls.filter(c => c.status === 'error').length;
    const pending = this.calls.filter(c => c.status === 'pending').length;
    
    console.log('\n📊 EXTERNAL API CALL SUMMARY:');
    console.log(`📈 Total Calls: ${total}`);
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏳ Pending: ${pending}`);
    
    if (total > 0) {
      const avgDuration = this.calls
        .filter(c => c.duration)
        .reduce((sum, c) => sum + c.duration, 0) / this.calls.filter(c => c.duration).length;
      console.log(`⏱️  Average Duration: ${avgDuration?.toFixed(0)}ms`);
    }
    
    return { total, successful, failed, pending };
  }

  getLastCall() {
    return this.calls[this.calls.length - 1];
  }
}

// Create global tracker
const tracker = new APICallTracker();

// Export for use in other modules
module.exports = tracker;

// If run directly, start the server with tracking
if (require.main === module) {
  console.log('🔍 Starting server with comprehensive API call tracking...\n');
  
  // Show summary every 30 seconds
  setInterval(() => {
    if (tracker.calls.length > 0) {
      tracker.getCallSummary();
    }
  }, 30000);
  
  require('./server.js');
}
