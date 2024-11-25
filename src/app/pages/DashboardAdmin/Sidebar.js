import React from 'react';
import '../../components/admin/Sidebar.css';
import logo from '../../assets/cochaLogo.png'; // Importa la imagen desde assets
import { Link } from 'react-router-dom';
import { auth } from '../../Tools/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Sidebar() {
  const navigate = useNavigate();

  // Función para cerrar sesión con confirmación de SweetAlert2
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Cerrarás tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await auth.signOut();
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate('/login'); // Redirige al login
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión. Inténtalo nuevamente.',
          icon: 'error',
        });
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        {/* Reemplazamos el texto "Panel" por la imagen */}
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      <nav>
        <ul>
          <li className='nav-item'>
            <Link to='/registroOTB' className='nav-links'>
              Asignaciones
            </Link>
          </li>  
          <li className='nav-item'>
            <Link to='/listSchedules' className='nav-links'>
              Lista de Horarios
            </Link>
          </li>    
          <li className='nav-item'>
            <Link to='/Assigment' className='nav-links'>
              Cisternas
            </Link>
          </li>             
          <li className='nav-item'>
            <Link to='/AssigmentReport' className='nav-links'>
              Reportes
            </Link>
          </li>
          <li className='nav-item'>
            <Link to='/Complaints' className='nav-links'>
              Quejas y Reclamos
            </Link>
          </li>
        </ul>
      </nav>
      {/* Botón de cerrar sesión */}
      <div className="nav-item">
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
