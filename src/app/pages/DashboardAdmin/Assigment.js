import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Tools/firebaseConfig.js';
import Sidebar from './Sidebar'; // Ajusta esta ruta si es necesario
import styles from '../../components/Assigment.module.css';
import Swal from 'sweetalert2';

export default function CisternaCRUD() {
  const [activeTab, setActiveTab] = useState('crud');
  const [cisternas, setCisternas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [placa, setPlaca] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [editCisterna, setEditCisterna] = useState(null);
  const [errors, setErrors] = useState({ placa: '', capacidad: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCisternas();
  }, []);

  const fetchCisternas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cisternas'));
      const cisternasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCisternas(cisternasData);
    } catch (error) {
      console.error('Error fetching cisternas:', error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    const placaRegex = /^(?:[A-Z]{3}[0-9]{4}|[0-9]{4}[A-Z]{3}|[0-9]{3}[A-Z]{3})$/;
    const capacidadRegex = /^\d+$/;
    let isValid = true;
    const newErrors = { placa: '', capacidad: '' };

    if (!placaRegex.test(placa)) {
      newErrors.placa = 'Formato de placa inválido. Ej: ABC1234, 1234ABC o 123ABC';
      isValid = false;
    }
    if (!capacidadRegex.test(capacidad)) {
      newErrors.capacidad = 'Solo se permiten números en la capacidad.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      if (editCisterna) {
        const cisternaRef = doc(db, 'cisternas', editCisterna.id);
        await updateDoc(cisternaRef, { nombre, placa, capacidad });
        Swal.fire('Actualizado!', 'La cisterna ha sido actualizada', 'success');
      } else {
        await addDoc(collection(db, 'cisternas'), { nombre, placa, capacidad });
        Swal.fire('Agregado!', 'La cisterna ha sido agregada', 'success');
      }
      resetForm();
      fetchCisternas();
    } catch (error) {
      console.error('Error saving cisterna:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'cisternas', id));
        Swal.fire('Eliminado!', 'La cisterna ha sido eliminada', 'success');
        fetchCisternas();
      } catch (error) {
        console.error('Error deleting cisterna:', error);
      }
    }
  };

  const handleEdit = (cisterna) => {
    setEditCisterna(cisterna);
    setNombre(cisterna.nombre);
    setPlaca(cisterna.placa);
    setCapacidad(cisterna.capacidad);
  };

  const resetForm = () => {
    setNombre('');
    setPlaca('');
    setCapacidad('');
    setEditCisterna(null);
    setErrors({ placa: '', capacidad: '' });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCisternas = cisternas.filter(
    (cisterna) =>
      cisterna.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cisterna.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cisterna.capacidad.toString().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Gestión de Cisternas</h1>
        {activeTab === 'crud' && (
          <div className={styles.card}>
            {/* Formulario */}
            <form onSubmit={handleAddOrUpdate} className={styles.form}>
              {/* Campos del formulario */}
              <div>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="placa">Placa</label>
                <input
                  id="placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  required
                />
                {errors.placa && <small className={styles.error}>{errors.placa}</small>}
              </div>
              <div>
                <label htmlFor="capacidad">Capacidad en litros</label>
                <input
                  id="capacidad"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  required
                />
                {errors.capacidad && <small className={styles.error}>{errors.capacidad}</small>}
              </div>
              <div className={styles.buttonGroup}>
  <button type="submit" className={styles.button}>{editCisterna ? 'Actualizar' : 'Guardar'}</button>
  <button type="button" onClick={resetForm} className={styles.button}>Cancelar</button>
</div>
            </form>
            <p></p>

            {/* Tabla */}
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Placa</th>
                  <th>Capacidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCisternas.map((cisterna) => (
                  <tr key={cisterna.id}>
                    <td>{cisterna.nombre}</td>
                    <td>{cisterna.placa}</td>
                    <td>{cisterna.capacidad}</td>
                    <td>
  <button onClick={() => handleEdit(cisterna)} className={styles.buttonEdit}>Editar</button>
  <button onClick={() => handleDelete(cisterna.id)} className={styles.buttonDelete}>Eliminar</button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
