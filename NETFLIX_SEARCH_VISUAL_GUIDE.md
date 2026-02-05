# Netflix-Style Search Page - Visual Guide

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISCOVER PRODUCTS (Header)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ 🔍 Search products, suppliers, or categories...     │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Browse by Category                                              │
│                                                                 │
│  [All] [🥩 Meat] [🐟 Seafood] [🥬 Vegetables] [🍎 Fruits]     │
│  [🧀 Dairy] [🌾 Grains] [🍯 Oils] [🎂 Baking] [🥤 Beverages] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🥩 Meat & Poultry                                               │
│                                                                 │
│  ◄  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  ►    │
│     │ Product1 │ │ Product2 │ │ Product3 │ │ Product4 │       │
│     │ $45/kg   │ │ $50/kg   │ │ $60/kg   │ │ $40/kg   │       │
│     │ (320px)  │ │ (320px)  │ │ (320px)  │ │ (320px)  │       │
│     └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🐟 Seafood                                                      │
│                                                                 │
│  ◄  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  ►    │
│     │ Product1 │ │ Product2 │ │ Product3 │ │ Product4 │       │
│     └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 🥬 Vegetables                                                   │
│                                                                 │
│  ◄  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  ►    │
│     │ Product1 │ │ Product2 │ │ Product3 │ │ Product4 │       │
│     └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

... (more categories)
```

## Product Card Details

```
┌────────────────────────────────┐
│   [Product Image Placeholder]  │  ← 320px width (w-80)
│   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← 160px height (h-40)
├────────────────────────────────┤
│ Fresh Tomatoes                 │  ← Product Name
│ Organic fresh tomatoes from    │  ← Description (2 lines max)
│ local farm                      │
│                                 │
│ $45.00          [Vegetables]   │  ← Price + Category Badge
│ per kg                          │
│ MOQ: 5 kg | Stock: 100         │  ← MOQ & Stock Info
│                                 │
│  [  View Supplier  ]           │  ← Action Button
└────────────────────────────────┘
```

## Category Filter - Scrollable Buttons

```
┌─────────────────────────────────────────────────────────────────┐
│ Browse by Category                                              │
│                                                                 │
│  ◄ gradient  [All] [🥩 Meat] [🐟 Seafood] [🥬 Vegetables]    ►│
│                    [🍎 Fruits] [🧀 Dairy] [🌾 Grains]         │
│                    [🍯 Oils] [🎂 Baking] [🥤 Beverages]       │
│                                            gradient ►          │
│                                                                 │
│  ← When scrolled left        When scrolled right →            │
│    (shows only when needed)   (shows only when needed)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Active Filter States

```
Default (All selected):
┌────────────────────┐
│ [All - Blue]       │ ← bg-blue-600 text-white
│ 🥩 Meat - Gray    │ ← bg-gray-100 text-gray-700
│ 🐟 Seafood - Gray │
└────────────────────┘

After clicking Meat:
┌────────────────────┐
│ [All - Gray]       │ ← bg-gray-100 text-gray-700
│ 🥩 Meat - Blue     │ ← bg-blue-600 text-white
│ 🐟 Seafood - Gray │
└────────────────────┘
```

## Scroll Navigation Buttons

```
Left Button (when can scroll left):
┌───────────────────────────────────────┐
│            ← (Black/50 opacity)       │ ← Positioned at left edge
│  Products scroll  ◄  Products scroll  │
│  to the RIGHT            to the LEFT  │
│            → (Black/50 opacity)       │ ← Positioned at right edge
└───────────────────────────────────────┘

Hover effect:
  bg-black/50 ──► bg-black/70 (darker on hover)
```

## Search Bar

```
┌─────────────────────────────────────────────────────────┐
│ DISCOVER PRODUCTS (Header)                              │
│                                                         │
│ 🔍┌──────────────────────────────────────────────────┐ │
│   │ Search products, suppliers, or categories...    │ │
│   └──────────────────────────────────────────────────┘ │
│                                                         │
│ (Focus: border-blue-500 ring-2 ring-blue-500)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## No Results State

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐  │
│  │                                    │  │
│  │      🔍                            │  │
│  │     (Large gray icon)              │  │
│  │                                    │  │
│  │  No products found                 │  │
│  │  Try adjusting your search         │  │
│  │  or filters                        │  │
│  │                                    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Loading State

```
┌────────────────────────────────┐
│ 🥩 Meat & Poultry             │
│                                │
│        Loading...             │ ← Centered loading message
│                                │
│ (with fade-in animation)      │
│                                │
└────────────────────────────────┘
```

## Responsive Behavior

### Desktop (1200px+)
```
┌─────────────────────────────────────────────────────────────┐
│ [All] [🥩] [🐟] [🥬] [🍎] [🧀] [🌾] [🍯] [🎂] [🥤]       │
│ ◄ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ► (5 cards) │
└─────────────────────────────────────────────────────────────┘
```

### Tablet (768px-1199px)
```
┌──────────────────────────────┐
│ [All] [🥩] [🐟] [🥬] [🍎]  │
│ [🧀] [🌾] [🍯] [🎂] [🥤]   │
│ ◄ ┌──────┐ ┌──────┐ ► (3 cards) │
└──────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────┐
│ [All] [🥩] [🐟] │
│ [🥬] [🍎] [🧀]  │
│ ◄ ┌──────┐ ►    │
│   (1 card wide) │
└──────────────────┘
```

## Color Scheme

```
Background:
  - Main: #f8f9fa (bg-gray-50)
  - Header: #f3f4f6 to #ffffff (gradient from-blue-50 to-white)

Text:
  - Primary: #212529 (text-gray-900)
  - Secondary: #6c757d (text-gray-600)
  - Muted: #adb5bd (text-gray-500)

Buttons:
  - Active: #0d6efd (bg-blue-600)
  - Hover: #0b5ed7 (hover:bg-blue-700)
  - Inactive: #e9ecef (bg-gray-100)
  - Disabled: #9ca3af (disabled:bg-gray-400)

Accents:
  - Error: #dc3545 (text-red-500)
  - Success: #198754 (border-green-600)
  - Shadow: rgba(0,0,0,0.1) - 0.5

Navigation:
  - Dark overlay: rgba(0,0,0,0.5) on hover: rgba(0,0,0,0.7)
```

## Animation Timings

```
Smooth Scroll:
  - Duration: Not specified (browser default ~1s)
  - Behavior: smooth

Button Transitions:
  - Duration: 300ms
  - Timing: ease-in-out (fade-in animation)

Hover Effects:
  - Duration: immediate
  - Classes: transition-shadow, transition-colors
```

## Accessibility Features

```
Keyboard Navigation:
  ✓ Tab through all interactive elements
  ✓ Enter/Space to activate buttons
  ✓ Focus visible outlines

Screen Reader:
  ✓ Semantic HTML structure
  ✓ Descriptive button labels
  ✓ ARIA attributes where needed

Color Contrast:
  ✓ Text on background: WCAG AA compliant
  ✓ Button states clearly distinguishable
  ✓ Icon-only buttons have hover tooltips
```

---

## Quick Reference

| Element | Size | Color | Icon |
|---------|------|-------|------|
| Search Bar | Full Width | White | 🔍 |
| Category Button | Auto | Gray/Blue | Various |
| Product Card | 320px | White | - |
| Card Height | 240px + padding | - | - |
| Scroll Button | 44px | Black/50 | ◄/► |
| Font Size | 16px base | - | - |
| Border Radius | 8px | - | - |
| Gap between cards | 16px | - | - |

