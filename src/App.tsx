import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import MyProfile from './pages/MyProfile';
import Niveles from './pages/Niveles';
import Tareas from './pages/Tareas';
import Referidos from './pages/Referidos';
import Recargas from './pages/Recargas';
import PaymentQRPage from './pages/PaymentQRPage';
import ConfirmationPage from './pages/ConfirmationPage';
import Retiros from './pages/Retiros';
import RegistroRecargas from './pages/RegistroRecargas';
import RegistroRetiros from './pages/RegistroRetiros';
import CuentaBancaria from './pages/CuentaBancaria';
import MiEquipo from './pages/MiEquipo';
import About from './pages/About';
import ReferralRegistry from './components/ReferralRegistry';

function ProtectedRoute({ element }: { element: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return user ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mi-perfil" element={<ProtectedRoute element={<MyProfile />} />} />
          <Route path="/niveles" element={<ProtectedRoute element={<Niveles />} />} />
          <Route path="/tareas" element={<ProtectedRoute element={<Tareas />} />} />
          <Route path="/referidos" element={<ProtectedRoute element={<Referidos />} />} />
          <Route path="/recargas" element={<ProtectedRoute element={<Recargas />} />} />
          <Route path="/pago-qr" element={<ProtectedRoute element={<PaymentQRPage />} />} />
          <Route path="/confirmacion" element={<ProtectedRoute element={<ConfirmationPage />} />} />
          <Route path="/retiros" element={<ProtectedRoute element={<Retiros />} />} />
          <Route path="/registro-recargas" element={<ProtectedRoute element={<RegistroRecargas />} />} />
          <Route path="/registro-retiros" element={<ProtectedRoute element={<RegistroRetiros />} />} />
          <Route path="/cuenta-bancaria" element={<ProtectedRoute element={<CuentaBancaria />} />} />
          <Route path="/mi-equipo" element={<ProtectedRoute element={<MiEquipo />} />} />
          <Route path="/about" element={<ProtectedRoute element={<About />} />} />
          <Route path="/registro-referidos" element={<ProtectedRoute element={<ReferralRegistry />} />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
