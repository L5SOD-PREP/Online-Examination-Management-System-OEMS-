import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllExams } from '../api/exams';
import { getStudentPerformanceReport, getPassFailReport, getExamResultReport } from '../api/reports';

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [reportType, setReportType] = useState('performance');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await getAllExams();
      setExams(data);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedExam && reportType !== 'performance') {
      alert('Please select an exam');
      return;
    }

    try {
      let data;
      if (reportType === 'performance') {
        data = await getStudentPerformanceReport(user.studentId);
      } else if (reportType === 'passfail') {
        data = await getPassFailReport(selectedExam);
      } else if (reportType === 'exam') {
        data = await getExamResultReport(selectedExam);
      }
      setReportData(data);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate Report</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="performance">Student Performance Report</option>
                <option value="passfail">Pass/Fail Report</option>
                <option value="exam">Exam Result Report</option>
              </select>
            </div>

            {reportType !== 'performance' && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Select Exam</label>
                <select
                  value={selectedExam || ''}
                  onChange={(e) => setSelectedExam(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an exam</option>
                  {exams.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                      {exam.exam_title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateReport}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Report
          </button>
        </div>

        {reportData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Report Results</h3>

            {reportType === 'performance' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Student Information</h4>
                  <p><strong>Name:</strong> {reportData.student.fullName}</p>
                  <p><strong>Email:</strong> {reportData.student.email}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600">Total Attempts</p>
                    <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.statistics.passedAttempts}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{reportData.statistics.failedAttempts}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{reportData.statistics.averageScore}%</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Detailed Results</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.results.map((result) => (
                        <tr key={result.result_id}>
                          <td className="px-6 py-4">{result.exam_title}</td>
                          <td className="px-6 py-4">{result.score} / {result.total_marks}</td>
                          <td className="px-6 py-4">{result.percentage}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === 'passfail' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Exam Information</h4>
                  <p><strong>Title:</strong> {reportData.exam.examTitle}</p>
                  <p><strong>Total Marks:</strong> {reportData.exam.totalMarks}</p>
                  <p><strong>Passing Marks:</strong> {reportData.exam.passingMarks}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600">Total Attempts</p>
                    <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.statistics.passedAttempts}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600">{reportData.statistics.failedAttempts}</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg mb-6">
                  <p className="text-gray-600">Pass Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{reportData.statistics.passRate}%</p>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Student Results</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.results.map((result) => (
                        <tr key={result.result_id}>
                          <td className="px-6 py-4">{result.full_name}</td>
                          <td className="px-6 py-4">{result.score} / {result.total_marks}</td>
                          <td className="px-6 py-4">{result.percentage}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === 'exam' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Exam Information</h4>
                  <p><strong>Title:</strong> {reportData.exam.examTitle}</p>
                  <p><strong>Total Marks:</strong> {reportData.exam.totalMarks}</p>
                  <p><strong>Passing Marks:</strong> {reportData.exam.passingMarks}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600">Total Attempts</p>
                    <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold">{reportData.statistics.averageScore}%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-gray-600">Highest Score</p>
                    <p className="text-2xl font-bold">{reportData.statistics.highestScore}%</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600">Lowest Score</p>
                    <p className="text-2xl font-bold">{reportData.statistics.lowestScore}%</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Score Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-green-100 rounded-lg">
                    <p className="text-gray-600">Excellent (80%+)</p>
                    <p className="text-2xl font-bold">{reportData.statistics.scoreDistribution.excellent}</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <p className="text-gray-600">Good (60-79%)</p>
                    <p className="text-2xl font-bold">{reportData.statistics.scoreDistribution.good}</p>
                  </div>
                  <div className="p-4 bg-yellow-100 rounded-lg">
                    <p className="text-gray-600">Average (40-59%)</p>
                    <p className="text-2xl font-bold">{reportData.statistics.scoreDistribution.average}</p>
                  </div>
                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-gray-600">Poor (&lt;40%)</p>
                    <p className="text-2xl font-bold">{reportData.statistics.scoreDistribution.poor}</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Detailed Results</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.results.map((result) => (
                        <tr key={result.result_id}>
                          <td className="px-6 py-4">{result.full_name}</td>
                          <td className="px-6 py-4">{result.score} / {result.total_marks}</td>
                          <td className="px-6 py-4">{result.percentage}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
