import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import "./auth.css";
import Home from "./Home";
import Create from "./Create";
import Edit from "./Edit";
import Login from "./Login";
import Signup from "./Signup";
import CompanyList from "./MyArray";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = JSON.parse(localStorage.getItem("currentUser"))?.isLoggedIn || false;
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.isLoggedIn) {
      setLoggedIn(true);
      setUsername(currentUser.username);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear current user
    localStorage.removeItem("currentUser");
    setLoggedIn(false);
    setUsername("");
    // Close menu on mobile if open
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🏢</span>
            <h1>Praveen BV's Company</h1>
          </div>
          
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className="menu-icon">{menuOpen ? '✕' : '☰'}</span>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'active' : ''}`}>
            <ul className="nav-links">
              {loggedIn ? (
                <>
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
                  <li className="user-nav-item">
                    <span className="username">
                      <span className="nav-icon">👤</span>
                      <span className="nav-text">{username}</span>
                    </span>
                  </li>
                  <li>
                    <button className="logout-btn" onClick={handleLogout}>
                      <span className="nav-icon">🚪</span>
                      <span className="nav-text">Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className={({isActive}) => isActive ? "active-link" : ""}>
                      <span className="nav-icon">🔑</span>
                      <span className="nav-text">Login</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/signup" className={({isActive}) => isActive ? "active-link" : ""}>
                      <span className="nav-icon">📝</span>
                      <span className="nav-text">Sign Up</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            } />
            <Route path="/edit" element={
              <ProtectedRoute>
                <Edit />
              </ProtectedRoute>
            } />
            <Route path="/list" element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            } />
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