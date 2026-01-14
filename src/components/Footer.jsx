import React from 'react';
import './Footer.css';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Izquierda: Logo */}
        <div className="footer-left">
          <img src={logo} alt="Logo Footer" className="footer-logo" />
        </div>

<div className="footer-center">
  <a 
    href="https://www.linkedin.com/in/tu-perfil" 
    target="_blank" 
    rel="noreferrer" 
    className="footer-credits-link"
  >
    Creado por Gustavo Luján
  </a>
</div>
        {/* Derecha: Redes Sociales */}
        <div className="footer-right">
          <div className="social-icons">
            <a href="#" className="social-link"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#" className="social-link"><FontAwesomeIcon icon={faXTwitter} /></a>
            <a href="#" className="social-link"><FontAwesomeIcon icon={faInstagram} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;