import VenoBox from 'venobox/src/venobox.esm'

const lightbox = new VenoBox({
  selector: '.portfolio-link',
  spinner: 'bounce',
  autoplay: true,
  infinigall: true,
  // Performance optimizations
  numeration: true,
  share: false, // Disable sharing for better performance
  // Optimize loading
  preload: false,
  // Use hardware acceleration
  overlayColor: 'rgba(0,0,0,0.85)',
  bgcolor: '#000',
})
