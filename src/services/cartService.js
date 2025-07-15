import { apiClient, API_ENDPOINTS, USE_MOCK_DATA, createApiResponse } from './api';

class CartService {
  // Save cart to server
  async saveCart(userId, cartData) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return createApiResponse(cartData, true, 'Cart saved successfully');
    }

    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CART}/${userId}`, cartData);
      return response;
    } catch (error) {
      console.error('Failed to save cart:', error);
      throw new Error('Failed to save cart. Please try again.');
    }
  }

  // Load cart from server
  async loadCart(userId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return createApiResponse(null, true, 'No saved cart found');
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CART}/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to load cart:', error);
      throw new Error('Failed to load cart. Please try again.');
    }
  }

  // Process checkout
  async processCheckout(userId, orderData) {
    if (USE_MOCK_DATA) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order = {
        id: Date.now().toString(),
        userId,
        ...orderData,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      };
      
      return createApiResponse(order, true, 'Order placed successfully');
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.CHECKOUT, {
        userId,
        ...orderData,
      });
      return response;
    } catch (error) {
      console.error('Failed to process checkout:', error);
      throw new Error('Failed to process order. Please try again.');
    }
  }

  // Get order history
  async getOrderHistory(userId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Return empty order history for mock
      return createApiResponse([], true, 'Order history retrieved');
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDER_HISTORY}/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to get order history:', error);
      throw new Error('Failed to load order history. Please try again.');
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const mockOrder = {
        id: orderId,
        status: 'delivered',
        orderDate: new Date().toISOString(),
        items: [],
        total: 0,
      };
      return createApiResponse(mockOrder, true, 'Order found');
    }

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${orderId}`);
      return response;
    } catch (error) {
      console.error('Failed to get order:', error);
      throw new Error('Failed to load order details. Please try again.');
    }
  }

  // Process order after successful fulfillment
  async processOrder(orderId) {
    try {
      const response = await fetch(`https://order-processing-backend.vercel.app/orders/${orderId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Order processing failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Order processed successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to process order:', error);
      throw new Error('Failed to process order. Please try again.');
    }
  }

  // Calculate shipping cost
  calculateShipping(items, location = 'default') {
    // Mock shipping calculation
    const baseShipping = 5.99;
    const freeShippingThreshold = 35.00;
    
    const subtotal = items.reduce((total, item) => {
      return total + (item.price || 2.50) * item.quantity;
    }, 0);

    if (subtotal >= freeShippingThreshold) {
      return 0;
    }

    return baseShipping;
  }

  // Calculate tax
  calculateTax(subtotal, location = 'default') {
    // Mock tax calculation (8.5% default)
    const taxRate = 0.085;
    return subtotal * taxRate;
  }

  // Calculate total
  calculateTotal(items, location = 'default') {
    const subtotal = items.reduce((total, item) => {
      return total + (item.price || 2.50) * item.quantity;
    }, 0);

    const shipping = this.calculateShipping(items, location);
    const tax = this.calculateTax(subtotal, location);

    return {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: subtotal + shipping + tax,
    };
  }
}

// Create and export service instance
export const cartService = new CartService();
export default cartService;
