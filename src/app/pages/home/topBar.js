import '../../components/home/topbar.css';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../../app/assets/cochaLogo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../DashboardAdmin/AuthContext';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { currentUser } = useAuth();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 960) {
        setClick(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Condición para no mostrar el navbar si el usuario es Admin
  if (currentUser && currentUser.role === 'Admin') {
    return null; // No renderiza el navbar si es admin
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo alineado a la izquierda */}
        <a href="#" className="navbar-logo">
          <img src={logo} alt="logo" />
        </a>

        {/* Menú hamburguesa */}
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </div>

        {/* Links de navegación */}
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              Agua Solidaria
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/scheduleUser" className="nav-links" onClick={closeMobileMenu}>
              Calendario
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/MapDistritos" className="nav-links" onClick={closeMobileMenu}>
              Mapa de Cisternas
            </Link>
          </li>
          {currentUser && currentUser.role === 'Admin' && (
            <li className="nav-item">
              <Link to="/AssigmentReport" className="nav-links" onClick={closeMobileMenu}>
                Panel Administrativo
              </Link>
            </li>
          )}
          {!currentUser && (
            <li className="nav-item">
              <Link to="/Login" className="nav-links" onClick={closeMobileMenu}>
                Iniciar Sesión
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
