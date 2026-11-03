// ====================================================================
// Muailek & Momo Bakery Shop - Storefront Application Logic
// ====================================================================

// สถานะตะกร้าสินค้าใน LocalStorage
let CART = JSON.parse(localStorage.getItem('bakery_cart') || '[]');
let ALL_PRODUCTS = [];
let ALL_CATEGORIES = [];
let ACTIVE_CATEGORY = 'all';
let SEARCH_QUERY = '';
let SELECTED_PRODUCT = null;

// Toast Notification
function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// อัปเดตตัวเลขบนปุ่มตะกร้า
function updateCartBadge() {
  const totalCount = CART.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge-count');
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
  }
  localStorage.setItem('bakery_cart', JSON.stringify(CART));
}

// --------------------------------------------------------------------
// การเรนเดอร์หมวดหมู่และสินค้า
// --------------------------------------------------------------------
async function loadStoreData() {
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 0.5rem;">🧁</p>
        <p>กำลังเตรียมเตาอบและเมนูขนมแสนอร่อย...</p>
      </div>
    `;
  }

  ALL_CATEGORIES = await window.BakeryDB.getCategories();
  ALL_PRODUCTS = await window.BakeryDB.getProducts();

  renderCategories();
  renderProducts();
  updateCartBadge();
}

function renderCategories() {
  const container = document.getElementById('category-chips');
  if (!container) return;

  let html = `
    <button class="category-chip ${ACTIVE_CATEGORY === 'all' ? 'active' : ''}" onclick="selectCategory('all')">
      🍰 ทั้งหมด
    </button>
  `;

  ALL_CATEGORIES.forEach(cat => {
    const isActive = ACTIVE_CATEGORY === cat.id || ACTIVE_CATEGORY === cat.slug;
    html += `
      <button class="category-chip ${isActive ? 'active' : ''}" onclick="selectCategory('${cat.id}')">
        ${cat.icon || '🧁'} ${cat.name}
      </button>
    `;
  });

  container.innerHTML = html;
}

window.selectCategory = function(catId) {
  ACTIVE_CATEGORY = catId;
  renderCategories();
  renderProducts();
};

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = ALL_PRODUCTS.filter(prod => {
    const matchCat = ACTIVE_CATEGORY === 'all' || prod.category_id === ACTIVE_CATEGORY;
    const matchSearch = SEARCH_QUERY === '' || 
      prod.name.toLowerCase().includes(SEARCH_QUERY.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(SEARCH_QUERY.toLowerCase()));
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 3rem; margin-bottom: 0.5rem;">🔍</p>
        <p style="font-size: 1.1rem; font-weight: 600;">ไม่พบเมนูขนมที่คุณค้นหา</p>
        <p style="font-size: 0.9rem;">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ทั้งหมด</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => `
    <div class="product-card">
      <div class="product-img-wrapper">
        <img src="${prod.image_url}" alt="${prod.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800'">
        ${prod.tag ? `<span class="product-tag">${prod.tag}</span>` : ''}
      </div>
      <div class="product-body">
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-desc">${prod.description || ''}</p>
        <div class="product-footer">
          <div class="price-wrap">
            <span class="product-price">฿${Number(prod.price).toLocaleString()}</span>
            ${prod.original_price ? `<span class="product-original-price">฿${Number(prod.original_price).toLocaleString()}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="openProductDetail('${prod.id}')">
            <span>+ สั่งขนม</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// --------------------------------------------------------------------
// ป๊อปอัปปรับแต่งสินค้า (Custom Cake & Sweetness Modal)
// --------------------------------------------------------------------
window.openProductDetail = function(productId) {
  SELECTED_PRODUCT = ALL_PRODUCTS.find(p => p.id === productId);
  if (!SELECTED_PRODUCT) return;

  const modal = document.getElementById('modal-product-detail');
  const content = document.getElementById('product-detail-content');

  content.innerHTML = `
    <div style="display: flex; gap: 1.2rem; margin-bottom: 1.2rem; align-items: center;">
      <img src="${SELECTED_PRODUCT.image_url}" style="width: 100px; height: 100px; border-radius: var(--radius-sm); object-fit: cover;">
      <div>
        <h4 style="font-size: 1.15rem; color: var(--secondary); font-weight: 700;">${SELECTED_PRODUCT.name}</h4>
        <p style="color: var(--primary); font-size: 1.3rem; font-weight: 800; margin: 4px 0;">฿${Number(SELECTED_PRODUCT.price).toLocaleString()}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${SELECTED_PRODUCT.description || ''}</p>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">ระดับความหวาน (Sweetness Level)</label>
      <select id="detail-sweetness" class="form-select">
        <option value="ปกติ (100%)">ปกติ (100%) - รสชาติกลมกล่อมตามสูตรต้นตำรับ</option>
        <option value="หวานน้อย (50%)" selected>หวานน้อย (50%) - ยอดนิยม ละมุนกำลังดี</option>
        <option value="หวานน้อยมาก (25%)">หวานน้อยมาก (25%)</option>
        <option value="ไม่หวาน (0%)">ไม่หวาน (0%)</option>
      </select>
    </div>

    ${SELECTED_PRODUCT.allow_custom_text ? `
      <div class="form-group">
        <label class="form-label">✍️ ข้อความเขียนหน้าเค้ก (ฟรี)</label>
        <input type="text" id="detail-custom-text" class="form-input" placeholder="เช่น Happy Birthday Momo! หรือครบรอบ 1 ปี" maxlength="40">
        <small style="color: var(--text-muted); font-size: 0.78rem;">ความยาวไม่เกิน 40 ตัวอักษร</small>
      </div>
    ` : ''}

    <div class="form-group">
      <label class="form-label">อุปกรณ์เสริมเพิ่มเติม (เลือกได้)</label>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
        <label><input type="checkbox" id="opt-candle"> 🕯️ รับเทียนวันเกิดฟรี (เทียนเกลียวสีพาสเทล)</label>
        <label><input type="checkbox" id="opt-knife"> 🔪 รับมีดตัดเค้กพลาสติกใส</label>
      </div>
    </div>

    <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem;">
      <label class="form-label" style="margin-bottom: 0;">จำนวน</label>
      <div class="cart-qty-ctrl">
        <button type="button" class="cart-qty-btn" onclick="changeDetailQty(-1)">-</button>
        <span id="detail-qty-display" style="min-width: 28px; text-align: center; font-weight: 700;">1</span>
        <button type="button" class="cart-qty-btn" onclick="changeDetailQty(1)">+</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
};

let currentDetailQty = 1;
window.changeDetailQty = function(delta) {
  currentDetailQty = Math.max(1, currentDetailQty + delta);
  const display = document.getElementById('detail-qty-display');
  if (display) display.textContent = currentDetailQty;
};

window.confirmAddToCart = function() {
  if (!SELECTED_PRODUCT) return;

  const sweetness = document.getElementById('detail-sweetness')?.value || 'ปกติ (100%)';
  const customText = document.getElementById('detail-custom-text')?.value || '';
  const candle = document.getElementById('opt-candle')?.checked || false;
  const knife = document.getElementById('opt-knife')?.checked || false;

  const cartItemId = `${SELECTED_PRODUCT.id}_${sweetness}_${customText}_${candle}_${knife}`;

  const existingIndex = CART.findIndex(item => item.cartItemId === cartItemId);

  if (existingIndex > -1) {
    CART[existingIndex].qty += currentDetailQty;
  } else {
    CART.push({
      cartItemId: cartItemId,
      id: SELECTED_PRODUCT.id,
      name: SELECTED_PRODUCT.name,
      price: Number(SELECTED_PRODUCT.price),
      image_url: SELECTED_PRODUCT.image_url,
      qty: currentDetailQty,
      sweetness: sweetness,
      customText: customText,
      options: { candle, knife }
    });
  }

  updateCartBadge();
  closeModal('modal-product-detail');
  currentDetailQty = 1;
  showToast(`เพิ่ม "${SELECTED_PRODUCT.name}" ลงในตะกร้าแล้ว! 🍰`);
};

// --------------------------------------------------------------------
// ตะกร้าสินค้า (Cart Drawer / Modal)
// --------------------------------------------------------------------
window.openCart = function() {
  const modal = document.getElementById('modal-cart');
  const container = document.getElementById('cart-items-list');
  const subtotalElem = document.getElementById('cart-subtotal');
  const deliveryFeeElem = document.getElementById('cart-delivery-fee');
  const grandTotalElem = document.getElementById('cart-grand-total');

  if (CART.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-size: 3rem; margin-bottom: 0.5rem;">🛒</p>
        <p style="font-weight: 600;">ยังไม่มีขนมในตะกร้า</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">เลือกขนมอร่อยๆ แล้วแวะมาสั่งได้เลยนะ</p>
      </div>
    `;
    if (subtotalElem) subtotalElem.textContent = '฿0';
    if (deliveryFeeElem) deliveryFeeElem.textContent = '฿0';
    if (grandTotalElem) grandTotalElem.textContent = '฿0';
    document.getElementById('btn-proceed-checkout').disabled = true;
  } else {
    container.innerHTML = CART.map((item, idx) => `
      <div class="cart-item-row">
        <img src="${item.image_url}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-custom">
            <span>${item.sweetness}</span>
            ${item.customText ? ` • ข้อความ: "${item.customText}"` : ''}
            ${item.options?.candle ? ` • ขอเทียน` : ''}
          </div>
          <div style="font-weight: 700; color: var(--primary); margin-top: 4px;">
            ฿${(item.price * item.qty).toLocaleString()}
          </div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="cart-qty-btn" onclick="updateCartItemQty(${idx}, -1)">-</button>
          <span style="font-size: 0.9rem; font-weight: bold; width: 20px; text-align: center;">${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCartItemQty(${idx}, 1)">+</button>
        </div>
      </div>
    `).join('');

    const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = subtotal >= window.BAKERY_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : window.BAKERY_CONFIG.DELIVERY_FEE;
    const grandTotal = subtotal + deliveryFee;

    if (subtotalElem) subtotalElem.textContent = `฿${subtotal.toLocaleString()}`;
    if (deliveryFeeElem) {
      deliveryFeeElem.innerHTML = deliveryFee === 0 
        ? `<span style="color: var(--success); font-weight: bold;">ฟรี (สั่งครบ ฿${window.BAKERY_CONFIG.FREE_DELIVERY_THRESHOLD})</span>` 
        : `฿${deliveryFee}`;
    }
    if (grandTotalElem) grandTotalElem.textContent = `฿${grandTotal.toLocaleString()}`;
    document.getElementById('btn-proceed-checkout').disabled = false;
  }

  modal.classList.add('active');
};

window.updateCartItemQty = function(index, delta) {
  if (!CART[index]) return;
  CART[index].qty += delta;
  if (CART[index].qty <= 0) {
    CART.splice(index, 1);
  }
  updateCartBadge();
  openCart(); // Re-render cart modal
};

// --------------------------------------------------------------------
// ระบบเช็กเอาต์ & ชำระเงิน (Checkout & PromptPay QR)
// --------------------------------------------------------------------
let SLIP_BASE64 = null;

window.openCheckout = function() {
  closeModal('modal-cart');
  const modal = document.getElementById('modal-checkout');

  const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryType = document.querySelector('input[name="checkout_delivery_type"]:checked')?.value || 'pickup';
  const deliveryFee = deliveryType === 'pickup' ? 0 : (subtotal >= window.BAKERY_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : window.BAKERY_CONFIG.DELIVERY_FEE);
  const grandTotal = subtotal + deliveryFee;

  document.getElementById('checkout-grand-total').textContent = `฿${grandTotal.toLocaleString()}`;

  // สร้าง QR Code พร้อมเพย์ตามยอดเงิน
  const qrImg = document.getElementById('checkout-qr-img');
  const promptpayNumber = window.BAKERY_CONFIG.PROMPTPAY_NUMBER;
  qrImg.src = `https://promptpay.io/${promptpayNumber}/${grandTotal}.png`;

  // กำหนดวันที่ส่ง/รับขนมขั้นต่ำเป็นวันนี้
  const dateInput = document.getElementById('checkout-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
  if (!dateInput.value) dateInput.value = today;

  modal.classList.add('active');
};

window.handleDeliveryTypeChange = function(type) {
  const addressGroup = document.getElementById('checkout-address-group');
  if (type === 'delivery') {
    addressGroup.style.display = 'block';
  } else {
    addressGroup.style.display = 'none';
  }
  // อัปเดตยอดเงินตามประเภทการส่ง
  const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = type === 'pickup' ? 0 : (subtotal >= window.BAKERY_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : window.BAKERY_CONFIG.DELIVERY_FEE);
  const grandTotal = subtotal + deliveryFee;
  document.getElementById('checkout-grand-total').textContent = `฿${grandTotal.toLocaleString()}`;
  document.getElementById('checkout-qr-img').src = `https://promptpay.io/${window.BAKERY_CONFIG.PROMPTPAY_NUMBER}/${grandTotal}.png`;
};

// จัดการอัปโหลดรูปสลิป
window.handleSlipUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    SLIP_BASE64 = e.target.result;
    const preview = document.getElementById('slip-preview');
    preview.src = SLIP_BASE64;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
};

// ส่งคำสั่งซื้อ
window.submitOrder = async function(event) {
  event.preventDefault();

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const deliveryType = document.querySelector('input[name="checkout_delivery_type"]:checked').value;
  const address = deliveryType === 'delivery' ? document.getElementById('checkout-address').value.trim() : 'รับที่หน้าร้าน Muailek&Momo';
  const deliveryDate = document.getElementById('checkout-date').value;
  const deliveryTime = document.getElementById('checkout-time').value;
  const note = document.getElementById('checkout-note').value.trim();

  if (!name || !phone || !deliveryDate) {
    alert('กรุณากรอกชื่อ เบอร์โทรศัพท์ และวันเวลานัดรับขนมให้ครบถ้วน');
    return;
  }

  const subtotal = CART.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = deliveryType === 'pickup' ? 0 : (subtotal >= window.BAKERY_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : window.BAKERY_CONFIG.DELIVERY_FEE);
  const grandTotal = subtotal + deliveryFee;

  const btnSubmit = document.getElementById('btn-submit-order');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'กำลังบันทึกคำสั่งซื้อ...';

  try {
    const result = await window.BakeryDB.createOrder({
      orderInfo: {
        name,
        phone,
        deliveryType,
        address,
        deliveryDate,
        deliveryTime,
        totalAmount: grandTotal,
        deliveryFee,
        note
      },
      items: CART,
      slipBase64: SLIP_BASE64
    });

    if (result.success) {
      // ล้างตะกร้า
      CART = [];
      updateCartBadge();
      SLIP_BASE64 = null;
      closeModal('modal-checkout');

      // แสดงผลหน้าสำเร็จ
      openOrderSuccess(result.orderNumber);
    }
  } catch (err) {
    console.error(err);
    alert('เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'ยืนยันการสั่งซื้อขนม';
  }
};

function openOrderSuccess(orderNumber) {
  const modal = document.getElementById('modal-order-success');
  document.getElementById('success-order-number').textContent = orderNumber;
  modal.classList.add('active');
}

// --------------------------------------------------------------------
// ติดตามสถานะออเดอร์ (Order Tracking Modal)
// --------------------------------------------------------------------
window.openTrackingModal = function(presetNumber = '') {
  const modal = document.getElementById('modal-tracking');
  const input = document.getElementById('tracking-input-number');
  if (presetNumber) {
    input.value = presetNumber;
    searchOrderTracking();
  }
  modal.classList.add('active');
};

window.searchOrderTracking = async function() {
  const input = document.getElementById('tracking-input-number');
  const orderNumber = input.value.trim();
  const container = document.getElementById('tracking-result-box');

  if (!orderNumber) {
    alert('กรุณากรอกรหัสคำสั่งซื้อ');
    return;
  }

  container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1.5rem;">กำลังค้นหาข้อมูล...</p>`;

  const order = await window.BakeryDB.getOrderByNumber(orderNumber);

  if (!order) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: #fff5f5; border-radius: var(--radius-md); border: 1px solid #ffd2d2;">
        <p style="font-size: 2rem; margin-bottom: 6px;">❌</p>
        <p style="font-weight: 700; color: #c53030;">ไม่พบรหัสคำสั่งซื้อ "${orderNumber}"</p>
        <p style="font-size: 0.85rem; color: #742a2a; margin-top: 4px;">กรุณาตรวจสอบรหัสให้ถูกต้อง (เช่น MM-123456)</p>
      </div>
    `;
    return;
  }

  // กำหนดขั้นตอน Timeline
  const steps = [
    { key: 'pending', label: 'รับคำสั่งซื้อ', icon: '📝' },
    { key: 'confirmed', label: 'ยืนยันสลิปแล้ว', icon: '💳' },
    { key: 'baking', label: 'กำลังอบขนม', icon: '🧁' },
    { key: 'ready', label: 'พร้อมรับ/ส่ง', icon: '📦' },
    { key: 'completed', label: 'สำเร็จ', icon: '🎉' }
  ];

  const currentIdx = steps.findIndex(s => s.key === order.status);

  container.innerHTML = `
    <div style="background: white; border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 1rem;">
        <div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">รหัสคำสั่งซื้อ</span>
          <h4 style="color: var(--secondary); font-size: 1.15rem; font-weight: 800;">${order.order_number}</h4>
        </div>
        <span class="badge-status status-${order.status}">
          ${steps.find(s => s.key === order.status)?.label || order.status}
        </span>
      </div>

      <!-- Timeline visual -->
      <div class="order-timeline">
        ${steps.map((st, idx) => {
          let stateClass = '';
          if (idx < currentIdx) stateClass = 'completed';
          else if (idx === currentIdx) stateClass = 'active';
          return `
            <div class="timeline-step ${stateClass}">
              <div class="timeline-dot">${st.icon}</div>
              <div class="timeline-label">${st.label}</div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- รายละเอียดคำสั่งซื้อ -->
      <div style="background: var(--bg-creamy); border-radius: var(--radius-sm); padding: 1rem; font-size: 0.9rem; margin-top: 1rem;">
        <p><strong>ผู้สั่ง:</strong> ${order.customer_name} (${order.customer_phone})</p>
        <p><strong>ประเภท:</strong> ${order.delivery_type === 'pickup' ? 'รับที่หน้าร้าน Muailek&Momo' : 'จัดส่งถึงบ้าน'}</p>
        <p><strong>วันเวลานัดรับ:</strong> ${order.delivery_date} (${order.delivery_time_slot})</p>
        ${order.delivery_address ? `<p><strong>ที่อยู่จัดส่ง:</strong> ${order.delivery_address}</p>` : ''}
        <p style="margin-top: 8px; font-weight: 700; color: var(--primary);">ยอดสุทธิ: ฿${Number(order.total_amount).toLocaleString()}</p>
      </div>
    </div>
  `;
};

// ปิด Modal
window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

// ผูก Search Box
document.addEventListener('DOMContentLoaded', () => {
  loadStoreData();

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      SEARCH_QUERY = e.target.value.trim();
      renderProducts();
    });
  }
});
