import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Create from "./Create";
import Edit from "./Edit";
import CompanyList from "./MyArray";

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            <h1>Company Portal</h1>
          </div>
          
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className="menu-icon">{menuOpen ? '✕' : '☰'}</span>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({isActive}) => isActive ? "active-link" : ""}>
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Home</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/create" className={({isActive}) => isActive ? "active-link" : ""}>
                  <span className="nav-icon">➕</span>
                  <span className="nav-text">Create</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/edit" className={({isActive}) => isActive ? "active-link" : ""}>
                  <span className="nav-icon">✏️</span>
                  <span className="nav-text">Edit</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/list" className={({isActive}) => isActive ? "active-link" : ""}>
                  <span className="nav-icon">📋</span>
                  <span className="nav-text">Company List</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/list" element={<CompanyList />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} Company Portal - All Rights Reserved</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;