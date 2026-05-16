import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-white">
              Online Examination System
            </h1>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-purple-300 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to Future Skills Academy
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            A modern, computer-based examination platform designed for seamless testing experiences. 
            Take exams, track your progress, and view detailed reports - all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Secure Authentication
            </h3>
            <p className="text-gray-700 text-center">
              Session-based login with encrypted passwords for secure access to your account.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Timed Exams
            </h3>
            <p className="text-gray-700 text-center">
              Built-in countdown timer for each exam with automatic submission when time expires.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Instant Results
            </h3>
            <p className="text-gray-700 text-center">
              Automatic scoring with immediate feedback and detailed performance reports.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Multiple Attempts
            </h3>
            <p className="text-gray-700 text-center">
              Retake exams to improve your scores and track your progress over time.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Detailed Reports
            </h3>
            <p className="text-gray-700 text-center">
              Comprehensive performance analytics including pass/fail statistics and score distribution.
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-400 transition">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Responsive Design
            </h3>
            <p className="text-gray-700 text-center">
              Access the platform from any device with a modern, user-friendly interface.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-700 to-purple-600 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Examination?
            </h3>
            <p className="text-white mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using our platform to enhance their learning experience.
            </p>
            <Link
              to="/register"
              className="bg-white text-blue-900 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-purple-100 transition shadow-lg inline-block"
            >
              Create Your Account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-600">
          <p>&copy; 2024 Future Skills Academy. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
