const escapeGalleryText = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const installGalleryViewer = () => {
  if (document.getElementById('gallery-viewer')) return;

  const styles = document.createElement('style');
  styles.id = 'gallery-viewer-styles';
  styles.textContent = `
    .shot-viewer-trigger {
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: left;
      font: inherit;
      cursor: zoom-in;
    }

    .shot-image-wrap {
      position: relative;
      display: block;
      overflow: hidden;
      background: #eef2f7;
    }

    .shot-open-badge {
      position: absolute;
      right: 10px;
      bottom: 10px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(9, 17, 31, .92);
      color: #fff;
      font-size: .72rem;
      font-weight: 800;
      line-height: 1.2;
      opacity: 0;
      transform: translateY(5px);
      transition: opacity .2s ease, transform .2s ease;
      pointer-events: none;
    }

    .shot-viewer-trigger:hover .shot-open-badge,
    .shot-viewer-trigger:focus-visible .shot-open-badge {
      opacity: 1;
      transform: translateY(0);
    }

    .shot-viewer-trigger:focus-visible {
      outline: 3px solid var(--blue, #276ef1);
      outline-offset: 3px;
      border-radius: 14px 14px 0 0;
    }

    .shot-caption-hint {
      display: block;
      margin-top: 2px;
      color: #718096;
      font-size: .72rem;
      font-weight: 600;
    }

    .gallery-viewer[hidden] {
      display: none;
    }

    .gallery-viewer {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      background: rgba(2, 6, 23, .97);
      color: #fff;
    }

    .gallery-viewer-toolbar,
    .gallery-viewer-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(9, 17, 31, .96);
    }

    .gallery-viewer-title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 800;
    }

    .gallery-viewer-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 7px;
      flex-wrap: wrap;
    }

    .gallery-viewer-control {
      min-height: 38px;
      padding: 7px 11px;
      border: 1px solid rgba(255, 255, 255, .2);
      border-radius: 9px;
      background: rgba(255, 255, 255, .08);
      color: #fff;
      font: inherit;
      font-size: .82rem;
      font-weight: 800;
      text-decoration: none;
      cursor: pointer;
    }

    .gallery-viewer-control:hover,
    .gallery-viewer-control:focus-visible {
      background: rgba(255, 255, 255, .17);
    }

    .gallery-viewer-close {
      background: #fff;
      color: #09111f;
    }

    .gallery-viewer-viewport {
      position: relative;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      touch-action: none;
      cursor: grab;
      user-select: none;
    }

    .gallery-viewer-viewport.is-dragging {
      cursor: grabbing;
    }

    .gallery-viewer-pan {
      position: absolute;
      left: 50%;
      top: 50%;
      width: max-content;
      height: max-content;
      will-change: transform;
    }

    .gallery-viewer-image {
      display: block;
      max-width: none;
      max-height: none;
      transform-origin: center center;
      will-change: transform;
      pointer-events: none;
      -webkit-user-drag: none;
    }

    .gallery-viewer-footer {
      justify-content: center;
      color: #c8d3e6;
      font-size: .8rem;
      text-align: center;
    }

    .gallery-viewer-zoom {
      min-width: 54px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    @media (hover: none) {
      .shot-open-badge {
        opacity: 1;
        transform: none;
      }
    }

    @media (max-width: 720px) {
      .gallery-viewer-toolbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .gallery-viewer-actions {
        width: 100%;
        justify-content: flex-start;
      }

      .gallery-viewer-control {
        min-height: 42px;
      }
    }
  `;
  document.head.appendChild(styles);

  const viewer = document.createElement('div');
  viewer.id = 'gallery-viewer';
  viewer.className = 'gallery-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-labelledby', 'gallery-viewer-title');
  viewer.innerHTML = `
    <div class="gallery-viewer-toolbar">
      <div class="gallery-viewer-title" id="gallery-viewer-title">Screenshot</div>
      <div class="gallery-viewer-actions">
        <button class="gallery-viewer-control" type="button" data-viewer-action="zoom-out" aria-label="Zoom out">−</button>
        <span class="gallery-viewer-zoom" aria-live="polite">100%</span>
        <button class="gallery-viewer-control" type="button" data-viewer-action="zoom-in" aria-label="Zoom in">+</button>
        <button class="gallery-viewer-control" type="button" data-viewer-action="fit">Fit</button>
        <button class="gallery-viewer-control" type="button" data-viewer-action="actual">100%</button>
        <a class="gallery-viewer-control gallery-viewer-original" href="#" target="_blank" rel="noopener noreferrer">Open raw image ↗</a>
        <button class="gallery-viewer-control gallery-viewer-close" type="button" data-viewer-action="close">Close</button>
      </div>
    </div>
    <div class="gallery-viewer-viewport" aria-label="Zoomable screenshot viewer">
      <div class="gallery-viewer-pan">
        <img class="gallery-viewer-image" alt="">
      </div>
    </div>
    <div class="gallery-viewer-footer">Use +/− or the mouse wheel to zoom. Drag to inspect details. Choose 100% for the image’s original pixel scale.</div>
  `;
  document.body.appendChild(viewer);

  const viewport = viewer.querySelector('.gallery-viewer-viewport');
  const panLayer = viewer.querySelector('.gallery-viewer-pan');
  const image = viewer.querySelector('.gallery-viewer-image');
  const title = viewer.querySelector('.gallery-viewer-title');
  const zoomLabel = viewer.querySelector('.gallery-viewer-zoom');
  const originalLink = viewer.querySelector('.gallery-viewer-original');
  const closeButton = viewer.querySelector('[data-viewer-action="close"]');

  let fitScale = 1;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let lastFocusedElement = null;
  const pointers = new Map();
  let dragStart = null;
  let pinchStart = null;

  const minimumScale = () => Math.max(fitScale * .5, .03);
  const clampScale = (value) => Math.min(Math.max(value, minimumScale()), 8);

  const applyTransform = () => {
    panLayer.style.transform = `translate(-50%, -50%) translate3d(${offsetX}px, ${offsetY}px, 0)`;
    image.style.transform = `scale(${scale})`;
    zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  };

  const calculateFitScale = () => {
    if (!image.naturalWidth || !image.naturalHeight) return 1;
    const availableWidth = Math.max(viewport.clientWidth - 40, 1);
    const availableHeight = Math.max(viewport.clientHeight - 40, 1);
    return Math.min(availableWidth / image.naturalWidth, availableHeight / image.naturalHeight, 1);
  };

  const setFit = () => {
    fitScale = calculateFitScale();
    scale = fitScale;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  };

  const setActualSize = () => {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    applyTransform();
  };

  const zoomAt = (nextScale, clientX, clientY) => {
    const oldScale = scale;
    const clampedScale = clampScale(nextScale);
    if (Math.abs(clampedScale - oldScale) < .0001) return;

    const rect = viewport.getBoundingClientRect();
    const originX = typeof clientX === 'number' ? clientX - rect.left - rect.width / 2 : 0;
    const originY = typeof clientY === 'number' ? clientY - rect.top - rect.height / 2 : 0;
    const ratio = clampedScale / oldScale;

    offsetX = originX - (originX - offsetX) * ratio;
    offsetY = originY - (originY - offsetY) * ratio;
    scale = clampedScale;
    applyTransform();
  };

  const closeViewer = () => {
    if (viewer.hidden) return;
    viewer.hidden = true;
    document.body.style.overflow = '';
    pointers.clear();
    dragStart = null;
    pinchStart = null;
    viewport.classList.remove('is-dragging');
    image.removeAttribute('src');
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const openViewer = (src, label, trigger) => {
    lastFocusedElement = trigger;
    title.textContent = label;
    image.alt = label;
    originalLink.href = src;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    image.onload = setFit;
    image.src = src;
    closeButton.focus();
  };

  viewer.addEventListener('click', (event) => {
    const action = event.target.closest('[data-viewer-action]')?.dataset.viewerAction;
    if (!action) return;

    if (action === 'close') closeViewer();
    if (action === 'zoom-in') zoomAt(scale * 1.25);
    if (action === 'zoom-out') zoomAt(scale / 1.25);
    if (action === 'fit') setFit();
    if (action === 'actual') setActualSize();
  });

  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    const multiplier = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoomAt(scale * multiplier, event.clientX, event.clientY);
  }, { passive: false });

  viewport.addEventListener('dblclick', (event) => {
    if (Math.abs(scale - fitScale) < .01) zoomAt(1, event.clientX, event.clientY);
    else setFit();
  });

  const distanceBetween = (first, second) => Math.hypot(second.x - first.x, second.y - first.y);
  const centerBetween = (first, second) => ({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 });

  viewport.addEventListener('pointerdown', (event) => {
    viewport.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewport.classList.add('is-dragging');

    if (pointers.size === 1) {
      dragStart = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        offsetX,
        offsetY
      };
      pinchStart = null;
    }

    if (pointers.size === 2) {
      const [first, second] = [...pointers.values()];
      const center = centerBetween(first, second);
      pinchStart = {
        distance: distanceBetween(first, second),
        scale,
        offsetX,
        offsetY,
        centerX: center.x,
        centerY: center.y
      };
      dragStart = null;
    }
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1 && dragStart && dragStart.pointerId === event.pointerId) {
      offsetX = dragStart.offsetX + event.clientX - dragStart.clientX;
      offsetY = dragStart.offsetY + event.clientY - dragStart.clientY;
      applyTransform();
      return;
    }

    if (pointers.size === 2 && pinchStart) {
      const [first, second] = [...pointers.values()];
      const currentDistance = distanceBetween(first, second);
      const currentCenter = centerBetween(first, second);
      const nextScale = clampScale(pinchStart.scale * (currentDistance / Math.max(pinchStart.distance, 1)));
      const rect = viewport.getBoundingClientRect();
      const originX = pinchStart.centerX - rect.left - rect.width / 2;
      const originY = pinchStart.centerY - rect.top - rect.height / 2;
      const ratio = nextScale / pinchStart.scale;

      offsetX = originX - (originX - pinchStart.offsetX) * ratio + currentCenter.x - pinchStart.centerX;
      offsetY = originY - (originY - pinchStart.offsetY) * ratio + currentCenter.y - pinchStart.centerY;
      scale = nextScale;
      applyTransform();
    }
  });

  const releasePointer = (event) => {
    pointers.delete(event.pointerId);

    if (pointers.size === 1) {
      const [pointerId, point] = [...pointers.entries()][0];
      dragStart = {
        pointerId,
        clientX: point.x,
        clientY: point.y,
        offsetX,
        offsetY
      };
      pinchStart = null;
    } else if (pointers.size === 0) {
      dragStart = null;
      pinchStart = null;
      viewport.classList.remove('is-dragging');
    }
  };

  viewport.addEventListener('pointerup', releasePointer);
  viewport.addEventListener('pointercancel', releasePointer);

  window.addEventListener('resize', () => {
    if (!viewer.hidden) setFit();
  });

  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return;

    if (event.key === 'Escape') closeViewer();
    if (event.key === '+' || event.key === '=') zoomAt(scale * 1.25);
    if (event.key === '-') zoomAt(scale / 1.25);
    if (event.key === '0') setActualSize();
    if (event.key.toLowerCase() === 'f') setFit();
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.shot-viewer-trigger');
    if (!trigger) return;
    openViewer(trigger.dataset.fullSrc, trigger.dataset.label, trigger);
  });
};

const gallery = (target, items) => {
  const element = document.querySelector(target);
  if (!element) return;

  installGalleryViewer();

  element.innerHTML = items.map(([src, label]) => {
    const safeSrc = escapeGalleryText(src);
    const safeLabel = escapeGalleryText(label);

    return `
      <figure class="shot">
        <button class="shot-viewer-trigger" type="button" data-full-src="${safeSrc}" data-label="${safeLabel}" aria-label="Open zoomable full-resolution view of ${safeLabel}">
          <span class="shot-image-wrap">
            <img loading="lazy" src="${safeSrc}" alt="${safeLabel}">
            <span class="shot-open-badge" aria-hidden="true">Zoom full image</span>
          </span>
        </button>
        <figcaption>
          ${safeLabel}
          <small class="shot-caption-hint">Click to zoom and inspect the original screenshot</small>
        </figcaption>
      </figure>
    `;
  }).join('');

  element.querySelectorAll('.shot img').forEach((image) => {
    const classify = () => {
      const shot = image.closest('.shot');
      if (!shot) return;

      shot.classList.toggle('is-portrait', image.naturalHeight > image.naturalWidth);
      shot.classList.toggle('is-tall', image.naturalHeight > image.naturalWidth * 1.35);
    };

    if (image.complete) classify();
    image.addEventListener('load', classify, { once: true });
  });
};
