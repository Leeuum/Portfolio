function initCarousel(carouselId, autoScrollDirection = 'right', autoScrollSpeed = 50) {
  const container = document.getElementById(carouselId);
  if (!container) return;
  const track = container.querySelector('.carousel-track');
  if (!track) return;
  const originalItems = Array.from(track.querySelectorAll('.carousel-item'));
  const prevButton = container.querySelector('.carousel-prev');
  const nextButton = container.querySelector('.carousel-next');

  if (originalItems.length === 0) return;

  const itemWidth = originalItems[0].offsetWidth + parseInt(window.getComputedStyle(originalItems[0]).marginRight || '0') * 2;
  const visibleItemsCount = Math.floor(container.offsetWidth / itemWidth);

  if (originalItems.length <= visibleItemsCount || itemWidth === 0) {
    if (prevButton) prevButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
    return;
  }

  let currentXOffset = 0;
  let animationFrameId;
  let isHovering = false;
  let lastFrameTime = performance.now();
  let autoScrollTimeoutId;

  const itemsToClone = Math.min(originalItems.length, Math.max(1, visibleItemsCount));

  for (let i = 0; i < itemsToClone; i++) {
    track.appendChild(originalItems[i].cloneNode(true));
  }
  for (let i = 0; i < itemsToClone; i++) {
    track.insertBefore(originalItems[originalItems.length - 1 - i].cloneNode(true), track.firstElementChild);
  }

  currentXOffset = -itemWidth * itemsToClone;
  track.style.transition = 'none';
  track.style.transform = `translateX(${currentXOffset}px)`;
  void track.offsetWidth;
  track.style.transition = '';

  function runLazySusanAnimation(currentTime) {
    if (isHovering) {
      lastFrameTime = currentTime;
      animationFrameId = requestAnimationFrame(runLazySusanAnimation);
      return;
    }

    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    let newXOffsetThisFrame = currentXOffset;
    if (autoScrollDirection === 'right') {
      newXOffsetThisFrame -= autoScrollSpeed * deltaTime;
    } else {
      newXOffsetThisFrame += autoScrollSpeed * deltaTime;
    }

    let finalProposedXOffset = newXOffsetThisFrame;
    let jumped = false;
    const originalItemsTotalWidth = itemWidth * originalItems.length;

    if (autoScrollDirection === 'right') {
      if (finalProposedXOffset <= -(itemWidth * itemsToClone + originalItemsTotalWidth)) {
        finalProposedXOffset += originalItemsTotalWidth;
        jumped = true;
      }
    } else {
      if (finalProposedXOffset >= -itemWidth * (itemsToClone - 1e-9)) {
        finalProposedXOffset -= originalItemsTotalWidth;
        jumped = true;
      }
    }

    if (isHovering) {
      animationFrameId = requestAnimationFrame(runLazySusanAnimation);
      return;
    }

    currentXOffset = finalProposedXOffset;

    if (jumped) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${currentXOffset}px)`;
      void track.offsetWidth;
      track.style.transition = '';
    } else {
      track.style.transform = `translateX(${currentXOffset}px)`;
    }

    animationFrameId = requestAnimationFrame(runLazySusanAnimation);
  }

  function startAutoScroll(delay = 0) {
    stopAutoScroll();

    const primeAndStartAnimationLoop = () => {
      requestAnimationFrame(function primeFrame(timestamp) {
        if (isHovering && delay > 0) return;

        const currentTransformValue = window.getComputedStyle(track).transform;
        if (currentTransformValue && currentTransformValue !== 'none') {
          const matrixValues = currentTransformValue.match(/matrix(?:3d)?\((.+)\)/);
          if (matrixValues && matrixValues[1]) {
            const M = matrixValues[1].split(', ').map(parseFloat);
            if (M.length === 6) {
              currentXOffset = M[4];
            } else if (M.length === 16) {
              currentXOffset = M[12];
            }
          }
        }

        lastFrameTime = timestamp;
        animationFrameId = requestAnimationFrame(runLazySusanAnimation);
      });
    };

    if (delay > 0) {
      autoScrollTimeoutId = setTimeout(primeAndStartAnimationLoop, delay);
    } else {
      primeAndStartAnimationLoop();
    }
  }

  function stopAutoScroll() {
    cancelAnimationFrame(animationFrameId);
    clearTimeout(autoScrollTimeoutId);
  }

  function handleManualNavigation(direction) {
    stopAutoScroll();
    isHovering = true;

    if (direction === 'next') {
      currentXOffset -= itemWidth;
    } else {
      currentXOffset += itemWidth;
    }

    track.style.transition = 'transform 0.4s ease-in-out';
    track.style.transform = `translateX(${currentXOffset}px)`;

    const transitionEndHandler = () => {
      track.removeEventListener('transitionend', transitionEndHandler);
      track.style.transition = 'none';

      const originalItemsTotalWidth = itemWidth * originalItems.length;
      if (currentXOffset <= -(itemWidth * itemsToClone + originalItemsTotalWidth)) {
        currentXOffset += originalItemsTotalWidth;
        track.style.transform = `translateX(${currentXOffset}px)`;
      }
      if (currentXOffset >= -itemWidth * (itemsToClone - 1e-9)) {
        currentXOffset -= originalItemsTotalWidth;
        track.style.transform = `translateX(${currentXOffset}px)`;
      }
      void track.offsetWidth;
      track.style.transition = '';
      isHovering = false;
      startAutoScroll(1500);
    };
    track.addEventListener('transitionend', transitionEndHandler);
    setTimeout(() => {
      if (track.style.transition !== 'none') {
        transitionEndHandler();
      }
    }, 450);
  }

  if (prevButton) prevButton.addEventListener('click', () => handleManualNavigation('prev'));
  if (nextButton) nextButton.addEventListener('click', () => handleManualNavigation('next'));

  container.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoScroll();
    const currentTransform = window.getComputedStyle(track).transform;
    track.style.transition = 'none';
    track.style.transform = currentTransform;
    void track.offsetWidth;
  });
  container.addEventListener('mouseleave', () => {
    isHovering = false;
    startAutoScroll(1000);
  });

  startAutoScroll();
}

window.addEventListener('load', () => {
  initCarousel('personal-work-carousel', 'right', 50);
  initCarousel('freelance-work-carousel', 'left', 40);
});
