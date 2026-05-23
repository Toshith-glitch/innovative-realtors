// ============================================================
//  Innovative Realtors — Shared Data Layer (localStorage)
//  v2 — Seeded with real content from innovativerealtor.in
// ============================================================

const DB = {
  // ── Keys ──────────────────────────────────────────────────
  KEYS: {
    settings:     'ir_settings',
    hero:         'ir_hero',
    properties:   'ir_properties',
    agents:       'ir_agents',
    testimonials: 'ir_testimonials',
    inquiries:    'ir_inquiries',
    version:      'ir_data_version',
  },

  DATA_VERSION: '5',

  // ── Defaults ──────────────────────────────────────────────
  defaults: {
    settings: {
      companyName:    'Innovative Realtor',
      tagline:        'Transforming Real Estate Dreams Into Profitable Investments',
      phone:          '+91 9718855485',
      email:          'info@innovativerealtor.in',
      address:        'Urbtech Trade Centre, A-112, Block 35, Sector 132, Noida, Uttar Pradesh – 201304',
      facebook:       'https://www.facebook.com/profile.php?id=61579953268835',
      instagram:      'https://www.instagram.com/innovative1485/',
      twitter:        'https://twitter.com/innovativerealtor',
      linkedin:       'https://www.linkedin.com/company/innovativerealtor',
      whatsapp:       'https://api.whatsapp.com/send?phone=+919718855485&text=Hello%20Innovative%20Realtor',
      accentColor:    '#c9a84c',
      adminPassword:  'admin123',
      yearsExp:       '5+',
      propertiesSold: '20+',
      happyClients:   '100%',
    },
    hero: {
      headline:    'Transforming Real Estate Dreams Into Profitable Investments',
      subheadline: 'Innovative Realtor redefines real estate consulting with integrity, expertise, and vision. From premium residences to high-growth commercial spaces — we help you invest smartly and confidently across India\'s most promising destinations and Dubai.',
      bgImage:     'assets/hero_bg.png',
    },
    properties: [
      // ── INDIA ──────────────────────────────────────────────
      {
        id: 'p-trump', title: 'Trump Tower Sector 94', type: 'Apartment',
        price: 50000000, bedrooms: 4, bathrooms: 4, area: 4500,
        location: 'Sector 94, Noida', image: 'assets/property1.png',
        description: 'A premium landmark offering world-class luxury living, iconic architecture, and unmatched lifestyle amenities in the heart of Noida. One of India\'s most prestigious addresses, developed in partnership with the Trump Organization.',
        featured: true, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-godrej-palm', title: 'Godrej Palm Retreat', type: 'Villa',
        price: 12500000, bedrooms: 3, bathrooms: 3, area: 2800,
        location: 'Noida, Uttar Pradesh', image: 'assets/property3.png',
        description: 'Flexible payment plans, resort amenities and prime waterfront location. Godrej Palm Retreat offers a serene lifestyle surrounded by lush greenery and world-class facilities.',
        featured: true, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-tata-value', title: 'Tata Value Homes', type: 'Apartment',
        price: 7500000, bedrooms: 2, bathrooms: 2, area: 1350,
        location: 'Noida, Uttar Pradesh', image: 'assets/property2.png',
        description: 'Tata Value Homes offers thoughtfully designed apartments with modern amenities, Tata\'s trusted quality, and excellent connectivity in one of Noida\'s most sought-after locations.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-godrej-sol', title: 'Godrej Solitaire', type: 'Apartment',
        price: 9800000, bedrooms: 3, bathrooms: 2, area: 1750,
        location: 'Noida, Uttar Pradesh', image: 'assets/property1.png',
        description: 'Godrej Solitaire is a premium residential project offering beautifully crafted 2 & 3 BHK homes with top-tier amenities, green surroundings, and excellent investment potential.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-godrej-woods', title: 'Godrej Woods (Phase 1 & Plus)', type: 'Apartment',
        price: 11000000, bedrooms: 3, bathrooms: 3, area: 2100,
        location: 'Sector 43, Noida', image: 'assets/property3.png',
        description: 'Godrej Woods is set amidst 10 acres of lush forest-themed landscape. Phase 1 & Plus offer thoughtfully designed residences with a unique forest living concept in the heart of Noida.',
        featured: true, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-tata-dest', title: 'Tata Destination 150', type: 'Apartment',
        price: 6200000, bedrooms: 2, bathrooms: 2, area: 1200,
        location: 'Sector 150, Noida', image: 'assets/property2.png',
        description: 'Tata Destination 150 in Sector 150 Noida is a premium housing project with stunning sports-centric amenities, spacious layouts, and outstanding connectivity to Delhi-NCR.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-godrej-regia', title: 'Godrej Woods Regia', type: 'Apartment',
        price: 13500000, bedrooms: 3, bathrooms: 3, area: 2400,
        location: 'Sector 43, Noida', image: 'assets/property1.png',
        description: 'Godrej Woods Regia is the premium tower within the Godrej Woods township — offering ultra-luxury 3 BHK residences with forest views, concierge services, and high-end specifications.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-godrej-ever', title: 'Godrej Woods Evergreen', type: 'Apartment',
        price: 10500000, bedrooms: 3, bathrooms: 2, area: 1900,
        location: 'Sector 43, Noida', image: 'assets/property3.png',
        description: 'Godrej Woods Evergreen is a nature-inspired luxury residential offering with modern architecture, sustainability features, and resort-level amenities in Noida\'s green belt.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-ats-pic', title: 'ATS Picturesque Reprieves', type: 'Villa',
        price: 18000000, bedrooms: 4, bathrooms: 4, area: 3500,
        location: 'Sector 152, Noida', image: 'assets/property1.png',
        description: 'ATS Picturesque Reprieves is a luxury villa project offering expansive private villas with pools, landscaped gardens, and resort amenities in one of Noida\'s most premium sectors.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-ats-king', title: 'ATS Kinghood Drive', type: 'Apartment',
        price: 8900000, bedrooms: 3, bathrooms: 2, area: 1600,
        location: 'Greater Noida West', image: 'assets/property2.png',
        description: 'ATS Kinghood Drive offers smartly designed 3 BHK residences with premium specifications, wide road connectivity, and world-class clubhouse facilities in Greater Noida West.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-ats-pious', title: 'ATS Homekraft Pious Orchards', type: 'Apartment',
        price: 7800000, bedrooms: 2, bathrooms: 2, area: 1300,
        location: 'Sector 150, Noida', image: 'assets/property3.png',
        description: 'A thoughtfully crafted residential project offering fresh-air living amidst orchards and greenery, with modern amenities and excellent connectivity in Sector 150 Noida.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-m3m', title: 'M3M Projects', type: 'Commercial',
        price: 25000000, bedrooms: 0, bathrooms: 2, area: 3000,
        location: 'Noida / Gurugram', image: 'assets/property1.png',
        description: 'M3M is one of India\'s leading real estate developers, offering premium commercial and residential projects across Noida and Gurugram with iconic architecture and high ROI potential.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-bhutani', title: 'Bhutani Projects', type: 'Commercial',
        price: 15000000, bedrooms: 0, bathrooms: 2, area: 1500,
        location: 'Sector 90, Noida', image: 'assets/property2.png',
        description: 'Bhutani Infra offers premium commercial spaces across Noida — from retail shops and office spaces to mixed-use developments — with excellent rental yields and capital appreciation.',
        featured: false, status: 'For Sale', region: 'India',
      },
      {
        id: 'p-onefg', title: 'One F&G', type: 'Commercial',
        price: 20000000, bedrooms: 0, bathrooms: 2, area: 2000,
        location: 'Noida, Uttar Pradesh', image: 'assets/property3.png',
        description: 'One F&G is a premium mixed-use development offering high-street retail, office suites, and serviced residences with an exceptional investment profile in the heart of Noida.',
        featured: false, status: 'For Sale', region: 'India',
      },
      // ── DUBAI ─────────────────────────────────────────────
      {
        id: 'p-sharukhz', title: 'Sharukhz Danube', type: 'Apartment',
        price: 45000000, bedrooms: 2, bathrooms: 2, area: 1200,
        location: 'Dubai, UAE', image: 'assets/property2.png',
        description: 'Sharukhz by Danube is an exclusive residential development in Dubai offering world-class amenities, stunning architecture, and premium furnished apartments with high rental potential.',
        featured: true, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-elle', title: 'Elle Residences', type: 'Apartment',
        price: 38000000, bedrooms: 2, bathrooms: 2, area: 1100,
        location: 'Dubai, UAE', image: 'assets/property1.png',
        description: 'Elle Residences Dubai offers elegantly designed apartments with premium finishes, smart home technology, and access to a full suite of luxury lifestyle amenities in prime Dubai.',
        featured: true, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-damac', title: 'DAMAC District – Dubai', type: 'Apartment',
        price: 52000000, bedrooms: 3, bathrooms: 3, area: 1800,
        location: 'Dubai, UAE', image: 'assets/property3.png',
        description: 'DAMAC District is a flagship development by DAMAC Properties — a master-planned community with luxury residences, retail, hospitality, and everything you need within one iconic destination.',
        featured: true, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-leblanc', title: 'Le Blanc by Imtiaz – Dubai', type: 'Penthouse',
        price: 85000000, bedrooms: 4, bathrooms: 4, area: 3200,
        location: 'Dubai, UAE', image: 'assets/property2.png',
        description: 'Le Blanc by Imtiaz Developments is an ultra-premium residential project in Dubai offering meticulously crafted penthouses and residences with sweeping views and bespoke finishes.',
        featured: false, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-symbolic', title: 'Symbolic Altus', type: 'Apartment',
        price: 35000000, bedrooms: 2, bathrooms: 2, area: 1050,
        location: 'Dubai, UAE', image: 'assets/property1.png',
        description: 'Symbolic Altus is a sophisticated high-rise residential development in Dubai offering contemporary apartments, panoramic city views, and a full-service lifestyle experience.',
        featured: false, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-viera', title: 'Viera Residences', type: 'Apartment',
        price: 30000000, bedrooms: 1, bathrooms: 2, area: 900,
        location: 'Dubai, UAE', image: 'assets/property3.png',
        description: 'Viera Residences offers stylish, contemporary apartments in Dubai with elegant interiors, community amenities, and strong investment returns in a growing Dubai neighbourhood.',
        featured: false, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-sobha', title: 'Sobha Central', type: 'Apartment',
        price: 60000000, bedrooms: 3, bathrooms: 3, area: 2000,
        location: 'Dubai, UAE', image: 'assets/property1.png',
        description: 'Sobha Central is an iconic twin-tower residential masterpiece in Dubai\'s most prestigious address. Built by Sobha Realty with the finest craftsmanship and materials sourced globally.',
        featured: false, status: 'For Sale', region: 'Dubai',
      },
      {
        id: 'p-samana', title: 'Samana Boulevard Heights', type: 'Apartment',
        price: 28000000, bedrooms: 2, bathrooms: 2, area: 980,
        location: 'Dubai, UAE', image: 'assets/property2.png',
        description: 'Samana Boulevard Heights is a premium residential development offering private pool apartments, resort-inspired amenities, and excellent connectivity in the heart of Dubai.',
        featured: false, status: 'For Sale', region: 'Dubai',
      },
    ],
    agents: [
      {
        id: 'a1', name: 'Amitayu Mukherjee', role: 'Founder & Real Estate Strategist',
        phone: '+91 9718855485', email: 'info@innovativerealtor.in',
        image: 'assets/amitayu.jpg',
        bio: 'Founder of Innovative Realtor, Amitayu brings a visionary approach to real estate consulting — helping clients invest smartly across India and Dubai with integrity, expertise, and data-driven insights.',
        specialties: 'Investment Strategy, Luxury Homes, Dubai Real Estate',
      },
      {
        id: 'a2', name: 'Toshith Pratap Singh', role: 'Senior Residential Consultant',
        phone: '+91 9718855485', email: 'toshith@innovativerealtor.in',
        image: 'assets/toshith.jpg',
        bio: 'Toshith specialises in premium residential properties across Noida and Greater Noida — helping families find their perfect home with a warm, client-first approach.',
        specialties: 'Noida Residential, Godrej & Tata Projects, Home Loans',
      },
      {
        id: 'a3', name: 'Harshit Negi', role: 'Commercial & Investment Advisor',
        phone: '+91 9718855485', email: 'harshit@innovativerealtor.in',
        image: 'assets/agent3.png',
        bio: 'Harshit focuses on commercial properties, warehouse leasing, and investment-grade assets — guiding business owners and investors to maximum returns across Delhi-NCR.',
        specialties: 'Commercial Properties, Warehouse Leasing, M3M & Bhutani',
      },
    ],
    testimonials: [
      {
        id: 't1', name: 'Brian Davis', role: 'Property Investor, UAE',
        quote: 'We were blown away by Innovative Realtor\'s professionalism, expertise, and customer service. They helped us find the perfect property and navigate the complex UAE real estate market with complete confidence.',
        rating: 5, avatar: '👨‍💼',
      },
      {
        id: 't2', name: 'Michael Lee', role: 'Real Estate Investor',
        quote: 'Innovative Realtor has been an invaluable partner in our real estate investments. Their expert advice and dedication helped us achieve our investment goals while minimizing risk.',
        rating: 5, avatar: '🏠',
      },
      {
        id: 't3', name: 'Mark Johnson', role: 'Business Owner, Delhi',
        quote: 'Their market insights and deep understanding of the real estate industry were invaluable to our investment success. Their customized solutions were perfect for our needs — highly recommended.',
        rating: 5, avatar: '👔',
      },
      {
        id: 't4', name: 'Anjali Kapoor', role: 'Homebuyer, Noida',
        quote: 'I purchased my first home through Innovative Realtor and the experience was exceptional. From shortlisting to possession, they handled everything professionally and kept me informed at every step.',
        rating: 5, avatar: '👩‍👧',
      },
    ],
    inquiries: [],
  },

  // ── Init — check version & re-seed if needed ───────────────
  init() {
    const storedVersion = localStorage.getItem(this.KEYS.version);
    if (storedVersion !== this.DATA_VERSION) {
      // New version — clear old data and re-seed
      Object.keys(this.KEYS).forEach(k => localStorage.removeItem(this.KEYS[k]));
      localStorage.setItem(this.KEYS.version, this.DATA_VERSION);
    }
  },

  // ── CRUD helpers ──────────────────────────────────────────
  get(key) {
    const raw = localStorage.getItem(this.KEYS[key]);
    if (raw) return JSON.parse(raw);
    // seed defaults
    localStorage.setItem(this.KEYS[key], JSON.stringify(this.defaults[key]));
    return this.defaults[key];
  },

  set(key, value) {
    localStorage.setItem(this.KEYS[key], JSON.stringify(value));
  },

  // convenience for arrays
  add(key, item) {
    const list = this.get(key);
    list.push(item);
    this.set(key, list);
  },

  update(key, id, updates) {
    const list = this.get(key);
    const idx  = list.findIndex(i => i.id === id);
    if (idx !== -1) list[idx] = { ...list[idx], ...updates };
    this.set(key, list);
  },

  remove(key, id) {
    const list = this.get(key);
    this.set(key, list.filter(i => i.id !== id));
  },

  // Unique ID generator
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  },
};

// Run init immediately when script loads
DB.init();
