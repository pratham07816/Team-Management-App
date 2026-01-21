import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home.jsx';
import AddMember from './pages/AddMember.jsx';
import ViewMembers from './pages/ViewMember.jsx';
import MemberDetails from './pages/MemberDetails.jsx';
import EditMember from './pages/EditMember.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function AppContent() {
  const { user, logout, loading } = React.useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-600 text-lg">Loading...</span>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            {user && (
              <>
                <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                <Link to="/add-member" className="text-white hover:text-gray-300">Add Member</Link>
                <Link to="/view-members" className="text-white hover:text-gray-300">View Members</Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white">Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="text-white hover:text-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
                <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/add-member" element={<ProtectedRoute><AddMember /></ProtectedRoute>} />
          <Route path="/view-members" element={<ProtectedRoute><ViewMembers /></ProtectedRoute>} />
          <Route path="/members/:id" element={<ProtectedRoute><MemberDetails /></ProtectedRoute>} />
          <Route path="/edit-member/:id" element={<ProtectedRoute><EditMember /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
