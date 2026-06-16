window.addEventListener('load', () => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const stage = lightbox.querySelector('.lightbox-stage');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let gallery = [];   // [{ type, src, alt }]
  let index = 0;

  // Turn a thumbnail <img>/<video> into a plain descriptor.
  function describe(el) {
    if (el.tagName === 'VIDEO') {
      const source = el.querySelector('source');
      return { type: 'video', src: source ? source.src : (el.currentSrc || el.src) };
    }
    return { type: 'image', src: el.src, alt: el.alt || 'full view' };
  }

  // The set of media to navigate through: the carousel or grid the item belongs
  // to. Carousel clones are skipped so each item appears once.
  function groupFor(el) {
    const carousel = el.closest('.carousel-container');
    if (carousel) {
      return Array.from(carousel.querySelectorAll(
        '.carousel-item:not(.carousel-clone) img, .carousel-item:not(.carousel-clone) video'
      ));
    }
    const grid = el.closest('.image-grid');
    if (grid) return Array.from(grid.querySelectorAll('img, video'));
    return [el];
  }

  function render() {
    const item = gallery[index];
    stage.innerHTML = '';

    let node;
    if (item.type === 'video') {
      node = document.createElement('video');
      node.src = item.src;
      node.controls = true;
      node.loop = true;
      node.autoplay = true;
      node.playsInline = true;
      node.play().catch(() => {}); // ignore autoplay rejections; controls remain
    } else {
      node = document.createElement('img');
      node.src = item.src;
      node.alt = item.alt;
    }
    stage.appendChild(node);

    const many = gallery.length > 1;
    prevBtn.hidden = !many;
    nextBtn.hidden = !many;
  }

  function open(el) {
    gallery = groupFor(el).map(describe);
    const clickedSrc = describe(el).src;
    index = Math.max(0, gallery.findIndex(item => item.src === clickedSrc));
    render();
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stage.innerHTML = '';
    gallery = [];
  }

  function step(dir) {
    if (gallery.length < 2) return;
    index = (index + dir + gallery.length) % gallery.length;
    render();
  }

  // Open from any thumbnail click (delegated so it covers lazy-loaded media too).
  document.addEventListener('click', (e) => {
    const media = e.target.closest(
      '.carousel-item img, .carousel-item video, .image-grid img, .image-grid video'
    );
    if (!media || lightbox.contains(media)) return;
    e.preventDefault();
    open(media);
  });

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });

  // Click the backdrop (but not the media or buttons) to close.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === stage) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Swipe left/right on touch screens.
  let touchStartX = 0;
  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });
});
