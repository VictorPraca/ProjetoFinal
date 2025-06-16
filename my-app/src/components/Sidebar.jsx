import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css'; 

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={toggleSidebar}>
        X
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>Home</Link>
          </li>
          <li>
            <Link to="/communities" onClick={toggleSidebar}>Comunidades</Link> 
          </li>
          <li>
            <Link to="/messages" onClick={toggleSidebar}>Mensagens</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;