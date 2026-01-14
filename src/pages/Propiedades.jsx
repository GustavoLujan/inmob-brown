import React, { useState } from 'react';
import './Propiedades.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBed, faBath, faUtensils, faTree, 
  faCar, faSearch, faTimes 
} from '@fortawesome/free-solid-svg-icons';

const Propiedades = () => {
  const [localidad, setLocalidad] = useState("José Mármol");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fotosSeleccionadas, setFotosSeleccionadas] = useState([]);

  const localidades = ["José Mármol", "Adrogué", "Burzaco", "Rafael Calzada", "Claypole", "Glew"];
  <br>
  
  </br>
  const propiedades = [
    { id: 1, amb: 4, ban: 2, coc: "Moderna", pat: "Parque con Parrilla", coch: "Cubierta", precio: "185.000" },
    { id: 2, amb: 3, ban: 1, coc: "Integrada", pat: "Patio pequeño", coch: "Espacio auto", precio: "125.000" },
    { id: 3, amb: 5, ban: 3, coc: "Full Equip", pat: "Piscina y Jardín", coch: "Doble", precio: "310.000" },
    { id: 4, amb: 2, ban: 1, coc: "Kitchinette", pat: "Balcón", coch: "No posee", precio: "85.000" },
    { id: 5, amb: 3, ban: 2, coc: "Moderna", pat: "Terraza", coch: "Cubierta", precio: "150.000" },
    { id: 6, amb: 4, ban: 2, coc: "Clásica", pat: "Jardín invierno", coch: "Pasante", precio: "210.000" }
  ];

  const abrirGaleria = (id) => {
    const galeria = [1, 2, 3, 4, 5].map(n => `https://picsum.photos/seed/${id}-${n}-${localidad}/800/600`);
    setFotosSeleccionadas(galeria);
    setModalAbierto(true);
  };

  return (
    <div className="container-page">
      <h2 className="title">Buscar Propiedades</h2>
      
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <select 
          value={localidad} 
          onChange={(e) => setLocalidad(e.target.value)} 
          className="select-localidad"
        >
          {localidades.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="prop-grid">
        {propiedades.map(casa => (
          <div key={casa.id} className="prop-card" onClick={() => abrirGaleria(casa.id)}>
            <div className="img-container">
              <img 
                src={`https://picsum.photos/seed/${casa.id}${localidad}/400/250`} 
                alt="Casa" 
                className="prop-img" 
              />
              <div className="price-tag">USD {casa.precio}</div>
              <div className="img-overlay">Ver Galería (5 fotos)</div>
            </div>

            <div className="prop-content">
              <h3>Propiedad en {localidad}</h3>
              <div className="icons-grid">
                <span><FontAwesomeIcon icon={faBed} /> {casa.amb} Amb.</span>
                <span><FontAwesomeIcon icon={faBath} /> {casa.ban} Baños</span>
                <span><FontAwesomeIcon icon={faUtensils} /> Cocina {casa.coc}</span>
                <span><FontAwesomeIcon icon={faTree} /> {casa.pat}</span>
                <span><FontAwesomeIcon icon={faCar} /> Cochera {casa.coch}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setModalAbierto(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="gallery-scroll">
              {fotosSeleccionadas.map((url, index) => (
                <img key={index} src={url} alt={`Vista ${index + 1}`} className="gallery-img" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Propiedades;