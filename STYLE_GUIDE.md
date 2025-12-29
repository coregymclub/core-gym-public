# Core Gym Public Site - Style Guide

## CSS Component Library

All reusable styles are defined in `app/assets/css/main.css`. Use these classes instead of writing inline Tailwind utilities to ensure consistency across the site.

---

## Layout

### Container
```html
<div class="container-wide">
  <!-- Max-width 7xl, responsive padding -->
</div>
```

### Section Padding
```html
<section class="section-padding">      <!-- py-16 md:py-24 lg:py-32 -->
<section class="section-padding-sm">   <!-- py-12 lg:py-16 -->
<section class="section-padding-xs">   <!-- py-8 -->
```

### Common Section Pattern
```html
<section class="section-padding bg-white">
  <div class="container-wide">
    <!-- content -->
  </div>
</section>
```

---

## Buttons

```html
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-outline">Outline Style</button>
```

| Class | Use Case |
|-------|----------|
| `btn-primary` | Main CTAs, important actions (red background) |
| `btn-secondary` | Secondary actions (white with border) |
| `btn-outline` | Alternative style (transparent with red border) |

---

## Cards

### Base Card
```html
<div class="card">
  <!-- White background, rounded-2xl, p-6 -->
</div>

<div class="card card-hover">
  <!-- Adds shadow and lift on hover -->
</div>
```

### Compact Card
```html
<div class="card-compact">
  <!-- Gray background, rounded-xl, p-4 -->
</div>
```

### Swipeable Card (horizontal scroll)
```html
<div class="scroll-container scrollbar-hide">
  <article class="card-swipeable card-compact">
    <!-- Fixed width (w-72 sm:w-80), snap-start -->
  </article>
</div>
```

### Interactive Card
```html
<article class="card card-interactive">
  <!-- Adds cursor-pointer and hover shadow -->
</article>
```

### Feature Card
```html
<div class="card-feature">
  <!-- Centered text, hover shadow -->
</div>
```

---

## Section Headers

### Centered Header
```html
<div class="section-header">
  <h2 class="section-title mb-4">Title Here</h2>
  <p class="section-subtitle max-w-2xl mx-auto">Subtitle text</p>
</div>
```

### Header with Link
```html
<div class="section-header-flex">
  <div>
    <h2 class="section-title-md">Title</h2>
    <p class="text-body mt-1">Optional subtitle</p>
  </div>
  <NuxtLink to="/more" class="link-arrow">
    See all
    <svg><!-- arrow icon --></svg>
  </NuxtLink>
</div>
```

### Title Sizes
| Class | Size |
|-------|------|
| `section-title` | 3xl / 4xl / 5xl (hero, main sections) |
| `section-title-md` | 2xl / 3xl (subsections) |
| `section-title-sm` | xl (card titles, small headers) |

---

## Badges & Tags

### Badges
```html
<span class="badge badge-green">Open</span>
<span class="badge badge-blue">Info</span>
<span class="badge badge-red">Important</span>
<span class="badge badge-gray">Default</span>
<span class="badge badge-dark">Dark mode</span>
```

### Tags (smaller)
```html
<span class="tag bg-core-gray-100 text-core-gray-400">Small tag</span>
```

---

## Status Indicators

```html
<span class="status-dot status-dot-live"></span>   <!-- Green, pulsing -->
<span class="status-dot status-dot-active"></span> <!-- Red, pulsing -->
```

Common pattern with text:
```html
<div class="flex items-center gap-2">
  <span class="status-dot status-dot-active"></span>
  <span class="text-meta">Latest updates</span>
</div>
```

---

## Links

```html
<NuxtLink to="/page" class="link-arrow">
  Link text
  <svg><!-- arrow icon --></svg>
</NuxtLink>

<NuxtLink to="/" class="link-back">
  <svg><!-- back arrow --></svg>
  Back
</NuxtLink>
```

---

## Text Utilities

```html
<span class="text-meta">Small gray text (dates, counts)</span>
<p class="text-body">Body text with relaxed line-height</p>
<p class="text-body-lg">Larger body text</p>
```

---

## Grids

### Feature Grid (4 columns)
```html
<div class="grid-features">
  <!-- 1 col → 2 col → 4 col -->
</div>
```

### Card Grid (3 columns)
```html
<div class="grid-cards">
  <!-- 1 col → 2 col → 3 col, gap-6 -->
</div>
```

### Compact Card Grid
```html
<div class="grid-cards-2">
  <!-- 2 col → 3 col, gap-4/6 -->
</div>
```

---

## Horizontal Scroll

```html
<div class="scroll-container scrollbar-hide">
  <article class="card-swipeable">Item 1</article>
  <article class="card-swipeable">Item 2</article>
  <article class="card-swipeable">Item 3</article>
</div>
```

---

## Loading States

```html
<!-- Skeleton container -->
<div class="card skeleton">
  <div class="skeleton-text w-3/4 mb-2"></div>
  <div class="skeleton-text-sm w-full"></div>
</div>

<!-- Individual skeletons -->
<div class="h-48 skeleton"></div>           <!-- Block skeleton -->
<div class="skeleton-text w-3/4"></div>     <!-- Text line (h-4) -->
<div class="skeleton-text-sm w-full"></div> <!-- Small text (h-3) -->
```

---

## Line Clamp

```html
<p class="line-clamp-2">Truncate after 2 lines...</p>
<p class="line-clamp-3">Truncate after 3 lines...</p>
<p class="line-clamp-4">Truncate after 4 lines...</p>
```

---

## Form Elements

```html
<input type="text" class="input-base" placeholder="Enter text...">
```

---

## Design Tokens (Tailwind Config)

### Colors
- `core-red` / `core-red-dark` - Primary brand color
- `core-dark` - Text and dark backgrounds (#0c0c0c)
- `core-gray-50` through `core-gray-600` - Gray scale

### Fonts
- `font-display` - Space Grotesk (headings)
- `font-sans` - Plus Jakarta Sans (body)

---

## Complete Component Example

```vue
<template>
  <section class="section-padding bg-core-gray-100">
    <div class="container-wide">
      <!-- Header with link -->
      <div class="section-header-flex">
        <div>
          <h2 class="section-title-md">Section Title</h2>
          <p class="text-body mt-1">Optional description</p>
        </div>
        <NuxtLink to="/more" class="link-arrow">
          See all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid-cards">
        <div v-for="i in 3" :key="i" class="card skeleton">
          <div class="skeleton-text w-3/4 mb-2"/>
          <div class="skeleton-text-sm w-full"/>
        </div>
      </div>

      <!-- Content grid -->
      <div v-else class="grid-cards">
        <article
          v-for="item in items"
          :key="item.id"
          class="card card-hover card-interactive"
        >
          <div class="flex items-center gap-2 mb-3">
            <span class="status-dot status-dot-active"/>
            <span class="text-meta">{{ item.date }}</span>
            <span class="badge badge-green">New</span>
          </div>
          <h3 class="section-title-sm mb-2">{{ item.title }}</h3>
          <p class="text-body line-clamp-3">{{ item.description }}</p>
        </article>
      </div>

      <!-- Empty state -->
      <div v-if="!loading && items.length === 0" class="text-center py-12">
        <p class="text-body">No items to display.</p>
      </div>
    </div>
  </section>
</template>
```

---

## Rules

1. **Always use component classes** instead of inline Tailwind for common patterns
2. **Extend main.css** if you need a new reusable pattern
3. **Use design tokens** (core-red, core-gray-*, font-display) not raw colors
4. **Follow the section pattern**: `section` > `container-wide` > content
5. **Include loading and empty states** in data-driven components
6. **Use semantic HTML**: `section`, `article`, `nav`, etc.
