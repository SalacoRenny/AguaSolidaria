import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element: Component }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // Muestra un mensaje de carga mientras `currentUser` se inicializa
  }

  return currentUser && currentUser.role === "Admin" ? (
    Component
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
