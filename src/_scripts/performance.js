// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.startTimes = {}
  }

  // Start timing a performance metric
  start(metricName) {
    this.startTimes[metricName] = performance.now()
  }

  // End timing and record the metric
  end(metricName) {
    if (this.startTimes[metricName]) {
      const duration = performance.now() - this.startTimes[metricName]
      this.metrics[metricName] = duration
      console.log(`${metricName}: ${duration.toFixed(2)}ms`)
      delete this.startTimes[metricName]
      return duration
    }
    return null
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime.toFixed(2), 'ms')
        }
      }
    }).observe({ entryTypes: ['paint'] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime.toFixed(2), 'ms')
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime, 'ms')
      }
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let clsValue = 0
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      console.log('CLS:', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }

  // Monitor long tasks
  monitorLongTasks() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          // Tasks longer than 50ms
          console.warn('Long task detected:', entry.duration.toFixed(2), 'ms')
        }
      }
    }).observe({ entryTypes: ['longtask'] })
  }

  // Monitor navigation timing
  getNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0]
      console.log('Navigation timing:')
      console.log(
        '  DNS lookup:',
        (navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2),
        'ms'
      )
      console.log(
        '  TCP connect:',
        (navigation.connectEnd - navigation.connectStart).toFixed(2),
        'ms'
      )
      console.log(
        '  Server response:',
        (navigation.responseEnd - navigation.requestStart).toFixed(2),
        'ms'
      )
      console.log(
        '  Page load:',
        (navigation.loadEventEnd - navigation.navigationStart).toFixed(2),
        'ms'
      )
    })
  }
}

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  const monitor = new PerformanceMonitor()

  // Monitor page load
  monitor.start('page-load')
  window.addEventListener('load', () => {
    monitor.end('page-load')
  })

  // Monitor Core Web Vitals
  monitor.getCoreWebVitals()

  // Monitor long tasks
  monitor.monitorLongTasks()

  // Monitor navigation timing
  monitor.getNavigationTiming()

  // Make monitor available globally for debugging
  window.performanceMonitor = monitor
}

export default PerformanceMonitor
