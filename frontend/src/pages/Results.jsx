import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getStudentResults } from '../api/results';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getStudentResults();
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-800">My Results</h1>
            <div></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {location.state?.result && (
          <div className={`mb-8 p-6 rounded-lg ${
            location.state.result.status === 'pass' 
              ? 'bg-green-100 border border-green-400' 
              : 'bg-red-100 border border-red-400'
          }`}>
            <h2 className="text-2xl font-bold mb-4">
              Exam {location.state.result.status === 'pass' ? 'Passed!' : 'Failed'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600">Score</p>
                <p className="text-2xl font-bold">{location.state.result.score} / {location.state.result.totalMarks}</p>
              </div>
              <div>
                <p className="text-gray-600">Percentage</p>
                <p className="text-2xl font-bold">{location.state.result.percentage}%</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="text-2xl font-bold uppercase">{location.state.result.status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">All Results</h3>
          
          {loading ? (
            <p className="text-gray-600">Loading results...</p>
          ) : results.length === 0 ? (
            <p className="text-gray-600">No results yet. Take an exam to see your results here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.result_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.exam_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.score} / {result.total_marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {result.percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {new Date(result.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
