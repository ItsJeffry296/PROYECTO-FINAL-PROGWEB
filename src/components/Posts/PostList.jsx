import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPosts } from '../../services/posts';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
      setError('');
    } catch (error) {
      console.error('Error cargando posts:', error);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    } else {
      return postDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="post-list">
        <h2>Publicaciones Recientes</h2>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div className="loading-spinner"></div>
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="post-list">
        <h2>Publicaciones Recientes</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {posts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            color: '#94a3b8',
            border: '2px dashed rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            margin: '2rem 0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📝</div>
            <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No hay publicaciones todavía</p>
            <p style={{ fontSize: '1rem', opacity: 0.7 }}>
              ¡Sé el primero en compartir algo increíble! 🎉
            </p>
          </div>
        ) : (
          <div>
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-user-info">
                    <div className="post-avatar">
                      {post.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="post-user-details">
                      <div className="post-username">
                        {post.userName || 'Usuario'}
                      </div>
                      <div className="post-date">
                        📅 {formatDate(post.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  {post.content}
                </div>
                
                <div className="post-footer">
                  <div className="post-actions">
                    <button className="post-action-button">
                      👍 Me gusta ({post.likes || 0})
                    </button>
                    <button className="post-action-button">
                      💬 Comentar ({post.comments?.length || 0})
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={loadPosts} 
          className="auth-button"
          style={{ 
            marginTop: '2rem',
            width: '100%',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
          }}
          disabled={loading}
        >
          {loading ? '🔄 Actualizando...' : '🔄 Actualizar Publicaciones'}
        </button>
      </div>

      {/* MENSAJE SIMPLE PARA USUARIOS NO AUTENTICADOS */}
      {!currentUser && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '1rem'
        }}>
          <p>
            Para publicar nuevos posts necesitas{' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: '500' }}>
              iniciar sesión
            </Link>
            {' '}o{' '}
            <Link to="/register" style={{ color: '#10b981', fontWeight: '500' }}>
              registrarte
            </Link>{' '}
            si aún no tienes cuenta.
          </p>
        </div>
      )}
    </>
  );
}
