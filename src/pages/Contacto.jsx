import React from 'react';
import './Contacto.css';

const Contacto = () => {
  return (
    <div className="contacto-container">
      <div className="contacto-header">
        <h1>Contacto</h1>
        <p>Estamos aquí para asesorarte en tu próxima inversión</p>
      </div>

      <div className="contacto-content">
        <form className="contacto-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text" placeholder="Escribe tu nombre..." required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="email@ejemplo.com" required />
          </div>
          <div className="form-group">
            <label>Mensaje</label>
            <textarea rows="5" placeholder="¿En qué podemos ayudarte?"></textarea>
          </div>
          <button type="submit" className="btn-enviar">Enviar Mensaje</button>
        </form>

        <div className="contacto-info">
          <h3>Nuestra Oficina</h3>
          <p>📍 José Mármol, Buenos Aires, Argentina</p>
          <p>📞 +54 11 1234-5678</p>
          <p>✉️ info@inmobiliariabrown.com.ar</p>
          
          <div className="map-placeholder">
            {/* Aquí puedes insertar un iframe de Google Maps */}
            <p>Mapa de Ubicación</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;