import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Tools/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../components/listSchedules.css';
import Sidebar from '../pages/DashboardAdmin/Sidebar'; // Asegúrate de que la ruta sea correcta

const Show = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para los productos filtrados
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la consulta de búsqueda
  const navigate = useNavigate();
  const scheduleCollection = collection(db, "Schedule");

  const getSchedule = async () => {
    const scheduleData = await getDocs(scheduleCollection);
    const combinedData = scheduleData.docs.map((doc) => {
      const data = doc.data();
      
      let formattedDate;
      if (data.date instanceof Date) {
        formattedDate = data.date;
      } else if (data.date?.toDate) {
        formattedDate = data.date.toDate();
      } else {
        formattedDate = new Date();
      }
  
      const hour = data.hour || 'N/A';
      const horaFin = data.horaFin || 'N/A';
  
      const isValidTimeRange = hour !== 'N/A' && horaFin !== 'N/A' && new Date(`1970-01-01T${horaFin}`) >= new Date(`1970-01-01T${hour}`);    
  
      return {
        id: doc.id,
        name: data.nameotb || 'N/A',
        date: formattedDate,
        hour: hour,
        horaFin: isValidTimeRange ? horaFin : 'Error en hora fin',
      };
    });
  
    combinedData.sort((a, b) => a.date - b.date);
    setProducts(combinedData);
    setFilteredProducts(combinedData); // Inicializamos los productos filtrados
  };

  useEffect(() => {
    getSchedule();
  }, []);

  // Filtrar productos por nombre y fecha basado en la búsqueda
  useEffect(() => {
    const filtered = products.filter(product => {
      const dateStr = product.date.toLocaleDateString("es-BO");
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             dateStr.includes(searchQuery); // Compara tanto el nombre como la fecha
    });
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleDelete = async (id) => {
    // Mostrar la alerta de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    // Si el usuario confirma, proceder con la eliminación
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "Schedule", id));
        setProducts(products.filter(product => product.id !== id));
        setFilteredProducts(filteredProducts.filter(product => product.id !== id)); // También actualizamos los productos filtrados
        Swal.fire(
          'Eliminado',
          'El registro ha sido eliminado exitosamente.',
          'success'
        );
      } catch (error) {
        console.error("Error al eliminar el registro: ", error);
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar el registro.',
          'error'
        );
      }
    }
  };

  const handleBack = () => {
    navigate('/registroOTB');
  };

  return (
    <div className="list-schedules-container">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <Sidebar />
        </div>

        {/* Contenido principal */}
        <div className="col-md-9" style={{ marginTop: '70px' }}>
          <h2>Lista de OTB's</h2>

          <button onClick={handleBack} className="btn btn-secondary">Agregar OTB</button>

          {/* Buscador */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar OTB por nombre o fecha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Actualizar la búsqueda
            />
          </div>

          <div className="table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nombre OTB</th>
                  <th>Fecha</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.date.toLocaleDateString("es-BO")}</td>
                    <td>{product.hour}</td>
                    <td>{product.horaFin}</td>
                    <td>
                      <button onClick={() => navigate(`/UpdateSchedule/${product.id}`)} className="btn btn-primary btn-sm">Actualizar</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Show;
