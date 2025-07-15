#!/usr/bin/env node

/**
 * Demo script showing AmazonMeal external API integration
 * This simulates the complete flow from cart to checkout success
 */

const axios = require('axios');

const ORDER_PROCESSING_API = 'https://order-processing-backend.vercel.app/orders';

// Simulate cart data
const mockCartData = {
  items: [
    { name: 'Organic Chicken Breast', quantity: 2, unit: 'lbs', price: 12.99 },
    { name: 'Fresh Broccoli', quantity: 1, unit: 'bunch', price: 3.49 },
    { name: 'Jasmine Rice', quantity: 1, unit: 'bag', price: 4.99 }
  ],
  customerInfo: {
    name: 'Chef Ayush',
    email: 'homeayush79@gmail.com'
  }
};

// Calculate total
const cartTotal = mockCartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);

console.log('🛒 AmazonMeal External API Integration Demo');
console.log('=' .repeat(50));

console.log('\n📋 Cart Summary:');
mockCartData.items.forEach(item => {
  console.log(`  • ${item.name}: ${item.quantity} ${item.unit} @ $${item.price} = $${(item.price * item.quantity).toFixed(2)}`);
});
console.log(`  💰 Total: $${cartTotal.toFixed(2)}`);

console.log('\n👤 Customer Info:');
console.log(`  • Name: ${mockCartData.customerInfo.name}`);
console.log(`  • Email: ${mockCartData.customerInfo.email}`);

async function simulateCheckoutFlow() {
  console.log('\n🚀 Starting Checkout Flow...');
  
  try {
    // Step 1: User clicks "Proceed to Checkout" in Cart component
    console.log('\n1️⃣ Cart Component: Processing checkout...');
    
    const orderId = `DEMO-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const orderPayload = {
      order_id: orderId,
      email: mockCartData.customerInfo.email,
      product: mockCartData.items[0].name, // Primary product
      quantity: mockCartData.items.reduce((total, item) => total + item.quantity, 0),
      amount: cartTotal,
      customer_name: mockCartData.customerInfo.name,
      recipe_image_link: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      all_items: mockCartData.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', '),
      item_count: mockCartData.items.length,
      order_type: 'meal_kit'
    };

    console.log('   📤 Calling external API...');
    
    const response = await axios.post(ORDER_PROCESSING_API, orderPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    console.log('   ✅ External API Success!');
    console.log(`   📋 Order ID: ${response.data.order.order_id}`);
    console.log(`   💵 Total Charged: $${response.data.order.bill.total}`);
    
    // Step 2: Navigate to CheckoutSuccess
    console.log('\n2️⃣ Navigating to CheckoutSuccess page...');
    console.log('   🔄 Passing order data via React Router state');
    
    const routerState = {
      orderId: response.data.order.order_id,
      customerInfo: mockCartData.customerInfo,
      orderTotal: cartTotal,
      items: mockCartData.items,
      externalApiCalled: true,
      externalOrderId: response.data.order.order_id
    };
    
    // Step 3: CheckoutSuccess component loads
    console.log('\n3️⃣ CheckoutSuccess Component: Loading...');
    console.log('   ✅ External API already called - skipping duplicate call');
    console.log('   🎉 Showing success message to user');
    console.log('   ⏰ Auto-redirect to dashboard in 10 seconds');
    
    console.log('\n🎯 Integration Flow Complete!');
    console.log('\n📊 Summary:');
    console.log(`   • Order processed successfully`);
    console.log(`   • External API called once (no duplicates)`);
    console.log(`   • User sees confirmation immediately`);
    console.log(`   • Order data preserved throughout flow`);
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Checkout Flow Failed:');
    
    if (error.response) {
      console.error(`   • API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error(`   • Network Error: ${error.message}`);
    } else {
      console.error(`   • Error: ${error.message}`);
    }
    
    console.log('\n🔄 Fallback Behavior:');
    console.log('   • CheckoutSuccess shows error message');
    console.log('   • User can still navigate the app');
    console.log('   • Order data is preserved for manual processing');
    
    return false;
  }
}

// Alternative flow: Direct navigation to CheckoutSuccess
async function simulateDirectNavigation() {
  console.log('\n🔀 Alternative Flow: Direct Navigation to CheckoutSuccess');
  console.log('   (User navigates directly to /checkout/success with order data)');
  
  console.log('\n1️⃣ CheckoutSuccess Component: Loading...');
  console.log('   🔍 Checking if external API was already called...');
  console.log('   ❌ externalApiCalled = false');
  console.log('   🚀 Calling external API from CheckoutSuccess...');
  
  try {
    const orderId = `DIRECT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const orderPayload = {
      order_id: orderId,
      email: mockCartData.customerInfo.email,
      product: mockCartData.items[0].name,
      quantity: mockCartData.items.reduce((total, item) => total + item.quantity, 0),
      amount: cartTotal,
      customer_name: mockCartData.customerInfo.name,
      recipe_image_link: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      all_items: mockCartData.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', '),
      item_count: mockCartData.items.length,
      order_type: 'meal_kit'
    };

    const response = await axios.post(ORDER_PROCESSING_API, orderPayload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    console.log('   ✅ External API Success from CheckoutSuccess!');
    console.log(`   📋 Order ID: ${response.data.order.order_id}`);
    console.log('   🎉 Showing success message to user');
    
    return true;
    
  } catch (error) {
    console.error('   ❌ External API Failed from CheckoutSuccess');
    console.log('   ⚠️  Showing error message with fallback options');
    return false;
  }
}

// Run the demo
async function runDemo() {
  const normalFlow = await simulateCheckoutFlow();
  
  console.log('\n' + '='.repeat(50));
  
  const directFlow = await simulateDirectNavigation();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Demo Complete!');
  
  if (normalFlow && directFlow) {
    console.log('✅ Both integration flows working correctly');
  } else {
    console.log('⚠️  Some flows have issues - check error messages above');
  }
  
  console.log('\n💡 Key Features:');
  console.log('   • Robust error handling');
  console.log('   • No duplicate API calls');
  console.log('   • Graceful fallbacks');
  console.log('   • User-friendly messaging');
  console.log('   • Complete order data flow');
  
  console.log('\n🔗 Integration Points:');
  console.log('   • Cart.js: Initial order processing');
  console.log('   • CheckoutSuccess.js: Backup processing & confirmation');
  console.log('   • orderService.js: External API communication');
  
  process.exit(0);
}

runDemo().catch(error => {
  console.error('💥 Demo failed:', error);
  process.exit(1);
});
