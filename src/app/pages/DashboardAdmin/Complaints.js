import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../components/admin/Complaints.css';
import '../../components/admin/Sidebar.css';
import { db } from '../../Tools/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { formatDistanceToNow } from 'date-fns'; 
import { es } from 'date-fns/locale'; // Importa el idioma español
import logo from '../../assets/cochaLogo.png'; // Verifica que esta ruta sea correcta

const Complaints = () => {
  const [otbs, setOtbs] = useState({});
  const [filteredOtbs, setFilteredOtbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOTB, setCurrentOTB] = useState(null); // Controlador del OTB actual
  const [searchTerm, setSearchTerm] = useState(''); // Controlador del buscador

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, 'Complaints');
        const complaintsSnapshot = await getDocs(complaintsCollection);
        const complaintsList = complaintsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Agrupar las quejas por OTB
        const groupedByOTB = complaintsList.reduce((acc, complaint) => {
          const { otbName, date } = complaint;
          if (!acc[otbName]) {
            acc[otbName] = [];
          }
          // Agregar las quejas ordenadas por fecha descendente
          acc[otbName].push({ ...complaint, date: date.toDate() });
          acc[otbName].sort((a, b) => b.date - a.date); // Ordenar por fecha (más reciente primero)
          return acc;
        }, {});

        setOtbs(groupedByOTB); // Guardamos las OTBs agrupadas
        setFilteredOtbs(Object.keys(groupedByOTB)); // Inicializamos el buscador con todas las OTBs
        setLoading(false);

        if (Object.keys(groupedByOTB).length > 0) {
          setCurrentOTB(Object.keys(groupedByOTB)[0]); // Establecemos la primera OTB por defecto
        }
      } catch (error) {
        console.error('Error al obtener las quejas:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las quejas.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    // Filtrar OTBs según el término de búsqueda
    if (searchTerm) {
      const filtered = Object.keys(otbs).filter(otbName =>
        otbName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOtbs(filtered);
    } else {
      setFilteredOtbs(Object.keys(otbs));
    }
  }, [searchTerm, otbs]);

  const handleOTBChange = (otbName) => {
    setCurrentOTB(otbName);
  };

  // Ordenar las OTBs por la fecha de la última queja de cada OTB
  const sortedOtbs = filteredOtbs.sort((a, b) => {
    const latestA = otbs[a][0]?.date;
    const latestB = otbs[b][0]?.date;
    return latestB - latestA; // Ordenar por la queja más reciente
  });

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="complaints-wrapper">
        {/* Panel de notificaciones de OTBs */}
        <div className="notifications-panel">
          {loading ? (
            <p>Cargando notificaciones...</p>
          ) : (
            <div className="otb-notifications">
              {filteredOtbs.length === 0 ? (
                <p>No hay OTBs con quejas.</p>
              ) : (
                sortedOtbs.map((otbName) => (
                  <button
                    key={otbName}
                    className="otb-button"
                    onClick={() => handleOTBChange(otbName)}
                  >
                    <strong>{otbName}</strong>
                    <div>
                      {otbs[otbName][0] 
                        ? `Última queja: ${formatDistanceToNow(otbs[otbName][0].date, { locale: es })} atrás`
                        : 'No hay quejas recientes'}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Contenedor principal de quejas */}
        <div className="complaints-container">
          <div className="complaints-list">
            <div className="complaints-list-container">
              <div className="complaints-panel">
                <h2>Lista de Quejas por OTB</h2>

                {loading ? (
                  <p>Cargando quejas...</p>
                ) : Object.keys(otbs).length === 0 ? (
                  <p>No hay quejas registradas.</p>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Buscar OTB..."
                      className="otb-search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />

<div className="complaints-list-items">
  {currentOTB && otbs[currentOTB] ? (
    otbs[currentOTB].slice(0, 3).map(complaint => (
      <div key={complaint.id} className="complaint-item">
        <div>
          <strong>OTB:</strong> {complaint.otbName} ({complaint.district})
        </div>
        <div>
          <strong>Fecha:</strong> {formatDistanceToNow(complaint.date, { locale: es })} atrás
        </div>
        <div>
          <strong>Queja:</strong> {complaint.complaintText}
        </div>
      </div>
    ))
  ) : (
    <p>No se encontró ninguna queja para la OTB seleccionada.</p>
  )}
</div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



const Sidebar = () => (
  <aside className="sidebar">
    <div className="logo">
      <img src={logo} alt="Admin Panel Logo" className="logo-img" />
    </div>
    <nav>
      <ul>
       
        <li className="nav-item">
          <Link to="/registroOTB" className="nav-links">Asignaciones</Link>
        </li>
        <li className="nav-item">
          <Link to="/listSchedules" className="nav-links">Lista de Horarios</Link>
        </li>
        <li className="nav-item">
          <Link to="/Assigment" className="nav-links">Cisternas</Link>
        </li>
        <li className="nav-item">
          <Link to="/AssigmentReport" className="nav-links">Reportes</Link>
        </li>
        <li className="nav-item">
          <Link to="/Complaints" className="nav-links">Quejas y Reclamos</Link>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Complaints;
