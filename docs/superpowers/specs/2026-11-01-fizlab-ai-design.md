# FizLab AI — Prototip Dizayni

**Sana:** 2026-11-01
**Manba hujjat:** `D:\fizlab\edubio_reactjs\edubio_reactjs\fizlab.docx` (texnik topshiriq v1.0)
**Holat:** Foydalanuvchi tomonidan tasdiqlangan (mockup'lar orqali)

---

## 1. Intent (Nima uchun)

EduBio platformasining **Institut tizimi → Fizika** bo'limida ishlaydigan **FizLab AI** prototipi quriladi: virtual laboratoriya (7-sinf, «Arximed kuchi») va real vaqt sinf paneli. O'qituvchi bitta ekranda butun sinfning tajriba o'tkazish jarayonini kuzatadi, dars oxirida har bir o'quvchi uchun qoidalarga asoslangan diagnostika hisoboti avtomatik shakllanadi.

**Asosiy muammo (hujjatdan):** sinfdagi 25–40 o'quvchini bir vaqtda baholash o'qituvchi uchun imkonsiz — kim qayerda qiynalayotgani dars tugagandan keyin bilinadi yoki umuman bilinmaydi.

## 2. Goals / Non-goals / Anti-goals

### Goals (MVP, 1-bosqich)
- O'qituvchi dars kodi bilan dars boshlaydi, o'quvchilar kod orqali kiradi (alohida kompyuterlarda).
- O'quvchi «Arximed kuchi» laboratoriyasini 7 bosqichda bajaradi; har bir harakat loglanadi.
- O'qituvchi panelida o'quvchilar real vaqtda rangli kartochkalarda ko'rinadi (kechikish ≤5 soniya).
- «Tezkor diagnostika» 10 soniya ichida sinf xulosasini chiqaradi.
- Dars tugagach har bir o'quvchi uchun ko'nikma darajalari, xato turlari, kuchli/zaif tomonlar, tavsiyalar va o'zbek tilidagi AI matnli xulosasi ko'ratiladi (MVP'da — qoidalar asosida yozilgan matn).
- Interfeys to'liq o'zbek tilida (lotin).

### Non-goals (bu bosqichda YO'Q)
- ❌ Firebase Auth / login-parol (o'qituvchi shunchaki tugma bilan kiradi).
- ❌ Administrator paneli (foydalanuvchi eksplicit rad etdi).
- ❌ Ro'yxatdan o'tish, parol tiklash.
- ❌ Backend yozish (Node.js, WebSocket server) — Firebase Realtime Database ishlatiladi.
- ❌ PDF/Excel eksport, dinamika grafigi saqlanishi (2-bosqich).
- ❌ LLM (Gemini) bilan haqiqiy AI tahlili — MVP'da qoidalar asosidagi matnli shablon.
- ❌ Boshqa laboratoriyalar (tezlik, bosim, ishqalanish) — keyingi bosqichlar.
- ❌ O'quvchining boshqa o'quvchi natijasini ko'rishi (yopiq tizim).

### Anti-goals (bunlar bo'lsa — muvaffaqiyatsizlik)
- O'qituvchi 5 soniyadan ko'proq kutib qolsa yoki sahifa qayta yuklansa.
- Log ma'lumotlari yo'qolsa (aloqa uzilsa ham brauzerda saqlanib, keyin yuborilishi shart).
- Yangi laboratoriya qo'shish uchun butun kodni qayta yozish talab qilinsa.
- Interfeys faqat bitta ekranda ishlasa, boshqa ekranlar ishlamasa.

## 3. Constraints (Cheklovlar)

- **Muhit:** EduBio Vite + React 19 + Tailwind (CDN) ilovasi ichida, `Capacitor` Android uchun. HashRouter.
- **Joylashuv:** Institut tizimi → Fizika fani (tanlangan fan `eduSubject` localStorage'da). Maktab tizimiga tegilmaydi.
- **Hosting:** Vercel static + Firebase Realtime Database (server yozilmaydi; Vercel'da persistent server yo'q).
- **Xavfsizlik savobi:** Auth yo'qligi uchun RTDB rules «demo» rejimida ochiq bo'ladi — shaxsiy ma'lumot faqat ism/sinf, hujjatdagi talabga mos.
- **Qurilmalar:** maktab kompyuterlari (Chrome/Edge), Desktop birinchi, mobil ixtiyoriy.
- **Til:** o'zbek (lotin); matnlar kodga qattiq yozilmaydi (`i18n` kabi faylda emas, MVP'da oddiy matn moduli).

## 4. Qabul qilingan qarorlar (Foydalanuvchi bilan)

| # | Qaror | Holat |
|---|---|---|
| 1 | To'liq ilova ko'rinishida (demo emas) | Foydalanuvchi tasdiqladi |
| 2 | O'quvchilar alohida kompyuterlarda, real vaqt kerak | Foydalanuvchi tasdiqladi |
| 3 | Auth yo'q, admin yo'q — faqat o'qituvchi + o'quvchi paneli | Foydalanuvchi tasdiqladi |
| 4 | **O'quvchi laboratoriyasi = Variant B** (katta simulyatsiya: asboblar chapda, slayderlar o'ngda, bosqichlar pastda) | Mockup tanlandi |
| 5 | **O'qituvchi paneli = Variant A** (rangli kartochkalar: ism, bosqich, foiz, vaqt + ✋; filtr chiplari; pastda statistika) | Mockup tanlandi |
| 6 | **Diagnostika ekrani** — ko'nikma shkalalari, xato turlari, kuchli/zaif, AI matnli xulosa, Tasdiqlash/Tahrirlash/PDF/Sinf tugmalari | Mockup "maqul" |
| 7 | Backend: **Firebase Realtime Database** (menda e'lon qilingan taxmin; foydalanuvchi qarshi chiqmadi) | Menimcha eng sodda yechim |

## 5. Tizim tuzilishi (qanday quriladi)

### 5.1 Kirish oqimi
```
Institut tizimi → Fan tanlandi (Fizika) → Fizika sahifasi
  └─ "FizLab AI — Virtual laboratoriya" kirish kartasi
       ├─ [O'qituvchi paneli]  → sinf yaratadi → dars kodi (masalan 7A-XY3)
       └─ [Darsga qo'shilish]  → kod kiritish → ism tanlash → laboratoriya
```

### 5.2 Ekranlar (mockup'lar asosida)
1. **Kirish** — ikkita yirik tugma: «O'qituvchi paneli» / «Darsga qo'shilish».
2. **O'qituvchi: sinf sozlash** — sinf nomi, laboratoriya (hozircha bitta: «Arximed kuchi»), o'quvchilar ro'yxati (qo'lda yozish, MVP'da ixtiyoriy — o'quvchi o'zi ismini yozadi), «Darsni boshlash» → dars kodi.
3. **O'qituvchi: real vaqt paneli (Variant A)** — tepada: dars kodi, ⚡ Tezkor diagnostika, ⏸ Pauza, ■ Darsni tugatish; rangli filtr (Hammasi/Qizil/Sariq/Yashil); kartochkalar (ism, bosqich, foiz, vaqt, holat rangi, ✋ belgi); pastda statistika (o'quvchilar soni, o'rtacha vaqt, eng ko'p xato, yordam so'raganlar).
4. **O'quvchi: laboratoriya (Variant B)** — tepa: mavzu + ism; katta simulyatsiya maydoni (idish + suv + jism + dinamometr); chapda asboblar paneli (dinamometr, o'lchov silindri, tarozi, «Noto'g'ri»); o'ngda slayderlar (massa, hajm, suyuqlik zichligi); pastda bosqich chiplari + «Yakunlash».
5. **Diagnostika: o'quvchi** — tasdiqlangan mockup bo'yicha (8 blok).
6. **Diagnostika: sinf** — MVP'da «Tezkor diagnostika» oynasi: qaysi bosqichda ko'pchilik qiynalmoqda, eng ko'p xato turi, yordam kerak bo'lganlar ro'yxati.

### 5.3 Laboratoriya bosqichlari (hujjat §5.1)
1. Nazariy savol (suyuqlikka botirilgan jismga qanday kuch ta'sir qiladi?)
2. Asbob tanlash (to'g'ri/noto'g'ri — diagnostika uchun muhim)
3. Jismni havoda o'lchash (og'irlik)
4. Jismni suyuqlikda o'lchash (og'irlik kamayishi)
5. Parametrlarni o'zgartirib takroriy o'lchash (slayderlar: hajm, zichlik)
6. Natijalarni jadvalga kiritish va Arximed kuchini hisoblash (Fbu = P − F1)
7. Xulosa (kuch nimalarga bog'liq?)

### 5.4 Simulyatsiya mantiqi (Variant B)
- Dinamometr ko'rsatishi: havoda `F1 = P`, suyuqlikda `F2 = P − Fbu`, `Fbu = ρ · g · V`.
- Slayderlar real vaqtda simulyatsiyani yangilaydi; o'quvchi «O'lchash» tugmasini bosadi → qiymat jadvalga tushadi.
- Asbob panelida «Noto'g'ri» asbob ham tanlanadi (qasddan — diagnostika uchun).

### 5.5 Log voqealari (hujjat §5.2 — to'liq ro'yxat)
`asbob_tanlandi`, `parametr_ozgardi`, `olchash_bajarildi`, `javob_kiritildi`, `jadval_toldirildi`, `yordam_sorandi`, `bosqich_ochildi/yopildi`, `xulosa_yozildi` — har birida vaqt tamg'asi.

### 5.6 Rangli holat qoidasi (hujjat §6.5 — sozlanadigan konfig)
- **Yashil:** bosqich me'yoriy vaqtda, xato 0–1
- **Sariq:** xato ≥2 yoki vaqt me'yordan 1.5× ko'p
- **Qizil:** xato ≥3 yoki vaqt me'yordan 2× ko'p yoki «Yordam» bosilgan
- Me'yoriy vaqt va koeffitsientlar **konfiguratsiya faylida** (`labRules`), kodga qattiq yozilmaydi.

### 5.7 Diagnostika qoidalari (hujjat §6.4 — rule-based MVP)
Har bir xato kodga moslanadi: noto'g'ri asbob → «Asbob tanlash: past»; bir vaqtda bir nechta parametr o'zgartirish → «Tajriba rejalashtirish: past»; g o'rniga N → «Birliklar: past»; hisob noto'g'ri → «Hisoblash»; xuloosa mantiqqa zid → «Tushunchaviy xato»; bosqichda 2× vaqt → «Umumiy: qizil».
AI matnli xulosa — shablonlar bilan yig'iladi (ism + kuchli + zaif + tavsiya).

## 6. Ma'lumotlar tuzilmasi (Firebase RTDB)

```
fizlab/
  sessions/{code}          # code, labId, className, status(active|paused|ended), startedAt, endedAt
  sessions/{code}/students/{sid}   # name, stage, pct, status(g|y|r), stageMs, needHelp, joinedAt
  sessions/{code}/logs/{logId}     # sid, type, data, ts
  sessions/{code}/diagnostics/{sid}# skills{}, errors{}, strengths[], weaknesses[], aiText, confirmed
  sessions/{code}/quickdiag        # tezkor diagnostika natijasi (vaqtinchalik)
```

- O'quvchi `sid` — sessiya ichida tasodifiy ID (ism emas) → loglar to'g'ri bog'lanadi.
- Brauzer tomonida `onDisconnect()` + offline buffer (hujjat §9: aloqa uzilsa yo'qolmaydi).
- Real vaqt: `onValue` listenerlar orqali o'qituvchi paneli (kechikish ≤5 soniya talab qondiriladi).

## 7. Muvaffaqiyat mezonlari (hujjat §11 — MVP)
- O'qituvchi barcha o'quvchilarni real vaqtda ko'radi (kechikish ≤5 s).
- Barcha harakatlar yo'qotishsiz saqlanadi.
- «Tezkor diagnostika» ≤10 soniya.
- Har bir o'quvchi uchun ≥3 ko'nikma bo'yicha avtomatik diagnostika.
- Oddiy maktab kompyuterida to'xtovsiz ishlaydi.

## 8. Ishlab chiqish tartibi (taxminiy)

1. **Tuzilma + kirish:** Fizika sahifasiga FizLab kartasi, kirish ekran, RTDB ulanishi.
2. **O'qituvchi oqimi:** sinf sozlash → dars kodi → real vaqt paneli (kartochkalar, filtr, pauza/tugatish).
3. **O'quvchi oqimi:** kod kiritish → ism → laboratoriya (bosqichlar, slayderlar, jadval, loglar).
4. **Diagnostika:** tezkor + to'liq (qoidalar konfigi, rang qoidalari, xulosa ekranlari).
5. **Mushtarak holatlar:** aloqa uzilishi, sahifani yangilash, sessiya tugagach kirish.

## 9. Hujjat qoldirgan va builder hal qiladigan qarorlar

- FizLab AI kirishi Fizika sahifasida qanday ko'rinadi (yirik kartami, alohida tugmami).
- O'quvchi ro'yxati: o'quvchi o'zi ismini yozadimi yoki o'qituvchi oldindan ro'yxat kiritadimi (MVP).
- Me'yoriy bosqich vaqtlari qanday qiymatlar bilan boshlanadi (default konfig).
- Sinfxo klasslar (desktop chegarasi, responsive talablar).
