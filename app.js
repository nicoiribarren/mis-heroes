/* ── 'MIS HÉROES' WEB INTERACTIVA - LÓGICA CORE ── */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMenuMobile();
  initProductFilter();
  initSizeQuiz();
  initScrollReveal();
  initHeroParallax();
  initToastContainer();
});

/* ── 1. NAVBAR SCROLL EFFECT ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initially
}

/* ── 2. MENU MOBILE HAMBURGUER ── */
function initMenuMobile() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  if (!hamburger || !navLinks) return;

  window.toggleMenu = function() {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  };

  // Close menu when clicking links
  document.querySelectorAll('#navLinks a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ── 3. REAL-TIME ANIMATED PRODUCT FILTERS ── */
function initProductFilter() {
  const filterControls = document.querySelector('.filter-controls');
  if (!filterControls) return;

  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  window.filterProducts = function(category, buttonEl) {
    // 1. Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (buttonEl) {
      buttonEl.classList.add('active');
    } else {
      // Find button by category if called programmatically
      const matchingBtn = Array.from(filterButtons).find(btn => btn.getAttribute('onclick').includes(`'${category}'`));
      if (matchingBtn) matchingBtn.classList.add('active');
    }

    // 2. Perform animated filter
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const matches = (category === 'all' || cardCategory === category);

      if (matches) {
        // If hidden, show it
        if (card.style.display === 'none') {
          card.style.display = 'flex';
          // Trigger reflow for transition
          card.offsetHeight; 
          card.classList.remove('fade-out');
        } else {
          card.classList.remove('fade-out');
        }
      } else {
        // Add fade-out transition
        card.classList.add('fade-out');
        // Hide after transition ends (300ms matching CSS)
        setTimeout(() => {
          if (card.classList.contains('fade-out')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  };
}

/* ── 4. INTERACTIVE SIZE QUIZ ("ENCONTRÁ TU TALLE") ── */
function initSizeQuiz() {
  const quizButtons = document.querySelectorAll('.sf-quiz-btn');
  const resultBox = document.getElementById('sfResult');
  const resultCategory = document.getElementById('sfCategory');
  const resultDetails = document.getElementById('sfDetails');
  const resultActionFilter = document.getElementById('sfActionFilter');

  if (!quizButtons.length || !resultBox) return;

  // Age lines mapping
  const quizData = {
    '0-12m': {
      category: 'Bebés',
      tag: 'babies',
      details: 'Para recién nacidos y bebés de hasta 1 año. Talles recomendados: **00 al 4**. Prendas de algodón ultra-suave e hipoalergénicas para proteger su piel.'
    },
    '1-2y': {
      category: 'Bebés grandes',
      tag: 'babies',
      details: 'Para pequeños exploradores de 1 a 2 años. Talles recomendados: **4 al 6**. Diseños cómodos y elásticos ideales para sus primeros pasos.'
    },
    '3-5y': {
      category: 'Niños Kids',
      tag: 'kids',
      details: 'Para chicos inquietos de 3 a 5 años. Talles recomendados: **6 al 8**. Ropa resistente y colorida para jugar en el jardín y en casa.'
    },
    '6-9y': {
      category: 'Niños Grandes',
      tag: 'kids',
      details: 'Para chicos dinámicos de 6 a 9 años. Talles recomendados: **8 al 12**. Diseños modernos listos para la escuela, salidas y aventuras.'
    },
    '10-12y': {
      category: 'Teens inicial',
      tag: 'teens',
      details: 'Para pre-adolescentes de 10 a 12 años. Talles recomendados: **12 al 14**. Estilos a la moda con la comodidad que ellos empiezan a exigir.'
    },
    '13-14y': {
      category: 'Teens / Adolescentes',
      tag: 'teens',
      details: 'Para adolescentes de 13 a 14+ años. Talles recomendados: **14 al 18+ (Teens)**. Colecciones urbanas con las últimas tendencias de la temporada.'
    }
  };

  quizButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states
      quizButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const ageKey = button.getAttribute('data-age');
      const match = quizData[ageKey];

      if (match) {
        // Populate results
        resultCategory.textContent = match.category;
        
        // Convert bold markdown-style **text** to HTML
        resultDetails.innerHTML = match.details.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Setup filter button action
        resultActionFilter.onclick = (e) => {
          e.preventDefault();
          
          // 1. Filter the shop
          window.filterProducts(match.tag);

          // 2. Smooth scroll to nouveautés section
          const catalogSection = document.getElementById('novedades');
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // 3. Show a feedback Toast
          showToast('Catálogo filtrado', `Mostrando ropa para ${match.category}`, 'fotos/logo.png');
        };

        // Reveal the result box smoothly
        resultBox.classList.add('show');
      }
    });
  });
}

/* ── 5. TOAST NOTIFICATION SYSTEM ── */
let toastContainer;
function initToastContainer() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

window.showToast = function(title, desc, imgSrc = '') {
  if (!toastContainer) initToastContainer();

  const toast = document.createElement('div');
  toast.className = 'toast-item';

  let imgHTML = '';
  if (imgSrc) {
    imgHTML = `<img src="${imgSrc}" class="toast-img" onerror="this.src='logo.png'">`;
  }

  toast.innerHTML = `
    ${imgHTML}
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${desc}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Play a tiny subtle vibration on mobile if supported
  if (navigator.vibrate) navigator.vibrate(20);

  // Remove toast after 3.2 seconds
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3200);
};

/* ── 6. ELASTIC CART LOGIC WITH ANIMATED SIDEBAR ── */
let cartItems = [];

/* ──────────────────────────────────────────────────────────
   MÓDULO DE ENVÍOS — Correo Argentino + Andreani
   ──────────────────────────────────────────────────────────
   API-READY: hoy las tarifas son estimadas por zona. Cuando
   la dueña tenga cuenta de Correo Argentino y contrato con
   Andreani, se reemplaza quoteShipping() por una llamada al
   backend que consulta las APIs reales (ver TODO abajo).
   ────────────────────────────────────────────────────────── */

// Tarifas estimadas (paquete de ropa ~0.5-1 kg). Editables.
const SHIPPING_RATES = {
  cercano:  { correo: 3500, andreani: 4200, dias: '1 a 2 días hábiles', label: 'Rosario y alrededores' },
  centro:   { correo: 5500, andreani: 6500, dias: '2 a 4 días hábiles', label: 'CABA, GBA y centro' },
  nacional: { correo: 7500, andreani: 8900, dias: '3 a 6 días hábiles', label: 'Resto del país' }
};

// Clasifica el código postal argentino (4 dígitos) en una zona.
function zoneFromCP(cp) {
  const n = parseInt(cp, 10);
  if (isNaN(n)) return null;
  // Santa Fe sur / Rosario / Funes (CP 2000–2299) = zona cercana
  if (n >= 2000 && n <= 2299) return 'cercano';
  // CABA (1000–1499) y GBA / centro (1500–1999, 2300–2999) = zona centro
  if ((n >= 1000 && n <= 1999) || (n >= 2300 && n <= 2999)) return 'centro';
  // Resto del país
  return 'nacional';
}

// Estado del envío seleccionado
let shipState = { method: 'pickup', carrier: null, cost: 0, zone: null, cp: '' };

window.selectShipMethod = function(method) {
  shipState.method = method;
  if (method === 'pickup') { shipState.carrier = null; shipState.cost = 0; }
  document.getElementById('shipPickupOpt').classList.toggle('selected', method === 'pickup');
  document.getElementById('shipDeliveryOpt').classList.toggle('selected', method === 'delivery');
  document.getElementById('shipCpBox').classList.toggle('open', method === 'delivery');
  updateCartUI();
};

window.quoteShipping = function() {
  const cp = (document.getElementById('cpInput').value || '').trim();
  const box = document.getElementById('shipCarriers');
  if (cp.length !== 4) {
    box.innerHTML = `<p class="ship-disclaimer" style="color:var(--primary);">Ingresá un código postal válido de 4 dígitos.</p>`;
    return;
  }
  const zone = zoneFromCP(cp);
  const r = SHIPPING_RATES[zone];
  shipState.zone = zone;
  shipState.cp = cp;

  /* TODO (fase 2 - API real):
     const rates = await fetch('/api/shipping?cp='+cp).then(r=>r.json());
     y reemplazar r.correo / r.andreani por rates.correo / rates.andreani */

  box.innerHTML = `
    <div class="carrier-opt" onclick="selectCarrier('correo', ${r.correo})" id="carrierCorreo">
      <span class="carrier-logo logo-correo">CORREO<br>AR</span>
      <span class="carrier-info"><strong>Correo Argentino</strong><small>${r.dias}</small></span>
      <span class="carrier-price">$${r.correo.toLocaleString('es-AR')}</span>
      <span class="carrier-check"><svg class="icon"><use href="#i-check"/></svg></span>
    </div>
    <div class="carrier-opt" onclick="selectCarrier('andreani', ${r.andreani})" id="carrierAndreani">
      <span class="carrier-logo logo-andreani">andreani</span>
      <span class="carrier-info"><strong>Andreani</strong><small>${r.dias}</small></span>
      <span class="carrier-price">$${r.andreani.toLocaleString('es-AR')}</span>
      <span class="carrier-check"><svg class="icon"><use href="#i-check"/></svg></span>
    </div>
  `;
};

window.selectCarrier = function(carrier, cost) {
  shipState.carrier = carrier;
  shipState.cost = cost;
  document.getElementById('carrierCorreo').classList.toggle('selected', carrier === 'correo');
  document.getElementById('carrierAndreani').classList.toggle('selected', carrier === 'andreani');
  updateCartUI();
};

window.addToCart = function(name, img, sizes, btn) {
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cartItems.push({ name, img, sizes, qty: 1 });
  }

  updateCartUI();
  
  // Dynamic button feedback
  if (btn) {
    const originalContent = btn.innerHTML;
    btn.innerHTML = '✓ Agregado';
    btn.style.background = '#27ae60';
    btn.style.color = 'white';
    btn.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.transform = '';
    }, 1200);
  }

  // Animate cart icon badge pulse
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.classList.remove('pulse-animation');
    void badge.offsetWidth; // Trigger reflow to restart animation
    badge.classList.add('pulse-animation');
  }

  // Open cart drawer after addition
  setTimeout(() => {
    openCart();
    // Trigger toast confirmation
    showToast('Producto añadido', `${name} (${sizes})`, img);
  }, 100);
};

window.removeFromCart = function(index) {
  const cartItemElements = document.querySelectorAll('.cart-item');
  const targetItem = cartItemElements[index];

  if (targetItem) {
    // Add remove animation class first
    targetItem.classList.add('removing');
    
    // Wait for the slide-out animation to complete (300ms)
    setTimeout(() => {
      const removedItem = cartItems[index];
      cartItems.splice(index, 1);
      updateCartUI();
      if (removedItem) {
        showToast('Eliminado del carrito', removedItem.name, removedItem.img);
      }
    }, 300);
  } else {
    cartItems.splice(index, 1);
    updateCartUI();
  }
};

window.changeQty = function(index, delta) {
  cartItems[index].qty += delta;
  
  if (cartItems[index].qty <= 0) {
    window.removeFromCart(index);
  } else {
    updateCartUI();
  }
};

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  
  if (badge) {
    badge.textContent = totalItems;
    badge.classList.toggle('show', totalItems > 0);
  }

  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  if (cartItems.length === 0) {
    if (body) {
      body.innerHTML = `
        <div class="cart-empty">
          <span class="empty-icon"><svg class="icon"><use href="#i-cart"/></svg></span>
          <p>Tu carrito está vacío.<br>¡Agregá productos para comenzar!</p>
        </div>
      `;
    }
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';
  
  if (body) {
    body.innerHTML = cartItems.map((item, i) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.style.background='#f5f0ef';this.src='logo.png'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-sub">${item.sizes}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${i}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i}, +1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})" title="Eliminar"><svg class="icon"><use href="#i-trash"/></svg></button>
      </div>
    `).join('');
  }

  // ── Resumen de entrega ──
  const totalEl = document.getElementById('cartTotal');
  let shipLine = '';
  if (shipState.method === 'pickup') {
    if (totalEl) totalEl.textContent = 'Retiro gratis';
    shipLine = '%0A%0AEntrega: Retiro en el local (Presidente Perón 1953, Funes)';
  } else if (shipState.carrier) {
    const name = shipState.carrier === 'correo' ? 'Correo Argentino' : 'Andreani';
    if (totalEl) totalEl.textContent = '+ $' + shipState.cost.toLocaleString('es-AR') + ' envío';
    shipLine = `%0A%0AEntrega: Envío a domicilio por ${encodeURIComponent(name)} (CP ${shipState.cp}) - $${shipState.cost.toLocaleString('es-AR')}`;
  } else {
    if (totalEl) totalEl.textContent = 'Consultable';
    shipLine = '%0A%0AEntrega: Envío a domicilio (a cotizar)';
  }

  // Build WhatsApp order request string
  const itemsList = cartItems.map(item => `• ${item.name} (${item.sizes}) x${item.qty}`).join('%0A');
  const whatsappMsg = `Hola%20Mis%20Heroes!%20Quiero%20hacer%20este%20pedido%20%F0%9F%91%97%0A%0A${itemsList}${shipLine}%0A%0A%C2%BFMe%20confirman%20disponibilidad%20y%20total%3F`;
  const checkoutBtn = document.getElementById('waCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.href = `https://wa.me/543415884977?text=${whatsappMsg}`;
  }
}

window.openCart = function() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCart = function() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.showMpModal = function() {
  const mpModal = document.getElementById('mpModal');
  if (mpModal) mpModal.classList.add('open');
};

/* ── 7. FAVORITES (WISHLIST) INTERACTION ── */
let wishCount = 0;
window.toggleWish = function(btn) {
  if (!btn) return;
  
  const card = btn.closest('.product-card');
  const productName = card ? card.querySelector('.product-name').textContent : 'Prenda';
  
  if (!btn.classList.contains('active')) {
    btn.classList.add('active');
    wishCount++;
    showToast('Añadido a favoritos', productName, card ? card.querySelector('.product-img img').src : '');
    
    if (wishCount === 1) {
      setTimeout(() => {
        const wishlistModal = document.getElementById('modalOverlay');
        if (wishlistModal) wishlistModal.classList.add('open');
      }, 500);
    }
  } else {
    btn.classList.remove('active');
    showToast('Quitado de favoritos', productName);
  }
};

window.closeModal = function() {
  const wishlistModal = document.getElementById('modalOverlay');
  if (wishlistModal) wishlistModal.classList.remove('open');
};

// Handle clicks outside modals to close them
document.addEventListener('click', (e) => {
  const mpModal = document.getElementById('mpModal');
  const wishlistModal = document.getElementById('modalOverlay');
  
  if (e.target === mpModal) mpModal.classList.remove('open');
  if (e.target === wishlistModal) wishlistModal.classList.remove('open');
});

/* ── 8. SMOOTH SCROLL-TRIGGERED REVEALS (Intersection Observer) ── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px' // Trigger slightly before element enters view
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ── 9. INTERACTIVE HERO MOUSE PARALLAX EFFECT ── */
function initHeroParallax() {
  const hero = document.getElementById('hero');
  const bubbles = document.querySelectorAll('.bubble');
  const illustration = document.querySelector('.hero-illustration');
  
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Normalized coordinates (-0.5 to 0.5)
    const pageX = (clientX / width) - 0.5;
    const pageY = (clientY / height) - 0.5;

    // Slide bubbles slightly based on index speed
    bubbles.forEach((bubble, index) => {
      const speed = (index + 1) * 20;
      const xTranslate = pageX * speed;
      const yTranslate = pageY * speed;
      bubble.style.transform = `translate(${xTranslate}px, ${yTranslate}px)`;
    });

    // Rotate and shift hero illustration slightly
    if (illustration) {
      const xRotate = pageX * 12; // Max 6 deg
      const yRotate = -pageY * 12; // Max 6 deg
      illustration.style.transform = `perspective(1000px) rotateY(${xRotate}deg) rotateX(${yRotate}deg) translateY(${pageY * 10}px)`;
    }
  }, { passive: true });

  // Reset positions when mouse leaves
  hero.addEventListener('mouseleave', () => {
    bubbles.forEach(bubble => {
      bubble.style.transform = 'translate(0px, 0px)';
    });
    if (illustration) {
      illustration.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    }
  });
}
