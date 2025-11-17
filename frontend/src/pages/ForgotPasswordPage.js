import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-emoji">🐐</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="auth-title">¿Olvidaste tu contraseña?</h1>
        <p className="auth-subtitle">
          Ingresa tu email y te enviaremos instrucciones para recuperar tu cuenta
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Mensaje de error */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className="success-alert">
              <strong>¡Correo enviado!</strong>
              <br />
              Si el email existe en nuestro sistema, recibirás un correo con instrucciones 
              para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.
            </div>
          )}

          {/* Campo Email */}
          {!success && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="correo@ejemplo.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR INSTRUCCIONES'}
              </button>
            </>
          )}

          {/* Botón Volver al Login */}
          <div className="auth-link">
            <button
              type="button"
              onClick={onBackToLogin}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
            >
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;