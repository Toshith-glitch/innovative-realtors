// ============================================================
//  Innovative Realtors — Main Public Site Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Apply Dynamic Site Settings ──────────────────────────
  const settings = DB.get('settings');
  const hero     = DB.get('hero');

  // Inject Branding and Company name
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.dataset.setting;
    if (settings[key]) el.textContent = settings[key];
  });

  // Inject Accent Theme Color (Gold-Amber)
  document.documentElement.style.setProperty('--gold', settings.accentColor || '#d8912a');

  // Inject Hero Content
  const heroTitle = document.getElementById('hero-title-text');
  if (heroTitle && hero.headline) {
    heroTitle.innerHTML = hero.headline.replace(/(profitable investments|luxury|dreams?|perfect)/gi, '<span>$&</span>');
  }
  const heroSub = document.getElementById('hero-sub-text');
  if (heroSub && hero.subheadline) {
    heroSub.textContent = hero.subheadline;
  }

  // Inject Stats counters
  document.querySelectorAll('[data-stat="years"]').forEach(el => el.textContent = settings.yearsExp || '5+');
  document.querySelectorAll('[data-stat="sold"]').forEach(el => el.textContent = settings.propertiesSold || '20+');
  document.querySelectorAll('[data-stat="clients"]').forEach(el => el.textContent = settings.happyClients || '100%');

  // Inject Contact details
  document.querySelectorAll('[data-contact]').forEach(el => {
    const key = el.dataset.contact;
    if (settings[key]) el.textContent = settings[key];
    if (el.tagName === 'A' && settings[key]) {
      if (key === 'phone') el.href = `tel:${settings[key]}`;
      if (key === 'email') el.href = `mailto:${settings[key]}`;
    }
  });

  // Dynamic social link mappings
  ['facebook', 'instagram', 'twitter', 'linkedin'].forEach(s => {
    document.querySelectorAll(`[data-social="${s}"]`).forEach(el => {
      if (settings[s]) el.href = settings[s];
    });
  });

  // ── Sticky Header Scroll Transition ───────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // ── Mobile Navigation Toggle Menu ─────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu drawer on clicking any anchor
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Fade-In On Scroll Observer ────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── Smooth Anchor Scrollings ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PORTFOLIO PROJECTS GRID (LOCAL STORAGE CAPTURE)
  // ═══════════════════════════════════════════════════════════
  let activeRegionFilter = 'All';
  const propertiesGrid = document.getElementById('properties-grid');
  const tabButtons = document.querySelectorAll('.portfolio-filter-tabs button');

  function renderPortfolio() {
    if (!propertiesGrid) return;
    const properties = DB.get('properties');
    
    // Filter by Region
    const filtered = properties.filter(p => {
      if (activeRegionFilter === 'All') return true;
      return (p.region || 'India').toLowerCase() === activeRegionFilter.toLowerCase();
    });

    if (!filtered.length) {
      propertiesGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
          <span>🏠</span>
          No properties matching this section yet.
        </div>`;
      return;
    }

    propertiesGrid.innerHTML = filtered.map(p => `
      <div class="property-card fade-in" onclick="openPropertyModal('${p.id}')">
        <img class="property-card-img" src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='assets/property1.png'">
        <div class="property-card-tag">${p.region || 'India'}</div>
        ${p.featured ? `<div class="property-card-featured">★ Featured</div>` : ''}
        
        <div class="property-glass-box">
          <div class="property-glass-left">
            <div class="property-glass-location">📍 ${p.location}</div>
            <h3 class="property-glass-title">${p.title}</h3>
            <div class="property-glass-specs">
              <span>🛏️ ${p.bedrooms} Beds</span>
              <span>🚿 ${p.bathrooms} Baths</span>
              <span>📐 ${Number(p.area).toLocaleString()} sq ft</span>
            </div>
          </div>
          <div class="property-glass-right">
            <div class="property-glass-arrow">➔</div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-observe fade-in cards
    document.querySelectorAll('.property-card.fade-in').forEach(el => observer.observe(el));
  }

  // Hook tab switch buttons
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRegionFilter = btn.dataset.region;
      renderPortfolio();
    });
  });

  // Hook navbar specific filters
  document.querySelectorAll('.region-filter-link, .mobile-region-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const region = link.dataset.filterRegion;
      const targetBtn = Array.from(tabButtons).find(b => b.dataset.region.toLowerCase() === region.toLowerCase());
      if (targetBtn) {
        e.preventDefault();
        targetBtn.click();
        const targetSec = document.getElementById('properties');
        if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Run initial portfolio rendering
  renderPortfolio();

  // ═══════════════════════════════════════════════════════════
  // PROPERTY OVERLAY DETAILS MODAL
  // ═══════════════════════════════════════════════════════════
  window.openPropertyModal = function(id) {
    const p = DB.get('properties').find(x => x.id === id);
    if (!p) return;

    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-img').onerror = function() { this.src = 'assets/property1.png'; };
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-region-badge').textContent = p.region || 'India';
    document.getElementById('modal-status-badge').textContent = p.status || 'For Sale';
    document.getElementById('modal-location').textContent = `📍 ${p.location}`;
    document.getElementById('modal-beds').textContent = `${p.bedrooms} Beds`;
    document.getElementById('modal-baths').textContent = `${p.bathrooms} Baths`;
    document.getElementById('modal-area').textContent = `${Number(p.area).toLocaleString()} sq ft`;
    document.getElementById('modal-code').textContent = p.id;
    document.getElementById('modal-price').textContent = `$${Number(p.price).toLocaleString()}`;
    document.getElementById('modal-desc').textContent = p.description || 'No description provided for this listing.';

    const featBadge = document.getElementById('modal-featured-badge');
    if (featBadge) featBadge.style.display = p.featured ? 'inline-block' : 'none';

    document.getElementById('property-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('property-modal');

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC TEAM / AGENTS GRID
  // ═══════════════════════════════════════════════════════════
  const agentsGrid = document.getElementById('agents-grid');
  function renderAgents() {
    if (!agentsGrid) return;
    const agents = DB.get('agents');
    
    agentsGrid.innerHTML = agents.map(a => `
      <div class="service-card fade-in" style="text-align: center; align-items: center;">
        <div style="width: 140px; height: 140px; border-radius: 50%; overflow: hidden; margin-bottom: 20px; box-shadow: var(--shadow-sm); border: 3px solid rgba(216,145,42,0.15)">
          <img src="${a.image}" alt="${a.name}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; ${a.id === 'a2' ? 'transform: scale(1.45);' : ''}" onerror="this.src='assets/agent1.png'">
        </div>
        <h3 class="service-title" style="margin-bottom: 4px; font-size: 18px;">${a.name}</h3>
        <div style="font-family: 'Poppins', sans-serif; font-size: 11px; color: var(--gold); font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">${a.role}</div>
        <p class="service-desc" style="font-size: 13.5px;">${a.bio}</p>
        <div style="font-size: 11px; font-weight: 500; color: var(--text-muted); margin-bottom: 18px; text-transform: uppercase; letter-spacing: 0.5px;">🏷️ Specialties: ${a.specialties}</div>
        <div style="display: flex; gap: 8px; width: 100%; justify-content: center; margin-top: auto;">
          <a href="tel:${a.phone}" class="btn btn-outline btn-sm" style="flex: 1; justify-content: center; font-size: 12px; padding: 8px 0;">📞 Call</a>
          <a href="mailto:${a.email}" class="btn btn-dark btn-sm" style="flex: 1; justify-content: center; font-size: 12px; padding: 8px 0;">✉️ Email</a>
        </div>
      </div>
    `).join('');

    // Observe fade-in agents
    document.querySelectorAll('#agents-grid .fade-in').forEach(el => observer.observe(el));
  }
  renderAgents();

  // ═══════════════════════════════════════════════════════════
  // HORIZONTAL SWIPER CLIENT TESTIMONIALS SLIDER
  // ═══════════════════════════════════════════════════════════
  const track = document.getElementById('testimonials-track');
  const dotsWrap = document.getElementById('carousel-dots');
  let currentSlide = 0;
  let slidesPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;

  function renderTestimonials() {
    if (!track) return;
    const testimonials = DB.get('testimonials');
    
    track.innerHTML = testimonials.map(t => `
      <div class="testimonial-card fade-in">
        <div class="testimonial-quote-mark">“</div>
        <p class="testimonial-text">${t.quote}</p>
        <div class="testimonial-rating">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.avatar || '👤'}</div>
          <div>
            <h4 class="testimonial-author-name">${t.name}</h4>
            <span class="testimonial-author-role">${t.role}</span>
          </div>
        </div>
      </div>
    `).join('');

    updateTestimonialControls();
    document.querySelectorAll('.testimonial-card.fade-in').forEach(el => observer.observe(el));
  }

  function updateTestimonialControls() {
    const testimonials = DB.get('testimonials');
    const total = testimonials.length;
    const maxSlide = Math.max(0, total - slidesPerView);
    
    if (dotsWrap) {
      dotsWrap.innerHTML = Array.from({ length: maxSlide + 1 }, (_, i) => 
        `<div class="slider-dot ${i === currentSlide ? 'active' : ''}" data-idx="${i}"></div>`
      ).join('');
      
      dotsWrap.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.idx)));
      });
    }
  }

  function goToSlide(idx) {
    const testimonials = DB.get('testimonials');
    const total = testimonials.length;
    const maxSlide = Math.max(0, total - slidesPerView);
    currentSlide = Math.max(0, Math.min(idx, maxSlide));
    
    const cardW = track?.children[0]?.offsetWidth || 0;
    if (track) {
      // account for flex gap of 28px
      track.style.transform = `translateX(-${currentSlide * (cardW + 28)}px)`;
    }
    
    dotsWrap?.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.getElementById('carousel-prev')?.addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('carousel-next')?.addEventListener('click', () => goToSlide(currentSlide + 1));

  window.addEventListener('resize', () => {
    slidesPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
    goToSlide(0);
    updateTestimonialControls();
  });

  // Auto Scroll slider logic
  let autoAdvanceInterval = setInterval(() => {
    const testimonials = DB.get('testimonials');
    const max = Math.max(0, testimonials.length - slidesPerView);
    goToSlide(currentSlide >= max ? 0 : currentSlide + 1);
  }, 6000);

  // Pause auto advance when user interacts
  [document.getElementById('carousel-prev'), document.getElementById('carousel-next'), dotsWrap].forEach(el => {
    el?.addEventListener('click', () => {
      clearInterval(autoAdvanceInterval);
    });
  });

  renderTestimonials();

  // ═══════════════════════════════════════════════════════════
  // SECURE INQUIRY FORM DISPATCH
  // ═══════════════════════════════════════════════════════════
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    
    const inquiry = {
      id:       DB.uid(),
      name:     data.get('name'),
      email:    data.get('email'),
      phone:    data.get('phone') || '',
      interest: data.get('interest') || 'General Property Management',
      message:  data.get('message'),
      date:     new Date().toISOString(),
      read:     false
    };

    // Save to Database inquiries
    DB.add('inquiries', inquiry);
    this.reset();

    // Trigger visual validation alert message
    if (formSuccess) {
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }
  });

});
