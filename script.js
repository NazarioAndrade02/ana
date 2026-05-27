/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger  = document.getElementById('hamburger');
const mainNav    = document.getElementById('main-nav');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('open');
  mainNav.classList.add('open');
  navOverlay.style.display = 'block';
  requestAnimationFrame(() => navOverlay.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mainNav.classList.remove('open');
  navOverlay.classList.remove('open');
  setTimeout(() => { navOverlay.style.display = 'none'; }, 350);
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

/* Cerrar al tocar un link del menú */
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ============================================
   MODAL — imagen, título y descripción por producto
   ============================================ */
function openModal(imgSrc, title, desc) {
  document.getElementById('modal-img').src = imgSrc;
  document.getElementById('modal-img').alt = title || 'Producto';
  document.getElementById('modal-title').textContent = title || 'Producto';
  document.getElementById('modal-desc').textContent  = desc  || '';
  document.getElementById('modal').style.display = 'block';

  /* Animación de entrada */
  const content = document.querySelector('.modal-content');
  content.classList.remove('modal-anim');
  void content.offsetWidth; // reflow para reiniciar la animación
  content.classList.add('modal-anim');
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

/* Cerrar al hacer click fuera */
window.onclick = function (e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) modal.style.display = 'none';
};

/* Cerrar con tecla ESC */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

/* ============================================
   NAV ACTIVO — IntersectionObserver
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.menu a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.add('active');
      }
    });
  });
}, { threshold: 0.3 });

sections.forEach(s => navObserver.observe(s));

/* ============================================
   HEADER — sombra al hacer scroll
   ============================================ */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================
   TOP BAR — marquee duplicado para loop infinito
   ============================================ */
const topBarInner = document.querySelector('.top-bar-inner');
if (topBarInner) {
  // Duplicamos el contenido para el loop
  topBarInner.innerHTML = topBarInner.innerHTML + topBarInner.innerHTML;
}

/* ============================================
   CURSOR PERSONALIZADO
   Punto rosa + estela que se desvanece + destello al click
   ============================================ */
const dot    = document.getElementById('cursor-dot');
const canvas = document.getElementById('cursor-trail');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let mx = -100, my = -100;
const trail = [];
const TRAIL_MAX  = 38;
const TRAIL_LIFE = 28;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  trail.push({ x: mx, y: my, age: 0 });
  if (trail.length > TRAIL_MAX) trail.shift();
});

document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i < trail.length; i++) {
    const p0  = trail[i - 1];
    const p1  = trail[i];
    const progress = i / trail.length;
    const alpha    = progress * 0.2 * (1 - p1.age / TRAIL_LIFE);

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    /* Estela en tono rosa suave */
    ctx.strokeStyle = `rgba(184, 120, 120, ${alpha})`;
    ctx.lineWidth   = 1.2;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }

  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].age++;
    if (trail[i].age > TRAIL_LIFE) trail.splice(i, 1);
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();

document.addEventListener('click', (e) => {
  dot.classList.add('clicked');
  setTimeout(() => dot.classList.remove('clicked'), 160);

  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 560);
});

/* ============================================
   SCROLL REVEAL
   ============================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

/* About */
const aboutText = document.querySelector('.about-text');
const aboutImg  = document.querySelector('.about-img');
if (aboutText) { aboutText.classList.add('reveal-left');  revealObs.observe(aboutText); }
if (aboutImg)  { aboutImg.classList.add('reveal-right');  revealObs.observe(aboutImg);  }

/* Contacto */
const contactBox  = document.querySelector('.contact-box');
const contactImgW = document.querySelector('.contact-img-wrap');
if (contactBox)  { contactBox.classList.add('reveal-left');   revealObs.observe(contactBox);  }
if (contactImgW) { contactImgW.classList.add('reveal-right'); revealObs.observe(contactImgW); }

/* Footer */
const footerInner = document.querySelector('.footer-inner');
if (footerInner) { footerInner.classList.add('reveal-fade'); revealObs.observe(footerInner); }

/* Heading lines (productos, faq, contacto) */
document.querySelectorAll('.products h2, .faq h2, .contact h2').forEach(h2 => {
  revealObs.observe(h2);
});

/* ============================================
   CARDS — stagger al entrar al viewport
   ============================================ */
const cards = document.querySelectorAll('.card');

const cardObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    /* Animamos todas las cards con delay escalonado */
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('is-visible'), i * 55);
    });
    cardObs.disconnect();
  });
}, { threshold: 0.04 });

if (cards.length) cardObs.observe(cards[0]);

/* ============================================
   FAQ — stagger al entrar al viewport
   ============================================ */
const faqItems = document.querySelectorAll('.faq-item');

const faqObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    faqItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('is-visible'), i * 90);
    });
    faqObs.disconnect();
  });
}, { threshold: 0.08 });

if (faqItems.length) faqObs.observe(faqItems[0]);
