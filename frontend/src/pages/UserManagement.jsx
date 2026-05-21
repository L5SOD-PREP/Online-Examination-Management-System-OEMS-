import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout as logoutApi } from '../api/auth';
import { getAllStudents, getAllTeachers, createUser, updateUser, deleteUser } from '../api/students';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'student' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const studentsData = await getAllStudents();
      setStudents(studentsData);
      if (user?.role === 'admin') {
        const teachersData = await getAllTeachers();
        setTeachers(teachersData);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.user_id, { fullName: formData.fullName, email: formData.email });
      } else {
        await createUser(formData);
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ fullName: user.full_name, email: user.email, password: '', role: user.role });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ fullName: '', email: '', password: '', role: 'student' });
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

  const displayedUsers = activeTab === 'students' ? students : teachers;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <div className="w-64 bg-primary-800 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Online Examination System</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">Dashboard</button>
            </li>
            <li>
              <button onClick={() => navigate('/exams')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">Available Exams</button>
            </li>
            <li>
              <button onClick={() => navigate('/results')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">My Results</button>
            </li>
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <>
                <li>
                  <button onClick={() => navigate('/exam-management')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">Exam Management</button>
                </li>
                <li>
                  <button onClick={() => navigate('/questions')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">Question Management</button>
                </li>
                <li>
                  <button onClick={() => navigate('/reports')} className="w-full text-left px-4 py-3 rounded-lg hover:bg-primary-600 transition font-medium">Reports</button>
                </li>
                <li>
                  <button onClick={() => navigate('/users')} className="w-full text-left px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 transition font-medium">User Management</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="mb-4">
            <p className="text-sm text-white/70">Welcome,</p>
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-xs text-white/50 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="w-full bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition font-medium">Logout</button>
        </div>
      </div>

      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-neutral-900">User Management</h2>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition font-semibold">
              Add User
            </button>
          </div>

          {user?.role === 'admin' && (
            <div className="flex space-x-1 mb-6 bg-neutral-200 rounded-lg p-1 w-fit">
              <button onClick={() => setActiveTab('students')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'students' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}>
                Students
              </button>
              <button onClick={() => setActiveTab('teachers')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'teachers' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'}`}>
                Teachers
              </button>
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-primary-500">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <form onSubmit={handleCreateOrUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-neutral-700 font-medium mb-1">Password</label>
                      <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                    </div>
                    {user?.role === 'admin' && (
                      <div>
                        <label className="block text-neutral-700 font-medium mb-1">Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                        </select>
                      </div>
                    )}
                    {user?.role === 'teacher' && (
                      <input type="hidden" value="student" />
                    )}
                  </>
                )}
                <div className="flex space-x-3">
                  <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition">{editingUser ? 'Update' : 'Create'}</button>
                  <button type="button" onClick={resetForm} className="px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <p className="text-neutral-600">Loading...</p>
          ) : displayedUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-neutral-600">No {activeTab} found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                    {activeTab === 'teachers' && <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>}
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {displayedUsers.map((u) => (
                    <tr key={u.user_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{u.full_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{u.email}</td>
                      {activeTab === 'teachers' && <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 capitalize">{u.role}</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button onClick={() => handleEdit(u)} className="text-primary-600 hover:text-primary-900">Edit</button>
                        <button onClick={() => handleDelete(u.user_id)} className="text-red-600 hover:text-red-900">Delete</button>
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

export default UserManagement;
