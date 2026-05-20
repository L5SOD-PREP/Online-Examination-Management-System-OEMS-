import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import TakeExam from './pages/TakeExam';
import Results from './pages/Results';
import QuestionManagement from './pages/QuestionManagement';
import ExamManagement from './pages/ExamManagement';
import Reports from './pages/Reports';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/exams" element={
          <ProtectedRoute>
            <ExamList />
          </ProtectedRoute>
        } />
        <Route path="/exam/:examId" element={
          <ProtectedRoute>
            <TakeExam />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        } />
        <Route path="/questions" element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <QuestionManagement />
          </RoleProtectedRoute>
        } />
        <Route path="/exam-management" element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ExamManagement />
          </RoleProtectedRoute>
        } />
        <Route path="/reports" element={
          <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Reports />
          </RoleProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
