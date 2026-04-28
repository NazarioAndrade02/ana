/* ============================================
   MODAL — muestra la imagen del producto
   ============================================ */
function openModal(imgSrc, title, desc) {
  document.getElementById('modal-img').src    = imgSrc;
  document.getElementById('modal-img').alt    = title || 'Producto';
  document.getElementById('modal-title').textContent = title || 'Producto';
  document.getElementById('modal-desc').textContent  = desc  || '';
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

window.onclick = function (e) {
  const modal = document.getElementById('modal');
  if (e.target === modal) modal.style.display = 'none';
};

/* ============================================
   NAV ACTIVO — se actualiza según la sección visible
   ============================================ */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.menu a');

const observer = new IntersectionObserver((entries) => {
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
}, {
  // Activa cuando la sección ocupa al menos el 30% del viewport
  threshold: 0.3
});

sections.forEach(section => observer.observe(section));