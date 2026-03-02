import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorAutenticacion, useAuth } from './context/AuthContext';
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
import InformacionPersonalPage from './pages/InformacionPersonalPage';
import FormasDeGanarPage from './pages/FormasDeGanarPage';
import ReglesInversionPage from './pages/ReglesInversionPage';
import ReferralRegistry from './components/ReferralRegistry';

function RutaProtegida({ element }: { element: React.ReactNode }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return usuario ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mi-perfil" element={<RutaProtegida element={<MyProfile />} />} />
          <Route path="/niveles" element={<RutaProtegida element={<Niveles />} />} />
          <Route path="/tareas" element={<RutaProtegida element={<Tareas />} />} />
          <Route path="/referidos" element={<RutaProtegida element={<Referidos />} />} />
          <Route path="/recargas" element={<RutaProtegida element={<Recargas />} />} />
          <Route path="/pago-qr" element={<RutaProtegida element={<PaymentQRPage />} />} />
          <Route path="/confirmacion" element={<RutaProtegida element={<ConfirmationPage />} />} />
          <Route path="/retiros" element={<RutaProtegida element={<Retiros />} />} />
          <Route path="/registro-recargas" element={<RutaProtegida element={<RegistroRecargas />} />} />
          <Route path="/registro-retiros" element={<RutaProtegida element={<RegistroRetiros />} />} />
          <Route path="/cuenta-bancaria" element={<RutaProtegida element={<CuentaBancaria />} />} />
          <Route path="/mi-equipo" element={<RutaProtegida element={<MiEquipo />} />} />
          <Route path="/about" element={<RutaProtegida element={<About />} />} />
          <Route path="/informacion-personal" element={<RutaProtegida element={<InformacionPersonalPage />} />} />
          <Route path="/formas-de-ganar" element={<RutaProtegida element={<FormasDeGanarPage />} />} />
          <Route path="/regles-inversion" element={<RutaProtegida element={<ReglesInversionPage />} />} />
        </Routes>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}

export default App;
