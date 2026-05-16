const Exam = require('../models/Exam');

const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.getAll();
    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    const questionCount = await Exam.getQuestionsCount(id);
    res.json({ ...exam, questionCount });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
};

const createExam = async (req, res) => {
  try {
    const { examTitle, duration, totalMarks, passingMarks } = req.body;

    if (!examTitle || !duration || !totalMarks || !passingMarks) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const examId = await Exam.create(examTitle, duration, totalMarks, passingMarks);
    res.status(201).json({ message: 'Exam created successfully', examId });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Failed to create exam' });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { examTitle, duration, totalMarks, passingMarks } = req.body;

    if (!examTitle || !duration || !totalMarks || !passingMarks) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await Exam.update(id, examTitle, duration, totalMarks, passingMarks);
    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Failed to update exam' });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    await Exam.delete(id);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Failed to delete exam' });
  }
};

module.exports = { getAllExams, getExamById, createExam, updateExam, deleteExam };
