# Categories & Subcategories Reference

This document outlines all product categories and subcategories used in the B2B Marketplace.

## Category Structure

Each category has:
- **id**: Unique identifier (lowercase, kebab-case)
- **name**: Display name
- **icon**: Emoji icon for visual representation
- **subcategories**: Array of subcategory items

Each subcategory has:
- **id**: Unique identifier
- **name**: Display name
- **icon**: Emoji icon

---

## Main Categories

### 🥩 Meat & Poultry (meat)
Beef, pork, chicken, lamb, turkey, and processed meat products.

**Subcategories:**
- Beef (🐄)
- Pork (🐷)
- Chicken (🍗)
- Lamb (🐑)
- Turkey (🦃)
- Processed Meat (🌭)

---

### 🐟 Seafood (seafood)
Fresh fish, shellfish, shrimp, and other marine products.

**Subcategories:**
- Fresh Fish (🐠)
- Shellfish (🦪)
- Shrimp & Prawns (🦐)
- Squid & Octopus (🐙)
- Frozen Seafood (❄️)

---

### 🥬 Vegetables (vegetables)
Fresh and frozen vegetables including leafy greens and root vegetables.

**Subcategories:**
- Fresh Vegetables (🥕)
- Leafy Greens (🥗)
- Root Vegetables (🥔)
- Frozen Vegetables (❄️)
- Organic Vegetables (🌱)

---

### 🍎 Fruits (fruits)
Fresh and organic fruits including citrus, berries, tropical, and stone fruits.

**Subcategories:**
- Citrus (🍊)
- Berries (🫐)
- Tropical Fruits (🥭)
- Stone Fruits (🍑)
- Organic Fruits (🌱)

---

### 🧀 Dairy & Cheese (dairy)
Cheese, milk, yogurt, butter, and other dairy products.

**Subcategories:**
- Cheese (🧀)
- Milk (🥛)
- Yogurt (🥣)
- Butter & Cream (🧈)
- Other Dairy (🥛)

---

### 🌾 Grains & Cereals (grains)
Rice, wheat, pasta, flour, and other grain products.

**Subcategories:**
- Rice (🍚)
- Wheat (🌾)
- Pasta (🍝)
- Flour & Meal (💪)
- Other Grains (🌾)

---

### 🍯 Oils & Condiments (oils)
Olive oil, cooking oils, vinegar, sauces, and spices.

**Subcategories:**
- Olive Oil (🫒)
- Cooking Oil (🍳)
- Vinegar (🍶)
- Sauces & Pastes (🍲)
- Spices & Seasonings (🌶️)

---

### 🎂 Baking & Desserts (baking)
Baking ingredients, flour, sugar, chocolate, and decorations.

**Subcategories:**
- Flour & Baking Mix (💪)
- Sugar & Sweeteners (🍯)
- Chocolate & Cocoa (🍫)
- Yeast & Leavening (🧬)
- Baking Decorations (✨)

---

### 🥤 Beverages (beverages)
Coffee, tea, juice, water, and alcoholic beverages.

**Subcategories:**
- Coffee (☕)
- Tea (🫖)
- Juice (🧃)
- Water & Drinks (💧)
- Alcohol (🍷)

---

### ❄️ Frozen Foods (frozen)
Ready meals, frozen vegetables, fruits, and desserts.

**Subcategories:**
- Ready Meals (🍱)
- Frozen Vegetables (🥕)
- Frozen Fruits (🍓)
- Frozen Desserts (🍦)
- Other Frozen (❄️)

---

## Special Category Groups

These are special groupings for the Netflix-style interface:

### ⭐ Featured Suppliers
Premium suppliers and bestselling products.

### 🕐 Recent Searches
User's recently searched products and categories.

### 🔥 Trending Now
Currently trending products and categories.

### 💰 Best Deals
Products with special offers and discounts.

---

## Usage Guide

### Accessing Categories in Code

```typescript
import { PRODUCT_CATEGORIES, getCategoryByName, getSubcategoryByName } from '@/data/categories';

// Get all categories
PRODUCT_CATEGORIES.forEach((category) => {
  console.log(category.name, category.icon);
});

// Get a specific category
const meatCategory = getCategoryByName('Meat & Poultry');

// Get a specific subcategory
const lamb = getSubcategoryByName('Meat & Poultry', 'Lamb');

// Get all subcategory names for a category
const subcategories = getSubcategoryNames('Meat & Poultry');
// Returns: ['Beef', 'Pork', 'Chicken', 'Lamb', 'Turkey', 'Processed Meat']
```

### UI Components

The Netflix-style search interface includes:

1. **CategoryFilter** - Horizontal scrolling category buttons
   - Allows filtering by main category
   - Supports "All" to view all categories

2. **CategorySection** - Horizontal scrolling product cards per category
   - Shows products grouped by category
   - Includes left/right scroll buttons
   - Displays loading and error states

### Search Features

- **Text Search**: Search by product name or description
- **Category Filter**: Filter by main category (e.g., "Meat & Poultry")
- **Subcategory**: Use subcategories to refine searches (future enhancement)

---

## Future Enhancements

### Subcategory Filtering
Add subcategory-level filtering to the search interface.

```typescript
const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

// Filter UI
const categoryData = PRODUCT_CATEGORIES.find(cat => cat.id === selectedCategory);
categoryData?.subcategories.map(sub => (
  <button onClick={() => setSelectedSubcategory(sub.id)}>
    {sub.icon} {sub.name}
  </button>
))
```

### Recently Viewed
Track and display user's recently viewed categories and products.

### Recommended Products
ML-based recommendations based on search history and purchases.

### Smart Suggestions
Auto-complete suggestions based on category and subcategory hierarchy.

---

## Adding New Categories

To add a new category:

1. Edit `src/data/categories.ts`
2. Add to `PRODUCT_CATEGORIES` array:

```typescript
{
  id: 'new-category',
  name: 'New Category Name',
  icon: '🎯',
  subcategories: [
    { id: 'sub1', name: 'Subcategory 1', icon: '🎨' },
    { id: 'sub2', name: 'Subcategory 2', icon: '🎭' },
  ],
}
```

3. Update API/backend to include the new category
4. Update mock data in `src/api/buyer.ts` if needed

---

## Category IDs Reference Table

| Category | ID | Icon | Subcategories |
|----------|----|----|--|
| Meat & Poultry | meat | 🥩 | 6 |
| Seafood | seafood | 🐟 | 5 |
| Vegetables | vegetables | 🥬 | 5 |
| Fruits | fruits | 🍎 | 5 |
| Dairy & Cheese | dairy | 🧀 | 5 |
| Grains & Cereals | grains | 🌾 | 5 |
| Oils & Condiments | oils | 🍯 | 5 |
| Baking & Desserts | baking | 🎂 | 5 |
| Beverages | beverages | 🥤 | 5 |
| Frozen Foods | frozen | ❄️ | 5 |

**Total: 10 main categories with 50 subcategories**
