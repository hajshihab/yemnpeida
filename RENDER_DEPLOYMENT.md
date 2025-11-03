# 🚀 دليل نشر Yemen-Pedia على Render

## 📋 جدول المحتويات
1. [المتطلبات الأساسية](#المتطلبات-الأساسية)
2. [إعداد MongoDB Atlas](#إعداد-mongodb-atlas)
3. [إعداد مستودع Git](#إعداد-مستودع-git)
4. [نشر Backend على Render](#نشر-backend-على-render)
5. [نشر Frontend على Render](#نشر-frontend-على-render)
6. [تهيئة قاعدة البيانات](#تهيئة-قاعدة-البيانات)
7. [إنشاء حساب Super Admin](#إنشاء-حساب-super-admin)
8. [اختبار التطبيق](#اختبار-التطبيق)
9. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## ✅ المتطلبات الأساسية

قبل البدء، تأكد من توفر:

- ✔️ حساب على [Render](https://render.com) (مجاني)
- ✔️ حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (مجاني)
- ✔️ حساب على [GitHub](https://github.com) أو GitLab/Bitbucket
- ✔️ Git مثبت على جهازك
- ✔️ معرفة أساسية بـ Git

---

## 🗄️ إعداد MongoDB Atlas

### الخطوة 1: إنشاء حساب وقاعدة بيانات

1. **التسجيل في MongoDB Atlas**
   - اذهب إلى: https://www.mongodb.com/cloud/atlas/register
   - أنشئ حساب جديد (مجاني)

2. **إنشاء Cluster**
   - اختر "Build a Database"
   - اختر "FREE" (M0 Sandbox)
   - اختر المنطقة الأقرب لك (مثلاً: AWS / Frankfurt)
   - اسم الـ Cluster: `yemen-pedia-cluster`

3. **إعداد الأمان**

   **أ. إنشاء Database User:**
   ```
   Username: yemenpedia_admin
   Password: [اختر كلمة مرور قوية وسجلها]
   ```

   **ب. إضافة IP Address:**
   - اختر "Network Access" من القائمة الجانبية
   - اضغط "Add IP Address"
   - اختر "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ هذا آمن لأن قاعدة البيانات محمية بكلمة مرور

4. **الحصول على Connection String**
   - اضغط "Connect" على الـ Cluster
   - اختر "Connect your application"
   - اختر Driver: Node.js
   - انسخ الـ Connection String:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/yemenpedia?retryWrites=true&w=majority
   ```
   - استبدل `<username>` و `<password>` بالبيانات التي أنشأتها
   - استبدل `cluster0.xxxxx` بعنوان الـ cluster الخاص بك
   - اسم قاعدة البيانات: `yemenpedia`

**مثال على Connection String صحيح:**
```
mongodb+srv://yemenpedia_admin:MySecurePass123@cluster0.abc123.mongodb.net/yemenpedia?retryWrites=true&w=majority
```

**احفظ هذا الـ Connection String للاستخدام لاحقاً!**

---

## 🔧 إعداد مستودع Git

### الخطوة 1: إنشاء Git Repository

1. **إنشاء مستودع على GitHub**
   - اذهب إلى: https://github.com/new
   - اسم المستودع: `yemen-pedia`
   - اختر "Private" (خاص) أو "Public" (عام)
   - لا تضف README أو .gitignore (موجود بالفعل)

2. **ربط المشروع بـ GitHub**

   افتح Terminal/CMD في مجلد المشروع ونفذ:

   ```bash
   # تهيئة Git (إذا لم يكن مهيأ)
   git init

   # إضافة جميع الملفات
   git add .

   # إنشاء أول commit
   git commit -m "Initial commit: Yemen-Pedia project ready for deployment"

   # إضافة المستودع البعيد (استبدل YOUR_USERNAME)
   git remote add origin https://github.com/YOUR_USERNAME/yemen-pedia.git

   # رفع الملفات
   git branch -M main
   git push -u origin main
   ```

3. **التحقق من الملفات المرفوعة**
   - تأكد أن ملفات `.env` **ليست مرفوعة** (يجب أن تكون في .gitignore)
   - يجب أن تكون ملفات `.env.example` موجودة فقط

---

## 🖥️ نشر Backend على Render

### الخطوة 1: إنشاء Web Service جديد

1. **تسجيل الدخول إلى Render**
   - اذهب إلى: https://dashboard.render.com
   - سجل الدخول أو أنشئ حساب جديد

2. **إنشاء Web Service**
   - اضغط "New +" من القائمة العلوية
   - اختر "Web Service"
   - اختر "Build and deploy from a Git repository"
   - اضغط "Next"

3. **ربط GitHub Repository**
   - اضغط "Connect" بجانب الـ repository الخاص بك
   - إذا لم يظهر، اضغط "Configure account" وأعط Render صلاحيات الوصول

### الخطوة 2: تكوين Backend Service

**املأ النموذج كالتالي:**

| الحقل | القيمة |
|------|--------|
| **Name** | `yemen-pedia-api` |
| **Region** | Oregon (US West) - مجاني |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && node database/seed-categories.js && node database/seed-sources.js` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### الخطوة 3: إضافة Environment Variables

اضغط "Advanced" ثم "Add Environment Variable" وأضف التالي:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | [الصق Connection String من MongoDB Atlas] |
| `JWT_SECRET` | [استخدم المولد أدناه] |
| `AI_API_KEY` | [اتركه فارغاً إذا لم يكن لديك] |
| `AI_API_PROVIDER` | `openai` |
| `FRONTEND_URL` | `https://yemen-pedia-frontend.onrender.com` |

**⚠️ هام: توليد JWT_SECRET قوي**

استخدم هذا الأمر لتوليد مفتاح آمن:

**على Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**على Linux/Mac:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

انسخ المفتاح الناتج وضعه في `JWT_SECRET`

### الخطوة 4: إنشاء وانتظار البناء

- اضغط "Create Web Service"
- سيبدأ Render في بناء ونشر الـ Backend
- **الانتظار**: قد يستغرق 5-10 دقائق
- راقب الـ Logs للتأكد من عدم وجود أخطاء

**علامات النجاح في الـ Logs:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📚 يمن بيديا - Yemen-Pedia API
```

### الخطوة 5: نسخ Backend URL

بعد نجاح النشر، انسخ الـ URL من أعلى الصفحة:
```
https://yemen-pedia-api.onrender.com
```

**احفظ هذا الرابط للاستخدام في Frontend!**

---

## 🌐 نشر Frontend على Render

### الخطوة 1: إنشاء Static Site جديد

1. **إنشاء Static Site**
   - من لوحة Render، اضغط "New +"
   - اختر "Static Site"
   - اختر نفس الـ repository

### الخطوة 2: تكوين Frontend Service

**املأ النموذج كالتالي:**

| الحقل | القيمة |
|------|--------|
| **Name** | `yemen-pedia-frontend` |
| **Region** | Oregon (US West) - مجاني |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### الخطوة 3: إضافة Environment Variables

اضغط "Advanced" ثم "Add Environment Variable":

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://yemen-pedia-api.onrender.com/api` |

⚠️ **استبدل الرابط بالرابط الفعلي للـ Backend الذي نسخته في الخطوة السابقة!**

### الخطوة 4: إنشاء وانتظار البناء

- اضغط "Create Static Site"
- **الانتظار**: قد يستغرق 10-15 دقيقة (بناء React أطول)
- راقب الـ Logs

**علامات النجاح:**
```
Creating an optimized production build...
Compiled successfully!
Build completed
```

### الخطوة 5: الحصول على Frontend URL

بعد النجاح، ستحصل على رابط مثل:
```
https://yemen-pedia-frontend.onrender.com
```

---

## 🔄 تحديث CORS في Backend

**مهم جداً:** عد إلى Backend Service على Render وحدّث `FRONTEND_URL`:

1. اذهب إلى Backend Service على Render
2. اضغط "Environment"
3. عدّل قيمة `FRONTEND_URL` إلى Frontend URL الفعلي:
   ```
   https://yemen-pedia-frontend.onrender.com
   ```
4. اضغط "Save Changes"
5. سيعيد Render نشر الـ Backend تلقائياً

---

## 🗃️ تهيئة قاعدة البيانات

### التحقق من التهيئة الأولية

الـ Build Command قام تلقائياً بتهيئة:
- ✅ 15 تصنيف يمني
- ✅ 10 مصادر يمنية

**للتحقق:**
1. اذهب إلى Backend Logs على Render
2. ابحث عن:
   ```
   ✅ Categories seeded successfully
   ✅ Sources seeded successfully
   ```

### إعادة التهيئة يدوياً (إذا لزم الأمر)

إذا لم يتم التهيئة، استخدم Render Shell:

1. اذهب إلى Backend Service
2. اضغط "Shell" من القائمة الجانبية
3. نفذ:
   ```bash
   node database/seed-categories.js
   node database/seed-sources.js
   ```

---

## 👤 إنشاء حساب Super Admin

### الطريقة 1: باستخدام Render Shell

1. في Backend Service، افتح "Shell"
2. نفذ:
   ```bash
   node backend/database/create-super-admin.js
   ```

### الطريقة 2: التسجيل من الواجهة + تعديل يدوي

1. **التسجيل من الموقع:**
   - اذهب إلى: `https://yemen-pedia-frontend.onrender.com/register`
   - سجل حساب جديد

2. **تعديل الدور في MongoDB Atlas:**
   - اذهب إلى MongoDB Atlas
   - افتح "Browse Collections"
   - اختر Database: `yemenpedia`
   - اختر Collection: `users`
   - ابحث عن المستخدم الذي أنشأته
   - اضغط "Edit"
   - غيّر `role` من `user` إلى `super_admin`
   - احفظ

---

## ✅ اختبار التطبيق

### 1. اختبار Backend API

افتح المتصفح واذهب إلى:
```
https://yemen-pedia-api.onrender.com/health
```

**يجب أن ترى:**
```json
{
  "status": "ok",
  "message": "يمن بيديا Backend is running"
}
```

### 2. اختبار Frontend

اذهب إلى:
```
https://yemen-pedia-frontend.onrender.com
```

**يجب أن ترى:**
- الصفحة الرئيسية بتصميم جميل
- شريط التنقل باللغة العربية
- التصنيفات الـ 15

### 3. اختبار التسجيل والدخول

1. سجل حساب جديد
2. سجل الدخول
3. حاول إنشاء مقالة
4. ابحث عن مقالة

### 4. اختبار صلاحيات Admin

1. سجل الدخول بحساب Super Admin
2. اذهب إلى: `/admin` أو `/super-admin`
3. تحقق من:
   - إدارة المستخدمين
   - إدارة المقالات
   - الإحصائيات

---

## 🔧 استكشاف الأخطاء

### مشكلة: Backend لا يعمل

**الحل:**
1. تحقق من Logs في Render
2. تأكد من صحة `MONGODB_URI`
3. تحقق من أن Build Command نجح
4. أعد نشر Service

**الأمر:**
- اذهب إلى Backend Service → "Manual Deploy" → "Deploy latest commit"

### مشكلة: Frontend لا يتصل بـ Backend

**الحل:**
1. تحقق من `REACT_APP_API_URL` في Frontend Environment Variables
2. تأكد أنه ينتهي بـ `/api`
3. تحقق من CORS في Backend (`FRONTEND_URL`)
4. افتح Developer Console (F12) وابحث عن أخطاء

### مشكلة: CORS Error

**الخطأ:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**الحل:**
1. تأكد من `FRONTEND_URL` في Backend يطابق Frontend URL بالضبط
2. أعد نشر Backend بعد التغيير

### مشكلة: Database Connection Failed

**الخطأ:**
```
❌ MongoDB connection error
```

**الحل:**
1. تحقق من صحة `MONGODB_URI`
2. تأكد من أن IP Address في MongoDB Atlas هو `0.0.0.0/0`
3. تأكد من صحة Username وPassword
4. تأكد من أن Cluster في MongoDB Atlas يعمل

### مشكلة: Build Failed

**الحل:**
1. تحقق من الـ Logs
2. تأكد من أن `package.json` صحيح
3. تأكد من وجود جميع Dependencies
4. جرب محلياً أولاً: `npm install && npm start`

### مشكلة: Render Free Tier يتوقف بعد فترة

**السبب:**
- Render Free Tier يوقف الخدمات بعد 15 دقيقة من عدم النشاط

**الحل:**
- الطلب الأول بعد التوقف قد يستغرق 30-60 ثانية (Cold Start)
- هذا طبيعي في الإصدار المجاني
- للحفاظ على الخدمة نشطة، استخدم خدمة Ping مثل:
  - [UptimeRobot](https://uptimerobot.com) (مجاني)
  - [Cron-Job.org](https://cron-job.org)

**إعداد Uptime Monitor:**
1. سجل في UptimeRobot
2. أنشئ Monitor جديد
3. URL: `https://yemen-pedia-api.onrender.com/health`
4. Interval: كل 5 دقائق

---

## 📊 ملاحظات حول Render Free Tier

### الحدود والقيود:

- ✅ **مجاني تماماً**
- ✅ **750 ساعة/شهر** (كافي لمشروع واحد)
- ⚠️ **يتوقف بعد 15 دقيقة** من عدم النشاط
- ⚠️ **Cold Start**: 30-60 ثانية لإعادة التشغيل
- ⚠️ **100GB Bandwidth/شهر**
- ✅ **SSL مجاني** (HTTPS)
- ✅ **Auto-Deploy** عند Push إلى Git

### نصائح للأداء الأفضل:

1. **استخدم Uptime Monitor** للحفاظ على الخدمة نشطة
2. **MongoDB Atlas Free Tier**: 512MB تخزين (كافي للبداية)
3. **Caching**: استخدم React Query أو SWR لتقليل الطلبات
4. **Compression**: تفعيل Gzip في Backend (موجود افتراضياً)

---

## 🎉 تهانينا!

مشروع **Yemen-Pedia** الآن منشور ويعمل على Render! 🚀

### الروابط المهمة:

- **Frontend**: https://yemen-pedia-frontend.onrender.com
- **Backend API**: https://yemen-pedia-api.onrender.com
- **API Health Check**: https://yemen-pedia-api.onrender.com/health
- **MongoDB Atlas**: https://cloud.mongodb.com

### الخطوات التالية:

1. ✅ شارك الرابط مع الآخرين للتجربة
2. 📝 اكتب مقالات يمنية
3. 🎨 خصص التصميم
4. 🤖 فعّل مساعد AI (بإضافة API Key)
5. 📊 راقب الإحصائيات والأداء

---

## 🆘 الدعم والمساعدة

إذا واجهت أي مشكلة:

1. راجع [استكشاف الأخطاء](#استكشاف-الأخطاء) أعلاه
2. تحقق من Logs في Render Dashboard
3. راجع [Render Documentation](https://render.com/docs)
4. راجع [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

## 📝 ملاحظات إضافية

### تحديث المشروع بعد التعديلات:

1. عدّل الكود محلياً
2. اعمل Commit و Push:
   ```bash
   git add .
   git commit -m "وصف التعديلات"
   git push origin main
   ```
3. Render سيقوم تلقائياً بإعادة النشر (Auto-Deploy)

### إضافة Domain مخصص (اختياري):

1. اذهب إلى Frontend Service في Render
2. اضغط "Settings" → "Custom Domain"
3. اتبع التعليمات لربط Domain الخاص بك

---

**تم إعداد هذا الدليل بواسطة Yemen-Pedia Team** 🇾🇪

**رخصة المشروع:** MIT License
