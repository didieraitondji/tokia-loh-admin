import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

// importation du Layout qui englobe toutes les pages privées
import Layout from './components/layout/Layout';

// importation de mes composants de pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// importation du hooks de gestion du thème
import useTheme from './hooks/useTheme';

// création du composant app
const App = () => {
  useTheme();
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages publiques */}
        <Route path="/login" element={<LoginPage />} />

        {/* Pages privées */}
        <Route path="/dashboard" element={<Layout showSearch={false}><DashboardPage /></Layout>} />

      </Routes>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
)
