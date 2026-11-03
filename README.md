# 🎂 Muailek & Momo Bakery Shop

ระบบเว็บแอปพลิเคชันสั่งขนมออนไลน์สำหรับร้าน **"Muailek&Momo bakery shop"**
เชื่อมต่อฐานข้อมูลและระบบจัดเก็บข้อมูลด้วย **Supabase**, เก็บซอร์สโค้ดบน **GitHub**, และ Deploy สู่ผู้ใช้งานด้วย **Netlify**

---

## 🌟 ฟีเจอร์หลักของระบบ

### 1. หน้าร้านสำหรับลูกค้า (Customer Storefront)
- 🧁 **หมวดหมู่ขนม & ตัวกรอง**: เค้กวันเกิด/เค้กปอนด์, ขนมปัง & ครัวซองต์, คุกกี้ & ทาร์ต, ขนมสด & ของหวาน
- ✍️ **ปรับแต่งขนมสั่งทำพิเศษ**: ใส่ข้อความเขียนหน้าเค้ก, เลือกระดับความหวาน, เพิ่มเทียนวันเกิด
- 📅 **กำหนดวันเวลารับขนม**: เลือกระหว่าง "รับที่หน้าร้าน (Pick-up)" หรือ "จัดส่งถึงบ้าน (Delivery)" พร้อมระบุวันและรอบเวลา
- 💳 **ชำระเงิน & สลิปโอนเงิน**: สร้าง QR พร้อมเพย์สำหรับชำระเงิน และระบบอัปโหลดสลิป
- 🔍 **ติดตามสถานะขนม (Order Tracking)**: เช็กสถานะการเตรียมขนมแบบ Real-time (รับคำสั่งซื้อ ➔ ยืนยันสลิป ➔ กำลังอบ ➔ พร้อมส่ง ➔ สำเร็จ)

### 2. ระบบจัดการหลังบ้านสำหรับเจ้าของร้าน (Admin Dashboard)
- 📋 **ตารางออเดอร์แบบ Realtime**: ดูออเดอร์ใหม่ได้ทันที ไม่ต้องกดรีเฟรช
- 🔎 **ตรวจสลิป & เปลี่ยนสถานะ**: ดูรูปสลิปพร้อมตรวจสอบยอดเงิน และกดอัปเดตสถานะออเดอร์
- 🍰 **จัดการสต็อกและเมนู**: เปิด/ปิดเมนูที่วัตถุดิบหมด และดูสรุปยอดขาย

---

## 📁 โครงสร้างโปรเจกต์

```text
muailek-momo-bakery/
├── index.html               # หน้าหลักสำหรับลูกค้า (Storefront & Cart & Tracking)
├── admin.html               # หน้าแดชบอร์ดสำหรับเจ้าของร้าน (Admin Portal)
├── netlify.toml             # การตั้งค่าสำหรับ Deploy บน Netlify
├── supabase_schema.sql      # สคริปต์ SQL สร้าง Table, Storage, RLS บน Supabase
├── css/
│   └── styles.css           # ธีมดีไซน์เบเกอรี่พรีเมียม สไตล์ Warm Pastel Cream
├── js/
│   ├── config.js            # กำหนด Supabase URL & Anon Key (พร้อม Mock Mode สำรอง)
│   ├── supabase.js          # ฟังก์ชันเชื่อมต่อ Database, Storage และ Realtime
│   ├── app.js               # Logic หน้าร้าน ตะกร้า และการสั่งซื้อ
│   └── admin.js             # Logic หน้าแอดมิน เปลี่ยนสถานะ ตรวจสลิป
└── assets/                  # โฟลเดอร์รูปภาพและไอคอน
```

---

## 🚀 ขั้นตอนการติดตั้งและเปิดใช้งาน

### ขั้นตอนที่ 1: ตั้งค่าบน Supabase
1. เข้าไปที่ [https://supabase.com](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่ (เช่น `muailek-momo-bakery`)
2. ไปที่เมนู **SQL Editor** ใน Supabase
3. คัดลอกโค้ดทั้งหมดจากไฟล์ `supabase_schema.sql` ไปวางแล้วกด **Run**
4. ไปที่เมนู **Project Settings > API** คัดลอกค่า:
   - `Project URL`
   - `anon public key`
5. นำค่าทั้งสองไปใส่ในไฟล์ `js/config.js`

### ขั้นตอนที่ 2: นำโค้ดขึ้น GitHub
1. เข้า [https://github.com](https://github.com) และสร้าง Repository ใหม่ เช่น `muailek-momo-bakery`
2. อัปโหลดโค้ดทั้งหมดนี้ขึ้น GitHub

### ขั้นตอนที่ 3: Deploy บน Netlify
1. เข้า [https://www.netlify.com](https://www.netlify.com) แล้วล็อกอินด้วย GitHub
2. กด **Add new site > Import an existing project**
3. เลือก Repository `muailek-momo-bakery`
4. ตั้งค่า:
   - **Publish directory**: `.` (โฟลเดอร์ Root)
5. กด **Deploy Site** ระบบจะสร้าง URL เว็บไซต์พร้อมใช้งานทันที!
