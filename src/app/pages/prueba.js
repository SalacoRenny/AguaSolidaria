import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from '../Tools/firebaseConfig.js'; // Importa tu configuración de Firebase

const db = getFirestore(app);

const CisternData = () => {
  const [data, setData] = useState([]); // Estado para almacenar los datos de Firestore

  // Función para obtener los datos de la colección "Cistern"
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "Cistern"));
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Obtenemos los documentos y su id
    setData(documents); // Guardamos los datos en el estado
  };

  // Ejecutamos fetchData cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []); // El arreglo vacío [] asegura que el efecto solo se ejecute una vez

  return (
    <div>
      <h1>Datos de la colección "Cistern"</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <strong>ID:</strong> {item.id}<br />
            <strong>Capacidad:</strong> {item.capacity}<br />
            <strong>Número de placa:</strong> {item.plateNumber}<br />
            <strong>Estado:</strong> {item.status ? "Activo" : "Inactivo"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CisternData;
