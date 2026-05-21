const Result = require('../models/Result');

const getStudentResults = async (req, res) => {
  try {
    const studentId = req.session.userId;
    const results = await Result.getByStudentId(studentId);
    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

const getResultByAttemptId = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const result = await Result.findByAttemptId(attemptId);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.getAll();
    res.json(results);
  } catch (error) {
    console.error('Get all results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};

module.exports = { getStudentResults, getResultByAttemptId, getAllResults };
