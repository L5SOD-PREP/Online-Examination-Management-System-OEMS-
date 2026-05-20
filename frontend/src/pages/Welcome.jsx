import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              OEMS <span className="text-xs font-normal text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded-full ml-1">v1.0</span>
            </h1>
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95"
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Computer-Based Testing Reinvented
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Future Skills Academy</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A secure, automated examination platform designed for seamless testing experiences. 
            Take exams, monitor progress, and view live results—all in one visual workspace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 hover:opacity-95 shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto glass-panel glass-panel-hover text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 text-center"
            >
              Access Dashboard
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Secure Authentication
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Session-based sign-in with high-security password hashing ensuring full privacy of data.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Timed Examinations
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Embedded countdown timer for all exams with automatic submission to ensure academic integrity.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 bg-pink-600/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Automatic Grading
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Immediate scoring logic and feedback on submission, yielding prompt scores and results logs.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/80 border border-slate-800 p-8 md:p-14 text-center">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
            <h3 className="text-2xl md:text-4xl font-extrabold text-white mb-4">
              Ready to challenge your knowledge?
            </h3>
            <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Create an account now and gain access to Academy tests instantly. Start measuring your skills.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition duration-200 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
              Sign Up Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-slate-900 text-center text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Future Skills Academy. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;
