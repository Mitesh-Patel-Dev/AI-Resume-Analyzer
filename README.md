# 🤖 AI Resume Analyzer

A modern full-stack web application that analyzes your resume using AI. Upload your resume PDF and receive an **ATS compatibility score**, **detected skills**, **missing skills**, and **actionable improvement suggestions**.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Tech Stack](https://img.shields.io/badge/TailwindCSS-v3-06B6D4)

---

## ✨ Features

- **User Authentication** — Signup & Login with JWT
- **Resume Upload** — Drag-and-drop PDF upload
- **Smart Parsing** — Extracts text from PDF resumes
- **ATS Score** — Calculates a 0-100 ATS compatibility score
- **Skill Detection** — Identifies 80+ technical and soft skills
- **Missing Skills** — Highlights in-demand skills you're missing
- **Suggestions** — AI-powered tips to improve your resume
- **Dashboard** — View all your analyses with statistics

---

## 📁 Project Structure

```
AI-Resume-Analyzer/
├── backend/
│   ├── server.js            # Express server entry point
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Signup, Login, GetMe
│   │   └── resumeController.js  # Upload, Analyze, CRUD
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Resume.js        # Resume schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   └── resumeRoutes.js  # Resume endpoints
│   ├── uploads/             # Uploaded PDFs stored here
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx         # React entry point
│   │   ├── App.jsx          # Router & layout
│   │   ├── index.css        # Global styles + Tailwind
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── services/
│   │   │   └── api.js       # Axios API layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ScoreCircle.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Upload.jsx
│   │       └── Results.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed ([download](https://nodejs.org/))
- **MongoDB Atlas** account (free tier) — [signup here](https://www.mongodb.com/atlas)

---

### Step 1: Clone / Open the Project

Open a terminal in the project root folder (`AI Resume Analyzer`).

---

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a **free cluster**
3. Click **Connect** → **Drivers** → Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resumeAnalyzer`

---

### Step 3: Configure Backend Environment

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/resumeAnalyzer?retryWrites=true&w=majority
JWT_SECRET=any_random_strong_string_here
```

---

### Step 4: Install Backend Dependencies

```bash
cd backend
npm install
```

---

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### Step 6: Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Where to Add API Keys

| Key | File | Description |
|-----|------|-------------|
| `MONGO_URI` | `backend/.env` | MongoDB Atlas connection string |
| `JWT_SECRET` | `backend/.env` | Any random string for JWT signing |
| `OPENAI_API_KEY` | `backend/.env` | *(Optional)* For AI-powered analysis |

---

## 🧪 Testing the App

### Sample Test Flow

1. Open `http://localhost:5173` in your browser
2. Click **Sign Up** and create an account
3. Go to **Upload Resume** page
4. Upload any PDF resume
5. View your **ATS Score**, **Skills**, and **Suggestions**
6. Check **Dashboard** to see all your analyses

### Sample Resume Text for Testing

If you need a test PDF, create a document with this content and save as PDF:

```
JOHN DOE
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced Full Stack Developer with 3+ years of experience building
scalable web applications. Proficient in JavaScript, React, and Node.js.

SKILLS
JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL,
Git, Docker, AWS, REST API, HTML, CSS, Tailwind, Redux, Python

WORK EXPERIENCE
Full Stack Developer | TechCorp Inc. | Jan 2022 - Present
- Developed and maintained 5 web applications using React and Node.js
- Improved application performance by 40% through code optimization
- Collaborated with a team of 8 developers using Agile methodology
- Implemented CI/CD pipelines using GitHub Actions

Junior Developer | StartupXYZ | Jun 2020 - Dec 2021
- Built REST APIs serving 10,000+ daily users
- Created responsive UI components using React and Tailwind CSS
- Managed database operations with MongoDB and PostgreSQL

EDUCATION
Bachelor of Computer Applications (BCA)
University of Technology | 2017 - 2020

PROJECTS
E-Commerce Platform
- Built a full-stack e-commerce app with React, Node.js, and MongoDB
- Implemented payment integration and user authentication
- Achieved 99.9% uptime with Docker containerization

CERTIFICATIONS
- AWS Certified Cloud Practitioner
- MongoDB Developer Certification
```

This sample resume should score approximately **75-85** on the ATS analyzer.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload & analyze resume (protected) |
| GET | `/api/resume/my-resumes` | Get all user's resumes (protected) |
| GET | `/api/resume/:id` | Get single resume details (protected) |
| DELETE | `/api/resume/:id` | Delete a resume (protected) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS 3 |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas compatible) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| HTTP Client | Axios |
| Icons | React Icons |

---

## 📝 License

This project is for educational purposes. Built as a BCA final year project.
