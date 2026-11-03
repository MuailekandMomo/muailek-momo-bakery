// ====================================================================
// Muailek & Momo Bakery Shop - Configuration
// ====================================================================

const CONFIG = {
  // 1. ตั้งค่าการเชื่อมต่อ Supabase
  // หลังจากรัน SQL ใน Supabase แล้ว นำ URL และ anon key จากหน้า Project Settings > API มาวางที่นี่
  SUPABASE_URL: "https://nktdcvbmxfgoexyvzzyx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGRjdmJteGZnb2V4eXZ6enl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMjc4NDksImV4cCI6MjA3OTkwMzg0OX0.30Hlq58j5uGkQnC0f19x6i1o7Lw_X8Ff1-3l2e2v9j8",

  // 2. ข้อมูลร้านค้าและการชำระเงิน
  SHOP_NAME: "Muailek & Momo Bakery Shop",
  SHOP_TAGLINE: "อบสดใหม่ด้วยหัวใจ ทุกคำคือความสุข",
  SHOP_PHONE: "089-123-4567",
  SHOP_ADDRESS: "123/45 ถนนสุขุมวิท แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110",

  // เบอร์หรือเลขประจำตัวสำหรับสร้าง QR Code พร้อมเพย์
  PROMPTPAY_NUMBER: "0891234567",
  PROMPTPAY_NAME: "มวยเล็กแอนด์โมโม เบเกอรี่",

  // ค่าจัดส่งคงที่ (0 = ฟรีค่าส่ง)
  DELIVERY_FEE: 50.00,
  FREE_DELIVERY_THRESHOLD: 500.00, // สั่งครบ 500 บาท ส่งฟรี

  // ช่วงเวลารับของ / จัดส่ง
  TIME_SLOTS: [
    "10:00 - 12:00 น.",
    "13:00 - 15:00 น.",
    "15:00 - 17:00 น.",
    "17:00 - 19:00 น."
  ]
};

// ตรวจสอบว่าได้ใส่ Supabase Key จริงแล้วหรือไม่
const isSupabaseConfigured = () => {
  return CONFIG.SUPABASE_URL &&
    CONFIG.SUPABASE_URL.startsWith("https://") &&
    CONFIG.SUPABASE_ANON_KEY &&
    CONFIG.SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";
};

window.BAKERY_CONFIG = CONFIG;
window.isSupabaseConfigured = isSupabaseConfigured;
