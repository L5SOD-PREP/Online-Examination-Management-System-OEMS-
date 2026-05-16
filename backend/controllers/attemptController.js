const Attempt = require('../models/Attempt');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

const startAttempt = async (req, res) => {
  try {
    const { examId } = req.body;
    const studentId = req.session.studentId;

    if (!examId) {
      return res.status(400).json({ error: 'Exam ID is required' });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const existingAttempt = await Attempt.getInProgressAttempt(studentId, examId);
    if (existingAttempt) {
      return res.json({ attemptId: existingAttempt.attempt_id, message: 'Resuming existing attempt' });
    }

    const attemptId = await Attempt.create(studentId, examId);
    res.status(201).json({ attemptId, message: 'Attempt started successfully' });
  } catch (error) {
    console.error('Start attempt error:', error);
    res.status(500).json({ error: 'Failed to start attempt' });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { attemptId, questionId, selectedAnswer } = req.body;

    if (!attemptId || !questionId || !selectedAnswer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = selectedAnswer === question.correct_answer;

    await Answer.create(attemptId, questionId, selectedAnswer, isCorrect);
    res.json({ message: 'Answer submitted successfully', isCorrect });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
};

const submitExam = async (req, res) => {
  try {
    const { attemptId } = req.body;

    if (!attemptId) {
      return res.status(400).json({ error: 'Attempt ID is required' });
    }

    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    await Attempt.updateStatus(attemptId, 'completed');

    const answers = await Answer.getByAttemptId(attemptId);
    const exam = await Exam.findById(attempt.exam_id);

    let score = 0;
    answers.forEach(answer => {
      if (answer.is_correct) {
        const question = answers.find(q => q.question_id === answer.question_id);
        score += answer.is_correct ? 1 : 0;
      }
    });

    const totalMarks = exam.total_marks;
    const percentage = (score / totalMarks) * 100;
    const status = score >= exam.passing_marks ? 'pass' : 'fail';

    await Result.create(attemptId, score, totalMarks, percentage, status);

    res.json({
      message: 'Exam submitted successfully',
      score,
      totalMarks,
      percentage: percentage.toFixed(2),
      status
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({ error: 'Failed to submit exam' });
  }
};

const getStudentAttempts = async (req, res) => {
  try {
    const studentId = req.session.studentId;
    const attempts = await Attempt.getByStudentId(studentId);
    res.json(attempts);
  } catch (error) {
    console.error('Get attempts error:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
};

const getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findById(id);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    const answers = await Answer.getByAttemptId(id);
    res.json({ ...attempt, answers });
  } catch (error) {
    console.error('Get attempt error:', error);
    res.status(500).json({ error: 'Failed to fetch attempt' });
  }
};

module.exports = { startAttempt, submitAnswer, submitExam, getStudentAttempts, getAttemptById };
