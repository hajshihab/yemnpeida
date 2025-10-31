# توثيق API - يمن بيديا

## Base URL

```
http://localhost:5000/api
```

## المصادقة (Authentication)

معظم endpoints تتطلب JWT token في الـ header:

```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### تسجيل حساب جديد

```http
POST /auth/register
Content-Type: application/json

{
  "username": "ahmed_ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "displayName": "أحمد علي"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "ahmed_ali",
    "email": "ahmed@example.com",
    "displayName": "أحمد علي",
    "role": "user"
  }
}
```

### تسجيل الدخول

```http
POST /auth/login
Content-Type: application/json

{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

### الحصول على بيانات المستخدم الحالي

```http
GET /auth/me
Authorization: Bearer <token>
```

### تحديث الملف الشخصي

```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "أحمد علي المحرر",
  "bio": "محرر في يمن بيديا",
  "avatar": "https://..."
}
```

---

## 📚 Articles Endpoints

### الحصول على جميع المقالات

```http
GET /articles?page=1&limit=20&status=published&category=<category_id>
```

**Query Parameters:**
- `page` (optional): رقم الصفحة (default: 1)
- `limit` (optional): عدد المقالات (default: 20)
- `status` (optional): حالة المقالة (published, draft, archived)
- `category` (optional): ID التصنيف
- `tag` (optional): الوسم
- `featured` (optional): true/false

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "_id": "...",
      "title": "صنعاء عاصمة اليمن",
      "slug": "sanaa-capital",
      "summary": "صنعاء هي عاصمة اليمن...",
      "author": {
        "_id": "...",
        "username": "ahmed_ali",
        "displayName": "أحمد علي"
      },
      "categories": [...],
      "tags": ["صنعاء", "عاصمة", "مدن"],
      "views": 1250,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### الحصول على مقالة واحدة

```http
GET /articles/:slug
```

**Example:**
```http
GET /articles/sanaa-capital
```

### إنشاء مقالة جديدة

```http
POST /articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "صنعاء عاصمة اليمن",
  "slug": "sanaa-capital",
  "content": "<p>صنعاء هي عاصمة اليمن...</p>",
  "summary": "نبذة مختصرة عن صنعاء",
  "categories": ["category_id_1", "category_id_2"],
  "tags": ["صنعاء", "عاصمة", "مدن"],
  "status": "published",
  "images": [
    {
      "url": "https://...",
      "caption": "صورة لصنعاء القديمة",
      "alt": "صنعاء القديمة"
    }
  ],
  "references": [
    {
      "title": "تاريخ صنعاء",
      "url": "https://...",
      "author": "محمد الحميري"
    }
  ]
}
```

**Requires:** Editor or Admin role

### تحديث مقالة

```http
PUT /articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "صنعاء عاصمة الجمهورية اليمنية",
  "content": "<p>محتوى محدث...</p>",
  "status": "published"
}
```

**Requires:** Editor or Admin role

### حذف مقالة

```http
DELETE /articles/:id
Authorization: Bearer <token>
```

**Requires:** Editor or Admin role

### الحصول على تاريخ النسخ

```http
GET /articles/:id/revisions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "revisions": [
    {
      "_id": "...",
      "content": "...",
      "summary": "تحديث المعلومات",
      "editor": {
        "username": "ahmed_ali",
        "displayName": "أحمد علي"
      },
      "editedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

---

## 🔍 Search Endpoints

### البحث في المقالات

```http
GET /search?q=صنعاء&page=1&limit=20
```

**Query Parameters:**
- `q` (required): كلمة البحث
- `category` (optional): ID التصنيف
- `tag` (optional): الوسم
- `page` (optional): رقم الصفحة
- `limit` (optional): عدد النتائج

**Response:**
```json
{
  "success": true,
  "query": "صنعاء",
  "results": [...],
  "pagination": {...}
}
```

### اقتراحات البحث

```http
GET /search/suggestions?q=صن
```

**Response:**
```json
{
  "success": true,
  "suggestions": [
    {
      "_id": "...",
      "title": "صنعاء",
      "slug": "sanaa"
    },
    {
      "_id": "...",
      "title": "صنعاء القديمة",
      "slug": "old-sanaa"
    }
  ]
}
```

---

## 🤖 AI Assistant Endpoints

### سؤال المساعد الذكي

```http
POST /ai/ask
Content-Type: application/json

{
  "question": "ما هي عاصمة اليمن؟",
  "context": "سياق إضافي اختياري"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "صنعاء هي عاصمة الجمهورية اليمنية...",
  "relatedArticles": [
    {
      "title": "صنعاء",
      "summary": "..."
    }
  ]
}
```

### الحصول على اقتراحات لتحسين المقالة

```http
POST /ai/suggest-improvements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "صنعاء عاصمة اليمن",
  "content": "<p>محتوى المقالة...</p>"
}
```

**Response:**
```json
{
  "success": true,
  "suggestions": "1. التقييم العام: المقالة جيدة...\n2. اقتراحات للتحسين..."
}
```

**Requires:** Authentication

---

## 🗂️ Categories Endpoints

### الحصول على جميع التصنيفات

```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "...",
      "name": "History",
      "nameAr": "التاريخ",
      "slug": "history",
      "description": "تاريخ اليمن عبر العصور",
      "icon": "📜",
      "color": "#8B4513",
      "order": 1
    }
  ]
}
```

### الحصول على تصنيف واحد

```http
GET /categories/:slug
```

### إنشاء تصنيف جديد

```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Music",
  "nameAr": "الموسيقى",
  "slug": "music",
  "description": "الموسيقى اليمنية التقليدية",
  "icon": "🎵",
  "color": "#FF6347",
  "order": 16
}
```

**Requires:** Admin role

### تحديث تصنيف

```http
PUT /categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nameAr": "الموسيقى والغناء"
}
```

**Requires:** Admin role

### حذف تصنيف

```http
DELETE /categories/:id
Authorization: Bearer <token>
```

**Requires:** Admin role

---

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🔒 Roles & Permissions

### User (مستخدم عادي)
- قراءة المقالات
- البحث
- استخدام المساعد الذكي

### Editor (محرر)
- كل صلاحيات User
- إنشاء مقالات
- تحرير مقالات
- حذف مقالاته

### Admin (مدير)
- كل صلاحيات Editor
- إدارة التصنيفات
- حذف أي مقالة
- إدارة المستخدمين (قريباً)

---

## 💡 أمثلة استخدام

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// تسجيل الدخول
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

// الحصول على المقالات
const getArticles = async (token) => {
  const response = await axios.get(`${API_URL}/articles`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// سؤال المساعد الذكي
const askAI = async (question) => {
  const response = await axios.post(`${API_URL}/ai/ask`, {
    question
  });
  return response.data;
};
```

### cURL

```bash
# تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ahmed@example.com","password":"password123"}'

# الحصول على المقالات
curl -X GET http://localhost:5000/api/articles

# سؤال المساعد الذكي
curl -X POST http://localhost:5000/api/ai/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"ما هي عاصمة اليمن؟"}'
```

---

## 🔄 Rate Limiting

- 100 طلب كل 15 دقيقة لكل IP
- ينطبق على جميع الـ endpoints تحت `/api/`

---

## 🐛 التعامل مع الأخطاء

جميع الأخطاء تُرجع بالصيغة التالية:

```json
{
  "success": false,
  "message": "رسالة الخطأ بالعربية",
  "error": { /* تفاصيل إضافية في وضع التطوير */ }
}
```

---

**للمزيد من المساعدة، راجع الكود المصدري أو افتح issue على GitHub!**
