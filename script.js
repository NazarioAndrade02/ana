/* ============================================
   MODAL — imagen, título y descripción por producto
   ============================================ */
function openModal(imgSrc, title, desc) {
  document.getElementById('modal-img').src = imgSrc;
  document.getElementById('modal-img').alt = title || 'Producto';
  document.getElementById('modal-title').textContent = title || 'Producto';
  document.getElementById('modal-desc').textContent  = desc  || '';
  document.getElementById('modal').style.display = 'block';
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
   CURSOR PERSONALIZADO
   Punto negro + estela que se desvanece + destello al click
   ============================================ */
const dot    = document.getElementById('cursor-dot');
const canvas = document.getElementById('cursor-trail');
const ctx    = canvas.getContext('2d');

/* Ajustar canvas al viewport */
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Posición del mouse */
let mx = -100, my = -100;
const trail = []; // [{x, y, age}]
const TRAIL_MAX    = 38;
const TRAIL_LIFE   = 28;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;

  /* Mover punto */
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';

  /* Añadir punto a la estela */
  trail.push({ x: mx, y: my, age: 0 });
  if (trail.length > TRAIL_MAX) trail.shift();
});

/* Ocultar cursor al salir de la ventana */
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });

/* Animación de la estela */
function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i < trail.length; i++) {
    const p0  = trail[i - 1];
    const p1  = trail[i];
    const progress = i / trail.length;                 // 0→1 más reciente
    const alpha    = progress * 0.22 * (1 - p1.age / TRAIL_LIFE);

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
    ctx.lineWidth   = 1;
    ctx.lineCap     = 'round';
    ctx.stroke();
  }

  /* Envejecer puntos */
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].age++;
    if (trail[i].age > TRAIL_LIFE) trail.splice(i, 1);
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();

/* Click: pequeño destello tenue */
document.addEventListener('click', (e) => {
  /* Animar el punto */
  dot.classList.add('clicked');
  setTimeout(() => dot.classList.remove('clicked'), 160);

  /* Crear ripple */
  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.left = e.clientX + 'px';
  ripple.style.top  = e.clientY + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 560);
});
