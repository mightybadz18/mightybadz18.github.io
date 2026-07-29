const escapeGalleryText = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const installGalleryEnhancements = () => {
  if (document.getElementById('gallery-enhancement-styles')) return;

  const styles = document.createElement('style');
  styles.id = 'gallery-enhancement-styles';
  styles.textContent = `
    .shot-link {
      display: block;
      color: inherit;
      text-decoration: none;
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
      background: rgba(9, 17, 31, .9);
      color: #fff;
      font-size: .72rem;
      font-weight: 800;
      line-height: 1.2;
      opacity: 0;
      transform: translateY(5px);
      transition: opacity .2s ease, transform .2s ease;
      pointer-events: none;
    }

    .shot-link:hover .shot-open-badge,
    .shot-link:focus-visible .shot-open-badge {
      opacity: 1;
      transform: translateY(0);
    }

    .shot-link:focus-visible {
      outline: 3px solid var(--blue, #276ef1);
      outline-offset: 3px;
      border-radius: 14px;
    }

    .shot-caption-hint {
      display: block;
      margin-top: 2px;
      color: #718096;
      font-size: .72rem;
      font-weight: 600;
    }

    @media (hover: none) {
      .shot-open-badge {
        opacity: 1;
        transform: none;
      }
    }
  `;
  document.head.appendChild(styles);
};

const gallery = (target, items) => {
  const element = document.querySelector(target);
  if (!element) return;

  installGalleryEnhancements();

  element.innerHTML = items.map(([src, label]) => {
    const safeSrc = escapeGalleryText(src);
    const safeLabel = escapeGalleryText(label);

    return `
      <figure class="shot">
        <a class="shot-link" href="${safeSrc}" target="_blank" rel="noopener noreferrer" aria-label="Open ${safeLabel} original full-resolution image">
          <span class="shot-image-wrap">
            <img loading="lazy" src="${safeSrc}" alt="${safeLabel}">
            <span class="shot-open-badge" aria-hidden="true">Open full size ↗</span>
          </span>
          <figcaption>
            ${safeLabel}
            <small class="shot-caption-hint">Click to view and zoom the original image</small>
          </figcaption>
        </a>
      </figure>
    `;
  }).join('');
};
