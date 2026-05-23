// ============================================================
//  Innovative Realtors — Admin Panel JavaScript
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Auth ───────────────────────────────────────────────
  const loginScreen = document.getElementById('login-screen');
  const app         = document.getElementById('app');

  function isLoggedIn() { return sessionStorage.getItem('ir_admin') === 'true'; }

  function showApp() {
    loginScreen.style.display = 'none';
    app.style.display = 'flex';
    updateHeaderTime();
    setInterval(updateHeaderTime, 60000);
    navigate('dashboard');
  }

  if (isLoggedIn()) showApp();

  document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const pass = document.getElementById('login-pass').value;
    const settings = DB.get('settings');
    if (pass === settings.adminPassword) {
      sessionStorage.setItem('ir_admin', 'true');
      document.getElementById('login-error').classList.remove('show');
      showApp();
    } else {
      document.getElementById('login-error').classList.add('show');
      document.getElementById('login-pass').value = '';
    }
  });

  document.getElementById('sidebar-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('ir_admin');
    location.reload();
  });

  // ── Time ──────────────────────────────────────────────
  function updateHeaderTime() {
    const el = document.getElementById('header-time');
    if (el) el.textContent = new Date().toLocaleString('en-US', {
      weekday:'short', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit',
    });
  }

  // ── Toast ──────────────────────────────────────────────
  function toast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span><span class="toast-msg">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3200);
  }

  // ── Confirm dialog ─────────────────────────────────────
  let _confirmResolve = null;
  function confirm(title, msg) {
    return new Promise(resolve => {
      _confirmResolve = resolve;
      document.getElementById('confirm-title').textContent = title;
      document.getElementById('confirm-msg').textContent   = msg;
      document.getElementById('confirm-overlay').classList.add('open');
    });
  }
  document.getElementById('confirm-yes')?.addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.remove('open');
    _confirmResolve && _confirmResolve(true);
  });
  document.getElementById('confirm-no')?.addEventListener('click', () => {
    document.getElementById('confirm-overlay').classList.remove('open');
    _confirmResolve && _confirmResolve(false);
  });

  // ── Navigation ─────────────────────────────────────────
  window.navigate = function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (navEl) navEl.classList.add('active');

    document.querySelector('.breadcrumb-current').textContent =
      { dashboard:'Dashboard', properties:'Properties', agents:'Agents',
        testimonials:'Testimonials', inquiries:'Inquiries',
        hero:'Hero Banner', settings:'Site Settings' }[page] || page;

    // Refresh page content
    const renderers = {
      dashboard:    renderDashboard,
      properties:   renderPropertiesPage,
      agents:       renderAgentsPage,
      testimonials: renderTestimonialsPage,
      inquiries:    renderInquiriesPage,
      hero:         renderHeroPage,
      settings:     renderSettingsPage,
    };
    renderers[page]?.();

    // Update inquiries badge
    updateInquiriesBadge();
  }

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });

  function updateInquiriesBadge() {
    const unread = DB.get('inquiries').filter(i => !i.read).length;
    const badge  = document.getElementById('inquiries-badge');
    if (badge) { badge.textContent = unread; badge.style.display = unread ? 'inline' : 'none'; }
  }

  // ════════════════════════════════════════════════════════
  //  DASHBOARD
  // ════════════════════════════════════════════════════════
  function renderDashboard() {
    const props    = DB.get('properties');
    const agents   = DB.get('agents');
    const tests    = DB.get('testimonials');
    const inquiries= DB.get('inquiries');
    const unread   = inquiries.filter(i => !i.read).length;

    document.getElementById('stat-properties').textContent = props.length;
    document.getElementById('stat-agents').textContent     = agents.length;
    document.getElementById('stat-testimonials').textContent = tests.length;
    document.getElementById('stat-inquiries').textContent  = inquiries.length;
    document.getElementById('stat-unread').textContent     = unread;

    // Recent inquiries in dashboard
    const recentWrap = document.getElementById('dashboard-recent-inquiries');
    if (recentWrap) {
      const recent = [...inquiries].reverse().slice(0, 5);
      if (!recent.length) {
        recentWrap.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📭</span><h3>No inquiries yet</h3><p>Contact form submissions will appear here.</p></div>`;
      } else {
        recentWrap.innerHTML = recent.map(i => `
          <div class="inquiry-card ${i.read ? '' : 'unread'}">
            <div class="inquiry-meta">
              <span class="inquiry-name">${i.name}</span>
              <span class="badge ${i.read ? 'badge-read' : 'badge-unread'}">${i.read ? 'Read' : 'New'}</span>
              <span class="inquiry-time">${new Date(i.date).toLocaleDateString()}</span>
            </div>
            <div class="inquiry-message">${i.message.substring(0,120)}${i.message.length>120?'…':''}</div>
          </div>
        `).join('');
      }
    }

    // Recent properties
    const recentPropsWrap = document.getElementById('dashboard-recent-props');
    if (recentPropsWrap) {
      const recent = [...props].reverse().slice(0, 5);
      recentPropsWrap.innerHTML = recent.map(p => `
        <tr>
          <td><img class="td-img" src="${p.image}" alt="" onerror="this.src='../assets/property1.png'"></td>
          <td><strong>${p.title}</strong><br><small>${p.type}</small></td>
          <td>${p.location}</td>
          <td>
            <span class="badge ${p.status==='For Sale'?'badge-sale':'badge-rent'}">${p.status}</span>
            <br><span class="badge" style="background:#ff99331a;color:#ff9933;border:1px solid #ff993333;margin-top:4px;display:inline-block">${p.region || 'India'}</span>
          </td>
          <td><strong>$${Number(p.price).toLocaleString()}</strong></td>
          <td><button class="action-btn btn-delete" onclick="deleteProperty('${p.id}')">🗑 Delete</button></td>
        </tr>
      `).join('');
    }
  }

  // ════════════════════════════════════════════════════════
  //  PROPERTIES
  // ════════════════════════════════════════════════════════
  let propSearchVal = '';

  function renderPropertiesPage() {
    const props = DB.get('properties').filter(p =>
      p.title.toLowerCase().includes(propSearchVal) ||
      p.location.toLowerCase().includes(propSearchVal) ||
      p.type.toLowerCase().includes(propSearchVal)
    );
    const tbody = document.getElementById('props-tbody');
    if (!tbody) return;
    if (!props.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><span class="empty-state-icon">🏠</span><h3>No properties found</h3></div></td></tr>`;
      return;
    }
    tbody.innerHTML = props.map(p => `
      <tr>
        <td><img class="td-img" src="${p.image}" alt="" onerror="this.src='../assets/property1.png'"></td>
        <td>
          <strong>${p.title}</strong>
          <br><small style="color:var(--text-dim)">${p.type} &bull; ${p.bedrooms} bd / ${p.bathrooms} ba</small>
        </td>
        <td>${p.location}</td>
        <td>
          <strong style="color:var(--gold)">$${Number(p.price).toLocaleString()}</strong>
          <br><span class="badge ${p.status==='For Sale'?'badge-sale':'badge-rent'}">${p.status}</span>
          <span class="badge" style="background:#ff99331a;color:#ff9933;border:1px solid #ff993333">${p.region || 'India'}</span>
        </td>
        <td><span class="badge ${p.featured?'badge-featured':'badge-read'}">${p.featured ? '⭐ Featured' : 'Standard'}</span></td>
        <td style="white-space:nowrap">
          <button class="action-btn btn-edit" onclick="editProperty('${p.id}')">✏️ Edit</button>
          <button class="action-btn btn-delete" onclick="deleteProperty('${p.id}')">🗑 Delete</button>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('prop-search')?.addEventListener('input', function() {
    propSearchVal = this.value.toLowerCase();
    renderPropertiesPage();
  });

  document.getElementById('btn-add-property')?.addEventListener('click', () => openPropertyModal());

  let editingPropertyId = null;

  window.editProperty = function(id) {
    const p = DB.get('properties').find(x => x.id === id);
    if (!p) return;
    editingPropertyId = id;
    fillPropertyForm(p);
    document.getElementById('prop-modal-title').textContent = 'Edit Property';
    openModal('prop-modal');
  };

  window.deleteProperty = async function(id) {
    const ok = await confirm('Delete Property', 'This action cannot be undone. Are you sure you want to delete this property?');
    if (!ok) return;
    DB.remove('properties', id);
    renderPropertiesPage();
    renderDashboard();
    toast('Property deleted successfully.');
  };

  function openPropertyModal() {
    editingPropertyId = null;
    document.getElementById('prop-form').reset();
    document.getElementById('prop-modal-title').textContent = 'Add New Property';
    openModal('prop-modal');
  }

  function fillPropertyForm(p) {
    const f = document.getElementById('prop-form');
    f.querySelector('[name="title"]').value      = p.title;
    f.querySelector('[name="type"]').value       = p.type;
    f.querySelector('[name="status"]').value     = p.status;
    f.querySelector('[name="region"]').value     = p.region || 'India';
    f.querySelector('[name="price"]').value      = p.price;
    f.querySelector('[name="bedrooms"]').value   = p.bedrooms;
    f.querySelector('[name="bathrooms"]').value  = p.bathrooms;
    f.querySelector('[name="area"]').value       = p.area;
    f.querySelector('[name="location"]').value   = p.location;
    f.querySelector('[name="image"]').value      = p.image;
    f.querySelector('[name="description"]').value= p.description;
    f.querySelector('[name="featured"]').checked = p.featured;
  }

  document.getElementById('prop-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    const prop = {
      title:       data.get('title'),
      type:        data.get('type'),
      status:      data.get('status'),
      region:      data.get('region') || 'India',
      price:       parseFloat(data.get('price')),
      bedrooms:    parseInt(data.get('bedrooms')),
      bathrooms:   parseInt(data.get('bathrooms')),
      area:        parseInt(data.get('area')),
      location:    data.get('location'),
      image:       data.get('image'),
      description: data.get('description'),
      featured:    data.get('featured') === 'on',
    };

    if (editingPropertyId) {
      DB.update('properties', editingPropertyId, prop);
      toast('Property updated successfully.');
    } else {
      DB.add('properties', { ...prop, id: DB.uid() });
      toast('Property added successfully.');
    }
    closeModal('prop-modal');
    renderPropertiesPage();
  });

  // ════════════════════════════════════════════════════════
  //  AGENTS
  // ════════════════════════════════════════════════════════
  let agentSearchVal = '';
  let editingAgentId = null;

  function renderAgentsPage() {
    const agents = DB.get('agents').filter(a =>
      a.name.toLowerCase().includes(agentSearchVal) ||
      a.role.toLowerCase().includes(agentSearchVal)
    );
    const tbody = document.getElementById('agents-tbody');
    if (!tbody) return;
    if (!agents.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><span class="empty-state-icon">👤</span><h3>No agents found</h3></div></td></tr>`;
      return;
    }
    tbody.innerHTML = agents.map(a => `
      <tr>
        <td><img class="td-avatar" src="${a.image}" alt="" style="${a.id === 'a2' ? 'transform: scale(1.45);' : ''}" onerror="this.src='../assets/agent1.png'"></td>
        <td><strong>${a.name}</strong></td>
        <td>${a.role}</td>
        <td>${a.phone}</td>
        <td>${a.email}</td>
        <td style="white-space:nowrap">
          <button class="action-btn btn-edit" onclick="editAgent('${a.id}')">✏️ Edit</button>
          <button class="action-btn btn-delete" onclick="deleteAgent('${a.id}')">🗑 Delete</button>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('agent-search')?.addEventListener('input', function() {
    agentSearchVal = this.value.toLowerCase();
    renderAgentsPage();
  });

  document.getElementById('btn-add-agent')?.addEventListener('click', () => {
    editingAgentId = null;
    document.getElementById('agent-form').reset();
    document.getElementById('agent-modal-title').textContent = 'Add New Agent';
    openModal('agent-modal');
  });

  window.editAgent = function(id) {
    const a = DB.get('agents').find(x => x.id === id);
    if (!a) return;
    editingAgentId = id;
    const f = document.getElementById('agent-form');
    f.querySelector('[name="name"]').value       = a.name;
    f.querySelector('[name="role"]').value       = a.role;
    f.querySelector('[name="phone"]').value      = a.phone;
    f.querySelector('[name="email"]').value      = a.email;
    f.querySelector('[name="image"]').value      = a.image;
    f.querySelector('[name="specialties"]').value= a.specialties;
    f.querySelector('[name="bio"]').value        = a.bio;
    document.getElementById('agent-modal-title').textContent = 'Edit Agent';
    openModal('agent-modal');
  };

  window.deleteAgent = async function(id) {
    const ok = await confirm('Delete Agent', 'Are you sure you want to remove this agent?');
    if (!ok) return;
    DB.remove('agents', id);
    renderAgentsPage();
    toast('Agent removed.');
  };

  document.getElementById('agent-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    const agent = {
      name:       data.get('name'),
      role:       data.get('role'),
      phone:      data.get('phone'),
      email:      data.get('email'),
      image:      data.get('image'),
      specialties:data.get('specialties'),
      bio:        data.get('bio'),
    };
    if (editingAgentId) {
      DB.update('agents', editingAgentId, agent);
      toast('Agent updated.');
    } else {
      DB.add('agents', { ...agent, id: DB.uid() });
      toast('Agent added.');
    }
    closeModal('agent-modal');
    renderAgentsPage();
  });

  // ════════════════════════════════════════════════════════
  //  TESTIMONIALS
  // ════════════════════════════════════════════════════════
  let editingTestId = null;
  let selectedRating = 5;

  function renderTestimonialsPage() {
    const tests = DB.get('testimonials');
    const tbody = document.getElementById('testimonials-tbody');
    if (!tbody) return;
    if (!tests.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><span class="empty-state-icon">⭐</span><h3>No testimonials yet</h3></div></td></tr>`;
      return;
    }
    tbody.innerHTML = tests.map(t => `
      <tr>
        <td><strong>${t.name}</strong></td>
        <td>${t.role}</td>
        <td>${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</td>
        <td>${t.quote.substring(0,80)}…</td>
        <td style="white-space:nowrap">
          <button class="action-btn btn-edit" onclick="editTestimonial('${t.id}')">✏️ Edit</button>
          <button class="action-btn btn-delete" onclick="deleteTestimonial('${t.id}')">🗑 Delete</button>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('btn-add-testimonial')?.addEventListener('click', () => {
    editingTestId = null;
    document.getElementById('test-form').reset();
    selectedRating = 5;
    updateStarPicker(5);
    document.getElementById('test-modal-title').textContent = 'Add Testimonial';
    openModal('test-modal');
  });

  window.editTestimonial = function(id) {
    const t = DB.get('testimonials').find(x => x.id === id);
    if (!t) return;
    editingTestId = id;
    const f = document.getElementById('test-form');
    f.querySelector('[name="name"]').value  = t.name;
    f.querySelector('[name="role"]').value  = t.role;
    f.querySelector('[name="quote"]').value = t.quote;
    f.querySelector('[name="avatar"]').value= t.avatar || '';
    selectedRating = t.rating;
    updateStarPicker(t.rating);
    document.getElementById('test-modal-title').textContent = 'Edit Testimonial';
    openModal('test-modal');
  };

  window.deleteTestimonial = async function(id) {
    const ok = await confirm('Delete Testimonial', 'Are you sure?');
    if (!ok) return;
    DB.remove('testimonials', id);
    renderTestimonialsPage();
    toast('Testimonial deleted.');
  };

  function updateStarPicker(rating) {
    document.querySelectorAll('.star-picker span').forEach((s, i) => {
      s.classList.toggle('active', i < rating);
    });
  }

  document.querySelectorAll('.star-picker span').forEach((s, i) => {
    s.addEventListener('click', () => { selectedRating = i + 1; updateStarPicker(selectedRating); });
  });

  document.getElementById('test-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(this);
    const test = {
      name:   data.get('name'),
      role:   data.get('role'),
      quote:  data.get('quote'),
      avatar: data.get('avatar') || '👤',
      rating: selectedRating,
    };
    if (editingTestId) {
      DB.update('testimonials', editingTestId, test);
      toast('Testimonial updated.');
    } else {
      DB.add('testimonials', { ...test, id: DB.uid() });
      toast('Testimonial added.');
    }
    closeModal('test-modal');
    renderTestimonialsPage();
  });

  // ════════════════════════════════════════════════════════
  //  INQUIRIES
  // ════════════════════════════════════════════════════════
  let showUnreadOnly = false;

  function renderInquiriesPage() {
    let inquiries = DB.get('inquiries').reverse();
    if (showUnreadOnly) inquiries = inquiries.filter(i => !i.read);
    const wrap = document.getElementById('inquiries-wrap');
    if (!wrap) return;
    if (!inquiries.length) {
      wrap.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📭</span><h3>No inquiries yet</h3><p>Contact form submissions will appear here.</p></div>`;
      return;
    }
    wrap.innerHTML = inquiries.map(i => `
      <div class="inquiry-card ${i.read ? '' : 'unread'}">
        <div class="inquiry-meta">
          <span class="inquiry-name">${i.name}</span>
          <a href="mailto:${i.email}" style="font-size:12px;color:var(--text-dim)">${i.email}</a>
          ${i.phone ? `<span style="font-size:12px;color:var(--text-dim)">${i.phone}</span>` : ''}
          ${i.interest ? `<span class="badge badge-gold" style="font-size:10px">${i.interest}</span>` : ''}
          <span class="badge ${i.read ? 'badge-read' : 'badge-unread'}">${i.read ? 'Read' : 'New'}</span>
          <span class="inquiry-time">${new Date(i.date).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
        </div>
        <div class="inquiry-message">${i.message}</div>
        <div class="inquiry-actions">
          ${!i.read ? `<button class="action-btn btn-mark" onclick="markRead('${i.id}')">✅ Mark as Read</button>` : ''}
          <button class="action-btn btn-delete" onclick="deleteInquiry('${i.id}')">🗑 Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.markRead = function(id) {
    DB.update('inquiries', id, { read: true });
    renderInquiriesPage();
    updateInquiriesBadge();
  };

  window.deleteInquiry = async function(id) {
    const ok = await confirm('Delete Inquiry', 'Permanently delete this inquiry?');
    if (!ok) return;
    DB.remove('inquiries', id);
    renderInquiriesPage();
    updateInquiriesBadge();
    toast('Inquiry deleted.');
  };

  document.getElementById('btn-mark-all-read')?.addEventListener('click', () => {
    const inquiries = DB.get('inquiries').map(i => ({ ...i, read: true }));
    DB.set('inquiries', inquiries);
    renderInquiriesPage();
    updateInquiriesBadge();
    toast('All marked as read.');
  });

  document.getElementById('btn-filter-unread')?.addEventListener('click', function() {
    showUnreadOnly = !showUnreadOnly;
    this.textContent = showUnreadOnly ? '📋 Show All' : '🔴 Unread Only';
    renderInquiriesPage();
  });

  document.getElementById('btn-clear-inquiries')?.addEventListener('click', async () => {
    const ok = await confirm('Clear All Inquiries', 'This will permanently delete ALL inquiries. Are you sure?');
    if (!ok) return;
    DB.set('inquiries', []);
    renderInquiriesPage();
    updateInquiriesBadge();
    toast('All inquiries cleared.');
  });

  // ════════════════════════════════════════════════════════
  //  HERO BANNER
  // ════════════════════════════════════════════════════════
  function renderHeroPage() {
    const hero = DB.get('hero');
    document.getElementById('hero-headline').value    = hero.headline;
    document.getElementById('hero-subheadline').value = hero.subheadline;
    document.getElementById('hero-bg-url').value      = hero.bgImage || '';
    updateHeroPreview();
  }

  function updateHeroPreview() {
    document.getElementById('hero-preview-title').textContent = document.getElementById('hero-headline')?.value || '';
    document.getElementById('hero-preview-sub').textContent   = document.getElementById('hero-subheadline')?.value || '';
    const imgUrl = document.getElementById('hero-bg-url')?.value;
    const previewImg = document.getElementById('hero-preview-img');
    if (previewImg && imgUrl) previewImg.src = imgUrl;
  }

  ['hero-headline','hero-subheadline','hero-bg-url'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateHeroPreview);
  });

  document.getElementById('hero-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    DB.set('hero', {
      headline:    document.getElementById('hero-headline').value,
      subheadline: document.getElementById('hero-subheadline').value,
      bgImage:     document.getElementById('hero-bg-url').value || 'assets/hero_bg.png',
    });
    toast('Hero banner updated!');
  });

  // ════════════════════════════════════════════════════════
  //  SITE SETTINGS
  // ════════════════════════════════════════════════════════
  function renderSettingsPage() {
    const s = DB.get('settings');
    const f = document.getElementById('settings-form');
    if (!f) return;
    Object.keys(s).forEach(key => {
      const el = f.querySelector(`[name="${key}"]`);
      if (el) el.value = s[key];
    });
    // Color preview
    const colorInput = document.getElementById('accent-color-input');
    const colorPreview = document.getElementById('accent-color-preview');
    if (colorInput) {
      colorInput.value = s.accentColor || '#c9a84c';
      if (colorPreview) colorPreview.textContent = s.accentColor || '#c9a84c';
      colorInput.addEventListener('input', () => {
        if (colorPreview) colorPreview.textContent = colorInput.value;
      });
    }
  }

  document.getElementById('settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const data    = new FormData(this);
    const current = DB.get('settings');
    const updated = { ...current };
    for (const [k, v] of data.entries()) updated[k] = v;
    DB.set('settings', updated);
    toast('Settings saved! Refresh the public site to see changes.');
  });

  document.getElementById('btn-reset-data')?.addEventListener('click', async () => {
    const ok = await confirm('Reset All Data', 'This will clear ALL data and restore factory defaults. This cannot be undone!');
    if (!ok) return;
    Object.keys(DB.KEYS).forEach(k => localStorage.removeItem(DB.KEYS[k]));
    toast('Data reset to defaults. Reloading…');
    setTimeout(() => location.reload(), 1500);
  });

  // ════════════════════════════════════════════════════════
  //  MODAL HELPERS
  // ════════════════════════════════════════════════════════
  function openModal(id) {
    document.getElementById(id)?.classList.add('open');
  }
  function closeModal(id) {
    document.getElementById(id)?.classList.remove('open');
  }

  document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

});
