import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Swal from 'sweetalert2';
import app from '../Tools/firebaseConfig.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/RegistroOTB.css';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img3.jpg';
import Sidebar from '../pages/DashboardAdmin/Sidebar';


const UserRegistration = () => {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [distrito, setDistrito] = useState("");
  const [cisternas, setCisternas] = useState([]); // Estado para almacenar cisternas
  const [selectedCisterna, setSelectedCisterna] = useState(""); // Estado para la cisterna seleccionada
  const [otbs, setOtbs] = useState([]); // Estado para almacenar todas las OTBs
  const [filteredOtbs, setFilteredOtbs] = useState([]); // Estado para almacenar OTBs filtradas según el distrito
  const [distritos, setDistritos] = useState([
    "Distrito 8", "Distrito 9", "Distrito 14", "Distrito 15"
  ]);

  const distritosData = {
    8: ["EL MOLINO",
  "VALLE HERMOSO CENTRAL",
  "SANTA VERA CRUZ",
  "VILLA NUEVA VERA CRUZ",
  "VILLA SAN MIGUEL A. T.",
  "EL SALVADOR",
  "MULA MAYU",
  "TICTI SUD",
  "BARRIO SAN MIGUEL Km 4.",
  "ALTO UNIVERSITARIO",
  "VILLA SAN JOSE",
  "10 DE FEBRERO",
  "USPHA USPHA",
  "RUMI CERCO",
  "ALTO VALLE HERMOS 5 DE OCTUBRE",
  "NUEVO AMANECER",
  "VILLA ALTO SALVADOR",
  "VILLA SALVADOR ALTO TICTI",
  "NUEVA ESPERANZA KIÑI LOMA",
  "ALTO MIRADOR TICTI SUD",
  "LA SERENA CALICANTO",
  "LOS ANGELES",
  "14 DE ABRIL",
  "CHASKA RUMI",
  "MINEROS SAN JUAN",
  "SAN FRANCISCO",
  "CONCORDIA CENTRAL",
  "LOMA PAMPA",
  "LAS ROCAS",
  "JUAN PABLO II",
  "NUEVA JERUSALEM",
  "BAJO SALVADOR",
  "1RO DE AGOSTO",
  "LOMAS DE SANTA BARBARA",
  "MONTE OLIVO",
  "JAPON EL ALTO",
  "LA ROSAS",
  "ALGARROBOS",
  "NUEVO PARAISO",
  "PANORAMICO 2 DE AGOSTO",
  "VILLA BOLIVAR",
  "JARKA MAYU",
  "MONTE RANCHO CENTRAL",
  "14 DE SEPTIEMBRE SUD",
  "CERRO HERMOSO",
  "SINAI 15 DE MARZO",
  "LOMAS DE MONTE RANCHO PLAN 3000",
  "ALTO MONTE RANCHO",
  "ALTO GUALBERTO VILLARROEL",
  "18 DE DICIEMBRE"],
    9: [  "OTB EL PARAISO",
      "OTB PAZ NUEVA JERUSALEM",
      "OTB EDUARDO AVAROA",
      "OTB VILLA ISRAEL",
      "OTB LADISLAO CABRERA",
      "OTB BARRIO VICTORIA BAJO",
      "OTB El ROSARIO",
      "OTB VILLA VICTORIA",
      "OTB COBOL",
      "OTB VILLA DE OROPEZA",
      "OTB PAMPITAS MEJILLONES",
      "OTB VILLA SAN NICOLAS",
      "OTB SAN JORGE \"B\"",
      "OTB VILLA AMERICA",
      "OTB COPACABANA",
      "OTB. J.V. ALTO COBOL",
      "OTB BUENA VISTA LIBERTAD",
      "OTB NUEVOS HORIZONTES",
      "OTB ACHUMANI",
      "OTB URB. 21 DE DICIEMBRE",
      "OTB B. BOLIVAR ENCAÑADA",
      "OTB DOMINGO SAVIO",
      "OTB CANDELARIA SUD F.A.",
      "OTB SAN JOSE DE LA BANDA PLAN C",
      "OTB SAN JOSE TAMBORADA",
      "OTB BISA LA TAMBORADA",
      "OTB MARIO TEJADA",
      "OTB LA CABAÑA",
      "OTB SAN SIMON",
      "OTB B. FERROVIARIO TAMBORADA",
      "OTB CODEVER",
      "OTB LA JOYA",
      "OTB LAS DELICIAS",
      "OTB 21 DE SEPTIEMBRE",
      "OTB OLMEDO SIVINGANI",
      "OTB. VILLA MEJILLONES",
      "OTB MARIA AUXILIADORA SIVINGANI",
      "OTB OLMEDO SIVINGANI",
      "OTB VILLA FATIMA",
      "OTB UNION KASA HUASA",
      "OTB VIDA NUEVA",
      "OTB KALAMARCA",
      "OTB UNION PEDREGAL SEÑOR DE EXALTACION SUR",
      "OTB ALTO SIVINGANI",
      "OTB LOMAS DEL SUR",
      "OTB ALTO SAN ISIDRO",
      "OTB SAN ANTONIO DE BUENA VISTA",
      "OTB lLLIMAN1",
      "OTB ALTO BELLA VISTA",
      "OTB VILLA ALTO BUENA VISTA",
      "OTB AGUAS CALIENTES",
      "OTB 12 DE OCTUBRE SAN ISIDRO",
      "OTB SAN SALVADOR",
      "OTB BUENA VISTA DE OROPEZA",
      "OTB lRO DE MAYO",
      "OTB VILLA CALAMA",
      "OTB 10 DE NOVIEMBRE KASA HUASA",
      "OTB BUENA VISTA",
      "OTB SAN MARCOS",
      "OTB 24 DE JULIO MOLLE MOLLE",
      "OTB ACHUMANI",
      "OTB SENAC",
      "OTB MAGISTERIO",
      "OTB MIRAFLORES ECOLOGICO",
      "OTB VILLA MEJILLOES",
      "OTB BOLIVAR TAMBORADA"],
    14: ["PRESIDENTE DEL DISTRITO",
  "CONTROL SOCIAL",
  "SEBASTIÁN PAGADOR 1º GRUPO",
  "SEBASTIÁN PAGADOR 2º GRUPO",
  "SEBASTIÁN PAGADOR 3º GRUPO",
  "12 DE OCTUBRE",
  "SPR",
  "ALTO DE LA ALIANZA",
  "VILLA SAN ANDRÉS",
  "ALALAY ALTO MIRADOR",
  "CENTRAL ITOCTA",
  "ALTO SEBASTIÁN PAGADOR",
  "VILLA URKUPIÑA",
  "SANTA FE",
  "ENTRE RÍOS",
  "BARRIO UNIDOS",
  "TRAFALGAR",
  "BELLA VISTA",
  "INTEGRACIÓN",
  "NUEVO MILENIO",
  "LOMAS DEL PAGADOR",
  "ALTO PORVENIR",
  "GUALBERTO VILLARROEL",
  "BELLO HORIZONTE",
  "YURAJ RUMY",
  "ALTO SAN JOSE",
  "ALTO NUEVO AMANECER",
  "ALTO YURAJ RUMY",
  "COPACABANA",
  "COLINAS DE PASBOL",
  "TRANSACCIÓN URKUPIÑA",
  "ALTO URKUPIÑA",
  "LAS PEÑAS",
  "VILLA NUEVA",
  "ROCA FUERTE",
  "PEDREGAL",
  "SANTIAGO",
  "ALTO LITORAL"],
    15: [ "JV TIQUIRANI",
      "OTB CENTRAL MILENIO",
      "OTB CHAUPILOMA 29 DE SEPTIEMBRE",
      "OTB 26 DE NOVIEMBRE",
      "OTB JACARANDA 27 DE OCTUBRE",
      "OTB ALTO PARAISO",
      "JV INTEGRACION ESPERANZA",
      "JV SAJAMA",
      "OTB SAN BENITO",
      "JV NUEVA UNION 14 DE SEPTIEMBRE",
      "JV ALTO LOMAS DEL VALLE",
      "OTB AGROMIN LA TAMBORADA",
      "OTB MEDIA LUNA",
      "OTB KHASA MAYU SAN SIMON",
      "JV SAN MIGUEL I",
      "JV CENTRAL SAN MIGUEL",
      "JV OLIMPICA",
      "JV VALLE DE SAN MIGUEL",
      "AGRARIO KHARA KHARA",
      "AGRARIO SAN MIGUEL",
      "OTB ALTO ARRUMANI",
  "OTB NUEVA BELEN",
  "JV NUEVO AMANECER ARRUMANI",
  "JV UNION PROGRESO ARRUMANI",
  "OTB 20 DE OCTUBRE MANANTIAL ARRUMANI",
  "OTB SAN SALVADOR ARRUMANI",
  "OTB SANTA ROSA DE LIMA CENTRAL NORTE",
  "JV 26 DE AGOSTO ARRUMANI",
  "OTB ALTO SAN JUAN DE DIOS",
  "OTB YURAJ JALLPHA",
  "JV ALTO COPACABANA ARRUMANI",
  "JV PAJCHA ARRUMANI",
  "JV KARA KARA",
  "16 DE JULIO",
  "ISLAS DEL SUR",
  "NUEVA INTEGRACION ARRUMANI",
  "OTB 20 DE OCTUBRE",
  "MERCADO 19 DE JULIO",
  "OTB NUEVO ARRUMANI",
  "OTB ALTO ANZALDO",
  "OTB 6 DE MARZO ARRUMANI",
  "OTB EL MIRADOR DE ARRUMANI",
  "JV UNION PROGRESO",
  "JV EL PALMAR ARRUMANI",
  "JV 3 DE AGOSTO ARRUMANI",
  "JV LAGUNILLAS DEL SUR ARRUMANI",
  "JV URKUPIÑA ARRUMANI",
  "JV ERAS PAMPILLA ARRUMANI",
  "JV CAJON PATA ARRUMANI",
  "JV JACARANDA ARRUMANI",
  "JV LOMAS DE ANZALDO ARRUMANI",
  "JV LAPHIA ARRUMANI",
  "JV RUMY PAMPA ARRUMANI",
  "JV LINDEROS DE ARRUMANI",
  "JV LOMAS DE ARRUMANI",
  "OTB ICHU KOLLU",
  "OTB PHALTA ORKO",
  "OTB 12 DE SEPTIEMBRE",
  "OTB CENTRAL ARRUMANI",
  "OTB ECOLOGICO ARRUMANI",
  "JV BAJO KARA KARA",
  "OTB NUEVA ESPERANZA 13 DE JUNIO",
  "OTB VILLA ROSARIO",
  "OTB LOS PINOS",
  "OTB VILLA FLORES",
  "JV CENTRAL KARA KARA SANTO DOMINGO",
  "OTB SAN MIGUEL SUD C",
  "OTB AGROMIN TAMBORADA",
  "OTB MEDIA LUNA",
  "OTB KHASA MAUYU II",
  "OTB ALTO HUERTA MAYU",
  "OTB CHAUPILOMA CENTRAL PED",
  "OTB 2 DE AGOSTO",
  "ALTO KARA KARA",
  "OTB 27 DE FEBRERO",
  "OTB VILLA LA CABAÑA",
  "JV BARRIO VELASCO",
  "JV CABAÑA VIOLETA",
  "JV CHAUPILOMA A",
  "JV CHAUPILOMA TANQUES",
  "JV LOMAS DE SAN MIGUEL",
  "OTB VILLA AROMA",
  "OTB UNION VILLA FLORIDA",
  "JV AQUERANA",
  "JV ALTO VILLCA FLORIDA",
  "JV ALTO LOMAS DEL VALLE",
  "JV ALTO ESPERANZA",
  "JV ALTO SALVADOR DEL SUR",
  "JV 14 DE AGOSTO",
  "OTB COMUNIDAD CAMPESINA KARA KARA",
  "SINDICATO AGRARIO ARRUMANI 'A'",
  "SUB CENTRAL AGRARIA CAMPESINA VALLE HERMOSO"
    ]
  };

  const db = getFirestore(app);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCisternas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cisternas"));
        const cisternasData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar por nombre ascendente

        setCisternas(cisternasData);
      } catch (error) {
        console.error("Error al obtener las cisternas:", error);
      }
    };

    fetchCisternas();
  }, [db]);

  // Manejar el cambio de distrito y filtrar OTBs
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrito(selectedDistrict);

    // Mapear distritos a claves numéricas y filtrar los OTBs
    const districtKey = parseInt(selectedDistrict.split(" ")[1]);
    const otbsInDistrict = distritosData[districtKey] || [];
    setFilteredOtbs(otbsInDistrict);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(`${fecha}T00:00:00`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      Swal.fire({
        title: "Error",
        text: "La fecha no puede ser anterior a la fecha actual.",
        icon: "error",
      });
      return;
    }

    if (hora >= horaFin) {
      Swal.fire({
        title: "Error",
        text: "La hora de llegada no puede ser posterior o igual a la hora de salida.",
        icon: "error",
      });
      return;
    }

    try {
      const timestampDate = Timestamp.fromDate(selectedDate);

      await addDoc(collection(db, "Schedule"), {
        date: timestampDate,
        hour: hora,
        nameotb: nombre,
        horaFin: horaFin,
        distrito: distrito,
        nombreCisterna: `${selectedCisterna} - ${cisternas.find(cisterna => cisterna.nombre === selectedCisterna).placa}`
      });

      Swal.fire({
        title: "Éxito",
        text: "OTB y horario registrados correctamente",
        icon: "success",
      });

      setNombre("");
      setFecha("");
      setHora("");
      setHoraFin("");
      setDistrito("");
      setSelectedCisterna(""); // Reinicia el campo de cisterna
      setFilteredOtbs([]); // Reinicia el campo de OTBs filtradas
    } catch (error) {
      console.error("Error al registrar la OTB: ", error);
      Swal.fire({
        title: "Error",
        text: "Error al registrar la OTB",
        icon: "error",
      });
    }
  };

  const goToList = () => {
    navigate('/listSchedules');
  };

  return (
    <div className="user-registration-page">
      <Sidebar /> {/* Agregar Sidebar aquí */}
      <div
        className="registro-page registro-body"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          position: 'relative'
        }}
      >
        <div className="full-page-container">
          <div className="register-container" style={{ marginTop: '80px' }}>
            <div className="register-card">
              <form onSubmit={handleSubmit} className="form">
                <h1 className="title">Asignación de Cisternas</h1>

                {/* Combo box para seleccionar el Distrito */}
                <div className="inp">
                  <select
                    name="distrito"
                    id="distrito"
                    className="input"
                    value={distrito}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="">Seleccione un Distrito</option>
                    {distritos.map((distrito, index) => (
                      <option key={index} value={distrito}>{distrito}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-building"></i>
                </div>

                {/* Combo box de OTBs filtradas según el Distrito */}
                <div className="inp">
                  <select
                    name="nombre"
                    id="nombre"
                    className="input"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una OTB</option>
                    {filteredOtbs.map((otb, index) => (
                      <option key={index} value={otb}>{otb}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-user"></i>
                </div>

                <div className="inp">
                  <input
                    type="date"
                    name="fecha"
                    id="fecha"
                    className="input"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                  <i className="fa-solid fa-calendar"></i>
                </div>

                <label htmlFor="hora">Hora de llegada</label>
                <div className="inp">
                  <input
                    type="time"
                    name="hora"
                    id="hora"
                    className="input"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                  <i className="fa-solid fa-clock"></i>
                </div>

                <label htmlFor="horaFin">Hora de salida</label>
                <div className="inp">
                  <input
                    type="time"
                    name="horaFin"
                    id="horaFin"
                    className="input"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    required
                  />
                  <i className="fa-solid fa-clock"></i>
                </div>

                {/* Combo box de cisternas */}
                <div className="inp">
                  <select
                    name="cisterna"
                    id="cisterna"
                    className="input"
                    value={selectedCisterna}
                    onChange={(e) => setSelectedCisterna(e.target.value)}
                    required
                  >
                    <option value="">Seleccione una cisterna</option>
                    {cisternas.map((cisterna) => (
                      <option key={cisterna.id} value={cisterna.nombre}>
                        {cisterna.nombre} - {cisterna.placa}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-truck"></i>
                </div>

                <button className="submit" type="submit">
                  Registrar OTB
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
