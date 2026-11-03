// ====================================================================
// Muailek & Momo Bakery Shop - Admin Dashboard Logic
// ====================================================================

let ADMIN_ORDERS = [];
let ACTIVE_STATUS_FILTER = 'all';

function showAdminToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>👩‍🍳</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// โหลดรายการคำสั่งซื้อทั้งหมด
async function loadAdminOrders() {
  const container = document.getElementById('admin-orders-list');
  container.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 3rem;">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>`;

  ADMIN_ORDERS = await window.BakeryDB.getAllOrders();

  updateStats();
  renderAdminOrders();
}

// อัปเดตตัวเลขสถิติ
function updateStats() {
  const totalRevenue = ADMIN_ORDERS.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const pendingCount = ADMIN_ORDERS.filter(o => o.status === 'pending').length;
  const bakingCount = ADMIN_ORDERS.filter(o => o.status === 'baking').length;

  document.getElementById('stat-revenue').textContent = `฿${totalRevenue.toLocaleString()}`;
  document.getElementById('stat-total-orders').textContent = ADMIN_ORDERS.length;
  document.getElementById('stat-pending-slip').textContent = pendingCount;
  document.getElementById('stat-baking').textContent = bakingCount;
}

// กรองสถานะ
window.filterAdminStatus = function(status) {
  ACTIVE_STATUS_FILTER = status;
  document.querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tab-${status}`);
  if (activeBtn) activeBtn.classList.add('active');
  renderAdminOrders();
};

// เรนเดอร์การ์ดออเดอร์
function renderAdminOrders() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  const filtered = ADMIN_ORDERS.filter(o => {
    if (ACTIVE_STATUS_FILTER === 'all') return true;
    return o.status === ACTIVE_STATUS_FILTER;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem; background: white; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <p style="font-size: 3rem; margin-bottom: 0.5rem;">📋</p>
        <p style="font-size: 1.1rem; font-weight: 600; color: var(--secondary);">ไม่มีออเดอร์ในหมวดหมู่นี้</p>
      </div>
    `;
    return;
  }

  const statusLabels = {
    pending: 'รอตรวจสอบสลิป',
    confirmed: 'ยืนยันยอดเงินแล้ว',
    baking: 'กำลังอบขนม 🧁',
    ready: 'พร้อมส่ง/รับ 📦',
    completed: 'สำเร็จแล้ว 🎉',
    cancelled: 'ยกเลิกแล้ว'
  };

  container.innerHTML = filtered.map(order => {
    const slipUrl = order.payment?.slip_url;

    return `
      <div class="order-card" id="card-${order.id}">
        <div class="order-card-header">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">เลขคำสั่งซื้อ</span>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--secondary);">${order.order_number}</h3>
            <span style="font-size: 0.8rem; color: #a4968d;">สั่งเมื่อ: ${new Date(order.created_at).toLocaleString('th-TH')}</span>
          </div>
          <div style="text-align: right;">
            <span class="badge-status status-${order.status}">
              ${statusLabels[order.status] || order.status}
            </span>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--primary); margin-top: 4px;">
              ฿${Number(order.total_amount).toLocaleString()}
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.2rem;">
          <!-- ข้อมูลลูกค้า & กำหนดส่ง -->
          <div style="background: var(--bg-creamy); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.9rem;">
            <p><strong>👤 ลูกค้า:</strong> ${order.customer_name}</p>
            <p><strong>📞 โทร:</strong> <a href="tel:${order.customer_phone}" style="color: var(--primary); font-weight: bold; text-decoration: none;">${order.customer_phone}</a></p>
            <p><strong>🛵 วิธีรับ:</strong> ${order.delivery_type === 'pickup' ? 'รับที่หน้าร้าน Muailek&Momo' : 'จัดส่งถึงที่'}</p>
            <p><strong>📅 วันที่นัดรับ:</strong> <span style="color: #c53030; font-weight: bold;">${order.delivery_date} (${order.delivery_time_slot})</span></p>
            ${order.delivery_address ? `<p style="margin-top: 4px;"><strong>📍 ที่อยู่จัดส่ง:</strong> ${order.delivery_address}</p>` : ''}
            ${order.note ? `<p style="margin-top: 4px; color: #a86248;"><strong>📝 โน้ต:</strong> ${order.note}</p>` : ''}
          </div>

          <!-- รายการขนมในออเดอร์ -->
          <div style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 1rem;">
            <p style="font-weight: 700; color: var(--secondary); margin-bottom: 8px;">🍰 รายการขนม:</p>
            <ul style="list-style: none; padding-left: 0; font-size: 0.88rem;">
              ${(order.items || []).map(item => `
                <li style="padding: 6px 0; border-bottom: 1px dashed var(--border-color);">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: 600;">${item.name || item.product_name} × ${item.quantity || item.qty}</span>
                    <span style="color: var(--primary); font-weight: bold;">฿${((item.price || item.unit_price) * (item.quantity || item.qty)).toLocaleString()}</span>
                  </div>
                  <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                    หวาน: ${item.sweetness || item.sweetness_level || 'ปกติ'}
                    ${item.custom_text || item.customText ? `<br><strong style="color: #b0572e;">✍️ ข้อความหน้าเค้ก: "${item.custom_text || item.customText}"</strong>` : ''}
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- แถบปุ่มจัดการสถานะ & สลิป -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);">
          <div>
            ${slipUrl ? `
              <button class="btn-nav-outline" onclick="openSlipModal('${slipUrl}')" style="font-size: 0.85rem;">
                <span>📎</span> ดูสลิปโอนเงิน
              </button>
            ` : `<span style="font-size: 0.85rem; color: #999;">(ไม่มีรูปสลิปแนบ)</span>`}
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${order.status === 'pending' ? `
              <button class="btn-primary" style="background: var(--success);" onclick="updateStatus('${order.id}', 'confirmed', true)">
                ✅ ยืนยันสลิปถูกต้อง
              </button>
            ` : ''}

            ${order.status === 'confirmed' ? `
              <button class="btn-primary" style="background: #2563eb;" onclick="updateStatus('${order.id}', 'baking')">
                🧁 เริ่มอบขนม (In the Oven)
              </button>
            ` : ''}

            ${order.status === 'baking' ? `
              <button class="btn-primary" style="background: #059669;" onclick="updateStatus('${order.id}', 'ready')">
                📦 ขนมพร้อมส่ง/รับแล้ว
              </button>
            ` : ''}

            ${order.status === 'ready' ? `
              <button class="btn-primary" onclick="updateStatus('${order.id}', 'completed')">
                🎉 ปิดออเดอร์ (สำเร็จ)
              </button>
            ` : ''}

            ${order.status !== 'completed' && order.status !== 'cancelled' ? `
              <button class="btn-outline" style="color: #c53030; border-color: #ffd2d2;" onclick="updateStatus('${order.id}', 'cancelled')">
                ยกเลิก
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// อัปเดตสถานะ
window.updateStatus = async function(orderId, nextStatus, isVerifySlip = false) {
  if (isVerifySlip) {
    await window.BakeryDB.verifyPayment(orderId, true);
  } else {
    await window.BakeryDB.updateOrderStatus(orderId, nextStatus);
  }
  showAdminToast(`อัปเดตสถานะออเดอร์เรียบร้อยแล้ว`);
  await loadAdminOrders();
};

// ดูรูปสลิป
window.openSlipModal = function(slipUrl) {
  const modal = document.getElementById('modal-slip-viewer');
  document.getElementById('modal-slip-img').src = slipUrl;
  modal.classList.add('active');
};

window.closeModal = function(id) {
  document.getElementById(id)?.classList.remove('active');
};

// เช็กสถานะการเชื่อมต่อ Supabase บนหัวเว็บ
document.addEventListener('DOMContentLoaded', () => {
  const pill = document.getElementById('supabase-status-pill');
  if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
    pill.innerHTML = `🟢 โหมดออนไลน์ (เชื่อมต่อ Live Supabase เรียบร้อย)`;
    pill.style.color = '#155724';

    // เชื่อมต่อ Realtime เพื่อแจ้งเตือนเมื่อมีออเดอร์ใหม่
    window.BakeryDB.subscribeToOrders((newOrder) => {
      showAdminToast(`🔔 มีออเดอร์ใหม่เข้ามา! รหัส ${newOrder.order_number}`);
      loadAdminOrders();
    });
  } else {
    pill.innerHTML = `🟡 โหมดทดสอบ Local Storage (ใส่ Key ใน js/config.js เพื่อออนไลน์จริง)`;
    pill.style.color = '#856404';
  }

  loadAdminOrders();
});
