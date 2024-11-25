import React from 'react';
import './App.css';
import './app/components/home/topbar.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './app/pages/Login';
import MainContent from './app/pages/MainContent';
import MapMain from './app/pages/home/MapMain';
import TopBar from './app/pages/home/topBar';
import MapDistritos from './app/pages/MapDistritos';
import ScheduleUser from './app/pages/scheduleUser';

import AdminDashboard from './app/pages/DashboardAdmin/AdminDashboard';
import AssigmentReport from './app/pages/DashboardAdmin/AssigmentReport';
import UserRegistration from './app/pages/registroOTB';
import Show from './app/pages/listSchedule';
import UpdateSchedule from './app/pages/UpdateSchedule';
import Assigment from './app/pages/DashboardAdmin/Assigment';
import Complaints from './app/pages/DashboardAdmin/Complaints'; // Renombrado correctamente

import { AuthProvider } from './app/pages/DashboardAdmin/AuthContext';
import PrivateRoute from './app/pages/DashboardAdmin/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TopBar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<MainContent />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/MapMain" element={<MapMain />} />
          <Route path="/MapDistritos" element={<MapDistritos />} />
          <Route path="/scheduleuser" element={<ScheduleUser />} />
          <Route path="/registroOTB" element={<UserRegistration />} />

          {/* Rutas protegidas solo para el administrador */}
          <Route path="/dashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
          <Route path="/listSchedules" element={<PrivateRoute element={<Show />} />} />
          <Route path="/UpdateSchedule/:id" element={<PrivateRoute element={<UpdateSchedule />} />} />
          <Route path="/AssigmentReport" element={<PrivateRoute element={<AssigmentReport />} />} />
          <Route path="/Assigment" element={<PrivateRoute element={<Assigment />} />} />
          <Route path="/Complaints" element={<PrivateRoute element={<Complaints />} />} />

          {/* Ruta para manejar errores 404 */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
