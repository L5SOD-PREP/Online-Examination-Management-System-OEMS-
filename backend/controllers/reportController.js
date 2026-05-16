const Result = require('../models/Result');
const Attempt = require('../models/Attempt');
const Student = require('../models/Student');
const Exam = require('../models/Exam');

const getStudentPerformanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const results = await Result.getByStudentId(studentId);
    const student = await Student.findById(studentId);

    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.status === 'pass').length;
    const failedAttempts = results.filter(r => r.status === 'fail').length;
    const averageScore = totalAttempts > 0 
      ? (results.reduce((sum, r) => sum + r.percentage, 0) / totalAttempts).toFixed(2)
      : 0;

    res.json({
      student: {
        studentId: student.student_id,
        fullName: student.full_name,
        email: student.email
      },
      statistics: {
        totalAttempts,
        passedAttempts,
        failedAttempts,
        passRate: totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(2) : 0,
        averageScore
      },
      results
    });
  } catch (error) {
    console.error('Student performance report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

const getPassFailReport = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await Result.getByExamId(examId);
    const exam = await Exam.findById(examId);

    const totalAttempts = results.length;
    const passedAttempts = results.filter(r => r.status === 'pass').length;
    const failedAttempts = results.filter(r => r.status === 'fail').length;

    const passRate = totalAttempts > 0 
      ? ((passedAttempts / totalAttempts) * 100).toFixed(2)
      : 0;

    res.json({
      exam: {
        examId: exam.exam_id,
        examTitle: exam.exam_title,
        totalMarks: exam.total_marks,
        passingMarks: exam.passing_marks
      },
      statistics: {
        totalAttempts,
        passedAttempts,
        failedAttempts,
        passRate
      },
      results
    });
  } catch (error) {
    console.error('Pass/fail report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

const getExamResultReport = async (req, res) => {
  try {
    const { examId } = req.params;

    const results = await Result.getByExamId(examId);
    const exam = await Exam.findById(examId);

    const scoreDistribution = {
      excellent: results.filter(r => r.percentage >= 80).length,
      good: results.filter(r => r.percentage >= 60 && r.percentage < 80).length,
      average: results.filter(r => r.percentage >= 40 && r.percentage < 60).length,
      poor: results.filter(r => r.percentage < 40).length
    };

    const averageScore = results.length > 0
      ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2)
      : 0;

    const highestScore = results.length > 0
      ? Math.max(...results.map(r => r.percentage)).toFixed(2)
      : 0;

    const lowestScore = results.length > 0
      ? Math.min(...results.map(r => r.percentage)).toFixed(2)
      : 0;

    res.json({
      exam: {
        examId: exam.exam_id,
        examTitle: exam.exam_title,
        totalMarks: exam.total_marks,
        passingMarks: exam.passing_marks
      },
      statistics: {
        totalAttempts: results.length,
        averageScore,
        highestScore,
        lowestScore,
        scoreDistribution
      },
      results
    });
  } catch (error) {
    console.error('Exam result report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

module.exports = { getStudentPerformanceReport, getPassFailReport, getExamResultReport };
