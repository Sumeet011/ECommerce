# Dual Currency Feature Implementation

## Overview
This project now supports dual currency pricing (INR and USD) throughout the entire e-commerce platform. Users can switch between currencies seamlessly, and the admin panel allows setting prices in both currencies.

## Features Added

### 1. Backend Changes
- **Product Model**: Updated to include `priceINR` and `priceUSD` fields instead of a single `price` field
- **Product Controller**: Modified to handle both price fields when adding products
- **Database Schema**: All existing products need to be migrated to include both price fields

### 2. Admin Panel Changes
- **Add Product Form**: Now includes separate input fields for INR and USD prices
- **Product List**: Displays both INR and USD prices in the product listing table
- **Required Fields**: Both price fields are now required when adding products

### 3. Frontend Changes
- **Currency Toggle**: Added a currency toggle button in the navbar (₹/$)
- **Dynamic Pricing**: All product displays now show prices based on the selected currency
- **Context Management**: ShopContext now manages currency state and provides `getPrice()` function
- **Mobile Support**: Currency toggle is available in mobile menu as well

### 4. Components Updated
- ProductItem: Now accepts `priceINR` and `priceUSD` props
- Product: Uses `getPrice()` function for dynamic pricing
- Cart: Shows prices in selected currency
- Orders: Displays order amounts in selected currency
- Collection: Sorting functionality updated to use current currency
- All product listing components (BestSeller, LatestCollection, RelatedProducts)

## How It Works

### Currency Switching
1. Users can click the currency button (₹/$) in the navbar
2. The currency state is managed in ShopContext
3. All price displays automatically update to show the selected currency
4. The `getPrice()` function returns the appropriate price based on current currency

### Admin Usage
1. When adding products, admins must provide both INR and USD prices
2. The product list shows both prices for easy reference
3. No changes to payment processing - backend still uses INR for payments

### Price Display
- INR prices are shown with ₹ symbol
- USD prices are shown with $ symbol
- All calculations (cart totals, order amounts) use the selected currency

## Technical Implementation

### Key Functions
- `getPrice(product)`: Returns the appropriate price based on current currency
- `toggleCurrency()`: Switches between INR and USD
- Currency state is managed in ShopContext and persists during the session

### Data Structure
```javascript
// Product structure
{
  _id: "product_id",
  name: "Product Name",
  priceINR: 100,
  priceUSD: 12,
  // ... other fields
}
```

## Migration Notes
- Existing products in the database need to be updated to include both price fields
- Mock data in `frontend/src/assets/assets.js` has been updated with sample USD prices
- Payment processing remains unchanged and continues to use INR

## Benefits
1. **Global Reach**: Supports international customers with USD pricing
2. **Local Market**: Maintains INR pricing for Indian customers
3. **User Choice**: Customers can view prices in their preferred currency
4. **Admin Flexibility**: Admins can set appropriate prices for both markets
5. **No Payment Changes**: Payment processing remains unchanged for simplicity

## Future Enhancements
- Real-time currency conversion using exchange rate APIs
- Currency preference saved in user profiles
- Support for additional currencies
- Automatic price conversion based on user location 