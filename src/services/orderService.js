import axios from 'axios';

const ORDER_PROCESSING_API = 'https://order-processing-backend.vercel.app/orders';

/**
 * Service for handling external order processing
 */
class OrderService {
  /** */
  /**
   * Process order with external API and fetch YouTube video for recipe
   * @param {Object} orderData - Order information
   * @param {string} orderData.orderId - Unique order ID
   * @param {string} orderData.email - Customer email
   * @param {string} orderData.customerName - Customer name
   * @param {Array} orderData.items - Cart items
   * @param {number} orderData.totalAmount - Total order amount
   * @param {Object} orderData.recipe - Recipe information (optional)
   * @returns {Promise<Object>} API response
   */
  async processOrder(orderData) {
    try {
      // console.log("Processing order with recipe:", orderData.recipe);
      // Generate order ID if not provided
      const orderId = orderData.orderId || this.generateOrderId();
      
      // Get recipe name from orderData - prioritize the recipe object
      let recipeName;
      
      // If orderData has recipe information, use that
      if (orderData.recipe && orderData.recipe.name) {
        recipeName = orderData.recipe.name;
      } 
      // If recipe has title instead of name
      else if (orderData.recipe && orderData.recipe.title) {
        recipeName = orderData.recipe.title;
      }
      // Otherwise try to extract recipe name from the first item
      else if (orderData.items && orderData.items.length > 0 && orderData.items[0].recipeName) {
        recipeName = orderData.items[0].recipeName;
      }
      // Last resort fallback
      else {
        recipeName = "healthy meal recipe";
      }
      
      // // console.log("Fetching YouTube video for recipe:", recipeName);
      
      // Call YouTube API with the recipe name
      const youtube = await axios.post(
        'https://recipe-generator-model-58mk.vercel.app/youtube',
        [recipeName],
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      // // console.log("YouTube API response:", youtube.data);
      // // console.log("Order data:", orderData);

      // Get recipe image if available - prioritize the recipe object
      let recipeImageLink;
      console.log("**Order: ", orderData)
      
      // If orderData has recipe with image, use that
      if (orderData.recipe && orderData.recipe.image) {
        recipeImageLink = orderData.recipe.image;
        // console.log("Using recipe image from context:", recipeImageLink);
      }
      // Otherwise use a default image only as last resort
      else {
        recipeImageLink = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
        // console.log("Using default recipe image");
      }
      
      // Get YouTube link from API response - prioritize the API response
      let youtubeLink;
      
      // If YouTube API returned a link for this recipe, use that
      if (youtube.data && youtube.data[recipeName] && youtube.data[recipeName] != 'No suitable video found') {
        youtubeLink = youtube.data[recipeName];
      }
      // Otherwise use a default link only as last resort
      else {
        youtubeLink = "https://www.dailymotion.com/video/x8n3mnb";
      }
      
      // // console.log("Using recipe image:", recipeImageLink);
      // // console.log("Using YouTube link:", youtubeLink);
      // console.log(orderData.recipe.instructions)
      
      const requestPayload = {
        order_id: orderId,
        email: orderData.email,
        customer_name: orderData.customerName,
        recipe_image_link: recipeImageLink,
        youtube_link: youtubeLink,
        recipe_text: orderData.recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n'),
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

      // // console.log('Order processed successfully:', response.data);
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
