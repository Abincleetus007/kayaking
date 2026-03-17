/* ============================================= */
/*  Munroe Island – script.js                     */
/* ============================================= */

/* ---- Navbar: scroll behaviour ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ---- Mobile hamburger menu ---- */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Scroll-reveal animation ---- */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger children if parent is a grid
      const children = entry.target.querySelectorAll('.why-card, .gallery-item');
      if (children.length) {
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
          child.style.opacity = '0';
          child.style.transform = 'translateY(30px)';
          child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          requestAnimationFrame(() => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'none';
            }, i * 80 + 50);
          });
        });
      }
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ---- Smooth active nav-link highlight ---- */
const sections     = document.querySelectorAll('section[id]');
const navAnchors   = document.querySelectorAll('.nav-links a');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.45 });

sections.forEach(sec => activeSectionObserver.observe(sec));

/* ---- Gallery: lightbox ---- */
const galleryItems = document.querySelectorAll('.gallery-item');

// Create lightbox DOM
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div class="lb-backdrop"></div>
  <button class="lb-close" aria-label="Close">&times;</button>
  <button class="lb-prev" aria-label="Previous">&#8592;</button>
  <button class="lb-next" aria-label="Next">&#8594;</button>
  <div class="lb-img-wrap">
    <img id="lbImg" src="" alt="" />
    <p id="lbCaption"></p>
  </div>
`;
document.body.appendChild(lightbox);

// Lightbox styles injected
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  #lightbox {
    position: fixed; inset: 0; z-index: 9999;
    display: none; align-items: center; justify-content: center;
  }
  #lightbox.active { display: flex; }
  .lb-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.92);
    backdrop-filter: blur(8px);
    cursor: zoom-out;
  }
  .lb-img-wrap {
    position: relative; z-index: 1;
    max-width: 90vw; max-height: 90vh;
    text-align: center;
  }
  #lbImg {
    max-width: 90vw; max-height: 82vh;
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 80px rgba(0,0,0,0.6);
    animation: lbIn 0.3s ease;
  }
  @keyframes lbIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }
  #lbCaption {
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    margin-top: 14px;
    letter-spacing: 0.06em;
  }
  .lb-close, .lb-prev, .lb-next {
    position: absolute; z-index: 2;
    background: rgba(255,255,255,0.12);
    border: 1.5px solid rgba(255,255,255,0.2);
    color: white; cursor: pointer;
    border-radius: 50%;
    width: 46px; height: 46px;
    font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s;
    backdrop-filter: blur(6px);
  }
  .lb-close { top: 18px; right: 18px; font-size: 1.6rem; }
  .lb-prev  { left: 18px; top: 50%; transform: translateY(-50%); }
  .lb-next  { right: 18px; top: 50%; transform: translateY(-50%); }
  .lb-close:hover, .lb-prev:hover, .lb-next:hover {
    background: rgba(255,255,255,0.25); transform: scale(1.1);
  }
  .lb-prev:hover { transform: translateY(-50%) scale(1.1); }
  .lb-next:hover { transform: translateY(-50%) scale(1.1); }
`;
document.head.appendChild(lbStyle);

let currentIdx = 0;
const images = Array.from(galleryItems).map(item => ({
  src:     item.querySelector('img').src,
  caption: item.querySelector('.gallery-caption').textContent
}));

function openLightbox(idx) {
  currentIdx = idx;
  document.getElementById('lbImg').src        = images[idx].src;
  document.getElementById('lbCaption').textContent = images[idx].caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.style.cursor = 'zoom-in';
  item.addEventListener('click', () => openLightbox(i));
});

lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-prev').addEventListener('click', () => {
  openLightbox((currentIdx - 1 + images.length) % images.length);
});
lightbox.querySelector('.lb-next').addEventListener('click', () => {
  openLightbox((currentIdx + 1) % images.length);
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox((currentIdx - 1 + images.length) % images.length);
  if (e.key === 'ArrowRight') openLightbox((currentIdx + 1) % images.length);
});

/* ---- Scroll-to-top on logo click ---- */
document.querySelector('.nav-logo').addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Active nav link CSS ---- */
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-links a.active { color: var(--gold-light); }
  .nav-links a.active::after { transform: scaleX(1); }
`;
document.head.appendChild(activeNavStyle);

/* ---- Parallax on hero image ---- */
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
  }
}, { passive: true });

console.log('🛶 Munroe Island Backwater Escapes – site loaded successfully.');
