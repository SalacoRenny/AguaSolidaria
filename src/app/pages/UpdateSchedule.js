import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Tools/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../components/updateSchedules.css';

const UpdateSchedule = () => {
    const [nombre, setNombre] = useState(""); 
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getScheduleById = async () => {
            const scheduleDoc = await getDoc(doc(db, "Schedule", id));
            if (scheduleDoc.exists()) {
                const data = scheduleDoc.data();
                
                let fechaFormato;
                if (data.date && data.date.toDate) {
                    fechaFormato = data.date.toDate(); // Obtenemos la fecha real
                } else if (data.date instanceof Date) {
                    fechaFormato = data.date;
                } else {
                    fechaFormato = new Date();
                }
    
                setNombre(data.nameotb || "");
                setFecha(fechaFormato.toISOString().split('T')[0]); // Mostramos la fecha original en formato yyyy-mm-dd
                setHora(data.hour || "");
                setHoraFin(data.horaFin || "");
            } else {
                Swal.fire({
                    title: "Error",
                    text: "El registro no existe",
                    icon: "error",
                });
                navigate('/listSchedules');
            }
        };
    
        getScheduleById();
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (hora >= horaFin) {
            Swal.fire({
                title: "Error",
                text: "La hora de llegada no puede ser posterior o igual a la hora de salida.",
                icon: "error",
            });
            return;
        }

        // Verificar si los datos realmente han cambiado
        const scheduleDoc = await getDoc(doc(db, "Schedule", id));
        const data = scheduleDoc.data();

        // Comparar correctamente las fechas, horas y otros campos
        const fechaOriginal = data.date.toDate().toISOString().split('T')[0];
        const fechaNueva = fecha;
        const horaOriginal = data.hour;
        const horaFinOriginal = data.horaFin;

        if (
            nombre === data.nameotb &&
            fechaOriginal === fechaNueva &&
            hora === horaOriginal &&
            horaFin === horaFinOriginal
        ) {
            Swal.fire({
                title: "Sin cambios",
                text: "No se ha realizado ningún cambio en los datos.",
                icon: "info",
            });
            return; // No hacer nada si no hay cambios
        }

        try {
            await updateDoc(doc(db, "Schedule", id), {
                nameotb: nombre,
                date: new Date(fecha), // Asegurarse de que la fecha esté en el formato correcto
                hour: hora,
                horaFin: horaFin,
            });

            Swal.fire({
                title: "Éxito",
                text: "Registro actualizado correctamente",
                icon: "success",
            });

            navigate('/listSchedules');
        } catch (error) {
            console.error("Error al actualizar el registro: ", error);
            Swal.fire({
                title: "Error",
                text: "Error al actualizar el registro",
                icon: "error",
            });
        }
    };

    const handleCancel = () => {
        navigate('/listSchedules');
    };

    return (
        <div className="update-schedule-wrapper">
            <div className="update-schedule-container">
                <form onSubmit={handleUpdate}>
                    <h2 className="mb-4">Actualizar Registro de OTB</h2>
                    <div className="form-group mb-3">
                        <label htmlFor="nombre">Nombre OTB</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            id="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="hora">Hora de Llegada</label>
                        <input
                            type="time"
                            className="form-control"
                            id="hora"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="horaFin">Hora de Salida</label>
                        <input
                            type="time"
                            className="form-control"
                            id="horaFin"
                            value={horaFin}
                            onChange={(e) => setHoraFin(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Actualizar</button>
                    <button type="button" className="btn btn-secondary ms-3" onClick={handleCancel}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateSchedule;
