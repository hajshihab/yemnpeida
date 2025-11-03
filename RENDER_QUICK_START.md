# 🚀 دليل البدء السريع - رفع يمن بيديا على Render

هذا دليل مختصر وسريع لرفع المشروع على Render للتجربة.

---

## الخطوة 1: إنشاء حساب GitHub ورفع المشروع

### 1.1 إنشاء مستودع GitHub

1. اذهب إلى: https://github.com/new
2. اسم المستودع: `yemen-pedia`
3. اختر **Public** (عام) أو **Private** (خاص)
4. لا تضف README
5. اضغط **Create repository**

### 1.2 رفع المشروع

افتح Command Prompt أو PowerShell في مجلد المشروع:

```bash
cd "c:\Users\utilisateur\Desktop\Nouveau dossier (4)\yemen-pedia"

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "Initial commit: Yemen-Pedia ready for Render deployment"

# ربط بـ GitHub (استبدل YOUR_USERNAME باسم المستخدم الخاص بك)
git remote add origin https://github.com/YOUR_USERNAME/yemen-pedia.git

# رفع الملفات
git branch -M main
git push -u origin main
```

---

## الخطوة 2: إعداد MongoDB Atlas (قاعدة البيانات)

### 2.1 إنشاء حساب وقاعدة بيانات

1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register
2. سجل حساب مجاني
3. اختر **Create a Database**
4. اختر **FREE** (M0 Sandbox)
5. المنطقة: اختر أقرب منطقة (مثلاً: Frankfurt)
6. اضغط **Create**

### 2.2 إعداد الأمان

**إنشاء مستخدم:**
- Username: `yemenpedia_admin`
- Password: اختر كلمة مرور قوية وسجلها

**إضافة IP:**
- اضغط **Network Access** > **Add IP Address**
- اختر **Allow Access from Anywhere** (0.0.0.0/0)
- اضغط **Confirm**

### 2.3 الحصول على Connection String

1. اضغط **Connect** على الـ Cluster
2. اختر **Connect your application**
3. انسخ الـ Connection String:
```
mongodb+srv://yemenpedia_admin:<password>@cluster0.xxxxx.mongodb.net/yemenpedia?retryWrites=true&w=majority
```
4. استبدل `<password>` بكلمة المرور التي اخترتها
5. **احفظ هذا الرابط!**

---

## الخطوة 3: النشر على Render

### 3.1 إنشاء حساب Render

1. اذهب إلى: https://dashboard.render.com/register
2. سجل حساب جديد (يمكنك استخدام حساب GitHub)

### 3.2 نشر Backend (خادم API)

1. من لوحة Render، اضغط **New +** > **Web Service**
2. اختر **Build and deploy from a Git repository**
3. اربط حساب GitHub الخاص بك
4. اختر مستودع `yemen-pedia`

**إعدادات Backend:**
```
Name:              yemen-pedia-api
Region:            Oregon (US West)
Branch:            main
Root Directory:    backend
Runtime:           Node
Build Command:     bash build.sh
Start Command:     npm start
Instance Type:     Free
```

**Environment Variables (اضغط Advanced):**
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | الصق Connection String من MongoDB Atlas |
| `JWT_SECRET` | (اتركه - سيتم توليده تلقائياً) |
| `AI_API_KEY` | (اتركه فارغاً) |
| `AI_API_PROVIDER` | `openai` |
| `FRONTEND_URL` | `https://yemen-pedia.onrender.com` |

5. اضغط **Create Web Service**
6. انتظر 5-10 دقائق حتى يكتمل البناء
7. انسخ رابط Backend: `https://yemen-pedia-api.onrender.com`

### 3.3 نشر Frontend (الواجهة)

1. من لوحة Render، اضغط **New +** > **Static Site**
2. اختر نفس المستودع `yemen-pedia`

**إعدادات Frontend:**
```
Name:              yemen-pedia
Region:            Oregon (US West)
Branch:            main
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: build
```

**Environment Variables (اضغط Advanced):**
| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://yemen-pedia-api.onrender.com/api` |

(استبدل الرابط بالرابط الفعلي للـ Backend)

3. اضغط **Create Static Site**
4. انتظر 10-15 دقيقة حتى يكتمل البناء

---

## الخطوة 4: تحديث CORS في Backend

**مهم جداً:**
1. ارجع إلى Backend Service على Render
2. اضغط **Environment**
3. عدّل `FRONTEND_URL` إلى رابط Frontend الفعلي:
   ```
   https://yemen-pedia.onrender.com
   ```
4. اضغط **Save Changes**

---

## الخطوة 5: اختبار الموقع

### اختبر Backend:
افتح: `https://yemen-pedia-api.onrender.com/health`

يجب أن ترى:
```json
{
  "status": "ok",
  "message": "يمن بيديا Backend is running"
}
```

### اختبر Frontend:
افتح: `https://yemen-pedia.onrender.com`

يجب أن ترى:
- الصفحة الرئيسية
- 5 مقالات عن اليمن
- التصنيفات

---

## الخطوة 6: تسجيل الدخول كـ Super Admin

تم إنشاء حساب Super Admin تلقائياً:

```
البريد الإلكتروني: admin@yemenpedia.com
كلمة المرور: Admin123!@#
```

1. اذهب إلى: `https://yemen-pedia.onrender.com/login`
2. سجل الدخول
3. يمكنك الوصول إلى:
   - لوحة التحكم: `/super-admin`
   - لوحة المحرر: `/admin`
   - إدارة المستخدمين
   - إدارة المقالات

---

## ملاحظات مهمة

### حول Render Free Tier:
- **مجاني تماماً** ولكن يتوقف بعد 15 دقيقة من عدم النشاط
- أول طلب بعد التوقف يستغرق 30-60 ثانية (Cold Start)
- هذا طبيعي في الإصدار المجاني

### البيانات الموجودة:
- ✅ 15 تصنيف يمني
- ✅ 10 مصادر يمنية
- ✅ 5 مقالات عن اليمن (صنعاء، سبأ، القهوة، سقطرى، شبام)
- ✅ حساب Super Admin واحد

### للحفاظ على الموقع نشطاً:
استخدم خدمة Uptime Monitor مثل:
- **UptimeRobot**: https://uptimerobot.com (مجاني)
- URL للمراقبة: `https://yemen-pedia-api.onrender.com/health`
- فترة المراقبة: كل 5 دقائق

---

## استكشاف الأخطاء الشائعة

### مشكلة: Frontend لا يتصل بـ Backend

**الحل:**
1. تحقق من `REACT_APP_API_URL` في Frontend Environment Variables
2. تحقق من `FRONTEND_URL` في Backend Environment Variables
3. تأكد أن البيانات متطابقة
4. أعد نشر كلا الخدمتين

### مشكلة: Database Connection Error

**الحل:**
1. تحقق من `MONGODB_URI` في Backend
2. تأكد من IP Address في MongoDB Atlas: `0.0.0.0/0`
3. تحقق من صحة Username وPassword
4. تأكد أن اسم قاعدة البيانات: `yemenpedia`

### مشكلة: Build Failed

**الحل:**
1. راجع الـ Logs في Render Dashboard
2. تأكد من `Root Directory` صحيح
3. تأكد من وجود ملفات `package.json`

---

## تحديث المشروع بعد التعديلات

عندما تعدل الكود محلياً:

```bash
# إضافة التعديلات
git add .

# إنشاء commit
git commit -m "وصف التعديلات"

# رفع للـ GitHub
git push origin main
```

Render سيقوم **تلقائياً** بإعادة النشر (Auto-Deploy)!

---

## الروابط المهمة

- **Frontend**: https://yemen-pedia.onrender.com
- **Backend API**: https://yemen-pedia-api.onrender.com
- **Health Check**: https://yemen-pedia-api.onrender.com/health
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Dashboard**: https://dashboard.render.com

---

## الدعم والمساعدة

لمزيد من التفاصيل، راجع:
- `RENDER_DEPLOYMENT.md` - دليل شامل ومفصل
- `API_DOCS.md` - توثيق API
- `README.md` - معلومات عامة عن المشروع

---

**تهانينا! موقعك الآن منشور على الإنترنت!** 🎉🇾🇪

**شارك الرابط مع الأصدقاء واستمتع بـ يمن بيديا!**
