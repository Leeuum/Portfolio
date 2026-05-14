window.addEventListener('load', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');

  function initLightbox() {
    const allImages = document.querySelectorAll('.image-grid img, .carousel-item img');
    allImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent carousel navigation when clicking images
        lightbox.classList.add('visible');
        lightboxImg.src = img.src;
      });
    });
  }

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('visible');
    lightboxImg.src = '';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
      lightbox.classList.remove('visible');
      lightboxImg.src = '';
    }
  });

  initLightbox();
}); 