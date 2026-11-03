// ====================================================================
// Muailek & Momo Bakery Shop - Supabase Service Layer
// ====================================================================

let supabaseClient = null;

// เริ่มต้นการเชื่อมต่อ Supabase Client
if (window.isSupabaseConfigured && window.isSupabaseConfigured()) {
  try {
    const { createClient } = window.supabase;
    supabaseClient = createClient(window.BAKERY_CONFIG.SUPABASE_URL, window.BAKERY_CONFIG.SUPABASE_ANON_KEY);
    console.log("🟢 Connected to live Supabase successfully!");
  } catch (err) {
    console.error("❌ Failed to initialize Supabase client:", err);
  }
} else {
  console.log("ℹ️ Running in Local/Demo Mode. Connect Supabase keys in js/config.js to go live!");
}

// --------------------------------------------------------------------
// ข้อมูลจำลองสำหรับ Demo Mode (กรณีผู้ใช้ยังไม่ได้ใส่ Supabase keys)
// --------------------------------------------------------------------
const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'เค้กวันเกิด & เค้กปอนด์', slug: 'cakes', icon: '🎂' },
  { id: 'cat-2', name: 'เบเกอรี่ & ครัวซองต์', slug: 'bakery', icon: '🥐' },
  { id: 'cat-3', name: 'คุกกี้ & ทาร์ต', slug: 'cookies', icon: '🍪' },
  { id: 'cat-4', name: 'ขนมสด & ของหวานเย็น', slug: 'desserts', icon: '🍮' }
];

const SEED_PRODUCTS = [
  {
    id: 'p-1',
    category_id: 'cat-1',
    name: 'Strawberry Blossom Shortcake (1 ปอนด์)',
    description: 'สปันจ์เค้กวานิลลานุ่มละมุน สอดไส้ครีมสดฮอกไกโดและสตรอว์เบอร์รีสดนำเข้าจากญี่ปุ่น หวานน้อยกลมกล่อม',
    price: 690,
    original_price: 750,
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    tag: 'Best Seller 🍓',
    is_available: true,
    allow_custom_text: true
  },
  {
    id: 'p-2',
    category_id: 'cat-1',
    name: 'Basque Burnt Cheesecake (ชีสเค้กหน้าไหม้)',
    description: 'ชีสเค้กหน้าไหม้สไตล์สเปน กลิ่นคาราเมลหอมกรุ่น เนื้อเค้กเนียนนุ่มเยิ้มตรงกลาง ใช้ครีมชีสแท้จากฝรั่งเศส',
    price: 590,
    original_price: 650,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    tag: 'Chef Recommend ⭐',
    is_available: true,
    allow_custom_text: true
  },
  {
    id: 'p-3',
    category_id: 'cat-1',
    name: 'Signature Belgian Dark Chocolate Cake',
    description: 'เค้กช็อกโกแลตฟัดจ์เนื้อแน่นเข้มข้น ทำจากเบลเยียมดาร์กช็อกโกแลต 74% รสชาติเข้มข้น หวานกำลังดี ไม่เลี่ยน',
    price: 650,
    original_price: null,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    tag: 'Must Try 🍫',
    is_available: true,
    allow_custom_text: true
  },
  {
    id: 'p-4',
    category_id: 'cat-1',
    name: 'เค้กมินิมอลสไตล์เกาหลี (Korean Vintage Cake)',
    description: 'เค้กครีมสดสไตล์เกาหลี โทนครีมพาสเทล สามารถระบุข้อความอวยพรและลายการ์ตูนหน้าเค้กได้ตามต้องการ',
    price: 750,
    original_price: 800,
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80',
    tag: 'Pre-order 1 วัน 🎨',
    is_available: true,
    allow_custom_text: true
  },
  {
    id: 'p-5',
    category_id: 'cat-2',
    name: 'Classic French Butter Croissant (ครัวซองต์เนยฝรั่งเศส)',
    description: 'ครัวซองต์แป้งกรอบนอกนุ่มใน หอมฟุ้งเนยสดแท้ AOP จากแคว้นนอร์มังดี นวดและพับชั้นอย่างพิถีพิถัน',
    price: 85,
    original_price: null,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    tag: 'อบสดใหม่ทุกเช้า 🥐',
    is_available: true,
    allow_custom_text: false
  },
  {
    id: 'p-6',
    category_id: 'cat-2',
    name: 'Almond Cream Croissant (ครัวซองต์อัลมอนด์)',
    description: 'ครัวซองต์สอดไส้ครีมอัลมอนด์หอมหวาน โรยหน้าด้วยอัลมอนด์สไลซ์อบกรอบและไอซิ่งบางๆ',
    price: 110,
    original_price: null,
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    tag: 'ยอดนิยม 🌰',
    is_available: true,
    allow_custom_text: false
  },
  {
    id: 'p-7',
    category_id: 'cat-3',
    name: 'New York Soft Cookies กล่อง 4 ชิ้น (รวมรส)',
    description: 'ซอฟต์คุกกี้สไตล์นิวยอร์ก หนานุ่ม ไส้เยิ้ม ช็อกชิป, เรดเวลเวท, มัทฉะไวท์ช็อก, ดาร์กช็อกวอลนัต',
    price: 220,
    original_price: 260,
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    tag: 'Gift Set 🎁',
    is_available: true,
    allow_custom_text: false
  },
  {
    id: 'p-8',
    category_id: 'cat-3',
    name: 'Lemon Curd Meringue Tart (ทาร์ตเลมอนเมอแรงก์)',
    description: 'แป้งทาร์ตกรุบกรอบ สอดไส้เลมอนเคิร์ดเปรี้ยวอมหวานสดชื่น ท็อปด้วยเมอแรงก์อิตาเลียนเบิร์นไฟหอมกรุ่น',
    price: 135,
    original_price: null,
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    tag: 'เปรี้ยวหวานสดชื่น 🍋',
    is_available: true,
    allow_custom_text: false
  },
  {
    id: 'p-9',
    category_id: 'cat-4',
    name: 'ไดฟุกุสตรอว์เบอร์รีถั่วแดงกวน (กล่อง 2 ลูก)',
    description: 'แป้งไดฟุกุนุ่มหนึบ ปั้นสดใหม่ สอดไส้ถั่วแดงกวนสูตรหวานน้อย และสตรอว์เบอร์รีสดไซซ์จัมโบ้',
    price: 150,
    original_price: null,
    image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    tag: 'ปั้นสดทุกวัน 🍓',
    is_available: true,
    allow_custom_text: false
  }
];

// Helper อ่านและเขียนข้อมูลใน LocalStorage สำหรับโหมดออฟไลน์
const getLocalOrders = () => {
  const data = localStorage.getItem('bakery_mock_orders');
  return data ? JSON.parse(data) : [];
};

const saveLocalOrders = (orders) => {
  localStorage.setItem('bakery_mock_orders', JSON.stringify(orders));
};

// --------------------------------------------------------------------
// ฟังก์ชันเรียกใช้งาน API สำหรับทั้งระบบ
// --------------------------------------------------------------------

const BakeryDB = {
  // ดึงหมวดหมู่สินค้า
  async getCategories() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('categories').select('*').order('display_order');
      if (!error && data && data.length > 0) return data;
    }
    return SEED_CATEGORIES;
  },

  // ดึงรายการขนมทั้งหมด
  async getProducts() {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return SEED_PRODUCTS;
  },

  // สร้างคำสั่งซื้อใหม่ (Order + Order Items + Payment)
  async createOrder({ orderInfo, items, slipBase64 }) {
    const orderNumber = 'MM-' + Date.now().toString().slice(-6);

    if (supabaseClient) {
      try {
        // 1. บันทึกลงตาราง orders
        const { data: orderData, error: orderErr } = await supabaseClient
          .from('orders')
          .insert([{
            order_number: orderNumber,
            customer_name: orderInfo.name,
            customer_phone: orderInfo.phone,
            customer_email: orderInfo.email || null,
            delivery_type: orderInfo.deliveryType,
            delivery_address: orderInfo.address || null,
            delivery_date: orderInfo.deliveryDate,
            delivery_time_slot: orderInfo.deliveryTime,
            total_amount: orderInfo.totalAmount,
            delivery_fee: orderInfo.deliveryFee,
            note: orderInfo.note || null,
            status: 'pending'
          }])
          .select()
          .single();

        if (orderErr) throw orderErr;

        // 2. บันทึก order_items
        const orderItemsPayload = items.map(item => ({
          order_id: orderData.id,
          product_id: item.id.startsWith('p-') ? null : item.id,
          product_name: item.name,
          unit_price: item.price,
          quantity: item.qty,
          custom_text: item.customText || null,
          sweetness_level: item.sweetness || 'ปกติ (100%)',
          options: item.options || {}
        }));

        await supabaseClient.from('order_items').insert(orderItemsPayload);

        // 3. บันทึกข้อมูลการชำระเงิน (payments)
        await supabaseClient.from('payments').insert([{
          order_id: orderData.id,
          payment_method: 'promptpay',
          amount: orderInfo.totalAmount,
          slip_url: slipBase64 || null,
          status: 'pending_verification'
        }]);

        return { success: true, orderNumber, orderId: orderData.id };
      } catch (err) {
        console.error("Supabase insert error, falling back to local storage:", err);
      }
    }

    // Fallback Local Storage Mode
    const newOrder = {
      id: 'local-' + Date.now(),
      order_number: orderNumber,
      customer_name: orderInfo.name,
      customer_phone: orderInfo.phone,
      customer_email: orderInfo.email || '',
      delivery_type: orderInfo.deliveryType,
      delivery_address: orderInfo.address || '',
      delivery_date: orderInfo.deliveryDate,
      delivery_time_slot: orderInfo.deliveryTime,
      total_amount: orderInfo.totalAmount,
      delivery_fee: orderInfo.deliveryFee,
      note: orderInfo.note || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      items: items,
      payment: {
        amount: orderInfo.totalAmount,
        slip_url: slipBase64,
        status: 'pending_verification'
      }
    };

    const currentOrders = getLocalOrders();
    currentOrders.unshift(newOrder);
    saveLocalOrders(currentOrders);

    return { success: true, orderNumber, orderId: newOrder.id };
  },

  // ดึงรายการคำสั่งซื้อทั้งหมด (สำหรับหน้า Admin)
  async getAllOrders() {
    if (supabaseClient) {
      try {
        const { data: orders, error } = await supabaseClient
          .from('orders')
          .select(`
            *,
            order_items (*),
            payments (*)
          `)
          .order('created_at', { ascending: false });

        if (!error && orders) {
          // Normalize format
          return orders.map(o => ({
            ...o,
            items: o.order_items || [],
            payment: Array.isArray(o.payments) ? o.payments[0] : o.payments
          }));
        }
      } catch (err) {
        console.warn("Could not fetch orders from Supabase:", err);
      }
    }
    return getLocalOrders();
  },

  // ค้นหาออเดอร์ด้วยรหัสคำสั่งซื้อ (สำหรับหน้าติดตามสถานะลูกค้า)
  async getOrderByNumber(orderNumber) {
    const cleanNum = orderNumber.trim().toUpperCase();
    if (supabaseClient) {
      try {
        const { data: order, error } = await supabaseClient
          .from('orders')
          .select(`
            *,
            order_items (*),
            payments (*)
          `)
          .ilike('order_number', cleanNum)
          .single();

        if (!error && order) {
          return {
            ...order,
            items: order.order_items || [],
            payment: Array.isArray(order.payments) ? order.payments[0] : order.payments
          };
        }
      } catch (err) {
        console.warn("Supabase order query error:", err);
      }
    }

    const localOrders = getLocalOrders();
    return localOrders.find(o => o.order_number.toUpperCase() === cleanNum) || null;
  },

  // อัปเดตสถานะออเดอร์ (แอดมิน)
  async updateOrderStatus(orderId, newStatus) {
    if (supabaseClient && !orderId.startsWith('local-')) {
      try {
        await supabaseClient
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
        return true;
      } catch (err) {
        console.error("Failed to update status on Supabase:", err);
      }
    }

    const orders = getLocalOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = newStatus;
      target.updated_at = new Date().toISOString();
      saveLocalOrders(orders);
    }
    return true;
  },

  // ยืนยันสลิปโอนเงิน (แอดมิน)
  async verifyPayment(orderId, isVerified) {
    const paymentStatus = isVerified ? 'verified' : 'rejected';
    const orderStatus = isVerified ? 'confirmed' : 'pending';

    if (supabaseClient && !orderId.startsWith('local-')) {
      try {
        await supabaseClient
          .from('payments')
          .update({ status: paymentStatus, verified_at: new Date().toISOString() })
          .eq('order_id', orderId);

        await supabaseClient
          .from('orders')
          .update({ status: orderStatus })
          .eq('id', orderId);

        return true;
      } catch (err) {
        console.error("Failed to verify payment on Supabase:", err);
      }
    }

    const orders = getLocalOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      if (target.payment) target.payment.status = paymentStatus;
      target.status = orderStatus;
      saveLocalOrders(orders);
    }
    return true;
  },

  // Realtime Listener สำหรับออเดอร์ใหม่
  subscribeToOrders(onNewOrder) {
    if (supabaseClient) {
      const subscription = supabaseClient
        .channel('public:orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
          onNewOrder(payload.new);
        })
        .subscribe();
      return subscription;
    }
    return null;
  }
};

window.BakeryDB = BakeryDB;
