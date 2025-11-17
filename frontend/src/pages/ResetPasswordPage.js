import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const ResetPasswordPage = ({ token, onBackToLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      try {
        const isValid = await authService.validateResetToken(token);
        setTokenValid(isValid);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setValidatingToken(false);
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras valida el token
  if (validatingToken) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-emoji">🐐</span>
            </div>
          </div>
          <h1 className="auth-title">Validando enlace...</h1>
          <p className="auth-subtitle">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  // Si el token no es válido
  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-emoji">🐐</span>
            </div>
          </div>
          <h1 className="auth-title">Enlace inválido o expirado</h1>
          <p className="auth-subtitle">
            Este enlace de recuperación no es válido o ha expirado. 
            Por favor, solicita uno nuevo.
          </p>
          <div className="auth-form">
            <button
              onClick={onBackToLogin}
              className="btn-primary"
            >
              VOLVER AL LOGIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si ya se cambió exitosamente
  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container">
            <div style={{ 
              width: '6rem', 
              height: '6rem', 
              backgroundColor: '#10b981', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={48} color="white" />
            </div>
          </div>
          <h1 className="auth-title">¡Contraseña actualizada!</h1>
          <p className="auth-subtitle">
            Tu contraseña ha sido cambiada exitosamente. 
            Serás redirigido al login en unos segundos...
          </p>
          <div className="auth-form">
            <button
              onClick={onBackToLogin}
              className="btn-primary"
            >
              IR AL LOGIN AHORA
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de nueva contraseña
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
        <h1 className="auth-title">Crear nueva contraseña</h1>
        <p className="auth-subtitle">
          Ingresa tu nueva contraseña para recuperar tu cuenta
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Mensaje de error */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Campo Nueva Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              NUEVA CONTRASEÑA
            </label>
            <div className="password-container">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Mínimo 6 caracteres"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Repite tu nueva contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          {/* Botón Cambiar Contraseña */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'CAMBIANDO CONTRASEÑA...' : 'CAMBIAR CONTRASEÑA'}
          </button>

          {/* Link Volver */}
          <div className="auth-link">
            <button
              type="button"
              onClick={onBackToLogin}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;