import { useState, useEffect } from 'react';
import { getFirestore, collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import ReactPaginate from 'react-paginate';
import { Clock, MapPin, Truck, User, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import app from '../../Tools/firebaseConfig.js';
import Sidebar from './Sidebar'; // Asume que ya tienes un componente Sidebar
import styles from '../../components/admin/reportAssigment.css';

const AnimatedCisternName = ({ name }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Truck
        className={`${styles.icon} transition-transform duration-300 ease-in-out ${animate ? 'translate-x-2' : ''}`}
      />
      <span
        className={`font-bold text-indigo-600 transition-all duration-300 ease-in-out ${animate ? 'scale-110' : ''}`}
      >
        {name}
      </span>
    </div>
  );
};

export default function ReportTableView() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const reportsPerPage = 10;
  const db = getFirestore(app);

  const fetchReports = async () => {
    try {
      const scheduleRef = collection(db, "Schedule");
      const reportQuery = query(scheduleRef, orderBy("date"), limit(reportsPerPage * 5));

      const querySnapshot = await getDocs(reportQuery);

      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        const [cisternName, cisternPlate] = (docData.nombreCisterna || ' - ').split(" - ");

        return {
          date: docData.date.toDate().toLocaleString(),
          district: docData.distrito || 'No disponible',
          endTime: docData.horaFin || 'No disponible',
          startTime: docData.hour || 'No disponible',
          otb: docData.nameotb || 'No disponible',
          cisternName: cisternName.trim(),
          cisternPlate: cisternPlate ? cisternPlate.trim() : 'No disponible',
        };
      });

      setReports(data);
      setFilteredReports(data);
      setPageCount(Math.ceil(data.length / reportsPerPage));
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
      Swal.fire("Error", "Hubo un problema al obtener los reportes", "error");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter((report) =>
      Object.values(report).some(
        (value) =>
          value &&
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredReports(filtered);
    setPageCount(Math.ceil(filtered.length / reportsPerPage));
  }, [searchTerm, reports]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="background">
          <div className="container mx-auto p-4 bg-white bg-opacity-90 shadow-xl rounded-lg max-h-full overflow-y-auto">
            <div className="text-2xl font-bold text-center text-indigo-700">
              Reportes de Cisternas
            </div>
            <div className="mb-4 flex items-center">
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${styles.searchInput} p-2 border border-gray-300 rounded`}
              />
            </div>

            <div className="overflow-x-auto mt-9">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Fecha y Hora</th>
                    <th className="px-4 py-2">Distrito</th>
                    <th className="px-4 py-2">Hora Inicio</th>
                    <th className="px-4 py-2">Hora Fin</th>
                    <th className="px-4 py-2">OTB</th>
                    <th className="px-4 py-2">Cisterna</th>
                    <th className="px-4 py-2">Placa</th>
                  </tr>
                </thead>
                <tbody>
  {filteredReports
    .filter((report) => report.cisternName !== "No disponible" && report.cisternPlate !== "No disponible") // Filtra cisternas disponibles
    .slice(
      currentPage * reportsPerPage,
      (currentPage + 1) * reportsPerPage
    )
    .map((report, index) => (
      <tr key={index}>
        <td className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <Clock className={styles.icon} />
            <span>{report.date}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <MapPin className={styles.icon} />
            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
              {report.district}
            </span>
          </div>
        </td>
        <td className="px-4 py-2">{report.startTime}</td>
        <td className="px-4 py-2">{report.endTime}</td>
        <td className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <User className={styles.icon} />
            <span>{report.otb}</span>
          </div>
        </td>
        <td className="px-4 py-2">
          <AnimatedCisternName name={report.cisternName} />
        </td>
        <td className="px-4 py-2">
          <div className="flex items-center space-x-2">
            <span>{report.cisternPlate}</span>
          </div>
        </td>
      </tr>
    ))}
</tbody>

              </table>
            </div>

            <ReactPaginate
              previousLabel="Anterior"
              nextLabel="Siguiente"
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName="pagination flex justify-center mt-4"
              activeClassName="bg-indigo-500 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
