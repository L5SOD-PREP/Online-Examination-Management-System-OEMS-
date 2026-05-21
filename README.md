# Online Examination Management System (OEMS)

A full-stack web application for conducting computer-based examinations. Built with React, Node.js, Express, and MySQL. Features role-based access (Admin, Teacher, Student), automatic scoring, exam security (fullscreen enforcement, tab-switch detection, question shuffling), and dynamic report generation.

## Tech Stack

**Frontend:** React 18, Tailwind CSS, Axios, React Router DOM, Vite  
**Backend:** Node.js, Express.js, MySQL (mysql2), bcrypt, express-session  
**Auth:** Session-based login with bcrypt password hashing

## Features

### For Students
- Register and login with secure session authentication
- View available exams with details (duration, marks, passing criteria)
- **Pre-exam rules modal** — read and agree to exam policies before starting
- **Fullscreen enforcement** — exam auto-submits if fullscreen is exited or Escape is pressed
- **Tab-switch protection** — switching tabs, minimizing, or navigating away auto-submits the exam
- **Randomized question order** — each session gets a shuffled question sequence
- **Countdown timer** — auto-submits when time expires
- **Question navigation grid** — jump between questions, see answered/ unanswered at a glance
- **Instant results** — automatic score calculation and pass/fail determination
- **Results history** — view all past attempts with scores, percentages, and dates
- **Multiple attempts** — retake exams any number of times

### For Teachers
- All student features
- **Exam Management** — create, edit, and delete exams
- **Question Management** — add, edit, and delete questions (multiple-choice with 4 options)
- **Reports** — generate Student Performance, Pass/Fail, and Exam Result reports
- **User Management** — manage student accounts (create, edit, delete)

### For Admins
- All teacher features
- **User Management** — manage both teachers and students
- **Full report access** — view reports for any student or exam

### Security
- Password hashing with bcrypt
- Session-based authentication
- Role-based access control (student, teacher, admin)
- CORS configuration for secure cross-origin requests
- Parameterized SQL queries (prevents injection)
- Exam anti-cheating measures (fullscreen lock, tab-switch detection, beforeunload protection)

## Database Schema

Six tables with proper primary/foreign keys and cascade deletes:

| Table | Purpose |
|---|---|
| `users` | Students, teachers, and admins |
| `exams` | Exam metadata (title, duration, marks) |
| `questions` | Multiple-choice questions with 4 options |
| `attempts` | Exam attempt tracking |
| `answers` | Individual student responses per question |
| `results` | Final scores and pass/fail status |

See `ERD.md` for the full entity-relationship diagram.

## Installation

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3302
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=oems_database
SESSION_SECRET=your_random_secret_here
CLIENT_URL=http://localhost:5173
```

Set up the database:

```bash
mysql -u root -p < config/database.sql
```

Start the server:

```bash
npm run dev
```

The backend runs on `http://localhost:3302`.

### Frontend

```bash
cd frontend
npm install
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` (Vite default).

## Usage

### Create an Admin Account
1. Register at `/register` (use any role — the DB sets `student` by default)
2. Manually update the role in MySQL: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`
3. Login and access the full system

### Workflow
1. **Admin** creates teachers and exams via Exam Management
2. **Teacher** creates questions for exams via Question Management
3. **Student** registers, views available exams, agrees to rules, takes the exam
4. Results are calculated automatically upon submission
5. Reports are available under the Reports section

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current session user |

### Exams
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/exams` | List all exams |
| GET | `/api/exams/:id` | Get exam by ID |
| POST | `/api/exams` | Create exam (admin/teacher) |
| PUT | `/api/exams/:id` | Update exam (admin/teacher) |
| DELETE | `/api/exams/:id` | Delete exam (admin/teacher) |

### Questions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/questions/exam/:examId` | Get questions for an exam |
| GET | `/api/questions/:id` | Get question by ID |
| POST | `/api/questions` | Create question (admin/teacher) |
| PUT | `/api/questions/:id` | Update question (admin/teacher) |
| DELETE | `/api/questions/:id` | Delete question (admin/teacher) |

### Attempts
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/attempts/start` | Start an exam attempt |
| POST | `/api/attempts/answer` | Submit an answer |
| POST | `/api/attempts/submit` | Submit/finish an exam |
| GET | `/api/attempts` | List user's attempts |
| GET | `/api/attempts/:id` | Get attempt details |

### Results
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/results` | Get logged-in user's results |
| GET | `/api/results/attempt/:attemptId` | Get result by attempt |
| GET | `/api/results/all` | Get all results (admin/teacher) |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/student/:studentId` | Student performance report |
| GET | `/api/reports/passfail/:examId` | Pass/fail statistics by exam |
| GET | `/api/reports/exam/:examId` | Detailed exam result report |

### User Management (admin/teacher)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | List all students |
| GET | `/api/students/teachers` | List all teachers (admin only) |
| GET | `/api/students/:id` | Get user by ID |
| POST | `/api/students` | Create user |
| PUT | `/api/students/:id` | Update user |
| DELETE | `/api/students/:id` | Delete user |

## Project Structure

```
├── backend/
│   ├── config/
│   │   ├── database.sql        # Schema + seed data
│   │   └── db.js               # MySQL connection pool
│   ├── controllers/            # Route handlers
│   ├── middleware/
│   │   └── auth.js             # Auth + role middleware
│   ├── models/                 # Data access layer
│   ├── routes/                 # Express routes
│   └── server.js               # App entry point
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API functions
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # All page components
│   │   ├── App.jsx             # Routes + providers
│   │   └── index.css           # Tailwind + custom styles
│   ├── tailwind.config.js
│   └── .env                    # Vite proxy config
├── ERD.md                      # Entity relationship diagram
└── README.md
```

## Brand Colors

| Role | Hex | Usage |
|---|---|---|
| Primary | `#2563EB` | Sidebar, buttons, headers |
| Neutral | `#F8FAFC` / `#FFFFFF` | Page backgrounds, cards |
| Accent | `#7C3AED` | Highlights, submit buttons |
| Success | `#10B981` | Pass indicators, success toasts |

## License

ISC
