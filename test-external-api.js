#!/usr/bin/env node

/**
 * Test script to verify external API integration
 * Run with: node test-external-api.js
 */

const axios = require('axios');

const ORDER_PROCESSING_API = 'https://order-processing-backend.vercel.app/orders';

async function testExternalAPI() {
  console.log('🧪 Testing External Order Processing API...\n');

  const testOrderData = {
    order_id: `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    email: 'homeayush79@gmail.com',
    product: 'AmazonMeal Test Order',
    quantity: 3,
    amount: 45.99,
    customer_name: 'Chef Ayush',
    recipe_image_link: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    all_items: 'Organic Chicken Breast (2 lbs), Fresh Broccoli (1 bunch), Jasmine Rice (1 bag)',
    item_count: 3,
    order_type: 'meal_kit'
  };

  try {
    console.log('📤 Sending test order:', JSON.stringify(testOrderData, null, 2));
    console.log('\n⏳ Processing...\n');

    const response = await axios.post(ORDER_PROCESSING_API, testOrderData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('✅ SUCCESS! External API Response:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ FAILED! External API Error:');
    
    if (error.code === 'ECONNABORTED') {
      console.error('- Request timed out');
    } else if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Data:', error.response.data);
    } else if (error.request) {
      console.error('- Network error:', error.message);
    } else {
      console.error('- Error:', error.message);
    }
    
    return false;
  }
}

// Run the test
testExternalAPI()
  .then(success => {
    console.log('\n' + '='.repeat(50));
    if (success) {
      console.log('🎉 External API integration is working correctly!');
      console.log('✅ CheckoutSuccess component will be able to process orders');
    } else {
      console.log('⚠️  External API integration has issues');
      console.log('❗ CheckoutSuccess component may show errors');
    }
    console.log('='.repeat(50));
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test script failed:', error);
    process.exit(1);
  });
