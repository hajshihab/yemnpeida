# دليل التثبيت والتشغيل - يمن بيديا

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

- **Node.js** (الإصدار 18 أو أحدث) - [تحميل](https://nodejs.org/)
- **MongoDB** (الإصدار 5 أو أحدث) - [تحميل](https://www.mongodb.com/try/download/community)
- **Git** - [تحميل](https://git-scm.com/)

## خطوات التثبيت

### 1. تشغيل MongoDB

قم بتشغيل MongoDB على جهازك:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

أو يمكنك استخدام MongoDB Atlas (قاعدة بيانات سحابية مجانية):
- سجل في [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- أنشئ Cluster مجاني
- احصل على رابط الاتصال

### 2. تثبيت Backend

```bash
# انتقل لمجلد Backend
cd yemen-pedia/backend

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
copy .env.example .env
# أو في Linux/Mac: cp .env.example .env
```

### 3. إعداد ملف .env للـ Backend

افتح ملف `backend/.env` وقم بتعديل الإعدادات:

```env
# قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/yemenpedia
# أو استخدم MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yemenpedia

# مفتاح JWT (اختر مفتاح قوي وعشوائي)
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string

# مفتاح الذكاء الصناعي
AI_API_KEY=your_openai_or_claude_api_key
AI_API_PROVIDER=openai
# أو AI_API_PROVIDER=claude

# المنفذ
PORT=5000

# رابط Frontend
FRONTEND_URL=http://localhost:3000
```

#### الحصول على مفتاح AI:

**لاستخدام OpenAI:**
1. سجل في [OpenAI Platform](https://platform.openai.com/)
2. اذهب إلى [API Keys](https://platform.openai.com/api-keys)
3. أنشئ مفتاح API جديد
4. استخدم: `AI_API_PROVIDER=openai`

**لاستخدام Claude:**
1. سجل في [Anthropic Console](https://console.anthropic.com/)
2. أنشئ مفتاح API
3. استخدم: `AI_API_PROVIDER=claude`

### 4. تثبيت Frontend

```bash
# افتح نافذة Terminal جديدة
cd yemen-pedia/frontend

# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
copy .env.example .env
# أو في Linux/Mac: cp .env.example .env
```

ملف `frontend/.env` يجب أن يحتوي على:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. إضافة التصنيفات اليمنية (اختياري)

```bash
cd yemen-pedia/database
node seed-categories.js
```

هذا سيضيف 15 تصنيف يمني أساسي للموقع.

## تشغيل المشروع

### تشغيل Backend

```bash
cd yemen-pedia/backend
npm start
```

سيعمل Backend على: `http://localhost:5000`

### تشغيل Frontend

في نافذة Terminal جديدة:

```bash
cd yemen-pedia/frontend
npm start
```

سيعمل Frontend على: `http://localhost:3000`

## الوصول للموقع

افتح المتصفح واذهب إلى: `http://localhost:3000`

## إنشاء أول حساب (Admin)

1. سجل حساب جديد من الموقع
2. افتح MongoDB Compass أو استخدم mongo shell
3. عدّل المستخدم الأول ليصبح Admin:

```javascript
// في MongoDB Shell أو Compass
db.users.updateOne(
  { email: "your_email@example.com" },
  { $set: { role: "admin" } }
)
```

أو عبر MongoDB Compass:
- افتح قاعدة البيانات `yemenpedia`
- افتح مجموعة `users`
- اعثر على مستخدمك
- غيّر `role` من `user` إلى `admin`

## اختبار المساعد الذكي

1. تأكد من إضافة مفتاح AI في ملف `.env`
2. اذهب إلى `/ai-assistant`
3. اطرح سؤالاً مثل: "ما هي عاصمة اليمن؟"

## المشاكل الشائعة وحلولها

### MongoDB لا يعمل

```bash
# تحقق من أن MongoDB يعمل
mongosh
# أو
mongo
```

### خطأ في الاتصال بـ Backend

- تأكد من أن Backend يعمل على المنفذ 5000
- تحقق من ملف `.env` في Frontend

### المساعد الذكي لا يعمل

- تأكد من صحة مفتاح AI_API_KEY
- تحقق من أن AI_API_PROVIDER صحيح (openai أو claude)
- تحقق من وجود رصيد في حساب OpenAI/Claude

### خطأ في تثبيت المكتبات

```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

## الوضع التطويري

لتشغيل Backend في وضع المطور (يعيد التشغيل تلقائياً):

```bash
cd backend
npm run dev
```

## البناء للإنتاج

### بناء Frontend

```bash
cd frontend
npm run build
```

سيُنشأ مجلد `build` يحتوي على الملفات الجاهزة للنشر.

### نشر المشروع

يمكنك نشر المشروع على:

- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (مجاني حتى 512 MB)

## الدعم

إذا واجهت أي مشكلة:

1. تحقق من [الوثائق](README.md)
2. راجع رسائل الأخطاء في Console
3. تأكد من تشغيل MongoDB و Backend و Frontend

## الميزات الأساسية

بعد التثبيت، يمكنك:

- ✅ إنشاء حساب وتسجيل الدخول
- ✅ قراءة المقالات
- ✅ البحث في الموسوعة
- ✅ استخدام المساعد الذكي
- ✅ كتابة مقالات جديدة (محررين فقط)
- ✅ تحرير المقالات الموجودة
- ✅ تصفح التصنيفات

## خطوات قادمة

1. أنشئ مقالات تجريبية
2. أضف محررين جدد
3. خصص التصنيفات حسب احتياجك
4. جرّب المساعد الذكي

---

**تهانينا! 🎉**

موقع يمن بيديا الآن جاهز للاستخدام!
