import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col overflow-hidden relative selection:bg-primary-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-600/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-accent-600 to-pink-500 bg-clip-text text-transparent">
              OEMS <span className="text-xs font-normal text-neutral-500 border border-neutral-300 px-2 py-0.5 rounded-full ml-1">v1.0</span>
            </h1>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-neutral-600 hover:text-primary-600 transition-colors duration-200 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-20 animate-slide-up">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Computer-Based Testing Reinvented
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900 mb-6 leading-tight max-w-4xl mx-auto">
            Welcome to <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-pink-500 bg-clip-text text-transparent">Future Skills Academy</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A secure, automated examination platform designed for seamless testing experiences. 
            Take exams, monitor progress, and view live results—all in one visual workspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white text-primary-600 border border-neutral-300 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:border-primary-300 hover:shadow-md active:translate-y-0 text-center"
            >
              Access Dashboard
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md hover:border-primary-200 transition flex flex-col items-start">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Session-based sign-in with high-security password hashing ensuring full privacy of data.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md hover:border-accent-200 transition flex flex-col items-start">
            <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Timed Examinations
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Embedded countdown timer for all exams with automatic submission to ensure academic integrity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 hover:shadow-md hover:border-pink-200 transition flex flex-col items-start">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              Automatic Grading
            </h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Immediate scoring logic and feedback on submission, yielding prompt scores and results logs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative overflow-hidden rounded-3xl bg-primary-600 p-8 md:p-14 text-center">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]" />
            <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              Ready to challenge your knowledge?
            </h3>
            <p className="text-primary-100 max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Create an account now and gain access to Academy tests instantly. Start measuring your skills.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-100 transition duration-200 active:scale-95 shadow-lg"
            >
              Sign Up Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-neutral-200 text-center text-neutral-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Future Skills Academy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;
