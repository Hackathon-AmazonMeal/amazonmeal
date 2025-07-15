const axios = require('axios');

// Test the order processing API
async function testOrderProcessing() {
  console.log('🧪 Testing Order Processing API...\n');

  const testOrder = {
    order_id: `TEST-${Date.now()}-ABC123`,
    email: 'homeayush79@gmail.com',
    product: 'Fresh Tomatoes',
    quantity: 3,
    amount: 24.99,
    customer_name: 'Chef Ayush'
  };

  try {
    console.log('📤 Sending test order:', JSON.stringify(testOrder, null, 2));
    
    const response = await axios.post(
      'https://order-processing-backend.vercel.app/orders',
      testOrder,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ Order processed successfully!');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    console.log('📊 Status:', response.status);
    
    return true;
  } catch (error) {
    console.error('❌ Order processing failed:');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('Network error - no response received');
      console.error('Request config:', error.config);
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

// Test our order service
async function testOrderService() {
  console.log('\n🧪 Testing Local Order Service...\n');
  
  // Import our order service
  const orderService = require('./src/services/orderService.js');
  
  const testOrderData = {
    email: 'homeayush79@gmail.com',
    customerName: 'Chef Ayush',
    items: [
      { id: 1, name: 'Fresh Tomatoes', quantity: 2, unit: 'lbs', price: 3.99 },
      { id: 2, name: 'Mozzarella Cheese', quantity: 1, unit: 'package', price: 5.99 }
    ],
    totalAmount: 13.97
  };

  try {
    console.log('📤 Processing order with local service...');
    const result = await orderService.processOrder(testOrderData);
    
    if (result.success) {
      console.log('✅ Local order service working!');
      console.log('📋 Order ID:', result.orderId);
      console.log('📥 Response:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Local order service failed');
    }
    
    return result.success;
  } catch (error) {
    console.error('❌ Local order service error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Order Processing Tests\n');
  
  const directApiTest = await testOrderProcessing();
  const localServiceTest = await testOrderService();
  
  console.log('\n📊 Test Results:');
  console.log(`Direct API Test: ${directApiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Local Service Test: ${localServiceTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (directApiTest && localServiceTest) {
    console.log('\n🎉 All tests passed! Order processing should work correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
}

runTests().catch(console.error);
