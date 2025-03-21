import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
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
  const isAuthenticated = localStorage.getItem("currentUser") ? 
    JSON.parse(localStorage.getItem("currentUser")).isLoggedIn : false;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  // Check authentication status
  const checkAuth = useCallback(() => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (userString) {
        const user = JSON.parse(userString);
        setIsAuthenticated(user.isLoggedIn === true);
        setUsername(user.username || "");
      } else {
        setIsAuthenticated(false);
        setUsername("");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setUsername("");
    }
  }, []);

  // Check login status on mount and when storage changes
  useEffect(() => {
    // Initial check
    checkAuth();
    
    // Set up event listener for storage events
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for our custom event
    window.addEventListener('authChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, [checkAuth]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear current user
    localStorage.removeItem("currentUser");
    
    // Update state
    setIsAuthenticated(false);
    setUsername("");
    
    // Close menu on mobile if open
    if (menuOpen) {
      setMenuOpen(false);
    }
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'));
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
              {isAuthenticated ? (
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
            {/* Redirect to login by default if no route matches */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <p>© {new Date().getFullYear()} Praveen BV's Company - All Rights Reserved</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;