import LazyLoad from 'vanilla-lazyload'

// Performance optimization: Configure lazy loading with better performance settings
const lazyContent = new LazyLoad({
  // Use native lazy loading when available
  use_native: true,
  // Optimize threshold for better performance
  threshold: 300,
  // Reduce callback frequency
  throttle: 16,
  // Optimize for performance
  cancel_on_exit: true,
})

const lazyBackground = new LazyLoad({
  // Use native lazy loading when available
  use_native: true,
  // Optimize threshold for better performance
  threshold: 300,
  // Reduce callback frequency
  throttle: 16,
  // Optimize for performance
  cancel_on_exit: true,
})
