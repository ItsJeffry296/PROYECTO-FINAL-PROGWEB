import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../services/posts';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return setError('El contenido no puede estar vacío');
    }
    
    if (content.length > 500) {
      return setError('El post no puede tener más de 500 caracteres');
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await createPost(
        content,
        currentUser.uid,
        currentUser.email,
        userData?.nombre || currentUser.email.split('@')[0]
      );
      
      setContent('');
      setSuccess('¡Post publicado exitosamente!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Error publicando post:', error);
      setError('Error al publicar el post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-list">
      <h2>Crear Nueva Publicación</h2>
      
      {error && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '1rem',
          borderRadius: '5px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{
          background: '#c6f6d5',
          color: '#22543d',
          padding: '1rem',
          borderRadius: '5px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder=" Cuéntate algo..."
            rows="4"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
            maxLength="500"
            disabled={loading}
          />
          <div style={{ textAlign: 'right', fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>
            {content.length}/500 caracteres
          </div>
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}
