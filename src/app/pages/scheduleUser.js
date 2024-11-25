import React, { useState, useEffect, useCallback, Fragment } from "react";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../Tools/firebaseConfig';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../components/calendar.css';
import { Navbar, Modal, Button } from 'react-bootstrap';
import cochaLogo from '../assets/cochaLogo.png';

import { Timestamp } from 'firebase/firestore';

dayjs.locale('es'); // Configuración de dayjs en español
const localizer = dayjsLocalizer(dayjs);

const ScheduleUser = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [displayCount, setDisplayCount] = useState(5); // Número de eventos a mostrar en la lista de búsqueda
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]); // Estado para eventos de la fecha seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const scheduleCollection = collection(db, "Schedule");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (dateEvents) => {
    setSelectedDateEvents(dateEvents);
    setShowModal(true);
  };

  // Actualizar el título de la página
  useEffect(() => {
    document.title = "Calendario de Cisternas";
  }, []);

  // Configuración de los mensajes en español para los botones y vistas
  const messages = {
    today: 'Hoy',
    previous: 'Atrás',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
  };

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(scheduleCollection);
      const data = await getDocs(eventsQuery);

      const fetchedEvents = data.docs.map(doc => {
        const scheduleData = doc.data();
      
        const startDate = scheduleData.date instanceof Timestamp
          ? dayjs(scheduleData.date.toDate()).set('hour', parseInt(scheduleData.hour.split(':')[0])).set('minute', parseInt(scheduleData.hour.split(':')[1])).toDate()
          : new Date();
        
        const endDate = scheduleData.date instanceof Timestamp
          ? dayjs(scheduleData.date.toDate()).set('hour', parseInt(scheduleData.horaFin.split(':')[0])).set('minute', parseInt(scheduleData.horaFin.split(':')[1])).toDate()
          : new Date();
      
        return {
          title: scheduleData.nameotb || "Sin nombre",
          start: startDate,
          end: endDate,
          distrito: scheduleData.distrito || "Sin distrito",
          id: doc.id
        };
      });
      
      

      const uniqueEvents = fetchedEvents.reduce((acc, current) => {
        if (!acc.find(item => item.id === current.id)) acc.push(current);
        return acc;
      }, []);

      setEvents(uniqueEvents); // Establecer todos los eventos en `events` para el calendario
      setFilteredEvents(uniqueEvents.slice(0, displayCount)); // Mostrar solo los primeros 5 eventos en la lista de búsqueda inicial
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents(); // Primera carga de eventos
  }, []);

  const loadMoreEvents = () => {
    setDisplayCount(prevCount => prevCount + 5); // Aumenta el número de eventos a mostrar en la lista
  };

  useEffect(() => {
    setFilteredEvents(events.slice(0, displayCount));
  }, [displayCount, events]);

  // Debounce optimizado para búsqueda
  const debouncedSearch = useCallback(
    debounce((term) => {
      if (term.trim() === '') {
        setFilteredEvents(events.slice(0, displayCount)); // Reinicia a los primeros eventos en la lista de búsqueda
      } else {
        const fuse = new Fuse(events, { keys: ['title'], threshold: 0.3 });
        const results = fuse.search(term);
        setFilteredEvents(results.map(result => result.item));
      }
    }, 300),
    [events, displayCount]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Función para manejar el clic en el evento para mostrar el modal
  const handleEventClick = (eventDate) => {
    const dateEvents = events.filter(event => 
      dayjs(event.start).isSame(eventDate, 'day')
    );
    if (dateEvents.length > 0) {
      handleShowModal(dateEvents); // Asegurar que haya eventos y mostrar el modal
    }
  };

  // Función para centrar la fecha seleccionada en el calendario
  const handleSearchEventClick = (eventDate) => {
    setSelectedDate(new Date(eventDate)); // Actualiza la fecha seleccionada en el calendario
  };

  return (
    <div className="calendar-container" style={{ height: '100vh', overflowY: 'auto' }}>  
      <div className="title-container">
        <div className="title-background"></div>
        <h1 className="page-title">
          <span>Calendario de</span> Cisternas
        </h1>
      </div>
  
      <div className="container-fluid" style={{ marginTop: '70px' }}>
        <div className="row">
          <div className="col-lg-4 col-md-5 col-sm-12 mb-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <div className="search-bar mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar OTB..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
  
            <div className="search-results">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <SearchResultItem key={index} event={event} handleEventClick={handleSearchEventClick} />
                ))
              ) : (
                <p>No hay resultados para la búsqueda</p>
              )}
  
              {filteredEvents.length > 0 && displayCount < events.length && searchTerm === '' ? (
              <button onClick={loadMoreEvents} className="btn btn-info">
                Cargar más
              </button>
            ) : null}

            </div>
          </div>
  
          <div className="col-lg-8 col-md-7 col-sm-12" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <Calendar
              localizer={localizer}
              events={events} // Mostrar todos los eventos en el calendario
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              date={selectedDate}
              onNavigate={setSelectedDate}
              messages={messages}
              components={{
                event: ({ event }) => (
                  <div onClick={() => handleEventClick(event.start)}>
                    <small style={{ fontSize: '0.8em', color: 'gray' }}>{event.distrito}</small><br />
                    {event.title}
                  </div>
                )
              }}
              
              formats={{
                dayFormat: 'dddd DD',
                monthHeaderFormat: 'MMMM YYYY',
                dayHeaderFormat: 'dddd DD MMM',
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${localizer.format(start, 'dddd D MMMM YYYY', culture)} - ${localizer.format(end, 'dddd D MMMM YYYY', culture)}`,
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
              }}
              
            />
          </div>
        </div>
      </div>
  
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eventos del {dayjs(selectedDateEvents[0]?.start).format('DD/MM/YYYY')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <div key={index} className="event-detail mb-3">
                <h5>{event.title}</h5>
                <p>{dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}</p>
              </div>
            ))
          ) : (
            <p>No hay eventos para esta fecha.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};  

const SearchResultItem = React.memo(({ event, handleEventClick }) => (
  <div className="search-result-item mb-3 p-2 shadow-sm">
    <h5>{event.title !== "Sin nombre" ? event.title : <i>Evento sin nombre</i>}</h5>
    <small style={{ fontSize: '0.8em', color: 'gray' }}>{event.distrito}</small> {/* Mostrar `distrito` aquí */}
    <p>{dayjs(event.start).format('DD/MM/YYYY HH:mm')} - {dayjs(event.end).format('HH:mm')}</p>
    <button className="btn btn-info" onClick={() => handleEventClick(event.start)}>Ver en calendario</button>
  </div>
));


export default ScheduleUser;

