import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const [view, setView] = useState('login');
  const [resetToken, setResetToken] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      setResetToken(token);
      setView('reset-password');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  switch (view) {
    case 'register':
      return <RegisterPage onSwitchToLogin={() => setView('login')} />;
    
    case 'forgot-password':
      return <ForgotPasswordPage onBackToLogin={() => setView('login')} />;
    
    case 'reset-password':
      return (
        <ResetPasswordPage 
          token={resetToken} 
          onBackToLogin={() => {
            setView('login');
            setResetToken(null);
            window.history.pushState({}, '', '/');
          }} 
        />
      );
    
    default:
      return (
        <LoginPage 
          onSwitchToRegister={() => setView('register')}
          onForgotPassword={() => setView('forgot-password')}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;