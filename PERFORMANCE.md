# Performance Optimization Guide

## Build Optimizations

### Development

- Use `npm run dev:fast` for optimized development builds with incremental compilation
- Incremental builds are enabled for faster rebuilds during development
- Image optimization happens on-request during development for better performance

### Production

- Use `npm run build:incremental` for incremental production builds
- Code splitting and tree shaking are enabled
- CSS and JS are minified in production
- Console logs and debuggers are removed in production builds

## JavaScript Optimizations

### Alpine.js

- Use passive event listeners for better scroll performance
- Cache DOM queries to avoid repeated lookups
- Use `.throttle` modifier for frequent events like scrolling

### GSAP

- Use `will-change` properties before animations
- Enable hardware acceleration with `force3D: true`
- Use `transform3d` for GPU acceleration
- Clean up `will-change` properties after animations complete

### General JS

- Tree shaking removes unused code
- Code splitting creates smaller, cacheable chunks
- ES2020 target for modern browser optimizations

## CSS Optimizations

### Tailwind CSS

- Use CSS variables instead of @apply where possible
- Use `will-change` utilities for animated elements
- Use `transform-gpu` for hardware acceleration
- Use `text-pretty` and `text-balance` for better typography

## Image Optimizations

- Automatic WebP/AVIF generation
- Lazy loading with optimized thresholds
- On-request optimization during development
- Responsive image generation

## Development Workflow

1. **Fast Development**: `npm run dev:fast`
2. **Standard Development**: `npm run dev`
3. **Production Build**: `npm run build`
4. **Incremental Production**: `npm run build:incremental`

## Performance Monitoring

- Use browser dev tools to monitor Core Web Vitals
- Check for unused CSS/JS with coverage tools
- Monitor bundle sizes and loading performance
- Use Lighthouse for overall performance scoring
