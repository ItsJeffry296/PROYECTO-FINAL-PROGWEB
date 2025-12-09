import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            🗨️ Muro Interactivo
          </Link>
        </div>
        
        <div>
          {currentUser ? (
            <>
              <span style={{ marginRight: '1rem', color: '#4a5568' }}>
                Hola, {userData?.nombre || currentUser.email.split('@')[0]}
              </span>
              <Link to="/create" style={{ marginRight: '1rem', color: '#4a5568' }}>
                Nuevo Post
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  background: '#fc8181',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem', color: '#4a5568' }}>
                Iniciar Sesión
              </Link>
              <Link to="/register" style={{
                background: '#667eea',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                textDecoration: 'none'
              }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
