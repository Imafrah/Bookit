# 🎯 BookIt – Adventure Booking Platform

BookIt is a full-stack web application where users can explore curated adventure experiences and book them seamlessly. The platform connects users with verified tour guides offering kayaking, mountain hikes, coffee trails, and more.

---

## 🚀 Live Project

Frontend (Vercel): ✅  
Backend (Render): ✅  
Database (Railway): ✅

| Service | Status | URL |
|--------|--------|-----|
| Frontend | ✅ Live | https://<your-frontend>.vercel.app |
| Backend API | ✅ Live | https://<your-backend>.onrender.com |
| Database | ✅ Cloud | Railway MySQL |

> 🔄 Replace URLs after deployment ✅

---

## ✨ Key Features

✅ Browse curated adventure experiences  
✅ View pricing, location, and activity details  
✅ Real-time availability slots  
✅ Apply promo codes to get discounts  
✅ Confirm bookings with user details  
✅ Fully deployed cloud architecture  
✅ Responsive UI built with modern frameworks

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite + TypeScript + TailwindCSS |
| Backend | Node.js + Express.js |
| Database | MySQL (Railway) |
| Deployment | Vercel + Render |
| Version Control | Git + GitHub |

---

## 🗄 Database Schema

**Database Name:** `bookitdb`

| Table | Description |
|------|-------------|
| experiences | Details of adventure packages |
| bookings | Customer bookings information |
| promocodes | Active coupon codes |
| slots | Time slots for each experience |

---

### 🗃️ Example Table Structure (Experiences)

| Column | Type |
|--------|------|
| id | INT (PK) |
| title | VARCHAR |
| description | TEXT |
| location | VARCHAR |
| price | DECIMAL |
| duration | INT |
| capacity | INT |
| imageUrl | TEXT |
| isActive | TINYINT |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | `/api/experiences` | Fetch all adventures |
| GET | `/api/experiences/:id` | Fetch details of one adventure |
| GET | `/api/experiences/:id/availability?date=YYYY-MM-DD` | Fetch booking slots |
| POST | `/api/bookings` | Create transaction booking |
| GET | `/api/promo?activeOnly=true` | Validate promo code |

---

## 🧩 Project Setup (Local)

Clone repo:

```sh
git clone https://github.com/<imafrah>/Bookit.git
cd Bookit

## ⚙️ Local Development

### Prerequisites
- Node.js 18+ (or 20+)
- MySQL instance (local or cloud)

### 1) Backend (Express)
```sh
cd backend
npm install
```
Create a `.env` in `backend/` (locally) with your DB creds if you’re not using Render/Vercel envs:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bookitdb
DB_USER=root
DB_PASSWORD=yourpassword
DB_SSL=false
SYNC_DB=true
```
Run the server locally:
```sh
npm run dev
# http://localhost:5000/api
```

Seed sample data (tables + demo rows):
```sh
npm run seed
```

### 2) Frontend (Vite + React)
```sh
npm install
npm run dev
# http://localhost:5173 (Vite default)
```
Frontend reads API base from `VITE_API_BASE` (see `services/http.ts`). For local dev:
```env
VITE_API_BASE=http://localhost:5000/api
```

---

## ☁️ Cloud Architecture
- Backend API: Render (Node Web Service) or Vercel (Serverless)
- Database: Railway (MySQL Public Connection)
- Frontend: Vercel (Vite static build)

---

## 🗄 Railway MySQL (Public Connection)
From Railway → MySQL → Connect, copy the PUBLIC connection:
```
Host: gondola.proxy.rlwy.net
Port: 23090
User: root
Password: <your_password>
Database: bookitdb
```
Environment values to use in the backend:
```
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=23090
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=bookitdb
DB_SSL=false
```

If your existing `experiences` rows are not showing, ensure `isActive=1`:
```sql
UPDATE experiences SET isActive = 1 WHERE isActive IS NULL OR isActive = 0;
```

---

## 🚀 Deploy Backend on Render (recommended for API)
Service: Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/health` (or `/api`)

Environment (Render → Environment):
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL=false
# One-time schema alignment (turn OFF after first success):
SYNC_DB=true
DB_SYNC_ALTER=true
```
Watch logs for:
- “Database connected…”
- “Database synced …”
- “Server running on port …”

Then disable sync flags (set `SYNC_DB=false`, `DB_SYNC_ALTER=false`) and redeploy.

---

## 🚀 Deploy Backend on Vercel (Serverless Option)
Files already added:
- `backend/api/index.js`
- `backend/api/[...all].js`

Create a new Vercel project:
- Root Directory: `backend`
- Framework: Other
- No build command required for API-only
- Env Vars: same DB_* as above (DB_SSL=false)

Verify:
- `GET https://<your-backend>.vercel.app/api/health` → `{ status: "OK" }`

Note: Do not use `src/index.js` (it calls `app.listen`). Serverless imports `src/app.js`.

---

## 🌐 Deploy Frontend on Vercel
Create a new Vercel project from repo root (where `index.html` exists):
- Root Directory: repository root
- Framework: Vite + React
- Build Command: `npm run build`
- Output Directory: `dist`

Environment (Vercel → Project → Settings → Env Vars):
```
VITE_API_BASE=https://<your-backend-domain>/api
```
Use your Render backend URL or your Vercel backend URL.

---

## 🔌 API Reference (Quick)
- `GET /api/health` → health probe
- `GET /api/experiences` → list active experiences
- `GET /api/experiences/:id` → one experience with availability
- `GET /api/experiences/:id/availability?date=YYYY-MM-DD`
- `POST /api/bookings` → create booking
- `GET /api/bookings` → list bookings (debug: add `?noinclude=1` to skip join)
- `GET /api/promo?activeOnly=true` → list active promo codes
- `POST /api/promo/validate` → validate a code `{ code, amount }`

---

## 🧯 Troubleshooting
- 500 on `/api/experiences`: tables missing or `isActive` not set → enable `DB_SYNC_ALTER=true` once or run seed; set `isActive=1` on rows.
- 500 on `/api/bookings`: join failing due to table names → ensured models use `tableName: 'experiences' | 'bookings'` and FK `experienceId` exists; use `?noinclude=1` to isolate.
- Can’t connect to DB from Render/Vercel: use Railway PUBLIC host/port (not `mysql.railway.internal`); set `DB_SSL=false` unless enforced.
- Vercel 404 root page: that’s an API-only project; deploy frontend as a separate project from repo root, or set rewrites if using a single project.

---

## 🛡️ Production Notes
- Disable sync flags after the first successful run.
- Restrict CORS to your frontend domain if desired.
- Rotate DB credentials periodically.
- Consider migrations (sequelize-cli) for future schema changes.

---

## 📄 License
MIT
