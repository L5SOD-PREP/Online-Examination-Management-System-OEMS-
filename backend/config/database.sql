-- Online Examination Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS oems_database;
USE oems_database;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id INT AUTO_INCREMENT PRIMARY KEY,
  exam_title VARCHAR(255) NOT NULL,
  duration INT NOT NULL COMMENT 'Duration in minutes',
  total_marks INT NOT NULL,
  passing_marks INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
  marks INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

-- Attempts table
CREATE TABLE IF NOT EXISTS attempts (
  attempt_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  exam_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  status ENUM('in_progress', 'completed', 'abandoned') DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

-- Answers table (Student responses)
CREATE TABLE IF NOT EXISTS answers (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_answer ENUM('A', 'B', 'C', 'D'),
  is_correct BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES attempts(attempt_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  attempt_id INT UNIQUE NOT NULL,
  score INT NOT NULL,
  total_marks INT NOT NULL,
  percentage DECIMAL(5, 2) NOT NULL,
  status ENUM('pass', 'fail') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES attempts(attempt_id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO students (full_name, email, password) VALUES
('John Doe', 'john@example.com', '$2b$10$X7OP/lSdFqGqZvZqZqZqZu'),
('Jane Smith', 'jane@example.com', '$2b$10$X7OP/lSdFqGqZvZqZqZqZu');

INSERT INTO exams (exam_title, duration, total_marks, passing_marks) VALUES
('JavaScript Basics', 30, 10, 6),
('React Fundamentals', 45, 15, 9);

INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, marks) VALUES
(1, 'What is the correct way to declare a variable in JavaScript?', 'var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;', 'A', 1),
(1, 'Which method is used to add an element to the end of an array?', 'push()', 'pop()', 'shift()', 'unshift()', 'A', 1),
(1, 'What does === operator check?', 'Value only', 'Type only', 'Value and type', 'None', 'C', 1),
(1, 'Which is not a JavaScript data type?', 'String', 'Boolean', 'Float', 'Undefined', 'C', 1),
(1, 'What is the output of typeof null?', 'null', 'undefined', 'object', 'number', 'C', 1),
(2, 'What is React?', 'A database', 'A JavaScript library', 'A programming language', 'An operating system', 'B', 1),
(2, 'Which hook is used for side effects?', 'useState', 'useEffect', 'useContext', 'useReducer', 'B', 1),
(2, 'What is JSX?', 'JavaScript XML', 'Java XML', 'JSON', 'JavaScript Extension', 'A', 1),
(2, 'How do you pass data to a component?', 'state', 'props', 'context', 'all of the above', 'D', 1),
(2, 'What is the virtual DOM?', 'A real DOM', 'A lightweight copy of DOM', 'A database', 'A server', 'B', 1);
