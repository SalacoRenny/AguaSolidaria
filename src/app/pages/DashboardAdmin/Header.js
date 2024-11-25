import React from 'react';
import { FiSearch, FiBell, FiSettings } from 'react-icons/fi';
import '../../components/admin/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="search-bar">
        <FiSearch />
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="header-icons">
        <FiBell className="icon" />
        <FiSettings className="icon" />
      </div>
    </header>
  );
}

export default Header;
