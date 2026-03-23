import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve our saved user object

  // 1. If not logged in at all, go to Login
  if (!token) {
    return <Navigate to="/" />;
  }

  // 2. If it's an admin-only page and the user isn't an admin, kick them to Dashboard
  if (adminOnly && user?.role !== 'admin') {
    console.warn("Access Denied: Student attempted to enter the Headmaster's Office.");
    return <Navigate to="/dashboard" />;
  }

  // 3. Otherwise, let them in!
  return children;
};

export default ProtectedRoute;