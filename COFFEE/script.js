/**
 * NEON & BEAN v6.1 - Luxury Fix
 */

const translations = {
    en: {
        hero_title: "THE PERFECT POUR",
        search_placeholder: "Discover excellence...",
        cat_all: "ALL", cat_drinks: "DRINKS", cat_food: "FOOD",
        cart_title: "ORDER SUMMARY", notes_placeholder: "Special requests...",
        bill_subtotal: "Subtotal", bill_tax: "Boutique Tax (5%)", bill_total: "TOTAL",
        btn_checkout: "CONFIRM ORDER",
        milk_dairy: "Dairy", milk_oat: "Oat", milk_almond: "Almond",
        spice_mild: "Mild", spice_med: "Med", spice_hot: "Hot",
        add: "ADD TO BAG", bestseller: "SIGNATURE", added: "Added to Bag", open: "OPEN", closed: "CLOSED"
    },
    hi: {
        hero_title: "बेहतरीन स्वाद",
        search_placeholder: "खोजें...",
        cat_all: "सब", cat_drinks: "पेय", cat_food: "खाना",
        cart_title: "आपका ऑर्डर", notes_placeholder: "निर्देश...",
        bill_subtotal: "कुल", bill_tax: "टैक्स", bill_total: "कुल भुगतान",
        btn_checkout: "ऑर्डर भेजें",
        milk_dairy: "डेयरी", milk_oat: "ओट", milk_almond: "बादाम",
        spice_mild: "कम", spice_med: "मध्यम", spice_hot: "तेज़",
        add: "जोड़ें", bestseller: "विशेष", added: "जोड़ा गया", open: "खुला", closed: "बंद"
    },
    kn: {
        hero_title: "ಪರಿಪೂರ್ಣ ರುಚಿ",
        search_placeholder: "ಹುಡುಕಿ...",
        cat_all: "ಎಲ್ಲವೂ", cat_drinks: "ಪಾನೀಯ", cat_food: "ಆಹಾರ",
        cart_title: "ನಿಮ್ಮ ಆರ್ಡರ್", notes_placeholder: "ಸೂಚನೆ...",
        bill_subtotal: "ಮೊತ್ತ", bill_tax: "ತೆರಿಗೆ", bill_total: "ಒಟ್ಟು ಮೊತ್ತ",
        btn_checkout: "ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಿ",
        milk_dairy: "ಡೈರಿ", milk_oat: "ಓಟ್", milk_almond: "ಬಾದಾಮಿ",
        spice_mild: "ಕಡಿಮೆ", spice_med: "ಮಧ್ಯಮ", spice_hot: "ಹೆಚ್ಚು",
        add: "ಸೇರಿಸಿ", bestseller: "ವಿಶೇಷ", added: "ಸೇರಿಸಲಾಗಿದೆ", open: "ತೆರೆದಿದೆ", closed: "ಮುಚ್ಚಲಾಗಿದೆ"
    }
};

const menuData = [
    { id: 1, cat: 'coffee', diet: 'veg', name: 'Nitro Cold Brew', price: 249, desc: 'Ultra-smooth velvet coffee infused with nitrogen.', img: '1517701604599-bb29b565090c', bestseller: true },
    { id: 2, cat: 'coffee', diet: 'veg', name: 'Charcoal Latte', price: 289, desc: 'Detox charcoal blend with vanilla.', img: '1534353473418-4cfa6c56fd38' },
    { id: 4, cat: 'food', diet: 'veg', name: 'Truffle Avocado Toast', price: 450, desc: 'Sourdough toast with rare truffle oil.', img: '1525351484163-7529414344d8', bestseller: true },
    { id: 6, cat: 'food', diet: 'nonveg', name: 'Loaded Keema Brioche', price: 420, desc: 'Hand-pulled lamb on butter brioche.', img: '1475090169767-40ed8d18f67d' }
];

let cart = [];
let currentLang = 'en';
let currentCategory = 'all';
let selectedOptions = {};

window.addEventListener('DOMContentLoaded', () => {
    // Initial UI Setup
    showSkeletons();
    
    // Load data after a short luxury delay
    setTimeout(() => {
        const saved = localStorage.getItem('nb-cart');
        if (saved) { cart = JSON.parse(saved); updateCartUI(); }
        
        const savedLang = localStorage.getItem('nb-lang') || 'en';
        changeLanguage(savedLang);
        
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 600);
    }, 1000);
});

function showSkeletons() {
    const container = document.getElementById('menu-container');
    container.innerHTML = Array(4).fill('<div class="skeleton"></div>').join('');
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('nb-lang', lang);
    
    // Update labels
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = translations[lang][el.getAttribute('data-i18n')];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = translations[lang][el.getAttribute('data-i18n-placeholder')];
    });

    // Shop Status
    const hour = new Date().getHours();
    const statusEl = document.getElementById('shop-status');
    if (hour >= 8 && hour < 22) {
        statusEl.className = 'status-badge status-open';
        statusEl.innerText = translations[lang].open;
    } else {
        statusEl.className = 'status-badge status-closed';
        statusEl.innerText = translations[lang].closed;
    }

    renderMenu(currentCategory);
}

function renderMenu(category, btn = null, query = "") {
    const container = document.getElementById('menu-container');
    const lang = translations[currentLang];

    if (btn) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = category;
        
        // Move indicator
        const indicator = document.querySelector('.tab-indicator');
        indicator.style.width = `${btn.offsetWidth}px`;
        indicator.style.left = `${btn.offsetLeft}px`;
    } else {
        // Handle indicator on page load
        const activeTab = document.querySelector('.tab.active');
        if(activeTab) {
            const indicator = document.querySelector('.tab-indicator');
            indicator.style.width = `${activeTab.offsetWidth}px`;
            indicator.style.left = `${activeTab.offsetLeft}px`;
        }
    }

    const filtered = menuData.filter(i => 
        (category === 'all' || i.cat === category) && 
        i.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 50px; color: var(--text-dim);">No items found.</div>`;
        return;
    }

    container.innerHTML = filtered.map((item, idx) => `
        <div class="item-card" style="animation-delay: ${idx * 0.1}s">
            <div class="img-box">
                ${item.bestseller ? `<span class="bestseller-tag" style="position:absolute; top:15px; left:15px; background:var(--accent); color:#000; padding:5px 12px; border-radius:50px; font-size:0.6rem; font-weight:800; z-index:2;">${lang.bestseller}</span>` : ''}
                <img src="https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&w=800&q=80">
            </div>
            <div class="item-info">
                <div class="card-head">
                    <h3 style="margin:0; font-size:1.1rem;">${item.name}</h3>
                    <div class="diet-dot ${item.diet}"></div>
                </div>
                <p style="font-size:0.8rem; color:var(--text-dim); margin: 10px 0;">${item.desc}</p>
                
                <div class="custom-selector">
                    ${item.cat === 'food' ? `
                        <div class="opt-btn" onclick="setOpt(${item.id}, 'Mild', this)">${lang.spice_mild}</div>
                        <div class="opt-btn active" onclick="setOpt(${item.id}, 'Med', this)">${lang.spice_med}</div>
                        <div class="opt-btn" onclick="setOpt(${item.id}, 'Hot', this)">${lang.spice_hot}</div>
                    ` : `
                        <div class="opt-btn active" onclick="setOpt(${item.id}, 'Dairy', this)">${lang.milk_dairy}</div>
                        <div class="opt-btn" onclick="setOpt(${item.id}, 'Oat', this)">${lang.milk_oat}</div>
                        <div class="opt-btn" onclick="setOpt(${item.id}, 'Almond', this)">${lang.milk_almond}</div>
                    `}
                </div>

                <div class="price-row">
                    <span class="price" style="font-weight:800; font-size:1.2rem;">₹${item.price}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">${lang.add}</button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleSearch() {
    const q = document.getElementById('menuSearch').value;
    renderMenu(currentCategory, null, q);
}

function setOpt(itemId, val, el) {
    selectedOptions[itemId] = val;
    el.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

function addToCart(id) {
    const item = menuData.find(p => p.id === id);
    const choice = selectedOptions[id] || (item.cat === 'food' ? 'Med' : 'Dairy');
    const existing = cart.find(i => i.id === id && i.choice === choice);
    
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1, choice: choice });
    
    showToast(`${item.name} ${translations[currentLang].added}`);
    updateCartUI();
}

function updateCartUI() {
    localStorage.setItem('nb-cart', JSON.stringify(cart));
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const tax = Math.round(subtotal * 0.05);
    
    document.getElementById('count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    document.getElementById('subtotal').innerText = `₹${subtotal}`;
    document.getElementById('tax-amount').innerText = `₹${tax}`;
    document.getElementById('total-price').innerText = `₹${subtotal + tax}`;
    
    document.getElementById('cart-items').innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #1a1a1a;">
            <div>
                <div style="font-weight:700; font-size:0.9rem;">${item.name} x ${item.qty}</div>
                <div style="font-size:0.7rem; color:var(--accent);">${item.choice.toUpperCase()}</div>
            </div>
            <div style="font-weight:800;">₹${item.price * item.qty}</div>
        </div>`).join('');
}

function toggleCart() { document.getElementById('cart-panel').classList.toggle('active'); }

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

function checkout() {
    const items = cart.map(i => `• ${i.name} (${i.choice}) x${i.qty}`).join('%0A');
    const total = document.getElementById('total-price').innerText;
    window.open(`https://wa.me/919876543210?text=*NEW ORDER*%0A%0A${items}%0A%0A*Total:* ${total}`);
}
