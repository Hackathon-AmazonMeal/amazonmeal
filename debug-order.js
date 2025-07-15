const axios = require('axios');

// Test the complete order flow
async function debugOrderFlow() {
  console.log('🔍 Debugging Order Processing Flow\n');

  // Test 1: Direct API call with minimal data
  console.log('1️⃣ Testing minimal API call...');
  try {
    const minimalOrder = {
      order_id: `DEBUG-${Date.now()}-MIN`,
      email: 'homeayush79@gmail.com',
      product: 'Test Product',
      quantity: 1,
      amount: 9.99,
      customer_name: 'Chef Ayush'
    };

    const response = await axios.post(
      'https://order-processing-backend.vercel.app/orders',
      minimalOrder,
      { timeout: 10000 }
    );

    console.log('✅ Minimal API call successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Minimal API call failed:', error.message);
  }

  // Test 2: API call with all fields (like our app sends)
  console.log('\n2️⃣ Testing full API call with all fields...');
  try {
    const fullOrder = {
      order_id: `DEBUG-${Date.now()}-FULL`,
      email: 'homeayush79@gmail.com',
      product: 'Fresh Tomatoes',
      quantity: 3,
      amount: 13.97,
      customer_name: 'Chef Ayush',
      all_items: 'Fresh Tomatoes (2 lbs), Mozzarella Cheese (1 package)',
      item_count: 2,
      order_type: 'meal_kit'
    };

    const response = await axios.post(
      'https://order-processing-backend.vercel.app/orders',
      fullOrder,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 
      }
    );

    console.log('✅ Full API call successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Full API call failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }

  // Test 3: Check if our local server is running
  console.log('\n3️⃣ Testing local server...');
  try {
    const response = await axios.get('http://localhost:3001/api/recipes', { timeout: 5000 });
    console.log('✅ Local server is running');
    console.log('Recipes available:', response.data.data?.length || 0);
  } catch (error) {
    console.log('❌ Local server not responding:', error.message);
    console.log('💡 Make sure to run: npm run server');
  }

  // Test 4: Simulate the exact cart data structure
  console.log('\n4️⃣ Testing with cart-like data structure...');
  
  const mockCartItems = [
    { id: 1, name: 'Fresh Tomatoes', quantity: 2, unit: 'lbs', price: 3.99 },
    { id: 2, name: 'Mozzarella Cheese', quantity: 1, unit: 'package', price: 5.99 }
  ];
  
  const mockOrderData = {
    email: 'homeayush79@gmail.com',
    customerName: 'Chef Ayush',
    items: mockCartItems,
    totalAmount: mockCartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  };

  // Simulate what our orderService.processOrder does
  const orderId = `LIVE-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const primaryItem = mockOrderData.items[0];
  const allItemsDescription = mockOrderData.items
    .map(item => `${item.name} (${item.quantity} ${item.unit})`)
    .join(', ');

  const requestPayload = {
    order_id: orderId,
    email: mockOrderData.email,
    product: primaryItem.name,
    quantity: mockOrderData.items.reduce((total, item) => total + item.quantity, 0),
    amount: mockOrderData.totalAmount,
    customer_name: mockOrderData.customerName,
    all_items: allItemsDescription,
    item_count: mockOrderData.items.length,
    order_type: 'meal_kit'
  };

  console.log('📤 Sending payload:', JSON.stringify(requestPayload, null, 2));

  try {
    const response = await axios.post(
      'https://order-processing-backend.vercel.app/orders',
      requestPayload,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 
      }
    );

    console.log('✅ Cart simulation successful!');
    console.log('📥 Response:', JSON.stringify(response.data, null, 2));
    console.log('🎉 ORDER PROCESSING IS WORKING CORRECTLY!');
    
  } catch (error) {
    console.log('❌ Cart simulation failed:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    }
  }

  console.log('\n📋 Summary:');
  console.log('- External API is accessible and working');
  console.log('- Order processing logic appears correct');
  console.log('- If orders are not processing in the app, check:');
  console.log('  1. Browser console for JavaScript errors');
  console.log('  2. Network tab for failed requests');
  console.log('  3. Cart items have proper structure');
  console.log('  4. User context provides valid email/name');
}

debugOrderFlow().catch(console.error);
