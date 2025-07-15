// Simple test file to verify order service functionality
// This is for development testing only

import orderService from './orderService';

// Mock cart items for testing
const mockCartItems = [
  {
    id: 'tomato-1',
    name: 'Fresh Tomatoes',
    quantity: 2,
    unit: 'lbs',
    price: 3.99
  },
  {
    id: 'cheese-1',
    name: 'Mozzarella Cheese',
    quantity: 1,
    unit: 'package',
    price: 5.49
  }
];

const mockOrderData = {
  email: 'homeayush79@gmail.com',
  customerName: 'Chef Ayush',
  items: mockCartItems,
  totalAmount: 13.47
};

// Test function (can be called from browser console)
window.testOrderService = async () => {
  try {
    console.log('Testing order service...');
    console.log('Order data:', mockOrderData);
    
    const result = await orderService.processOrder(mockOrderData);
    console.log('Order processed successfully:', result);
    return result;
  } catch (error) {
    console.error('Order processing failed:', error);
    throw error;
  }
};

// Test validation
window.testOrderValidation = () => {
  console.log('Testing order validation...');
  
  // Valid data
  const validResult = orderService.validateOrderData(mockOrderData);
  console.log('Valid data result:', validResult);
  
  // Invalid data
  const invalidData = {
    email: 'invalid-email',
    customerName: '',
    items: [],
    totalAmount: -5
  };
  
  const invalidResult = orderService.validateOrderData(invalidData);
  console.log('Invalid data result:', invalidResult);
};

console.log('Order service test functions loaded. Use:');
console.log('- testOrderService() to test API call');
console.log('- testOrderValidation() to test validation');

export { mockCartItems, mockOrderData };
