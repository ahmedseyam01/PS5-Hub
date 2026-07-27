document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initThemeToggle();
  initGameCardModals();
  initMenuCart();
  initReservationForm();
  initTooltipsAndToasts();
  initScrollReveal();
  initParticleCanvas();
  init3DTilt();
  initCounterAnim();
  initRippleEffect();
});

function initNavbarScroll() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link-ps');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

function initThemeToggle() {
  const themeBtn = document.createElement('button');
  themeBtn.className = 'btn-ps-theme-toggle shadow-lg';
  themeBtn.innerHTML = '<i class="bi bi-palette-fill"></i> <span class="d-none d-sm-inline ms-1">LED Theme</span>';
  themeBtn.setAttribute('title', 'Switch PS5 Ambient Theme Color');
  document.body.appendChild(themeBtn);

  let currentTheme = localStorage.getItem('ps5_theme') || 'blue';
  if (currentTheme === 'red') {
    document.body.classList.add('theme-red');
  }

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-red');
    const isRed = document.body.classList.contains('theme-red');
    localStorage.setItem('ps5_theme', isRed ? 'red' : 'blue');
    showToast(isRed ? '🔴 Switched to Crimson Spiderman Theme' : '🔵 Switched to Classic PlayStation Blue Theme');
  });
}

function initScrollReveal() {
  document.body.classList.add('js-reveal');
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  function checkViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  reveals.forEach(el => {
    if (checkViewport(el)) {
      el.classList.add('active');
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

function initParticleCanvas() {
  const canvas = document.getElementById('psParticleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    const isGlobal = canvas.classList.contains('global-particle-canvas');
    const parent = canvas.parentElement;
    width = canvas.width = isGlobal ? window.innerWidth : (parent ? parent.offsetWidth : window.innerWidth);
    height = canvas.height = isGlobal ? window.innerHeight : (parent ? parent.offsetHeight : window.innerHeight);
  }
  resize();
  window.addEventListener('resize', resize);

  const shapes = ['▲', '●', '✖', '■'];
  const colors = ['#00b06f', '#e60012', '#0070d1', '#df0067'];

  const particles = [];
  const count = Math.min(Math.floor((width * height) / 24000), 55);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 16 + 14,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.015,
      alpha: Math.random() * 0.3 + 0.12
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;

      if (p.x < -30) p.x = width + 30;
      if (p.x > width + 30) p.x = -30;
      if (p.y < -30) p.y = height + 30;
      if (p.y > height + 30) p.y = -30;

      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        p.x -= (dx / dist) * 1.2;
        p.y -= (dy / dist) * 1.2;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.font = `bold ${p.size}px Outfit, sans-serif`;
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.shape, 0, 0);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function init3DTilt() {
  const cards = document.querySelectorAll('.ps-card, .game-card, .hero-img-scaled');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

function initCounterAnim() {
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length === 0) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNums.forEach(numEl => {
          const target = parseFloat(numEl.getAttribute('data-target'));
          const decimals = parseInt(numEl.getAttribute('data-decimals')) || 0;
          const duration = 1800;
          const startTime = performance.now();

          function updateNum(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            numEl.textContent = currentVal.toFixed(decimals);

            if (progress < 1) {
              requestAnimationFrame(updateNum);
            }
          }

          requestAnimationFrame(updateNum);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.querySelector('.hero-ps');
  if (heroSection) observer.observe(heroSection);
}

function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn-ps-blue, .btn-ps-red, .btn-ps-outline');

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ps-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

const GAMES_DATA = [
  { id: 1, title: 'EA Sports FC 25', category: 'Sports', rating: '4.9', players: '1-4 Players', img: 'images/game-fifa.jpg', desc: 'Latest rosters, Ultimate Team, and local kick-off tournaments.' },
  { id: 2, title: 'TEKKEN 8', category: 'Fighting', rating: '4.8', players: '1-2 Players', img: 'images/game-tekken.jpg', desc: 'Next-gen fighting graphics, 32 fighters, high speed combat.' },
  { id: 3, title: 'Call of Duty MW3', category: 'Action', rating: '4.7', players: '1-4 Players', img: 'images/game-cod.jpg', desc: 'Fast multiplayer splitscreen & Warzone battle royale.' },
  { id: 4, title: 'GTA V & God of War', category: 'Adventure', rating: '4.9', players: '1 Player', img: 'images/game-gta.jpg', desc: 'Stunning 4K 60FPS open world and epic mythological combat.' }
];

function initGameCardModals() {
  const cards = document.querySelectorAll('#games .game-card');
  cards.forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.setAttribute('title', 'Click to view game details');

    card.addEventListener('click', () => {
      const game = GAMES_DATA[index] || GAMES_DATA[0];
      openGameModal(game);
    });
  });
}

function openGameModal(game) {
  let modalEl = document.getElementById('gameDetailModal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'gameDetailModal';
    modalEl.className = 'modal fade';
    modalEl.setAttribute('tabindex', '-1');
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-0 pb-0">
          <h5 class="modal-title fw-bold text-dark"><i class="bi bi-controller text-danger me-2"></i>${game.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img src="${game.img}" alt="${game.title}" class="img-fluid rounded-3 mb-3 shadow-sm w-100" style="max-height: 220px; object-fit: cover;">
          <p class="text-muted small mb-3">${game.desc}</p>
          <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-3">
            <div>
              <span class="text-muted small d-block">Players</span>
              <strong class="text-dark"><i class="bi bi-people-fill text-primary me-1"></i>${game.players}</strong>
            </div>
            <div>
              <span class="text-muted small d-block">Rating</span>
              <strong class="text-dark"><i class="bi bi-star-fill text-warning me-1"></i>${game.rating} / 5.0</strong>
            </div>
            <div>
              <span class="text-muted small d-block">Resolution</span>
              <strong class="text-dark"><i class="bi bi-tv text-danger me-1"></i>4K 120Hz</strong>
            </div>
          </div>
        </div>
        <div class="modal-footer border-0 pt-0">
          <button id="btnBookThisGame" class="btn btn-ps-red w-100 justify-content-center">
            <i class="bi bi-whatsapp me-1"></i> Book Station For This Game via WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;

  const btnBook = modalEl.querySelector('#btnBookThisGame');
  if (btnBook) {
    btnBook.addEventListener('click', () => {
      const msg = `Hello PlayStation Hub! I would like to reserve a PS5 station to play: ${game.title}. Please confirm availability.`;
      showToast(`Opening WhatsApp to reserve station for ${game.title}... 🎮`);
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
      setTimeout(() => {
        window.open(`https://wa.me/201205298585?text=${encodeURIComponent(msg)}`, '_blank');
      }, 600);
    });
  }

  const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  bsModal.show();
}

const cartState = [];

function initMenuCart() {
  const menuItems = document.querySelectorAll('#cafe .menu-item');
  if (menuItems.length === 0) return;

  menuItems.forEach((item) => {
    const nameEl = item.querySelector('.menu-name');
    const priceEl = item.querySelector('[class^="menu-price"]');

    if (!nameEl || !priceEl) return;

    const name = nameEl.textContent.trim();
    const priceText = priceEl.textContent.replace(/[^0-9]/g, '');
    const price = parseInt(priceText) || 0;

    const rightGroup = document.createElement('div');
    rightGroup.className = 'd-flex align-items-center gap-2 ms-auto';

    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-sm btn-outline-danger rounded-circle py-0 px-2 btn-add-menu';
    addBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
    addBtn.setAttribute('title', `Add ${name} to order`);

    item.removeChild(priceEl);
    rightGroup.appendChild(priceEl);
    rightGroup.appendChild(addBtn);
    item.appendChild(rightGroup);

    addBtn.addEventListener('click', () => {
      addToCart(name, price);
    });
  });

  const cartFloating = document.createElement('div');
  cartFloating.id = 'cartFloatingBar';
  cartFloating.className = 'cart-floating-bar shadow-lg d-none';
  cartFloating.innerHTML = `
    <div class="d-flex align-items-center gap-3">
      <div class="position-relative">
        <i class="bi bi-bag-fill fs-4 text-white"></i>
        <span id="cartCountBadge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
      </div>
      <div>
        <span class="text-white-50 small d-block">Current Order</span>
        <strong id="cartTotalText" class="text-white fs-6">0 EGP</strong>
      </div>
    </div>
    <button id="btnViewCart" class="btn btn-light btn-sm fw-bold rounded-pill px-3">
      View Order <i class="bi bi-arrow-right ms-1"></i>
    </button>
  `;
  document.body.appendChild(cartFloating);

  document.getElementById('btnViewCart').addEventListener('click', openCartModal);
}

function addToCart(name, price) {
  const existing = cartState.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({ name, price, qty: 1 });
  }

  updateCartBar();
  showToast(`Added "${name}" to your cafe order! ☕`);
}

function updateCartBar() {
  const bar = document.getElementById('cartFloatingBar');
  const countBadge = document.getElementById('cartCountBadge');
  const totalText = document.getElementById('cartTotalText');

  const totalItems = cartState.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (totalItems > 0) {
    bar.classList.remove('d-none');
    countBadge.textContent = totalItems;
    totalText.textContent = `${totalPrice} EGP`;
  } else {
    bar.classList.add('d-none');
  }
}

function openCartModal() {
  let modalEl = document.getElementById('cartOrderModal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'cartOrderModal';
    modalEl.className = 'modal fade';
    modalEl.setAttribute('tabindex', '-1');
    document.body.appendChild(modalEl);
  }

  const totalPrice = cartState.reduce((sum, item) => sum + (item.price * item.qty), 0);

  modalEl.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow-lg">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold text-dark"><i class="bi bi-cup-hot-fill text-danger me-2"></i>Your Cafe Order Summary</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${cartState.length === 0 ? '<p class="text-muted text-center my-4">Your order list is currently empty.</p>' : `
            <ul class="list-group list-group-flush mb-3">
              ${cartState.map((item, i) => `
                <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <strong class="text-dark d-block">${item.name}</strong>
                    <span class="text-muted small">${item.price} EGP × ${item.qty} = ${item.price * item.qty} EGP</span>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary btn-cart-dec" data-index="${i}">-</button>
                    <button class="btn btn-outline-secondary disabled fw-bold">${item.qty}</button>
                    <button class="btn btn-outline-secondary btn-cart-inc" data-index="${i}">+</button>
                  </div>
                </li>
              `).join('')}
            </ul>
            <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
              <span class="fw-bold text-dark">Total Bill Amount:</span>
              <strong class="text-danger fs-5">${totalPrice} EGP</strong>
            </div>
          `}
        </div>
        <div class="modal-footer border-0">
          ${cartState.length > 0 ? `
            <button id="sendCartWhatsApp" class="btn btn-ps-red w-100 justify-content-center">
              <i class="bi bi-whatsapp me-1"></i> Send Order to Station Waiter via WhatsApp
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  modalEl.querySelectorAll('.btn-cart-inc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      cartState[idx].qty += 1;
      updateCartBar();
      openCartModal();
    });
  });

  modalEl.querySelectorAll('.btn-cart-dec').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.dataset.index);
      if (cartState[idx].qty > 1) {
        cartState[idx].qty -= 1;
      } else {
        cartState.splice(idx, 1);
      }
      updateCartBar();
      openCartModal();
    });
  });

  const sendBtn = modalEl.querySelector('#sendCartWhatsApp');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const itemsList = cartState.map(i => `• ${i.name} (x${i.qty})`).join('%0A');
      const msg = `Hello! I would like to order the following drinks/snacks to my station:%0A${itemsList}%0ATotal: ${totalPrice} EGP`;
      window.open(`https://wa.me/201205298585?text=${msg}`, '_blank');
    });
  }

  const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  bsModal.show();
}

function initReservationForm() {
  const form = document.querySelector('#location form');
  if (!form) return;

  form.onsubmit = null;
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cName')?.value || 'Guest';
    const phone = document.getElementById('cPhone')?.value || '';
    const roomSelect = document.getElementById('cRoom');
    const roomText = roomSelect ? roomSelect.options[roomSelect.selectedIndex].text : '';

    showToast(`Thank you ${name}! Your reservation request has been registered. 🎮`);

    const msg = `Hello PlayStation Hub! My name is ${name} (${phone}). I would like to reserve: ${roomText}. Please confirm availability.`;
    setTimeout(() => {
      window.open(`https://wa.me/201205298585?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1200);

    form.reset();
  });
}

function initTooltipsAndToasts() {
  let toastContainer = document.getElementById('psToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'psToastContainer';
    toastContainer.className = 'toast-container position-fixed p-3';
    toastContainer.style.bottom = '88px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '9999';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message) {
  const toastContainer = document.getElementById('psToastContainer');
  if (!toastContainer) return;

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-dark border-0 shadow-lg rounded-3 show';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi bi-controller text-danger fs-5"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 300);
  }, 4000);
}
