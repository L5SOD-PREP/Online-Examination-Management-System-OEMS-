const Question = require('../models/Question');

const getQuestionsByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const questions = await Question.getByExamId(examId);
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks } = req.body;

    if (!examId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const questionId = await Question.create(examId, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks || 1);
    res.status(201).json({ message: 'Question created successfully', questionId });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer, marks } = req.body;

    if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await Question.update(id, questionText, optionA, optionB, optionC, optionD, correctAnswer, marks || 1);
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.delete(id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

module.exports = { getQuestionsByExam, getQuestionById, createQuestion, updateQuestion, deleteQuestion };
