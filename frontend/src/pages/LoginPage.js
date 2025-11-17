import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import '../styles/Auth.css';

const LoginPage = ({ onSwitchToRegister, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authService.login(email, password);
            login(data);
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
                <h1 className="auth-title">Sistema de Gestión Caprina</h1>
                <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Mensaje de error */}
                    {error && (
                        <div className="error-alert">
                            {error}
                        </div>
                    )}

                    {/* Campo Email */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">
                            USERNAME
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
                        />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            PASSWORD
                        </label>
                        <div className="password-container">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
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

                    {/* Botón Login */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'INGRESANDO...' : 'LOGIN'}
                    </button>

                    {/* Link Registro */}
                    <div className="auth-link">
                        <button
                            type="button"
                            onClick={onSwitchToRegister}
                        >
                            ¿No tienes cuenta? Regístrate aquí
                        </button>
                    </div>

                    {/* Link Forgot Password */}
                    {/* Link Forgot Password */}
                    <div className="forgot-link">
                        <button type="button" onClick={onForgotPassword}>
                            Forgot password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;