import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllExams } from '../api/exams';
import { getStudentPerformanceReport, getPassFailReport, getExamResultReport } from '../api/reports';
import { logout as logoutApi } from '../api/auth';

const Reports = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Online Examination System</h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/exams')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Available Exams
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/results')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                My Results
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/questions')}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Question Management
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/reports')}
                className="w-full text-left px-4 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 transition font-medium"
              >
                Reports
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="mb-4">
            <p className="text-sm text-blue-200">Welcome,</p>
            <p className="font-semibold">{user?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Reports</h2>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate Report</h3>
            
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
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Generate Report
            </button>
          </div>

          {reportData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Report Results</h3>

              {reportType === 'performance' && (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Student Information</h4>
                    <p><strong>Name:</strong> {reportData.student.fullName}</p>
                    <p><strong>Email:</strong> {reportData.student.email}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-gray-600">Total Attempts</p>
                      <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-gray-600">Passed</p>
                      <p className="text-2xl font-bold text-purple-600">{reportData.statistics.passedAttempts}</p>
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

                  <h4 className="font-semibold text-gray-900 mb-4">Detailed Results</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Exam</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Percentage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
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
                                result.status === 'pass' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
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
                    <h4 className="font-semibold text-gray-900 mb-2">Exam Information</h4>
                    <p><strong>Title:</strong> {reportData.exam.examTitle}</p>
                    <p><strong>Total Marks:</strong> {reportData.exam.totalMarks}</p>
                    <p><strong>Passing Marks:</strong> {reportData.exam.passingMarks}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-600">Total Attempts</p>
                      <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-gray-600">Passed</p>
                      <p className="text-2xl font-bold text-purple-600">{reportData.statistics.passedAttempts}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{reportData.statistics.failedAttempts}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-100 rounded-lg mb-6">
                    <p className="text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-purple-600">{reportData.statistics.passRate}%</p>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Student Results</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Percentage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
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
                                result.status === 'pass' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
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
                    <h4 className="font-semibold text-gray-900 mb-2">Exam Information</h4>
                    <p><strong>Title:</strong> {reportData.exam.examTitle}</p>
                    <p><strong>Total Marks:</strong> {reportData.exam.totalMarks}</p>
                    <p><strong>Passing Marks:</strong> {reportData.exam.passingMarks}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-gray-600">Total Attempts</p>
                      <p className="text-2xl font-bold">{reportData.statistics.totalAttempts}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold">{reportData.statistics.averageScore}%</p>
                    </div>
                    <div className="p-4 bg-purple-100 rounded-lg">
                      <p className="text-gray-600">Highest Score</p>
                      <p className="text-2xl font-bold">{reportData.statistics.highestScore}%</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-gray-600">Lowest Score</p>
                      <p className="text-2xl font-bold">{reportData.statistics.lowestScore}%</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-4">Score Distribution</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-purple-100 rounded-lg">
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

                  <h4 className="font-semibold text-gray-900 mb-4">Detailed Results</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Percentage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
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
                                result.status === 'pass' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
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
    </div>
  );
};

export default Reports;
