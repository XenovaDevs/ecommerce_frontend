# Le Pas Sage Design System - Quick Reference

## Color Palette

### Primary Colors
```css
/* Sage Black - Primary brand color */
--sage-black: 15 15 15
--sage-black-light: 38 38 38

/* Sage White - Background */
--sage-white: 255 255 255

/* Sage Gold - Luxury accent */
--sage-gold: 191 155 96
--sage-gold-light: 217 191 145
--sage-gold-dark: 165 129 70

/* Sage Green - Natural accent */
--sage-green: 139 145 136
--sage-green-light: 169 175 166
```

### Gray Scale
```css
--sage-gray-50:  250 250 250  /* Lightest - backgrounds */
--sage-gray-100: 245 245 245  /* Muted backgrounds */
--sage-gray-200: 229 229 229  /* Borders */
--sage-gray-300: 212 212 212  /* Input borders */
--sage-gray-400: 163 163 163  /* Disabled text */
--sage-gray-500: 115 115 115  /* Secondary text */
--sage-gray-600: 82 82 82     /* Body text */
--sage-gray-700: 64 64 64     /* Emphasis */
--sage-gray-800: 38 38 38     /* Strong emphasis */
--sage-gray-900: 23 23 23     /* Darkest - headings */
```

---

## Component Variants

### Button
```tsx
// Primary brand button - Use for main CTAs
<Button variant="sage">Add to Cart</Button>

// Luxury accent - Use for premium/featured items
<Button variant="gold">Buy Premium</Button>

// Secondary - Use for less important actions
<Button variant="secondary">View Details</Button>

// Outline - Use for tertiary actions
<Button variant="outline">Learn More</Button>

// Ghost - Use for subtle interactions
<Button variant="ghost">Cancel</Button>

// Gradients - Use sparingly for special promotions
<Button variant="gradient-gold">Limited Edition</Button>
```

### Card
```tsx
// Standard card
<Card>Content</Card>

// Premium card with gold top accent
<Card variant="premium">Premium Content</Card>

// Luxury card with gold glow
<Card variant="luxury">Exclusive Offer</Card>

// Glass effect
<Card variant="glass">Overlay Content</Card>

// Hoverable product card
<Card variant="default" hoverable>Product</Card>
```

### Badge
```tsx
// Default status
<Badge>In Stock</Badge>

// Brand emphasis
<Badge variant="sage">Featured</Badge>

// Luxury/Premium indicator
<Badge variant="gold">Premium</Badge>

// Outlined for emphasis
<Badge variant="outline-gold">Limited</Badge>

// Status indicators
<Badge variant="success">Available</Badge>
<Badge variant="warning">Low Stock</Badge>
<Badge variant="danger">Out of Stock</Badge>

// Special effects
<Badge variant="glow-gold">New Arrival</Badge>
```

---

## Utility Classes

### Gradients
```tsx
className="gradient-sage"      // Black gradient
className="gradient-gold"      // Gold gradient
className="gradient-radial-gold" // Subtle gold glow background
```

### Shadows
```tsx
className="shadow-elegant"     // Subtle black shadow
className="shadow-elegant-lg"  // Larger elegant shadow
className="shadow-gold"        // Gold-tinted shadow
className="shadow-gold-lg"     // Larger gold shadow
```

### Hover Effects
```tsx
className="hover-lift"         // 4px lift on hover
className="hover-lift-subtle"  // 2px lift on hover
className="hover-scale"        // Scale to 1.02
className="hover-scale-subtle" // Scale to 1.01
```

### Animations
```tsx
className="animate-fade-in"       // Fade in
className="animate-slide-up"      // Slide up with fade
className="animate-shimmer-gold"  // Gold shimmer effect
className="animate-glow-gold"     // Pulsing gold glow
```

### Focus States
```tsx
className="focus-ring"      // Black ring (light) / Gold ring (dark)
className="focus-ring-gold" // Always gold ring
```

### Text
```tsx
className="text-gradient-sage" // Black gradient text
className="text-gradient-gold" // Gold gradient text
```

---

## Typography Scale

### Font Sizes
```tsx
text-xs     // 12px - Labels, badges
text-sm     // 14px - Body text, buttons
text-base   // 16px - Default body
text-lg     // 18px - Large text
text-xl     // 20px - Card titles
text-2xl    // 24px - Section headers
text-3xl    // 30px - Page titles
```

### Font Weights
```tsx
font-normal   // 400 - Body text
font-medium   // 500 - Buttons, emphasis
font-semibold // 600 - Card titles
font-bold     // 700 - Headers, logo
```

### Letter Spacing
- Body text has subtle tightening (`-0.011em`) by default
- Use `tracking-tight` for headings
- Use `tracking-tighter` for brand elements

---

## Spacing Scale

### Padding
```tsx
p-2   // 8px  - Tight spacing
p-4   // 16px - Default spacing
p-6   // 24px - Card padding
p-8   // 32px - Section padding
```

### Gaps
```tsx
gap-2  // 8px  - Tight elements
gap-4  // 16px - Default gap
gap-6  // 24px - Comfortable spacing
gap-8  // 32px - Generous spacing
```

---

## Common Patterns

### Product Card
```tsx
<Card variant="default" hoverable>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <Badge variant="gold">Premium</Badge>
  </CardHeader>
  <CardContent>
    <p className="text-sage-gray-600">Description</p>
    <p className="text-xl font-semibold text-sage-black">$99.99</p>
  </CardContent>
  <CardFooter>
    <Button variant="sage" fullWidth>Add to Cart</Button>
  </CardFooter>
</Card>
```

### Premium CTA Section
```tsx
<div className="relative overflow-hidden rounded-xl p-8 gradient-radial-gold">
  <h2 className="text-3xl font-bold text-sage-black">
    Exclusive Collection
  </h2>
  <p className="mt-2 text-sage-gray-600">
    Limited time offer on premium items
  </p>
  <Button variant="gradient-gold" className="mt-4">
    Shop Now
  </Button>
</div>
```

### Form Input (Consistent with Header Search)
```tsx
<div className="relative group">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-gray-400 transition-sophisticated group-focus-within:text-sage-black" />
  <input
    className="w-full rounded-lg border border-sage-gray-300 bg-sage-gray-50 py-2 pl-10 pr-4 text-sm text-sage-black placeholder:text-sage-gray-400 focus:border-sage-black focus:bg-sage-white focus:outline-none focus:ring-2 focus:ring-sage-black/10 transition-sophisticated"
    placeholder="Enter text..."
  />
</div>
```

### Status Indicator
```tsx
<div className="flex items-center gap-2">
  <Badge variant={
    status === 'available' ? 'success' :
    status === 'low' ? 'warning' :
    'danger'
  }>
    {status}
  </Badge>
</div>
```

---

## Animation Timing

### Easing Functions
```css
--ease-elegant:        cubic-bezier(0.16, 1, 0.3, 1)    /* Default */
--ease-luxury:         cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-sophisticated:  cubic-bezier(0.4, 0, 0.2, 1)
--ease-refined:        cubic-bezier(0.33, 1, 0.68, 1)
```

### Durations
- Quick interactions: `200ms`
- Standard transitions: `300ms` (use `transition-smooth`)
- Sophisticated transitions: `400ms` (use `transition-sophisticated`)
- Shimmer/Glow effects: `1000ms+`

---

## Dark Mode

### Automatic Color Switching
All semantic colors automatically invert:
- `bg-primary` → black (light) / white (dark)
- `text-primary` → black (light) / white (dark)
- `bg-accent` → gold (both modes)
- `focus-ring` → black (light) / gold (dark)

### Usage
```tsx
// No special code needed - colors adapt automatically
<div className="bg-background text-foreground">
  Content adapts to theme
</div>
```

---

## Accessibility Guidelines

### Color Contrast
- Body text on white: Use `text-sage-gray-600` or darker (meets AA)
- Headings: Use `text-sage-black` (21:1 ratio)
- Disabled state: `opacity-50` on gray backgrounds
- Links: Underline or clear visual distinction

### Interactive Elements
- Always include focus states (automatically handled by components)
- Maintain 44px minimum touch target on mobile
- Provide clear hover feedback
- Use aria-labels for icon-only buttons

### Semantic HTML
```tsx
// ✅ Good
<button>Click Me</button>
<nav>...</nav>
<main>...</main>

// ❌ Bad
<div onClick={...}>Click Me</div>
```

---

## Performance Tips

### Use CSS Variables
```tsx
// ✅ Good - Dynamic theming
<div style={{ color: 'rgb(var(--sage-gold))' }} />

// ❌ Avoid - Hard to theme
<div style={{ color: '#BF9B60' }} />
```

### Optimize Animations
```tsx
// ✅ Good - GPU accelerated
className="transform hover:scale-105"

// ❌ Avoid - Causes reflow
className="hover:w-full"
```

### Backdrop Blur
```tsx
// Use sparingly - expensive operation
className="backdrop-blur-md" // Only for headers, modals
```

---

## Don'ts

❌ Don't use hardcoded hex colors
❌ Don't use generic blue/gray palette
❌ Don't skip focus states
❌ Don't use more than 2-3 colors per component
❌ Don't overuse gold accent (reserve for premium/emphasis)
❌ Don't mix old color classes with new system
❌ Don't use complex gradients on large areas
❌ Don't animate properties that cause reflow

---

## Migration Checklist

When updating existing components:

- [ ] Replace `bg-primary` with `bg-sage-black` or keep semantic
- [ ] Replace `bg-blue-*` with `bg-sage-gray-*` or semantic colors
- [ ] Update button variants: `primary` → `sage`
- [ ] Replace `text-gray-*` with `text-sage-gray-*`
- [ ] Replace `border-gray-*` with `border-sage-gray-*`
- [ ] Update shadows: use `shadow-elegant` or `shadow-gold`
- [ ] Update transitions: use `transition-sophisticated`
- [ ] Add proper focus states if missing
- [ ] Test dark mode appearance
- [ ] Verify accessibility contrast

---

## Resources

- **Full Documentation:** `/PHASE_1_REFACTOR_SUMMARY.md`
- **Component Source:** `/src/components/ui/`
- **Design Tokens:** `/src/app/globals.css`
- **Type Definitions:** Each component file

For questions or issues with the design system, refer to the comprehensive documentation in PHASE_1_REFACTOR_SUMMARY.md.
