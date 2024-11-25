import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Tools/firebaseConfig';
import '../components/show.css';

const Show = () => {
    const [products, setProducts] = useState([]);

    const scheduleCollection = collection(db, "Schedule");
    const otbCollection = collection(db, "Otb");

    const getSchedule = async () => {
        const scheduleData = await getDocs(scheduleCollection);
    
        // Combinar datos de Schedule
        const combinedData = scheduleData.docs.map((doc) => ({
            id: doc.id,
            hour: doc.data().hour,
            day: doc.data().day,
            name: doc.data().name || 'N/A', // Obtener el nombre de la OTB desde el documento de Schedule
        }));
    
        setProducts(combinedData);
        console.log(combinedData);
    };
    

    useEffect(() => {
        getSchedule();
    }, []);

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                    <div className='d-grid gap-2'>
    <h2 className='mt-2 mb-2'>Calendario Cisternero</h2>
</div>

                        <table className='table table-dark table-hover'>
                            <thead>
                                <tr>
                                    <th>Nombre</th>  {/* Nueva columna para Nombre */}
                                    <th>Día</th>    {/* Nueva columna para Día */}
                                    <th>Hora</th>   {/* Columna de Hora */}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>  {/* Mostramos el nombre */}
                                        <td>{product.day}</td>   {/* Mostramos el día */}
                                        <td>{product.hour}</td>  {/* Mostramos la hora */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Show;
