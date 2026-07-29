const gallery = (target, items) => {
  const element = document.querySelector(target);
  if (!element) return;
  element.innerHTML = items.map(([src, label]) => `<figure class="shot"><img loading="lazy" src="${src}" alt="${label}"><figcaption>${label}</figcaption></figure>`).join('');
};
