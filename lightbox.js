document.addEventListener('DOMContentLoaded', () => {
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

  initLightbox();
}); 