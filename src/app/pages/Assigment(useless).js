// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, addDoc, getDoc, doc } from 'firebase/firestore';
// import { auth, db } from '../Tools/firebaseConfig.js';
// import styles from '../components/Assigment.module.css';
// import Swal from 'sweetalert2';

// export default function AsignacionOTBMejorada() {
//   const [activeTab, setActiveTab] = useState('asignaciones');
//   const [assignments, setAssignments] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [visibleAssignments, setVisibleAssignments] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5;
//   const [cisternas, setCisternas] = useState([]);
//   const [selectedCisterna, setSelectedCisterna] = useState('');
//   const [reportData, setReportData] = useState([]);
//   const [visibleReportData, setVisibleReportData] = useState([]);
//   const [reportCurrentPage, setReportCurrentPage] = useState(0);
//   const [reportLoaded, setReportLoaded] = useState(false);

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'Schedule'));
//         const assignmentsData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setAssignments(assignmentsData);
//         setVisibleAssignments(assignmentsData.slice(0, itemsPerPage));
//       } catch (error) {
//         console.error("Error fetching assignments:", error);
//       }
//     };

//     const fetchCisternas = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'cisternas'));
//         const cisternasData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           name: doc.data().nombre,
//         }));
//         setCisternas(cisternasData);
//       } catch (error) {
//         console.error("Error fetching cisternas:", error);
//       }
//     };

//     fetchAssignments();
//     fetchCisternas();
//   }, []);

//   const fetchReportData = async () => {
//     if (reportLoaded) return;
//     try {
//       const querySnapshot = await getDocs(collection(db, 'Assigment'));
//       const reportData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
//         const data = docSnapshot.data();

//         if (typeof data.IdSchedule !== 'string' || typeof data.IdCisterna !== 'string') {
//           console.warn("IdSchedule o IdCisterna no son válidos:", data.IdSchedule, data.IdCisterna);
//           return null;
//         }

//         const scheduleDocRef = doc(db, 'Schedule', data.IdSchedule);
//         const scheduleDoc = await getDoc(scheduleDocRef);
//         const scheduleData = scheduleDoc.exists() ? scheduleDoc.data() : {};

//         const cisternaDocRef = doc(db, 'cisternas', data.IdCisterna);
//         const cisternaDoc = await getDoc(cisternaDocRef);
//         const cisternaData = cisternaDoc.exists() ? cisternaDoc.data() : {};

//         return {
//           fecha: data.date,
//           otb: scheduleData.nameotb || 'OTB no encontrado',
//           horaInicio: scheduleData.hour || 'Hora no encontrada',
//           horaFin: scheduleData.horaFin || 'Hora no encontrada',
//           cisterna: cisternaData.nombre || 'Cisterna no encontrada',
//         };
//       }));

//       setReportData(reportData.filter((entry) => entry !== null));
//       setReportLoaded(true);
//       setVisibleReportData(reportData.filter((entry) => entry !== null).slice(0, itemsPerPage));
//     } catch (error) {
//       console.error("Error fetching report data:", error);
//     }
//   };

//   const handleAssignClick = (assignment) => {
//     setSelectedAssignment(assignment);
//   };

//   const handleCancelClick = () => {
//     setSelectedAssignment(null);
//     setSelectedCisterna('');
//   };

//   const loadAssignments = (page) => {
//     const startIndex = page * itemsPerPage;
//     const newVisibleAssignments = assignments.slice(startIndex, startIndex + itemsPerPage);
//     setVisibleAssignments(newVisibleAssignments);
//     setCurrentPage(page);
//   };

//   const loadReportData = (page) => {
//     const startIndex = page * itemsPerPage;
//     const newVisibleReportData = reportData.slice(startIndex, startIndex + itemsPerPage);
//     setVisibleReportData(newVisibleReportData);
//     setReportCurrentPage(page);
//   };

//   const handleNextPage = () => {
//     if ((currentPage + 1) * itemsPerPage < assignments.length) {
//       loadAssignments(currentPage + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 0) {
//       loadAssignments(currentPage - 1);
//     }
//   };

//   const handleReportNextPage = () => {
//     if ((reportCurrentPage + 1) * itemsPerPage < reportData.length) {
//       loadReportData(reportCurrentPage + 1);
//     }
//   };

//   const handleReportPreviousPage = () => {
//     if (reportCurrentPage > 0) {
//       loadReportData(reportCurrentPage - 1);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (selectedAssignment && selectedCisterna) {
//       try {
//         const newAssignment = {
//           IdCisterna: selectedCisterna,
//           IdSchedule: selectedAssignment.id,
//           date: new Date().toISOString(),
//         };

//         await addDoc(collection(db, 'Assigment'), newAssignment);

//         const selectedCisternaData = cisternas.find(cisterna => cisterna.id === selectedCisterna);
//         const cisternaNombre = selectedCisternaData ? selectedCisternaData.name : '';

//         setReportData(prevData => [
//           ...prevData,
//           {
//             fecha: newAssignment.date,
//             otb: selectedAssignment.nameotb,
//             horaInicio: selectedAssignment.hour,
//             horaFin: selectedAssignment.horaFin,
//             cisterna: cisternaNombre,
//           },
//         ]);

//         setVisibleReportData(prevData => [
//           ...prevData,
//           {
//             fecha: newAssignment.date,
//             otb: selectedAssignment.nameotb,
//             horaInicio: selectedAssignment.hour,
//             horaFin: selectedAssignment.horaFin,
//             cisterna: cisternaNombre,
//           },
//         ]);

//         setSelectedAssignment(null);
//         setSelectedCisterna('');

//         Swal.fire({
//           icon: 'success',
//           title: 'Asignación exitosa',
//           text: 'La asignación se ha guardado correctamente.',
//         });
//       } catch (error) {
//         console.error("Error adding assignment:", error);
//       }
//     } else {
//       alert('Por favor, selecciona una OTB y una cisterna.');
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>Sistema de Asignación OTB</h1>
//       <div className={styles.tabs}>
//         <div
//           className={`${styles.tab} ${activeTab === 'asignaciones' ? styles.active : ''}`}
//           onClick={() => setActiveTab('asignaciones')}
//         >
//           Asignaciones
//         </div>
//         <div
//           className={`${styles.tab} ${activeTab === 'reporte' ? styles.active : ''}`}
//           onClick={() => {
//             setActiveTab('reporte');
//             fetchReportData();
//           }}
//         >
//           Reporte
//         </div>
//       </div>

//       {activeTab === 'asignaciones' && (
//         <div className={styles.gridContainer}>
//           <div className={styles.card}>
//             <div className={styles.cardHeader}>
//               <h2 className={styles.cardTitle}>Lista de Asignaciones</h2>
//             </div>
//             <div className={styles.cardContent}>
//               <div className={styles.scrollArea}>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Nombre OTB</th>
//                       <th>Hora Inicio</th>
//                       <th>Hora Fin</th>
//                       <th>Acción</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {visibleAssignments.map((assignment) => (
//                       <tr key={assignment.id}>
//                         <td>{assignment.nameotb}</td>
//                         <td>{assignment.hour}</td>
//                         <td>{assignment.horaFin}</td>
//                         <td>
//                           <button className={styles.button} onClick={() => handleAssignClick(assignment)}>
//                             Asignar
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               <div className={styles.buttonGroup}>
//                 <button 
//                   className={`${styles.button} ${currentPage === 0 ? styles.disabled : ''}`} 
//                   onClick={handlePreviousPage} 
//                   disabled={currentPage === 0}
//                 >
//                   Anterior
//                 </button>
//                 <button 
//                   className={`${styles.button} ${((currentPage + 1) * itemsPerPage >= assignments.length) ? styles.disabled : ''}`} 
//                   onClick={handleNextPage} 
//                   disabled={((currentPage + 1) * itemsPerPage) >= assignments.length}
//                 >
//                   Siguiente
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className={styles.card}>
//             <div className={styles.cardHeader}>
//               <h2 className={styles.cardTitle}>Formulario de Asignación</h2>
//             </div>
//             <div className={styles.cardContent}>
//               <form className={styles.form} onSubmit={handleSubmit}>
//                 <div>
//                   <label htmlFor="nombreOTB">Nombre OTB</label>
//                   <input 
//                     id="nombreOTB" 
//                     value={selectedAssignment ? selectedAssignment.nameotb : ''} 
//                     disabled={true} 
//                   />
//                 </div>
//                 <div className={styles.formGrid}>
//                   <div>
//                     <label htmlFor="horaInicio">Hora Inicio</label>
//                     <input 
//                       id="horaInicio" 
//                       type="time" 
//                       value={selectedAssignment ? selectedAssignment.hour : ''} 
//                       disabled={true} 
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="horaFin">Hora Fin</label>
//                     <input 
//                       id="horaFin" 
//                       type="time" 
//                       value={selectedAssignment ? selectedAssignment.horaFin : ''} 
//                       disabled={true} 
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="cisterna">Cisterna</label>
//                   <select
//                     id="cisterna"
//                     value={selectedCisterna}
//                     onChange={(e) => setSelectedCisterna(e.target.value)}
//                   >
//                     <option value="">Seleccione una cisterna</option>
//                     {cisternas.map((cisterna) => (
//                       <option key={cisterna.id} value={cisterna.id}>
//                         {cisterna.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className={styles.buttonGroup}>
//                   <button className={styles.button} type="submit">
//                     Guardar
//                   </button>
//                   <button className={styles.button} type="button" onClick={handleCancelClick}>
//                     Cancelar
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {activeTab === 'reporte' && (
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             <h2 className={styles.cardTitle}>Reporte de Asignaciones</h2>
//           </div>
//           <div className={styles.cardContent}>
//             <div className={styles.scrollArea}>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Fecha</th>
//                     <th>Nombre OTB</th>
//                     <th>Hora Inicio</th>
//                     <th>Hora Fin</th>
//                     <th>Cisterna</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleReportData.map((data, index) => (
//                     <tr key={index}>
//                       <td>{data.fecha}</td>
//                       <td>{data.otb}</td>
//                       <td>{data.horaInicio}</td>
//                       <td>{data.horaFin}</td>
//                       <td>{data.cisterna}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className={styles.buttonGroup}>
//               <button 
//                 className={`${styles.button} ${reportCurrentPage === 0 ? styles.disabled : ''}`} 
//                 onClick={handleReportPreviousPage} 
//                 disabled={reportCurrentPage === 0}
//               >
//                 Anterior
//               </button>
//               <button 
//                 className={`${styles.button} ${((reportCurrentPage + 1) * itemsPerPage >= reportData.length) ? styles.disabled : ''}`} 
//                 onClick={handleReportNextPage} 
//                 disabled={((reportCurrentPage + 1) * itemsPerPage) >= reportData.length}
//               >
//                 Siguiente
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
