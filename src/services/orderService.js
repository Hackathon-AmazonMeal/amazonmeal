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
   * @returns {Promise<Object>} API response
   */

  



  async processOrder(orderData) {
    try {
      // Generate order ID if not provided
      const orderId = orderData.orderId || this.generateOrderId();
      
        
      const userPref = await axios.get(`https://user-ms-iimt.vercel.app/preference/${orderData.email}`);
      const recipeResponse = await axios.post(
            'https://recipe-generator-model-58mk-git-main-sanjays-projects-5366cb8a.vercel.app/recipes',
            {
                dietType: userPref.dietType || "eggetarian",
                healthGoals: userPref.healthGoals || "[muscle-gain,maintain-weight,diabetes-management]",
                meal_type: userPref.mealType || "lunch",
                cookingTime: userPref.cookingTime || "30min",
                cookingMethod: userPref.cookingMethod || "slow-cook",
                numberOfPerson: userPref.numberOfPerson || "2",
                allergies: userPref.allergies || "[soy,shellfish,wheat]"
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );
        // Take the first recipe
        const recipe = recipeResponse.data[0];
            
      
      

      console.log("item: ", orderData)

      const requestPayload = {
        order_id: orderId,
        email: orderData.email,
        customer_name: orderData.customerName,
        recipe_image_link: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=40', // Default recipe image
        youtube_link: recipe.youtube, // Default recipe video
        recipe_text: recipe.procedure,
        products: orderData.items.map((item) => {
          return {
            name: item.name,
            cost: item.price,
            quantity: item.quantity
          }
        }),
      };

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
   * Validate order data before processing
   * @param {Object} orderData - Order data to validate
   * @returns {Object} Validation result
   */
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
