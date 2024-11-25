import React from 'react';
import Calendar from 'react-calendar';
import '../../components/admin/AssignmentCalendar.css';

function AssignmentCalendar() {
  const assignments = [
    { date: '2024-11-07', otb: 'San Lorssenzo', cisterna: 'Cisterna 1', status: 'Aceptado' },
    { date: '2024-11-08', otb: 'Alto Arrumani', cisterna: 'Cisterna 2', status: 'En Proceso' },
    // más asignaciones
  ];

  return (
    <div className="assignment-calendar">
      <Calendar />
      {/* Aquí puedes añadir una lista o detalles de asignaciones según la fecha seleccionada */}
    </div>
  );
}

export default AssignmentCalendar;
