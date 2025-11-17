import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const RegisterPage = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            setSuccess(true);

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
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
                        {/* Opción 1: Si tienes el logo.svg en public/ */}
                        {/* <img src="/logo.svg" alt="Caprisoft Logo" /> */}

                        {/* Opción 2: Emoji temporal */}
                        <span className="logo-emoji">🐐</span>
                    </div>
                </div>

                {/* Título */}
                <h1 className="auth-title">Crear Cuenta Nueva</h1>
                <p className="auth-subtitle">Completa tus datos para registrarte</p>

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
                            ¡Registro exitoso! Redirigiendo al login...
                        </div>
                    )}

                    {/* Campo Nombre Completo */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="fullName">
                            NOMBRE COMPLETO
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Juan Pérez"
                            required
                            autoComplete="name"
                        />
                    </div>

                    {/* Campo Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            EMAIL
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="correo@ejemplo.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Campo Teléfono */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">
                            TELÉFONO (OPCIONAL)
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+57 300 123 4567"
                            autoComplete="tel"
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            CONTRASEÑA
                        </label>
                        <div className="password-container">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
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
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Repite tu contraseña"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Botón Registro */}
                    <button
                        type="submit"
                        disabled={loading || success}
                        className="btn-primary"
                    >
                        {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
                    </button>

                    {/* Link Login */}
                    <div className="auth-link">
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;