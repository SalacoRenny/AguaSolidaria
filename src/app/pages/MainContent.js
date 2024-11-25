import React, { useState, useEffect } from 'react'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import { db } from '../Tools/firebaseConfig'; 
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import Swal from 'sweetalert2'; 
import { MdOutlineEventAvailable } from 'react-icons/md'; 
import '../components/home/MainContent.css';

// Función para obtener la fecha actual sin hora
const getCurrentDate = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

// Función para obtener la fecha formateada
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
};

const MainContent = () => {
  const [date, setDate] = useState(new Date());
  const [otbs, setOtbs] = useState([]);
  const [complaint, setComplaint] = useState('');
  const [selectedDateOtbs, setSelectedDateOtbs] = useState([]);
  const [selectedOtb, setSelectedOtb] = useState(null);

  const isToday = () => {
    const today = getCurrentDate();
    const selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return selectedDate.getTime() === today.getTime();
  };

  // Función para obtener los OTBs desde Firestore
  const fetchOtbs = async () => {
    try {
      const otbCollection = collection(db, 'Schedule');
      const otbSnapshot = await getDocs(otbCollection);
      const otbList = otbSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.nameotb,
          district: data.distrito,
          startTime: data.hour,
          endTime: data.horaFin,
          date: data.date && typeof data.date.toDate === 'function' ? data.date.toDate() : null,
        };
      });
      setOtbs(otbList);
    } catch (error) {
      console.error("Error al obtener los datos de Schedule:", error);
    }
  };

  useEffect(() => {
    fetchOtbs();
  }, []);

  useEffect(() => {
    const filteredOtbs = otbs.filter(otb => {
      if (!otb.date) return false;
      const otbDate = new Date(otb.date.getFullYear(), otb.date.getMonth(), otb.date.getDate()).toISOString().split('T')[0];
      const selectedDateFormatted = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
      return otbDate === selectedDateFormatted;
    });
    setSelectedDateOtbs(filteredOtbs);
    setSelectedOtb(filteredOtbs.length > 0 ? filteredOtbs[0] : null); // Selecciona la primera OTB por defecto
  }, [date, otbs]);

  const handleComplaintSubmit = async () => {
    if (!selectedOtb) {
      Swal.fire('Error!', 'Por favor, seleccione una OTB.', 'error');
      return;
    }
    if (!complaint.trim()) {
      Swal.fire('Error!', 'Por favor, ingrese su queja.', 'error');
      return;
    }

    try {
      const complaintData = {
        otbId: selectedOtb.id,
        district: selectedOtb.district,
        otbName: selectedOtb.name,
        date: new Date(),
        complaintText: complaint,
      };

      const complaintsCollection = collection(db, 'Complaints');
      await addDoc(complaintsCollection, complaintData);

      Swal.fire('Éxito!', 'Queja registrada con éxito.', 'success');
      setComplaint('');
      
      // Refrescar los OTBs después de registrar una queja
      fetchOtbs();  // Recarga los OTBs desde Firestore
    } catch (error) {
      console.error('Error al registrar la queja:', error);
      Swal.fire('Error!', 'Hubo un error al registrar la queja. Inténtelo de nuevo.', 'error');
    }
  };

  return (
    <div className="main-content">
      <div className="main-container">
        <div className="card date-calendar-card">
          <h2>Calendario de reparto</h2>
          <div className="date-section">
            <MdOutlineEventAvailable className="date-icon" />
            <div className="date-box">
              <div className="date-text">{formatDate(date)}</div>
            </div>
          </div>
          <div className="calendar-box">
            <Calendar onChange={setDate} value={date} />
          </div>

          <div className="otbs-list">
            {selectedDateOtbs.map((otb, index) => (
              <div key={index} className="otb-info">
                <h3>{otb.name} {otb.district}</h3>
                <div className="otb-details">
                  <p>Horario: {otb.startTime} - {otb.endTime}</p>
                </div>
              </div>
            ))}
            {selectedDateOtbs.length === 0 && <p>No hay eventos programados para esta fecha.</p>}
          </div>

          <div className="otbs-list">
            {isToday() && selectedDateOtbs.length > 0 ? (
              <>
                <label htmlFor="otb-select"><strong>Seleccione una OTB:</strong></label>
                <select
                  id="otb-select"
                  value={selectedOtb?.id || ''}
                  onChange={(e) =>
                    setSelectedOtb(selectedDateOtbs.find(otb => otb.id === e.target.value))
                  }
                >
                  {selectedDateOtbs.map(otb => (
                    <option key={otb.id} value={otb.id}>
                      {otb.name} - Distrito {otb.district}
                    </option>
                  ))}
                </select>
                <textarea
                  rows="4"
                  placeholder="Escriba su queja aquí..."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                ></textarea>
                <button onClick={handleComplaintSubmit}>Enviar Queja</button>
              </>
            ) : (
              <p>No puede registrar quejas para días que no sean hoy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
