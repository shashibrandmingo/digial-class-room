# 🎥 Digital Classroom & Studio Slot Booking System

A secure, full-stack web platform for reserving professional recording studio and digital classroom slots. Built with **React + Tailwind CSS** on the frontend, and **Node.js (Express) + MongoDB + Razorpay + Nodemailer** on the backend.

---

## 🚀 Key Features

### 1. 📅 Real-Time Slot Booking & Availability Check
- **Morning Slot:** `05:00 AM - 12:00 PM` (7 Hours) — **₹3,999**
- **Evening Slot:** `03:00 PM - 09:00 PM` (6 Hours) — **₹4,999**
- **Zero Double-Bookings:** If a slot is already booked for a selected date, the system marks it **Booked** (`Already booked for this date - Please choose another date or time`) and prevents any duplicate submissions.
- **Temporary Hold Lock:** While a customer completes payment, the slot is locked for 10 minutes to prevent race conditions.

### 2. 💳 Secure Razorpay Payment Integration
- Server-side cryptographic signature verification (`HMAC-SHA256`).
- Webhook and idempotency handling to prevent double billing.
- Pre-configured demo testing mode for instant local testing without needing live bank credentials.

### 3. 📧 Automated Email Confirmation
- Built with **Nodemailer**.
- Sends a styled confirmation email containing:
  - Booking ID & payment reference
  - Date & slot timing
  - Studio guidelines (arrive 15 min early, SSD/Pen Drive recommendations)
  - Studio contact number & Google Maps location details.

### 4. 🛠️ Admin Slot Blocking (Maintenance & Holidays)
- Admin can block **any specific slot or entire day** with a custom reason (e.g., *"AC Servicing"*, *"Equipment Calibration"*, *"Private VIP Booking"*).
- Blocked slots immediately reflect on the user booking form as **"Under Maintenance"** or **"Unavailable"**.
- Admin can **Unblock** any slot in 1 click at any time.

### 5. 📊 Admin Dashboard & Tracking
- **Revenue & Booking Metrics:** Total confirmed bookings, total revenue collected, today's schedule, and active blocks.
- **All Bookings Table:** Filter by date, search by name/email/phone/booking ID.
- **Manual Walk-In Entry:** Register offline/call-in clients directly.

### 6. 🔒 Enterprise Security
- Protected with **Helmet.js** (secure HTTP headers).
- **Rate limiting** on API and checkout endpoints.
- **JWT Authentication** + **bcrypt** password hashing for admin accounts.
- Input validation and strict request payload sizing.

---

## 📂 Project Structure

```
digital-classroom/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Razorpay, Constants
│   │   ├── controllers/     # bookingController, adminController
│   │   ├── middlewares/     # JWT Auth, Rate Limiters, Security
│   │   ├── models/          # Booking, SlotBlock, Admin (Mongoose)
│   │   ├── routes/          # bookingRoutes, adminRoutes
│   │   ├── utils/           # mailer (Nodemailer HTML templates)
│   │   └── server.js        # Express server entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── api.js           # Centralized Axios API client
│   │   ├── App.jsx
│   │   └── index.css        # Tailwind CSS
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚡ How to Run

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Default Admin Credentials
- **Email:** `admin@studio.com`
- **Password:** `admin123`
*(Change in production via `.env` / database)*

---

## ⚙️ Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Connection (MongoDB Local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/digital_classroom

# JWT Secret
JWT_SECRET=digital_classroom_jwt_secret_dev_key_2026_xyz9876543210!

# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret_key

# Nodemailer SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Digital Classroom Studio" <no-reply@digitalclassroom.com>
```
