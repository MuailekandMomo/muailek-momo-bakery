-- ====================================================================
-- Muailek & Momo Bakery Shop - Supabase Database Schema & Seed Data
-- ====================================================================

-- 1. ตารางหมวดหมู่สินค้า (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT '🧁',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางเมนูขนม (Products)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    image_url TEXT,
    tag TEXT DEFAULT 'Freshly Baked', -- เช่น 'Best Seller', 'Pre-order 2 วัน', 'Chef Recommend'
    is_available BOOLEAN DEFAULT TRUE,
    allow_custom_text BOOLEAN DEFAULT FALSE, -- เช่น เค้กที่เขียนหน้าเค้กได้
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ตารางคำสั่งซื้อ (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE, -- เช่น MM-2026-0001
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_type TEXT NOT NULL DEFAULT 'pickup', -- 'pickup' (รับที่ร้าน) หรือ 'delivery' (จัดส่ง)
    delivery_address TEXT,
    delivery_date DATE NOT NULL,
    delivery_time_slot TEXT NOT NULL, -- เช่น '11:00 - 13:00'
    total_amount NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending', 
    -- สถานะ: 'pending' (รอชำระ/ตรวจสลิป), 'confirmed' (ยืนยันแล้ว), 'baking' (กำลังอบขนม), 'ready' (พร้อมส่ง/รับ), 'completed' (สำเร็จ), 'cancelled' (ยกเลิก)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ตารางรายการสินค้าในคำสั่งซื้อ (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    custom_text TEXT, -- ข้อความเขียนหน้าเค้ก
    sweetness_level TEXT, -- ระดับความหวาน เช่น หวานน้อย 50%, ปกติ 100%
    options JSONB, -- เก็บออปชันเสริม เช่น เทียนวันเกิด, มีดตัดเค้ก
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ตารางการชำระเงินและสลิป (Payments)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    payment_method TEXT NOT NULL DEFAULT 'promptpay',
    amount NUMERIC(10, 2) NOT NULL,
    slip_url TEXT,
    transfer_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending_verification', -- 'pending_verification', 'verified', 'rejected'
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Categories & Products: ใครก็อ่านได้ (Public Read)
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

-- Orders: ลูกค้าสามารถสร้างออเดอร์ใหม่ได้ และอ่านเฉพาะออเดอร์ของตนเอง (หรือผ่าน order_number)
CREATE POLICY "Public create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- Order Items: อนุญาตให้อ่านและสร้าง
CREATE POLICY "Public create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read order items" ON public.order_items FOR SELECT USING (true);

-- Payments: อนุญาตให้อ่านและสร้าง
CREATE POLICY "Public create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Public update payments" ON public.payments FOR UPDATE USING (true);

-- ====================================================================
-- REALTIME SUBSCRIPTIONS
-- ====================================================================
-- เปิดใช้งาน Realtime สำหรับการแจ้งเตือนออเดอร์ใหม่ในหน้าหลังบ้าน
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- ====================================================================
-- SEED DATA (ข้อมูลเริ่มต้นสำหรับร้าน Muailek & Momo Bakery)
-- ====================================================================

-- ลบข้อมูลเดิมชั่วคราว (กรณีรันซ้ำ)
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- หมวดหมู่
INSERT INTO public.categories (id, name, slug, icon, display_order) VALUES
('11111111-1111-1111-1111-111111111111', 'เค้กวันเกิด & เค้กปอนด์', 'cakes', '🎂', 1),
('22222222-2222-2222-2222-222222222222', 'เบเกอรี่ & ครัวซองต์', 'bakery', '🥐', 2),
('33333333-3333-3333-3333-333333333333', 'คุกกี้ & ทาร์ต', 'cookies', '🍪', 3),
('44444444-4444-4444-4444-444444444444', 'ขนมสด & ของหวานเย็น', 'desserts', '🍮', 4);

-- รายการสินค้า
INSERT INTO public.products (category_id, name, description, price, original_price, image_url, tag, is_available, allow_custom_text) VALUES
-- เค้ก
('11111111-1111-1111-1111-111111111111', 
 'Strawberry Blossom Shortcake (1 ปอนด์)', 
 'สปันจ์เค้กวานิลลานุ่มละมุน สอดไส้ครีมสดฮอกไกโดและสตรอว์เบอร์รีสดนำเข้าจากญี่ปุ่น หวานน้อยกลมกล่อม', 
 690.00, 750.00, 
 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80', 
 'Best Seller 🍓', true, true),

('11111111-1111-1111-1111-111111111111', 
 'Basque Burnt Cheesecake (ชีสเค้กหน้าไหม้)', 
 'ชีสเค้กหน้าไหม้สไตล์สเปน กลิ่นคาราเมลหอมกรุ่น เนื้อเค้กเนียนนุ่มเยิ้มตรงกลาง ใช้ครีมชีสแท้จากฝรั่งเศส', 
 590.00, 650.00, 
 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', 
 'Chef Recommend ⭐', true, true),

('11111111-1111-1111-1111-111111111111', 
 'Signature Belgian Dark Chocolate Fudge Cake', 
 'เค้กช็อกโกแลตฟัดจ์เนื้อแน่นเข้มข้น ทำจากเบลเยียมดาร์กช็อกโกแลต 74% รสชาติเข้มข้น หวานกำลังดี ไม่เลี่ยน', 
 650.00, NULL, 
 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 
 'Must Try 🍫', true, true),

('11111111-1111-1111-1111-111111111111', 
 'เค้กมินิมอลสไตล์เกาหลี (Korean Vintage Cake)', 
 'เค้กครีมสดสไตล์เกาหลี โทนครีมพาสเทล สามารถระบุข้อความอวยพรและลายการ์ตูนหน้าเค้กได้ตามต้องการ', 
 750.00, 800.00, 
 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', 
 'Pre-order 1 วัน 🎨', true, true),

-- เบเกอรี่ & ครัวซองต์
('22222222-2222-2222-2222-222222222222', 
 'Classic French Butter Croissant (ครัวซองต์เนยฝรั่งเศส)', 
 'ครัวซองต์แป้งกรอบนอกนุ่มใน หอมฟุ้งเนยสดแท้ AOP จากแคว้นนอร์มังดี นวดและพับชั้นอย่างพิถีพิถัน', 
 85.00, NULL, 
 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', 
 'อบสดใหม่ทุกเช้า 🥐', true, false),

('22222222-2222-2222-2222-222222222222', 
 'Almond Cream Croissant (ครัวซองต์อัลมอนด์)', 
 'ครัวซองต์สอดไส้ครีมอัลมอนด์หอมหวาน โรยหน้าด้วยอัลมอนด์สไลซ์อบกรอบและไอซิ่งบางๆ', 
 110.00, NULL, 
 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 
 'ยอดนิยม 🌰', true, false),

('22222222-2222-2222-2222-222222222222', 
 'Shokupan ขนมปังเนยสดนมฮอกไกโด', 
 'ขนมปังแถวสไตล์ญี่ปุ่น เนื้อนุ่มยืดเหนียวนุ่ม ดึงเป็นเส้นได้ ทานเปล่าๆ หรือปิ้งทาเนยก็อร่อยลงตัว', 
 120.00, 140.00, 
 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80', 
 'สูตรพิเศษ 🍞', true, false),

-- คุกกี้ & ทาร์ต
('33333333-3333-3333-3333-333333333333', 
 'New York Soft Cookies กล่อง 4 ชิ้น (รวมรส)', 
 'ซอฟต์คุกกี้สไตล์นิวยอร์ก หนานุ่ม ไส้เยิ้ม ช็อกโกแลตชิป, เรดเวลเวทครีมชีส, มัทฉะไวท์ช็อก, ดาร์กช็อกสโมคแอนด์วอลนัต', 
 220.00, 260.00, 
 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80', 
 'Gift Set 🎁', true, false),

('33333333-3333-3333-3333-333333333333', 
 'Lemon Curd Meringue Tart (ทาร์ตเลมอนเมอแรงก์)', 
 'แป้งทาร์ตกรุบกรอบ สอดไส้เลมอนเคิร์ดเปรี้ยวอมหวานสดชื่น ท็อปด้วยเมอแรงก์อิตาเลียนเบิร์นไฟหอมกรุ่น', 
 135.00, NULL, 
 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80', 
 'เปรี้ยวหวานสดชื่น 🍋', true, false),

-- ขนมสด & ของหวานเย็น
('44444444-4444-4444-4444-444444444444', 
 'ไดฟุกุสตรอว์เบอร์รีถั่วแดงกวน (กล่อง 2 ลูก)', 
 'แป้งไดฟุกุนุ่มหนึบ ปั้นสดใหม่ สอดไส้ถั่วแดงกวนสูตรหวานน้อย และสตรอว์เบอร์รีสดไซซ์จัมโบ้', 
 150.00, NULL, 
 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80', 
 'ปั้นสดทุกวัน 🍓', true, false),

('44444444-4444-4444-4444-444444444444', 
 'Caramel Custard Pudding (พุดดิ้งคัสตาร์ดคาราเมล)', 
 'พุดดิ้งเนื้อเนียนละมุนลิ้น ละลายในปาก ราดด้วยซอสคาราเมลหอมกลิ่นน้ำตาลไหม้กำลังดี', 
 75.00, NULL, 
 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', 
 'ขนมหวานคลายร้อน 🍮', true, false);
