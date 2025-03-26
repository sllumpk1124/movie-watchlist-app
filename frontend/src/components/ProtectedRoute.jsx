import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect to home page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child component
  return children;
};

export default ProtectedRoute;