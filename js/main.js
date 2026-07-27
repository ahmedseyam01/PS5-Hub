/**
 * PlayStation Hub - Main Interactive JavaScript
 * Author: Ahmed Seyam (ahmedseyam01)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initThemeToggle();
  initGameCardModals();
  initRateCalculator();
  initMenuCart();
  initReservationForm();
  initTooltipsAndToasts();
});

/* ----------------------------------------------------
 * 1. Navbar Scroll Effect & Active Section Tracking
 * ---------------------------------------------------- */
function initNavbarScroll() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.nav-link-ps');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add shadow on scroll
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
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

/* ----------------------------------------------------
 * 2. PS5 Ambient Theme Toggler (DualSense Blue / Red)
 * ---------------------------------------------------- */
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

/* ----------------------------------------------------
 * 3. Interactive Game Cards Modal System
 * ---------------------------------------------------- */
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
          <a href="#location" data-bs-dismiss="modal" class="btn btn-ps-red w-100 justify-content-center">
            <i class="bi bi-calendar-check me-1"></i> Book Station For This Game
          </a>
        </div>
      </div>
    </div>
  `;

  const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  bsModal.show();
}

/* ----------------------------------------------------
 * 2. Interactive Live Rate & Bill Estimator Calculator
 * ---------------------------------------------------- */
function initRateCalculator() {
  const ratesSection = document.getElementById('rates');
  if (!ratesSection) return;

  const calcWrapper = document.createElement('div');
  calcWrapper.className = 'mt-5 p-4 bg-white rounded-4 shadow-sm border border-danger border-opacity-25';
  calcWrapper.innerHTML = `
    <div class="row align-items-center g-4">
      <div class="col-12 col-lg-5">
        <h3 class="h5 fw-bold text-dark mb-1"><i class="bi bi-calculator-fill text-danger me-2"></i>Quick Gaming Price Calculator</h3>
        <p class="text-muted small mb-3">Calculate your session cost with discount estimation in real-time.</p>
        
        <div class="mb-3">
          <label class="form-label text-muted small fw-semibold">Station Type</label>
          <select id="calcType" class="form-select form-select-ps">
            <option value="40">Single Player (40 EGP/h)</option>
            <option value="65" selected>Multi-Player 2-4 Players (65 EGP/h)</option>
            <option value="110">VIP Private AC Room (110 EGP/h)</option>
          </select>
        </div>

        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <label class="form-label text-muted small fw-semibold">Number of Hours</label>
            <span id="calcHoursLabel" class="fw-bold text-danger">2 Hours</span>
          </div>
          <input type="range" id="calcHours" class="form-range" min="1" max="8" value="2" step="0.5">
        </div>

        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" id="calcExtraControllers">
          <label class="form-check-label text-muted small fw-semibold" for="calcExtraControllers">
            Add Extra DualSense Controller (+15 EGP/h)
          </label>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="bg-subtle-section p-4 rounded-4 text-center border">
          <span class="text-muted small text-uppercase fw-bold tracking-wider d-block mb-1">Estimated Total Session Cost</span>
          <div class="d-flex justify-content-center align-items-baseline gap-2 mb-2">
            <span id="calcTotalCost" class="display-4 fw-bold text-dark">130</span>
            <span class="fs-4 text-muted fw-bold">EGP</span>
          </div>
          <div id="calcDiscountBadge" class="badge bg-success-subtle text-success px-3 py-2 rounded-pill d-none mb-3">
            <i class="bi bi-percent me-1"></i> 10% Long Session Discount Applied!
          </div>

          <div class="d-flex flex-wrap justify-content-center gap-2">
            <button id="calcBookBtn" class="btn btn-ps-red px-4">
              <i class="bi bi-whatsapp me-1"></i> Book Estimated Session on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  ratesSection.querySelector('.container').appendChild(calcWrapper);

  const calcType = calcWrapper.querySelector('#calcType');
  const calcHours = calcWrapper.querySelector('#calcHours');
  const calcHoursLabel = calcWrapper.querySelector('#calcHoursLabel');
  const calcExtra = calcWrapper.querySelector('#calcExtraControllers');
  const calcTotal = calcWrapper.querySelector('#calcTotalCost');
  const calcDiscountBadge = calcWrapper.querySelector('#calcDiscountBadge');
  const calcBookBtn = calcWrapper.querySelector('#calcBookBtn');

  function updateCost() {
    const ratePerHour = parseFloat(calcType.value);
    const hours = parseFloat(calcHours.value);
    const extraRate = calcExtra.checked ? 15 : 0;
    
    calcHoursLabel.textContent = `${hours} Hour${hours > 1 ? 's' : ''}`;

    let total = (ratePerHour + extraRate) * hours;
    
    // 10% discount if 3 hours or more
    if (hours >= 3) {
      total = total * 0.9;
      calcDiscountBadge.classList.remove('d-none');
    } else {
      calcDiscountBadge.classList.add('d-none');
    }

    calcTotal.textContent = Math.round(total);
  }

  calcType.addEventListener('change', updateCost);
  calcHours.addEventListener('input', updateCost);
  calcExtra.addEventListener('change', updateCost);

  calcBookBtn.addEventListener('click', () => {
    const typeName = calcType.options[calcType.selectedIndex].text;
    const hours = calcHours.value;
    const total = calcTotal.textContent;
    const msg = `Hello PlayStation Hub! I want to book: ${typeName} for ${hours} hours. Total estimated cost: ${total} EGP.`;
    window.open(`https://wa.me/201000000000?text=${encodeURIComponent(msg)}`, '_blank');
  });

  updateCost();
}

/* ----------------------------------------------------
 * 5. Interactive Drinks & Snacks Order Cart
 * ---------------------------------------------------- */
const cartState = [];

function initMenuCart() {
  const menuItems = document.querySelectorAll('#cafe .menu-item');
  if (menuItems.length === 0) return;

  // Add "Add" buttons to menu items
  menuItems.forEach((item, index) => {
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

  // Create Floating Cart Bar
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

  // Attach quantity change handlers
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
      window.open(`https://wa.me/201000000000?text=${msg}`, '_blank');
    });
  }

  const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  bsModal.show();
}

/* ----------------------------------------------------
 * 6. Interactive Reservation Form Handling
 * ---------------------------------------------------- */
function initReservationForm() {
  const form = document.querySelector('#location form');
  if (!form) return;

  // Replace default alert onsubmit with interactive handler
  form.onsubmit = null;
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cName')?.value || 'Guest';
    const phone = document.getElementById('cPhone')?.value || '';
    const roomSelect = document.getElementById('cRoom');
    const roomText = roomSelect ? roomSelect.options[roomSelect.selectedIndex].text : '';

    showToast(`Thank you ${name}! Your reservation request has been registered. 🎮`);

    // Open WhatsApp pre-filled message
    const msg = `Hello PlayStation Hub! My name is ${name} (${phone}). I would like to reserve: ${roomText}. Please confirm availability.`;
    setTimeout(() => {
      window.open(`https://wa.me/201000000000?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1200);

    form.reset();
  });
}

/* ----------------------------------------------------
 * 7. Toast Notification System
 * ---------------------------------------------------- */
function initTooltipsAndToasts() {
  let toastContainer = document.getElementById('psToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'psToastContainer';
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
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
