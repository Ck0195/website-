/**
 * NEON & BEAN - Premium Indian Menu with Diet Indicators
 */

const menuData = [
    { id: 1, cat: 'coffee', diet: 'veg', name: 'Nitro Cold Brew', price: 249, desc: 'Ultra-smooth velvet coffee infused with nitrogen.', img: '1517701604599-bb29b565090c' },
    { id: 2, cat: 'coffee', diet: 'veg', name: 'Charcoal Latte', price: 289, desc: 'Detox activated charcoal with Madagascar vanilla.', img: '1534353473418-4cfa6c56fd38' },
    { id: 3, cat: 'coffee', diet: 'veg', name: 'Cloud Latte', price: 310, desc: 'Whipped espresso foam over chilled organic milk.', img: '1514432324607-a07d9f4a7083' },
    { id: 4, cat: 'food', diet: 'veg', name: 'Truffle Avocado Toast', price: 450, desc: 'Sourdough toast topped with white truffle oil.', img: '1525351484163-7529414344d8' },
    { id: 5, cat: 'food', diet: 'veg', name: 'Miso Brioche Donut', price: 180, desc: 'Signature brioche with savory miso caramel.', img: '1555507036-ab1f4038808a' },
    { id: 6, cat: 'food', diet: 'nonveg', name: 'Loaded Keema Brioche', price: 420, desc: 'Slow-cooked spiced lamb on toasted brioche.', img: '1475090169767-40ed8d18f67d' }
];

let cart = [];
let currentCategory = 'all';

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').style.display = 'none', 600);
    }, 1000);
    renderMenu('all');
});

function handleSearch() {
    const query = document.getElementById('menuSearch').value.toLowerCase();
    renderMenu(currentCategory, null, query);
}

function renderMenu(category, btn = null, query = "") {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    
    if (btn) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = category;
    }

    const filtered = menuData.filter(item => {
        const matchesCat = (category === 'all' || item.cat === category);
        const matchesSearch = item.name.toLowerCase().includes(query);
        return matchesCat && matchesSearch;
    });

    filtered.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="img-box">
                <div class="diet-tag ${item.diet}">
                    <i class="fas fa-circle"></i>
                </div>
                <img src="https://images.unsplash.com/photo-${item.img}?auto=format&fit=crop&w=600&q=80">
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="price-row">
                    <span class="price">₹${item.price}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">ADD</button>
                </div>
            </div>`;
        container.appendChild(card);
        setTimeout(() => card.classList.add('show'), index * 60);
    });
}

function addToCart(id) {
    const item = menuData.find(p => p.id === id);
    cart.push({ ...item, cartId: Date.now() });
    updateCartUI();
}

function removeFromCart(cartId) {
    cart = cart.filter(i => i.cartId !== cartId);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById('count').innerText = cart.length;
    const total = cart.reduce((s, i) => s + i.price, 0);
    document.getElementById('subtotal').innerText = `₹${total}`;
    document.getElementById('total-price').innerText = `₹${total}`;
    
    const container = document.getElementById('cart-items');
    if(cart.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px;"><i class="fas fa-shopping-basket" style="font-size:3rem; opacity:0.1;"></i><p style="margin-top:10px; font-size:0.8rem; color:#666;">Hungry? Add something!</p></div>`;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <div style="font-weight:800; font-size:0.9rem; display:flex; align-items:center;">
                    <span class="diet-tag ${item.diet}" style="position:static; margin-right:8px; padding:2px;"><i class="fas fa-circle" style="font-size:6px;"></i></span>
                    ${item.name}
                </div>
                <div style="color:var(--accent); font-size:0.8rem; margin-left:18px;">₹${item.price}</div>
            </div>
            <i class="fas fa-times-circle" onclick="removeFromCart(${item.cartId})" style="color:#333; cursor:pointer;"></i>
        </div>`).join('');
}

function toggleCart() { document.getElementById('cart-panel').classList.toggle('active'); }

function checkout() {
    if (cart.length === 0) return alert("Cart is empty!");
    const phone = "919876543210"; // REPLACE WITH YOUR 10 DIGIT NUMBER
    const notes = document.getElementById('notes').value || "No special instructions";
    const items = cart.map(i => `- ${i.name}`).join('%0A');
    const msg = `*NEW ORDER - #NB-2026*%0A%0A*Items:*%0A${items}%0A%0A*Instructions:* ${notes}%0A*Total:* ${document.getElementById('total-price').innerText}`;
    window.open(`https://wa.me/${phone}?text=${msg}`);
}