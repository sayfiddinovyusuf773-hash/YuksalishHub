# Yuksalish Hub — O‘zbekiston yoshlarining yagona rivojlanish ekotizimi

> **"Bilim sari birlashamiz. Kelajak sari yuksalamiz."**  
> *"Har bir yoshning rivojlanishi — mamlakat kelajagiga qo‘shilgan hissa."*

---

## 🌟 Loyiha Haqida

**Yuksalish Hub** — O‘zbekiston Respublikasining barcha 14 ta ma’muriy hududi (Qoraqalpog‘iston Respublikasi, Toshkent shahri va 12 ta viloyat) hamda ulardagi tuman va shaharlar yoshlarini yagona raqamli ekotizimga birlashtiruvchi zamonaviy ijtimoiy-intellektual platforma.

Platforma an’anaviy maktab yoki universitet boshqaruv tizimi emas, balki yoshlarning bilim olishi, xorijiy tillarni o‘rganishi, kitob mutolaa qilishi, IT va startap loyihalarini yaratishi hamda ijtimoiy tashabbuslarda faol ishtirok etishi uchun mo‘ljallangan dinamik va zamonaviy yoshlar hamjamiyatidir.

---

## 🚀 Asosiy Imkoniyatlar va Funksiyalar

1. **14 Ta Hududning Interaktiv Vektor Xaritasi**:
   - Har bir viloyat va shahar bo‘yicha aniq ma’lumotlar: yoshlar soni, maydoni, markazi, faol hamjamiyatlar va loyihalar.
   - Tumanlar va shaharlar darajasida navigatsiya.

2. **5 Ta Asosiy Rivojlanish Yo‘nalishi**:
   - 📖 **Kitobxonlik va Adabiyot**: Kitoblar katalogi, qidiruv, yulduzli reyting, mutolaa sahifalarini qayd qilish, kitob tahlillari va oylik marafonlar.
   - 🌐 **Xorijiy Tillar**: Ingliz, arab va rus tillarida speaking klublar, jonli efir integratsiyasi, 30 kunlik 500 ta so‘z lug‘at marafonlari.
   - 💻 **IT va Innovatsiya**: Open source tashabbuslar, jamoaviy kodlash, AI master-klasslari va 14 kunlik dasturlash sprintlari.
   - 🚀 **Liderlik va Tadbirkorlik**: Startap g‘oyalarini tekshirish (validation), biznes-reja tuzish, pitch taqdimotlar va mentorlik.
   - 🤝 **Volontyorlik va Ijtimoiy Tashabbuslar**: "Yashil Makon" ekologik hasharlari, bepul ta’lim loyihalari va rasmiy volontyorlik qaydlari.

3. **Haqiqiy Ma’lumotlar Bazasiga Ulangan Avtorizatsiya va Rollar**:
   - Super Admin, Regional Coordinator, District Coordinator, Community Moderator, Mentor, Regular User.
   - Sha256 + Tuzlangan xavfsiz parollash tizimi.
   - Yangi ro‘yxatdan o‘tgan yoshlarga darhol hududiy hamjamiyat va +50 XP rag‘batlantirish bali.

4. **Shaxsiy Dashboard (Boshqaruv Paneli)**:
   - Foydalanuvchi darajasi (Level), XP ballar va progress-bar.
   - A’zo bo‘lingan hamjamiyatlar, faol marafonlar, yaqinlashayotgan tadbirlar va mutolaa javoni.

5. **Yoshlar Loyihalari va Jamoa Tuzish**:
   - Loyihalarni e’lon qilish (G‘oya, Jamoa shakllanmoqda, Jarayonda, Yakunlandi).
   - Kerakli rollarni tanlab jamoaga a’zo bo‘lish (+50 XP).

6. **Tadbirlar va Onlayn/Oflayn RSVP Tizimi**:
   - Tadbirlarga 1-bosishda ro‘yxatdan o‘tish (+25 XP) va ishtirokchilar ro‘yxati.

7. **Ichki Bildirishnomalar va Moderatsiya Tizimi**:
   - Nomaqbul kontentlar ustidan shikoyat yuborish (Reporting) va moderatorlar tomonidan bir bosishda ko‘rib chiqilishi.

8. **Admin va Tahliliy Statistika Paneli**:
   - Hududlar bo‘yicha yoshlar qamrovi diagrammalari (`recharts`).
   - Foydalanuvchilar rollarini boshqarish (Super Admin tomonidan).

---

## 🔑 Sinov Hisoblari (Demo Accounts)

Platformada quyidagi rollar oldindan tayyorlangan:

| Rol | Email | Parol | Ruxsat doirasi |
|---|---|---|---|
| **Super Admin** | `admin@ufq.uz` | `ufq2026!` | Barcha tizim va hududlarni to‘liq boshqarish |
| **Hududiy Koordinator** | `samarqand.admin@ufq.uz` | `ufq2026!` | Faqat Samarqand viloyati resurslarini boshqarish |
| **Moderator** | `sardor@ufq.uz` | `ufq2026!` | Hamjamiyatlar va shikoyatlarni moderatsiya qilish |
| **Faol Yosh** | `jasur@ufq.uz` | `ufq2026!` | Standart foydalanuvchi imkoniyatlari |

*(Shuningdek, istalgan paytda `/royxatdan-otish` sahifasidan yangi profil ochishingiz mumkin).*

---

## 🛠 Texnologiyalar Steki

- **Frontend & Backend**: Next.js 16 (App Router, Server Actions & API Routes, Turbopack)
- **Til**: TypeScript (To‘liq typesafety)
- **Dizayn & Uslub**: Tailwind CSS v4, Midnight Navy va Rich Indigo ranglar palitrasi, Glassmorphism
- **Grafika & Ikonkalar**: Lucide React, SVG Interaktiv Xarita
- **Diagrammalar**: Recharts
- **Ma’lumotlar bazasi**: Doimiy JSON/Atomik Fayl Baza (`data/ufq_database.json`) — qo‘shimcha tashqi servis yoki docker talab qilmaydi, Windows, Linux va MacOS'da bir zumda ishlaydi.

---

## 💻 Mahalliy Ishga Tushirish (Local Run)

Loyihani o‘z kompyuteringizda ishga tushirish uchun:

```bash
# 1. Loyiha papkasiga kiring
cd C:\Users\AliCom\Desktop\ufq

# 2. Bog‘liqliklarni tekshiring (kerak bo‘lsa)
npm install

# 3. Dasturchi rejimini ishga tushiring
npm run dev
```

Brauzeringizda oching: **`http://localhost:3000`**

---

## 🚢 Ishlab Chiqarishga Joylash (Production Deployment)

Loyiha to‘liq `npm run build` testidan o‘tgan bo‘lib, Vercel, Node.js VPS, Docker yoki istalgan bulutli muhitga 1 ta buyruq bilan joylanishi mumkin:

```bash
npm run build
npm run start
```
