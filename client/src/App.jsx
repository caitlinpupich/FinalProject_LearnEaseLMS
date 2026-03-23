import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Shared entry point?
import CourseDetail from './pages/CourseDetail';
import AdminPanel from './pages/AdminPanel';
import StudentLibrary from './pages/StudentLibrary';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import FacultyDashboard from './pages/FacultyDashboard';
import MyCourses from './pages/MyCourses';

function App() {
  // Helper to check role for the shared /dashboard route
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role?.toLowerCase();

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* 1. SMART DASHBOARD 
            This checks the role and sends the user to the right 'Home' 
        */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {role === 'admin' ? <AdminPanel /> : <StudentLibrary />}
          </ProtectedRoute>
        } />

        {/* 2. THE GREAT HALL (Student Library) */}
        <Route path="/library" element={
          <ProtectedRoute>
            <StudentLibrary />
          </ProtectedRoute>
        } />

        {/* 3. COURSE DETAILS (The Scrolls) */}
        <Route path="/course/:id" element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } />

        {/* 4. HEADMASTER'S LEDGER (Admin Only) */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* 4. Faculty Dashboard (Faculty Only) */}
        <Route path="/faculty" element={
          <ProtectedRoute>
            <FacultyDashboard />
          </ProtectedRoute>
        } />

        {/* 5. My Courses (Shared by Students) */}
        <Route path="/my-courses" element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        } />

        {/* Catch-all: Send lost wizards back to Login */}
        <Route path="*" element={<Navigate to="/" />} />


      </Routes>
    </Router>
  );
}

export default App;