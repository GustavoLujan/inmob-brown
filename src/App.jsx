import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

function PublicLayout() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas con Navbar y Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Nosotros />} />
          <Route path="/propiedades" element={<PropertiesPage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/propiedad/:id" element={<PropertyDetailPage />} />
        </Route>

        {/* Login: sin Navbar ni Footer */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard protegido: sin Navbar ni Footer */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
