# Core Gym Public Site - Style Guide

## CSS Component Library

This project uses a custom design system based on **Material Design 3 Expressive** principles, implemented via Tailwind CSS.
All reusable styles are defined in `app/assets/css/main.css`.

---

## Colors (Design Tokens)

The color palette is defined in `tailwind.config.js` and available as utility classes.

### Brand Colors
- `bg-brand` / `text-brand`: Primary Red (#D93636) - Main actions, highlights
- `bg-brand-dark`: Darker Red (#B02020) - Hover states
- `bg-brand-deep`: Deep Red (#C42121) - Gradients/Hero
- `bg-brand-light`: Light Pink (#FFEDEF) - Background tints

### Surface & Text
- `bg-surface`: White (#ffffff) - Cards, main backgrounds
- `bg-surface-bright`: Bright White (#fcfcfc) - Page background
- `bg-surface-dim`: Off-white (#f5f5f5) - Secondary backgrounds
- `bg-surface-container`: Container background (#f0f0f0)
- `text-on-surface`: Dark Grey (#1a1a1a) - Primary text
- `text-on-surface-dim`: Medium Grey (#666666) - Secondary text

---

## Typography

### Fonts
- **Headings:** `font-display` (Suisse BP Intl) - Bold, Uppercase, Tight tracking
- **Body:** `font-body` (Neue Montreal) - Clean, readable

### Text Classes
```html
<h1 class="text-hero">Massive Hero Text</h1>
<h2 class="text-section">Section Title</h2>
<p class="text-lead">Lead paragraph text...</p>
<span class="text-overline">Small Uppercase Label</span>
```

---

## Components

### Buttons (M3 Expressive)
Pill-shaped buttons with expressive hover states and springy animations.

```html
<!-- Primary (Red filled) -->
<button class="btn btn-primary">Bli Medlem</button>

<!-- Secondary (Outlined) -->
<button class="btn btn-secondary">Logga In</button>

<!-- Tonal (Soft filled) -->
<button class="btn btn-tonal">Alternativ</button>

<!-- Ghost (Transparent) -->
<button class="btn btn-ghost">Läs mer</button>

<!-- Dark (Black) -->
<button class="btn btn-dark">Svart Knapp</button>

<!-- Sizes -->
<button class="btn btn-primary btn-xs">Extra Small</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-md">Medium</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

### FAB (Floating Action Button)
```html
<!-- Standard FAB -->
<button class="fab">
  <svg>...</svg>
</button>

<!-- Extended FAB with label -->
<button class="fab fab-extended">
  <svg>...</svg>
  Skapa
</button>
```

### Cards (M3 Expressive)
Large rounded corners (28px) and soft shadows.

```html
<!-- Standard Card -->
<div class="card">Content</div>

<!-- Card Variants -->
<div class="card card-elevated">Elevated shadow</div>
<div class="card card-filled">Filled background</div>
<div class="card card-outlined">Outlined border</div>
<div class="card card-glass">Glass blur effect</div>
<div class="card card-dark">Dark background</div>

<!-- Interactive Card -->
<div class="card card-interactive">
  Clickable Content
</div>

<!-- Sizes -->
<div class="card card-sm">Small padding</div>
<div class="card card-lg">Large padding</div>
<div class="card card-xl">Extra large</div>

<!-- Media Card -->
<div class="card-media">
  <img class="card-media-image" src="..." />
  <div class="card-media-content">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

### Chips (M3 Expressive)
Pill-shaped selection elements.

```html
<!-- Assist Chip (outlined) -->
<button class="chip-assist">
  <svg>...</svg>
  Hjälp
</button>

<!-- Filter Chip (toggleable) -->
<button class="chip-filter" aria-selected="true">Aktiv</button>
<button class="chip-filter">Inaktiv</button>

<!-- Input Chip (with close) -->
<div class="chip-input">
  Tagg
  <button class="chip-close">×</button>
</div>

<!-- Suggestion Chip -->
<button class="chip-suggestion">Förslag</button>

<!-- Sizes -->
<button class="chip-filter chip-sm">Small</button>
<button class="chip-filter chip-lg">Large</button>

<!-- Chip Group (scrollable) -->
<div class="chip-group">
  <button class="chip-filter">Alla</button>
  <button class="chip-filter">Gym</button>
  <button class="chip-filter">Yoga</button>
</div>
```

### Forms (M3 Expressive)

```html
<!-- Filled Input (default M3 style) -->
<input type="text" class="input" placeholder="Namn" />

<!-- Outlined Input -->
<input type="email" class="input-outlined" placeholder="Email" />

<!-- Floating Label Field -->
<div class="field">
  <input type="text" class="field-input" placeholder=" " />
  <label class="field-label">Namn</label>
</div>

<!-- Select -->
<select class="select">
  <option>Välj...</option>
</select>

<!-- Textarea -->
<textarea class="textarea" rows="4"></textarea>

<!-- Checkbox -->
<input type="checkbox" class="checkbox" />

<!-- Radio -->
<input type="radio" class="radio" />

<!-- Labels & Messages -->
<label class="label">Etikett</label>
<p class="hint">Hjälptext</p>
<p class="error-text">Felmeddelande</p>
```

---

## Layout Utilities

### Container
```html
<div class="container">
  <!-- Max-width 1400px, responsive padding -->
</div>
<div class="container-narrow">
  <!-- Max-width 600px -->
</div>
```

### Spacing
Use standard Tailwind spacing, or these specific section paddings:
- `section`: py-24 lg:py-40
- `section-sm`: py-16 lg:py-24
- `section-lg`: py-32 lg:py-48

---

## M3 Expressive Utilities

### Shapes (Border Radius)
```html
<div class="shape-xs">8px</div>
<div class="shape-sm">12px</div>
<div class="shape-md">16px</div>
<div class="shape-lg">20px</div>
<div class="shape-xl">28px</div>
<div class="shape-2xl">32px</div>
<div class="shape-full">Pill</div>
```

### Shadow Levels
```html
<div class="shadow-level-0">None</div>
<div class="shadow-level-1">Low</div>
<div class="shadow-level-2">Medium</div>
<div class="shadow-level-3">High</div>
<div class="shadow-level-4">Higher</div>
<div class="shadow-level-5">Highest</div>
```

### State Layer (Interactive Hover)
```html
<button class="state-layer">
  Hover me for overlay effect
</button>
```

### Interactive Surface
```html
<div class="surface-interactive">
  Clickable area with hover states
</div>
```

### Animation Utilities
- `.animate-spring`: Bouncy entrance
- `.animate-slide-up`: Slide up fade in
- `.spring-hover`: Hover scale effect
- `.ripple`: Click ripple effect

### Touch Target Helper
```html
<!-- Ensures minimum 48px touch target -->
<button class="touch-target">Small button</button>
```

---

## Usage Rules

1. **Use Component Classes:** Prefer `.btn-primary` over `bg-red-500 rounded-full ...`.
2. **Follow the Voice:** "Kom som du är", "Inga pekpinnar".
3. **M3 Expressive Principles:**
   - Large, soft rounded corners (28px+)
   - Generous touch targets (min 48px)
   - Spring-based animations
   - Clear visual hierarchy
4. **Structure:**
   ```html
   <section class="section bg-surface">
     <div class="container">
       <h2 class="text-section mb-8">Rubrik</h2>
       <div class="grid ...">
         <!-- Content -->
       </div>
     </div>
   </section>
   ```
