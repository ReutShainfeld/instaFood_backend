# instaFood_backend
#  InstaFood - פרויקט גמר | Backend

זהו הריפוזיטורי של צד השרת עבור אפליקציית **InstaFood** – פלטפורמה חברתית לשיתוף מנות ממסעדות, דירוגים, תגובות ותוכן מבוסס מיקום.  
ה-Backend נכתב ב-Node.js ומספק REST API עבור לקוח React (ראו [instafood_frontend](https://github.com/ReutShainfeld/instafood_frontend)).

> פרויקט גמר במסגרת לימודי פיתוח Full Stack, שפותח על ידי צוות של 6 מפתחות.

---

##  מטרות צד השרת

- ניהול משתמשים, אימות והרשאות
- טיפול בתוכן גולשים: מנות, תגובות, דירוגים
- תמיכה בקריאות API עבור צד לקוח
- חיבור למסד נתונים NoSQL - MongoDB
- העלאת תמונות ואחסון במדיה חיצונית (Cloudinary)

---

##  טכנולוגיות עיקריות (Backend)

- **Node.js** עם **Express.js**
- **MongoDB** עם **Mongoose**
- **JWT** לאימות משתמשים (Authentication)
- **bcrypt** להצפנת סיסמאות
- **multer** להעלאת תמונות
- **Cloudinary** לאחסון וניהול קבצי מדיה בענן
- **multer-storage-cloudinary** לחיבור בין multer ל-Cloudinary
- **CORS**, **dotenv**, **helmet** ועוד ספריות עזר

---

##  תכונות עיקריות

-  הרשמה, התחברות וניהול session עם JWT
-  CRUD מלא למתכון: יצירה, עריכה, מחיקה, שליפה
-  תמיכה בהעלאת תמונות עם אחסון ב-Cloudinary
-  מערכת לייקים / דירוגים
-  תגובות של משתמשים
-  ניהול פרופיל משתמש
-  קבלת מנות לפי מיקום, משתמשים נעקבים, מסעדות ועוד

---

##  מבנה כללי של המערכת

- **API מבוסס RESTful**, המשרת את לקוח ה-React
- **חיבור למסד MongoDB** בענן או מקומית
- **אחסון מדיה בענן עם Cloudinary**
- קונפיגורציה מבוססת קובץ `.env`
- טיפול בנתונים לפי תקני אבטחה מקובלים

---

##  הוראות הפעלה (Backend)

1. ודאו ש-Node.js מותקן במחשב
2. שִכפלו את הריפו:

```bash
git clone https://github.com/ReutShainfeld/instafood_backend.git
cd instafood_backend
```

3. התקינו תלויות:

```bash
npm install
```

4. הגדירו קובץ `.env` עם המשתנים הבאים:

```env
PORT=5000
MONGODB_URI
JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

SENDGRID_API_KEY
EMAIL_SENDER_ADDRESS

BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

5. הריצו את השרת:

```bash
npm run dev
```

6. השרת ירוץ כברירת מחדל בכתובת:  
   `http://localhost:5000`

---

##  מבנה תיקיות עיקרי

```bash
instafood_backend/
├── controllers/       # לוגיקת שליטה לכל רוט
├── models/            # סכמות Mongoose למסד הנתונים
├── routes/            # הגדרת מסלולי API
├── middleware/        # אימות, שגיאות, טיפול בהרשאות
├── uploads/           # (אופציונלי) אחסון מקומי אם לא בענן
├── config/            # קבצי קונפיגורציה (DB, Cloudinary וכו')
├── .env               # משתני סביבה
└── server.js          # קובץ הכניסה הראשי
```

---

##  נקודות מפתח בפיתוח

- ארכיטקטורת REST מלאה עם הפרדה בין שכבות
- ניהול הרשאות באמצעות JWT ו-middleware
- טיפול בשגיאות ובקרת גישה ברמה גבוהה
- שימוש ב-Mongoose לסכמות ו-Validation
- העלאת תמונות ל-Cloudinary עם multer-storage-cloudinary
- בנייה של API גמיש, מאובטח ונוח לשימוש מצד ה-Frontend

---

לשאלות, פידבק או תרומות – מוזמנים לפתוח issue או לפנות ישירות לחברות הצוות.

---
