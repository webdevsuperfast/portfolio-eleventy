# Portfolio Eleventy

JAMStack implementation of my portfolio website using [11ty](https://www.11ty.dev/), [TailwindCSS](https://tailwindcss.com/) and [WordPress](https://wordpress.org/).

## Features

- ⚡ **Optimized Performance**: Fast builds with incremental compilation and code splitting
- 🎨 **Modern UI**: Built with Tailwind CSS v4 and Alpine.js
- 🖼️ **Smart Images**: Automatic WebP/AVIF generation with lazy loading
- 🎭 **Smooth Animations**: GSAP-powered animations with hardware acceleration
- 📱 **Responsive Design**: Mobile-first approach with dark mode support
- 🔍 **SEO Optimized**: Server-side rendering with optimized meta tags

## Development

### Quick Start

```bash
npm install
npm run dev:fast  # Optimized development with incremental builds
```

### Available Scripts

- `npm run dev` - Standard development server
- `npm run dev:fast` - Optimized development with incremental builds
- `npm run build` - Production build
- `npm run build:incremental` - Incremental production build
- `npm run clean` - Clean build artifacts

### Performance Features

- **Incremental Builds**: Faster rebuilds during development
- **Code Splitting**: Optimized bundle sizes with esbuild
- **Image Optimization**: On-request optimization during development
- **Hardware Acceleration**: GPU-accelerated animations
- **Passive Event Listeners**: Better scroll performance
- **Lazy Loading**: Optimized image and content loading

## Performance Monitoring

The site includes built-in performance monitoring in development mode:

- Core Web Vitals tracking
- Long task detection
- Navigation timing metrics
- Custom performance metrics

Check the browser console for performance data when running in development mode.

## Credits

- [TEA Stack](https://github.com/mattwaler/tea-stack/)
- [11ty WordPress GraphQL](https://github.com/most-useful/11ty-wordpress-graphql)
- [Personal Site WP 11ty](https://github.com/larryhudson/personal-site-wp-11ty)
- [Persistent Dark Mode](https://www.mikehealy.com.au/light-dark-mode-switch-with-tailwind-alpine/)
