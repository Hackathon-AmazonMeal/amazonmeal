/**
 * Test script to demonstrate both single and multiple product payload formats
 * for the external order processing API
 */

import orderService from './src/services/orderService.js';

// Test data for single product order
const singleProductOrder = {
  orderId: 'TEST-SINGLE-001',
  customerName: 'John Doe',
  email: 'john.doe@example.com',
  items: [
    {
      name: 'Pizza Kit',
      quantity: 1,
      price: 24.99,
      unit: 'kit'
    }
  ],
  totalAmount: 24.99,
  recipeImageLink: 'https://example.com/pizza.jpg'
};

// Test data for multiple products order
const multipleProductsOrder = {
  orderId: 'TEST-MULTI-002',
  customerName: 'Jane Smith',
  email: 'jane.smith@example.com',
  items: [
    {
      name: 'Burger Kit',
      quantity: 2,
      price: 19.99,
      unit: 'kit'
    },
    {
      name: 'Fries Kit',
      quantity: 1,
      price: 9.99,
      unit: 'kit'
    }
  ],
  totalAmount: 49.97, // (19.99 * 2) + 9.99
  recipeImageLink: 'https://example.com/combo.jpg'
};

/**
 * Test single product order format
 */
async function testSingleProductOrder() {
  console.log('\n=== Testing Single Product Order ===');
  console.log('Expected payload format:');
  console.log(JSON.stringify({
    order_id: "TEST-SINGLE-001",
    customer_name: "John Doe",
    email: "john.doe@example.com",
    product: "Pizza Kit",
    amount: 24.99,
    quantity: 1,
    recipe_image_link: "https://example.com/pizza.jpg"
  }, null, 2));

  try {
    const result = await orderService.processOrder(singleProductOrder);
    console.log('\n✅ Single product order processed successfully:', result);
  } catch (error) {
    console.error('\n❌ Single product order failed:', error.message);
  }
}

/**
 * Test multiple products order format
 */
async function testMultipleProductsOrder() {
  console.log('\n=== Testing Multiple Products Order ===');
  console.log('Expected payload format:');
  console.log(JSON.stringify({
    order_id: "TEST-MULTI-002",
    customer_name: "Jane Smith",
    email: "jane.smith@example.com",
    recipe_image_link: "https://example.com/combo.jpg",
    products: [
      { name: "Burger Kit", cost: 19.99, quantity: 2 },
      { name: "Fries Kit", cost: 9.99, quantity: 1 }
    ]
  }, null, 2));

  try {
    const result = await orderService.processOrder(multipleProductsOrder);
    console.log('\n✅ Multiple products order processed successfully:', result);
  } catch (error) {
    console.error('\n❌ Multiple products order failed:', error.message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Order Payload Format Tests...');
  
  await testSingleProductOrder();
  await testMultipleProductsOrder();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testSingleProductOrder, testMultipleProductsOrder, runTests };
