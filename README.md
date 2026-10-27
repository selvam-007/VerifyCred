# VerifyCred — Trusted Digital Certificate & Achievement Verification Platform

> **Upload Once. Verify Forever. Share Anywhere.**

VerifyCred is a full-stack platform that enables students to build a trusted digital portfolio of their certificates, projects, internships and achievements — while giving colleges a way to officially verify credentials and recruiters instant access to validated profiles.

---

## ✨ Features

| Portal | Highlights |
|---|---|
| **Student** | Upload certificates (PDF/JPG/PNG), QR code per cert, public portfolio link, one-click resume generation, activity timeline |
| **College / Faculty** | Review & verify student certs, AI fake-detection report, add digital signature, issue official certificates |
| **Company** | Search verified candidates, view portfolios, download resumes, contact students |
| **Admin** | Approve colleges, manage all users, AI fraud dashboard, platform analytics |

### 🤖 AI Fake Certificate Detection
Checks: edited PDF metadata, fake logos, wrong fonts, OCR text comparison, duplicate detection.

### 🔒 Security
- JWT authentication (role-based)
- bcrypt password hashing
- File type & size validation
- RBAC middleware

---

## 🗂 Project Structure

```
VerifyCred/
├── frontend/
│   ├── index.html            # Landing page
│   ├── login.html            # Multi-role login
│   ├── register.html         # Registration (student/faculty/company)
│   ├── dashboard.html        # Student dashboard
│   ├── upload.html           # Certificate upload + AI check
│   ├── certificates.html     # My certificates (filter/search)
│   ├── profile.html          # Public student portfolio
│   ├── verify.html           # QR / ID verification (public)
│   ├── faculty.html          # Faculty dashboard
│   ├── company.html          # Company recruiter dashboard
│   ├── admin.html            # Admin dashboard
│   ├── css/
│   │   ├── style.css         # Global stylesheet
│   │   ├── auth.css          # Login/Register styles
│   │   ├── dashboard.css     # Dashboard styles
│   │   ├── upload.css        # Upload page styles
│   │   ├── verify.css        # Verify page styles
│   │   └── landing.css       # Landing page extras
│   └── js/
│       ├── main.js           # Shared utilities
│       ├── login.js          # Login logic
│       ├── register.js       # Registration logic
│       ├── dashboard.js      # Dashboard (stat counters, actions)
│       ├── upload.js         # Drag & drop, AI scan simulation
│       ├── verify.js         # QR/ID certificate verification
│       └── profile.js        # Profile tabs, copy link
│
├── backend/
│   ├── server.js             # Express app entry point
│   ├── package.json
│   ├── .env.example          # Environment variable template
│   ├── config/db.js          # MySQL connection pool
│   ├── routes/
│   │   ├── auth.js           # Register / Login
│   │   ├── student.js        # Student profile, portfolio, dashboard
│   │   ├── certificate.js    # Upload, verify, reject, QR generation
│   │   ├── company.js        # Candidate search & view
│   │   ├── admin.js          # Platform management
│   │   └── verification.js   # Public QR scan endpoint
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT guard
│   │   ├── roleMiddleware.js  # RBAC guard
│   │   └── uploadMiddleware.js # Multer file handler
│   └── utils/
│       ├── qrGenerator.js    # QR code generation
│       └── emailService.js   # Nodemailer email helper
│
└── database/
    └── verifycred.sql        # Full MySQL schema + seed data
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MySQL ≥ 8

### 1. Database Setup
```bash
mysql -u root -p < database/verifycred.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # fill in DB credentials, JWT secret, etc.
npm install
npm run dev                  # starts on http://localhost:5000
```

### 3. Frontend
Open `frontend/index.html` directly in your browser, or serve with any static file server:
```bash
npx serve frontend
```

### Demo Login
Open `frontend/login.html` and enter **any email + password** (demo mode — no backend required for the UI).

| Role | Demo Route |
|---|---|
| Student | `dashboard.html` |
| Faculty | `faculty.html` |
| Company | `company.html` |
| Admin   | `admin.html` |

### Demo QR Verification
Go to `verify.html` and click **"Try Demo Verification"** — or enter:
- `VC-2024-AWS-00123`
- `VC-2024-SIH-00456`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (CSS Variables), Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Auth | JWT + bcrypt |
| Files | Multer → Cloudinary / local |
| QR Code | qrcode npm package |
| Email | Nodemailer |

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET  | `/api/student/profile` | Student | Own profile |
| GET  | `/api/student/portfolio/:slug` | Public | Public portfolio |
| GET  | `/api/student/dashboard` | Student | Stats |
| POST | `/api/certificate/upload` | Student | Upload certificate |
| GET  | `/api/certificate/my` | Student | My certificates |
| GET  | `/api/certificate/verify/:uid` | Public | Verify by UID |
| PUT  | `/api/certificate/:id/verify` | Faculty | Verify cert |
| PUT  | `/api/certificate/:id/reject` | Faculty | Reject cert |
| GET  | `/api/company/search` | Company | Search candidates |
| GET  | `/api/company/candidate/:slug` | Company | View candidate |
| GET  | `/api/admin/stats` | Admin | Platform stats |
| GET  | `/api/admin/ai-flags` | Admin | AI flagged certs |
| PUT  | `/api/admin/colleges/:id/approve` | Admin | Approve college |
| GET  | `/api/verification/:uid` | Public | QR scan endpoint |

---

## 🔮 Future Roadmap
- Blockchain verification (certificate hash on-chain)
- Mobile App (React Native)
- AI Skill Recommendations
- AI Resume Review
- Real-time Notifications (Socket.io)
- Digital Badge / NFT Certificates
- E-Signature (DocuSign integration)
- API for colleges and companies

---

## 👨‍💻 Author
**Tharun M** — B.E. AI & Data Science, Anna University  
Roll No: 24AIDS103  
Portfolio: [verifycred.com/tharun](https://verifycred.com/tharun)

---

## 📄 License
MIT License — see [LICENSE](LICENSE)
