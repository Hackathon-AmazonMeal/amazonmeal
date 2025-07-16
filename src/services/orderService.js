import axios from 'axios';

const ORDER_PROCESSING_API = 'https://order-processing-backend.vercel.app/orders';

/**
 * Service for handling external order processing
 */
class OrderService {
  /**
   * Process order with external API
   * @param {Object} orderData - Order information
   * @param {string} orderData.orderId - Unique order ID
   * @param {string} orderData.email - Customer email
   * @param {string} orderData.customerName - Customer name
   * @param {Array} orderData.items - Cart items
   * @param {number} orderData.totalAmount - Total order amount
   * @param {string} orderData.recipeImageLink - Recipe image URL (optional)
   * @returns {Promise<Object>} API response
   */
  async processOrder(orderData) {
    try {
      // Validate order data first
      const validation = this.validateOrderData(orderData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Validate and prepare items
      const itemValidation = this.validateAndPrepareItems(orderData.items);
      if (!itemValidation.isValid) {
        throw new Error(`Item validation failed: ${itemValidation.errors.join(', ')}`);
      }

      // Generate order ID if not provided
      const orderId = orderData.orderId || this.generateOrderId();
      
      // Default recipe image if not provided
      const recipeImageLink = orderData.recipeImageLink || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
      
      let requestPayload;
      const preparedItems = itemValidation.items;

      // Check if we have single or multiple products
      if (preparedItems.length === 1) {
        // Single product format
        const item = preparedItems[0];
        requestPayload = {
          order_id: orderId,
          customer_name: orderData.customerName,
          email: orderData.email,
          product: item.name,
          amount: parseFloat(orderData.totalAmount.toFixed(2)),
          quantity: item.quantity,
          recipe_image_link: recipeImageLink
        };
      } else {
        // Multiple products format
        const products = preparedItems.map(item => ({
          name: item.name,
          cost: parseFloat(item.price.toFixed(2)),
          quantity: item.quantity
        }));

        requestPayload = {
          order_id: orderId,
          customer_name: orderData.customerName,
          email: orderData.email,
          recipe_image_link: recipeImageLink,
          products: products
        };
      }

      console.log('Processing order with external API:', requestPayload);

      const response = await axios.post(ORDER_PROCESSING_API, requestPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Order processed successfully:', response.data);
      return {
        success: true,
        data: response.data,
        orderId: orderId,
      };
    } catch (error) {
      console.error('Order processing failed:', error);
      
      // Handle different types of errors
      if (error.code === 'ECONNABORTED') {
        throw new Error('Order processing timed out. Please try again.');
      } else if (error.response) {
        // Server responded with error status
        throw new Error(`Order processing failed: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Network error
        throw new Error('Unable to connect to order processing service. Please check your internet connection.');
      } else {
        // Other error
        throw new Error(`Order processing failed: ${error.message}`);
      }
    }
  }

  /**
   * Generate a unique order ID
   * @returns {string} Unique order ID
   */
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `LIVE-${timestamp}-${random}`;
  }

  /**
   * Validate and prepare cart items for API payload
   * @param {Array} items - Cart items to validate
   * @returns {Object} Validation result with prepared items
   */
  validateAndPrepareItems(items) {
    const errors = [];
    const preparedItems = [];

    if (!Array.isArray(items) || items.length === 0) {
      errors.push('At least one item is required');
      return { isValid: false, errors, items: [] };
    }

    items.forEach((item, index) => {
      const itemErrors = [];

      // Validate item name
      if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
        itemErrors.push(`Item ${index + 1}: Name is required`);
      }

      // Validate quantity
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        itemErrors.push(`Item ${index + 1}: Valid quantity is required`);
      }

      // Validate price (use default if not provided)
      const price = item.price && typeof item.price === 'number' && item.price > 0 
        ? item.price 
        : 2.50; // Default price

      if (itemErrors.length === 0) {
        preparedItems.push({
          name: item.name.trim(),
          quantity: item.quantity,
          price: price,
          unit: item.unit || 'item'
        });
      }

      errors.push(...itemErrors);
    });

    return {
      isValid: errors.length === 0,
      errors,
      items: preparedItems
    };
  }
  validateOrderData(orderData) {
    const errors = [];

    if (!orderData.email || !this.isValidEmail(orderData.email)) {
      errors.push('Valid email address is required');
    }

    if (!orderData.customerName || orderData.customerName.trim().length < 2) {
      errors.push('Customer name is required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      errors.push('Valid total amount is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Format cart items for display
   * @param {Array} items - Cart items
   * @returns {string} Formatted items string
   */
  formatItemsForDisplay(items) {
    return items
      .map(item => `${item.name} (${item.quantity} ${item.unit}) - $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');
  }
}

// Create singleton instance
const orderService = new OrderService();

// Export singleton instance
export default orderService;
