# 🚀 كيفية تشغيل يمن بيديا

## ✅ ما تم بالفعل:
- ✅ Node.js مثبت (v22.19.0)
- ✅ npm مثبت (v10.9.3)
- ✅ Backend dependencies مثبتة
- ✅ Frontend dependencies مثبتة
- ✅ ملفات .env منشأة

## ⚠️ ما تحتاج إلى فعله:

### الخيار 1: استخدام MongoDB Atlas (موصى به - مجاني وسهل)

#### 1. إنشاء حساب MongoDB Atlas

1. اذهب إلى: https://www.mongodb.com/cloud/atlas/register
2. سجل حساب مجاني (يمكنك استخدام Google)
3. اختر **M0 Free Tier** (512 MB مجاناً)
4. اختر أقرب منطقة لك

#### 2. إنشاء Cluster

1. بعد التسجيل، انقر على **Build a Database**
2. اختر **M0 Free** tier
3. اختر **Cloud Provider** (AWS مثلاً)
4. اختر **Region** (Frankfurt أو القريب لك)
5. اضغط **Create**

#### 3. إعداد الوصول

1. **إنشاء مستخدم للـ Database:**
   - اختر username (مثل: `admin`)
   - اختر password قوية (مثل: `YemenPedia2024`)
   - احفظها!

2. **السماح بالوصول من أي مكان:**
   - انقر على **Network Access** من القائمة اليسرى
   - انقر **Add IP Address**
   - اختر **Allow Access from Anywhere** (0.0.0.0/0)
   - اضغط **Confirm**

#### 4. الحصول على رابط الاتصال

1. ارجع إلى **Database** من القائمة
2. انقر على **Connect** بجانب cluster
3. اختر **Connect your application**
4. اختر **Driver**: Node.js
5. انسخ **Connection String**:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. استبدل `<password>` بكلمة المرور الحقيقية

#### 5. تحديث ملف .env

افتح الملف:
```
c:\Users\utilisateur\Desktop\Nouveau dossier (4)\yemen-pedia\backend\.env
```

غيّر السطر:
```env
MONGODB_URI=mongodb://localhost:27017/yemenpedia
```

إلى (استخدم رابطك):
```env
MONGODB_URI=mongodb+srv://admin:YemenPedia2024@cluster0.xxxxx.mongodb.net/yemenpedia?retryWrites=true&w=majority
```

---

### الخيار 2: تثبيت MongoDB محلياً (للمتقدمين)

#### Windows:
1. حمّل MongoDB من: https://www.mongodb.com/try/download/community
2. ثبّته
3. شغّل MongoDB Compass أو:
   ```bash
   mongod
   ```

#### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

## 🔑 الحصول على مفتاح AI (اختياري للبداية)

### خيار 1: OpenAI (موصى به)

1. اذهب إلى: https://platform.openai.com/signup
2. سجل حساب
3. اذهب إلى: https://platform.openai.com/api-keys
4. انقر **Create new secret key**
5. احفظ المفتاح (يبدأ بـ `sk-...`)

**ملاحظة:** OpenAI يعطيك $5 مجاناً عند التسجيل (تكفي للتجربة)

6. افتح `backend\.env` وغيّر:
```env
AI_API_KEY=sk-proj-xxxxxxxxxxxxxxx
AI_API_PROVIDER=openai
```

### خيار 2: Claude (بديل)

1. اذهب إلى: https://console.anthropic.com/
2. سجل حساب
3. احصل على API key
4. غيّر في `.env`:
```env
AI_API_KEY=sk-ant-xxxxxxxxxxxxxxx
AI_API_PROVIDER=claude
```

### خيار 3: التخطي مؤقتاً

يمكنك تشغيل الموقع بدون AI مؤقتاً، لكن المساعد الذكي لن يعمل.
اترك:
```env
AI_API_KEY=your_openai_api_key_here
```

---

## ▶️ تشغيل المشروع

### 1. تشغيل Backend

افتح Terminal/PowerShell:

```bash
cd "c:\Users\utilisateur\Desktop\Nouveau dossier (4)\yemen-pedia\backend"
npm start
```

يجب أن ترى:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📚 يمن بيديا - Yemen-Pedia API
```

### 2. تشغيل Frontend (نافذة جديدة)

افتح Terminal/PowerShell جديدة:

```bash
cd "c:\Users\utilisateur\Desktop\Nouveau dossier (4)\yemen-pedia\frontend"
npm start
```

سيفتح المتصفح تلقائياً على:
```
http://localhost:3000
```

### 3. إضافة التصنيفات اليمنية (مرة واحدة فقط)

بعد تشغيل Backend بنجاح، في نافذة ثالثة:

```bash
cd "c:\Users\utilisateur\Desktop\Nouveau dossier (4)\yemen-pedia\database"
node seed-categories.js
```

يجب أن ترى:
```
✅ Connected to MongoDB
✅ Inserted 15 categories
📜 التاريخ
🗺️ الجغرافيا
...
```

---

## 🎉 المشروع يعمل الآن!

افتح المتصفح: **http://localhost:3000**

### خطوات أولى:

1. **إنشاء حساب:**
   - انقر "إنشاء حساب"
   - املأ البيانات
   - سجل الدخول

2. **تحويل حسابك لـ Admin:**
   - اذهب إلى MongoDB Atlas → Browse Collections
   - افتح database `yemenpedia` → collection `users`
   - اعثر على مستخدمك
   - غيّر `"role": "user"` إلى `"role": "admin"`

3. **جرّب المساعد الذكي:**
   - انقر على "المساعد الذكي"
   - اسأل: "ما هي عاصمة اليمن؟"

4. **أنشئ أول مقالة:**
   - انقر "مقالة جديدة"
   - اكتب عن موضوع يمني
   - انشرها!

---

## 🔧 حل المشاكل

### ❌ Backend: Cannot connect to MongoDB

**الحل:**
- تأكد من صحة رابط MongoDB في `backend\.env`
- تأكد من استبدال `<password>` بكلمة المرور الحقيقية
- تأكد من السماح بالوصول من أي IP في MongoDB Atlas

### ❌ Frontend: API connection failed

**الحل:**
- تأكد من أن Backend يعمل على port 5000
- تحقق من `frontend\.env`:
  ```
  REACT_APP_API_URL=http://localhost:5000/api
  ```

### ❌ AI Assistant: Error

**الحل:**
- تحقق من صحة `AI_API_KEY` في `backend\.env`
- تأكد من وجود رصيد في حساب OpenAI
- أو اترك المساعد الذكي مؤقتاً حتى تحصل على مفتاح

---

## 📞 تحتاج مساعدة؟

إذا واجهت أي مشكلة:

1. تحقق من رسائل الخطأ في Terminal
2. تأكد من جميع الخطوات أعلاه
3. راجع ملف `INSTALLATION.md` للتفاصيل

---

## ✅ خطوات سريعة (TL;DR)

```bash
# 1. إعداد MongoDB Atlas وحدّث backend/.env

# 2. تشغيل Backend
cd backend
npm start

# 3. تشغيل Frontend (نافذة جديدة)
cd frontend
npm start

# 4. إضافة التصنيفات (مرة واحدة)
cd database
node seed-categories.js

# 5. افتح http://localhost:3000
```

---

**استمتع بيمن بيديا! 🇾🇪✨**
