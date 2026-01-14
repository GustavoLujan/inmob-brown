import React from "react";
import "./Nosotros.css";
// Importamos la nueva imagen de la casa
import imagenCasa from "../assets/casa.png";

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      <div className="hero-image-container">
        <img src={imagenCasa} alt="Nuestra Inmobiliaria" className="hero-casa-img" />
        <div className="hero-overlay">
          <h1>Inmobiliaria Brown</h1>
        </div>
      </div>

      <div className="history-card">
        <div className="history-content">
          <h3>Nuestra Historia</h3>
          <p>
            Con años de trayectoria en la zona de <span className="highlight-text">José Mármol</span> y alrededores,
            nos hemos consolidado como referentes de confianza y profesionalismo en el sector inmobiliario.
          </p>
          <p>
            Nuestra misión es simple: acompañarte en cada paso del camino, ya sea que busques el hogar de tus sueños
            o la mejor inversión para tu futuro.
          </p>

          <div className="valores-grid">
            <div className="valor-item">Confianza</div>
            <div className="valor-item">Trayectoria</div>
            <div className="valor-item">Excelencia</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;