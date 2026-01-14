import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Nosotros from './pages/Nosotros';
import Propiedades from './pages/Propiedades';
import Contacto from './pages/Contacto';

// Estilo global básico
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Nosotros />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;