import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation(); // Esto sirve para saber en qué página estamos

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo a la izquierda */}
        <div className="navbar-logo-box">
          <Link to="/">
            <img src={logo} alt="Logo Inmobiliaria" className="navbar-logo" />
          </Link>
        </div>

        {/* Menú Centrado con Animación */}
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
              Nosotros
            </Link>
          </li>
          <li>
            <Link to="/propiedades" className={`nav-item ${location.pathname === '/propiedades' ? 'active' : ''}`}>
              Propiedades
            </Link>
          </li>
          <li>
            <Link to="/contacto" className={`nav-item ${location.pathname === '/contacto' ? 'active' : ''}`}>
              Contacto
            </Link>
          </li>
        </ul>

        {/* Espaciador para balancear el logo y mantener el centro real */}
        <div className="navbar-spacer"></div>
      </div>
    </nav>
  );
};

export default Navbar;