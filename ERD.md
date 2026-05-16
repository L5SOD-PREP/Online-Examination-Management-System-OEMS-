# Entity Relationship Diagram (ERD) - Online Examination Management System

## Entities and Relationships

### 1. Students Table
```
Table: students
-----------------
- student_id (PK, INT, AUTO_INCREMENT)
- full_name (VARCHAR(255), NOT NULL)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

### 2. Exams Table
```
Table: exams
-----------------
- exam_id (PK, INT, AUTO_INCREMENT)
- exam_title (VARCHAR(255), NOT NULL)
- duration (INT, NOT NULL) -- in minutes
- total_marks (INT, NOT NULL)
- passing_marks (INT, NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
```

### 3. Questions Table
```
Table: questions
-----------------
- question_id (PK, INT, AUTO_INCREMENT)
- exam_id (FK, INT, NOT NULL)
- question_text (TEXT, NOT NULL)
- option_a (VARCHAR(255), NOT NULL)
- option_b (VARCHAR(255), NOT NULL)
- option_c (VARCHAR(255), NOT NULL)
- option_d (VARCHAR(255), NOT NULL)
- correct_answer (ENUM('A', 'B', 'C', 'D'), NOT NULL)
- marks (INT, DEFAULT 1)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Foreign Key: exam_id REFERENCES exams(exam_id) ON DELETE CASCADE
```

### 4. Attempts Table
```
Table: attempts
-----------------
- attempt_id (PK, INT, AUTO_INCREMENT)
- student_id (FK, INT, NOT NULL)
- exam_id (FK, INT, NOT NULL)
- start_time (DATETIME, NOT NULL)
- end_time (DATETIME)
- status (ENUM('in_progress', 'completed', 'abandoned'), DEFAULT 'in_progress')
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Foreign Key: student_id REFERENCES students(student_id) ON DELETE CASCADE
Foreign Key: exam_id REFERENCES exams(exam_id) ON DELETE CASCADE
```

### 5. Answers Table (Student Responses)
```
Table: answers
-----------------
- answer_id (PK, INT, AUTO_INCREMENT)
- attempt_id (FK, INT, NOT NULL)
- question_id (FK, INT, NOT NULL)
- selected_answer (ENUM('A', 'B', 'C', 'D'))
- is_correct (BOOLEAN)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Foreign Key: attempt_id REFERENCES attempts(attempt_id) ON DELETE CASCADE
Foreign Key: question_id REFERENCES questions(question_id) ON DELETE CASCADE
```

### 6. Results Table
```
Table: results
-----------------
- result_id (PK, INT, AUTO_INCREMENT)
- attempt_id (FK, INT, UNIQUE, NOT NULL)
- score (INT, NOT NULL)
- total_marks (INT, NOT NULL)
- percentage (DECIMAL(5, 2), NOT NULL)
- status (ENUM('pass', 'fail'), NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Foreign Key: attempt_id REFERENCES attempts(attempt_id) ON DELETE CASCADE
```

## Relationships

1. **Students to Attempts**: One-to-Many
   - One student can have multiple attempts
   - Each attempt belongs to one student

2. **Exams to Questions**: One-to-Many
   - One exam can have multiple questions
   - Each question belongs to one exam

3. **Exams to Attempts**: One-to-Many
   - One exam can have multiple attempts
   - Each attempt belongs to one exam

4. **Attempts to Answers**: One-to-Many
   - One attempt can have multiple answers
   - Each answer belongs to one attempt

5. **Attempts to Results**: One-to-One
   - One attempt has one result
   - Each result belongs to one attempt

6. **Questions to Answers**: One-to-Many
   - One question can have multiple answers (from different attempts)
   - Each answer belongs to one question

## ERD Diagram (Text Representation)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  students   │       │   exams     │       │  questions  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ student_id ◄┼───────┤ exam_id     │───────►│ question_id │
│ full_name   │       │ exam_title  │       │ exam_id     │
│ email       │       │ duration    │       │ question_   │
│ password    │       │ total_marks │       │   text      │
└─────────────┘       │ passing_    │       │ option_a    │
                      │   marks     │       │ option_b    │
                      └─────────────┘       │ option_c    │
                            │               │ option_d    │
                            │               │ correct_    │
                            │               │   answer    │
                            │               └─────────────┘
                            │                       │
                            │                       │
                            ▼                       │
                      ┌─────────────┐               │
                      │  attempts   │               │
                      ├─────────────┤               │
                      │ attempt_id  │───────────────┘
                      │ student_id  │
                      │ exam_id     │
                      │ start_time  │
                      │ end_time    │
                      │ status      │
                      └─────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
        ┌─────────────┐         ┌─────────────┐
        │  answers    │         │  results    │
        ├─────────────┤         ├─────────────┤
        │ answer_id   │         │ result_id   │
        │ attempt_id  │         │ attempt_id  │
        │ question_id │         │ score       │
        │ selected_   │         │ total_marks │
        │   answer    │         │ percentage  │
        │ is_correct  │         │ status      │
        └─────────────┘         └─────────────┘
```

## Key Design Decisions

1. **Primary Keys**: All tables use auto-incrementing integer primary keys
2. **Foreign Keys**: All foreign keys have CASCADE DELETE to maintain referential integrity
3. **Password Storage**: Passwords will be hashed using bcrypt before storage
4. **Status Enums**: Used for status fields to ensure data consistency
5. **Timestamps**: All tables have created_at timestamps for audit purposes
6. **Unique Constraints**: Email is unique in students table; attempt_id is unique in results table
7. **Separation of Concerns**: Answers and Results are separated to allow detailed answer tracking
