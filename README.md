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

