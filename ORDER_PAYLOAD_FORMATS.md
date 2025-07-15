# Order Processing API Payload Formats

This document describes the two payload formats supported by the external order processing API at `https://order-processing-backend.vercel.app/orders`.

## Overview

The AmazonMeal application automatically detects the number of items in a cart and sends the appropriate payload format:

- **Single Product Format**: Used when the cart contains exactly 1 unique item
- **Multiple Products Format**: Used when the cart contains 2 or more unique items

## Single Product Format

Used when the order contains exactly one product type.

### Payload Structure

```json
{
  "order_id": "string",
  "customer_name": "string", 
  "email": "string",
  "product": "string",
  "amount": number,
  "quantity": number,
  "recipe_image_link": "string"
}
```

### Example

```json
{
  "order_id": "TEST-001",
  "customer_name": "Test User",
  "email": "test@example.com",
  "product": "Pizza Kit",
  "amount": 24.99,
  "quantity": 1,
  "recipe_image_link": "https://example.com/pizza.jpg"
}
```

### cURL Example

```bash
curl -X POST https://order-processing-backend.vercel.app/orders \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TEST-001",
    "customer_name": "Test User",
    "email": "test@example.com",
    "product": "Pizza Kit",
    "amount": 24.99,
    "quantity": 1,
    "recipe_image_link": "https://example.com/pizza.jpg"
  }'
```

## Multiple Products Format

Used when the order contains two or more different products.

### Payload Structure

```json
{
  "order_id": "string",
  "customer_name": "string",
  "email": "string", 
  "recipe_image_link": "string",
  "products": [
    {
      "name": "string",
      "cost": number,
      "quantity": number
    }
  ]
}
```

### Example

```json
{
  "order_id": "TEST-002",
  "customer_name": "Test User",
  "email": "test@example.com",
  "recipe_image_link": "https://example.com/combo.jpg",
  "products": [
    {"name": "Burger Kit", "cost": 19.99, "quantity": 2},
    {"name": "Fries Kit", "cost": 9.99, "quantity": 1}
  ]
}
```

### cURL Example

```bash
curl -X POST https://order-processing-backend.vercel.app/orders \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TEST-002",
    "customer_name": "Test User",
    "email": "test@example.com",
    "recipe_image_link": "https://example.com/combo.jpg",
    "products": [
      {"name": "Burger Kit", "cost": 19.99, "quantity": 2},
      {"name": "Fries Kit", "cost": 9.99, "quantity": 1}
    ]
  }'
```

## Implementation Details

### Automatic Format Detection

The `OrderService` class in `/src/services/orderService.js` automatically determines which format to use:

```javascript
// Check if we have single or multiple products
if (orderData.items.length === 1) {
  // Use single product format
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
  // Use multiple products format
  const products = orderData.items.map(item => ({
    name: item.name,
    cost: parseFloat((item.price || 2.50).toFixed(2)),
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
```

### Field Mappings

| AmazonMeal Field | Single Product API | Multiple Products API | Notes |
|------------------|--------------------|-----------------------|-------|
| `orderId` | `order_id` | `order_id` | Auto-generated if not provided |
| `customerName` | `customer_name` | `customer_name` | Required field |
| `email` | `email` | `email` | Required field |
| `recipeImageLink` | `recipe_image_link` | `recipe_image_link` | Default image if not provided |
| `items[0].name` | `product` | - | Only for single product |
| `totalAmount` | `amount` | - | Only for single product |
| `items[0].quantity` | `quantity` | - | Only for single product |
| `items[]` | - | `products[]` | Array for multiple products |

### Error Handling

The service includes comprehensive error handling for:

- **Network timeouts**: 10-second timeout with retry suggestions
- **Server errors**: HTTP status code handling with error messages
- **Validation errors**: Email format, required fields, item validation
- **Connection issues**: Network connectivity problems

### Testing

Use the provided test scripts to verify both formats:

```bash
# Test both formats
node test-external-api.js

# Test with detailed payload examples
node test-payload-formats.js
```

## Response Format

Both payload formats return the same response structure:

```json
{
  "success": true,
  "order_id": "string",
  "message": "Order processed successfully",
  "timestamp": "ISO 8601 date string"
}
```

## Best Practices

1. **Always validate order data** before sending to the API
2. **Use proper error handling** for network and server errors
3. **Include meaningful order IDs** for tracking purposes
4. **Provide recipe images** to enhance the user experience
5. **Test both formats** during development and deployment

## Integration Examples

### React Component Usage

```javascript
import orderService from '../services/orderService';

const handleCheckout = async (cartItems, customerInfo) => {
  try {
    const orderData = {
      customerName: customerInfo.name,
      email: customerInfo.email,
      items: cartItems,
      totalAmount: calculateTotal(cartItems),
      recipeImageLink: getRecipeImage(cartItems)
    };

    const result = await orderService.processOrder(orderData);
    
    if (result.success) {
      // Handle successful order
      console.log('Order processed:', result.orderId);
    }
  } catch (error) {
    // Handle error
    console.error('Order failed:', error.message);
  }
};
```

### Express.js Server Usage

```javascript
app.post('/api/checkout', async (req, res) => {
  try {
    const result = await orderService.processOrder(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
```

## Troubleshooting

### Common Issues

1. **Timeout errors**: Check network connectivity and API availability
2. **Validation errors**: Ensure all required fields are provided
3. **Format errors**: Verify payload structure matches expected format
4. **Price formatting**: Ensure prices are properly formatted as numbers

### Debug Mode

Enable debug logging by setting the console log level:

```javascript
// In orderService.js
console.log('Processing order with external API:', requestPayload);
```

This will output the exact payload being sent to the API for debugging purposes.
