# Online Examination Management System (OEMS)

A comprehensive web-based examination management system built with React, Node.js, Express, and MySQL.

## Features

- **Student Authentication**: Secure login and registration with bcrypt password encryption
- **Exam Management**: Create, view, and manage exams with multiple-choice questions
- **Question Management**: Add, edit, and delete questions for exams
- **Exam Taking**: Interactive exam interface with countdown timer
- **Automatic Scoring**: Real-time score calculation and pass/fail determination
- **Results Tracking**: View detailed exam results and performance history
- **Reports**: Generate student performance, pass/fail, and exam result reports
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MySQL
- bcrypt (password encryption)
- express-session (session management)

## Database Schema

The system uses the following tables:
- **students**: Student information
- **exams**: Exam details (title, duration, marks)
- **questions**: Multiple-choice questions
- **attempts**: Exam attempts tracking
- **answers**: Student responses
- **results**: Final exam results

See `ERD.md` for detailed entity relationships.

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=oems_database
SESSION_SECRET=your_secret_key_here
```

4. Create the database and tables:
```bash
mysql -u root -p < config/database.sql
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### Student Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form with full name, email, and password
3. Click "Register" to create an account

### Student Login
1. Navigate to `http://localhost:3000/login`
2. Enter your email and password
3. Click "Login" to access the dashboard

### Taking an Exam
1. From the dashboard, click "Available Exams"
2. Select an exam to take
3. Answer questions within the time limit
4. Submit the exam when complete

### Viewing Results
1. From the dashboard, click "My Results"
2. View all your exam attempts and scores

### Managing Questions (Admin)
1. From the dashboard, click "Question Management"
2. Select an exam to manage
3. Add or delete questions as needed

### Generating Reports
1. From the dashboard, click "Reports"
2. Select the report type (Student Performance, Pass/Fail, Exam Result)
3. Select an exam (if required)
4. Click "Generate Report"

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new student
- `POST /api/auth/login` - Login a student
- `POST /api/auth/logout` - Logout a student
- `GET /api/auth/me` - Get current user

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create a new exam
- `PUT /api/exams/:id` - Update an exam
- `DELETE /api/exams/:id` - Delete an exam

### Questions
- `GET /api/questions/exam/:examId` - Get questions by exam
- `GET /api/questions/:id` - Get question by ID
- `POST /api/questions` - Create a new question
- `PUT /api/questions/:id` - Update a question
- `DELETE /api/questions/:id` - Delete a question

### Attempts
- `POST /api/attempts/start` - Start an exam attempt
- `POST /api/attempts/answer` - Submit an answer
- `POST /api/attempts/submit` - Submit an exam
- `GET /api/attempts` - Get student attempts
- `GET /api/attempts/:id` - Get attempt by ID

### Results
- `GET /api/results` - Get student results
- `GET /api/results/attempt/:attemptId` - Get result by attempt
- `GET /api/results/all` - Get all results

### Reports
- `GET /api/reports/student/:studentId` - Student performance report
- `GET /api/reports/passfail/:examId` - Pass/fail report
- `GET /api/reports/exam/:examId` - Exam result report

## Default Data

The database is initialized with sample data:
- 2 sample students (passwords are hashed)
- 2 sample exams (JavaScript Basics, React Fundamentals)
- 10 sample questions (5 per exam)

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- CORS configuration
- SQL injection prevention (parameterized queries)
- Input validation

## Future Enhancements

- Email notifications for exam results
- Exam scheduling and reminders
- Advanced analytics and charts
- Mobile app version
- Multi-language support
- Question bank with categories
- Randomized question selection
- Time-based exam scheduling

## License

ISC

## Support

For issues or questions, please open an issue on the GitHub repository.
