import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

// importation du Layout qui englobe toutes les pages privées
import Layout from './components/layout/Layout';

// importation de mes composants de pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import VillesPage from './pages/VillesPage';
import NotificationsPage from './pages/NotificationsPage';
import PublishPage from './pages/PublishPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import ClientsPage from './pages/ClientsPage';


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
        <Route path="/products" element={<Layout showSearch={false}><ProductsPage /></Layout>} />
        <Route path="/cities" element={<Layout showSearch={false}><VillesPage /></Layout>} />
        <Route path="/notifications" element={<Layout showSearch={false}><NotificationsPage /></Layout>} />
        <Route path="/publish" element={<Layout showSearch={false}><PublishPage /></Layout>} />
        <Route path="/reports" element={<Layout showSearch={false}><ReportsPage /></Layout>} />
        <Route path="/settings" element={<Layout showSearch={false}><SettingsPage /></Layout>} />
        <Route path="/profile" element={<Layout showSearch={false}><ProfilePage /></Layout>} />
        <Route path="/categories" element={<Layout showSearch={false}><CategoriesPage /></Layout>} />
        <Route path="/orders" element={<Layout showSearch={false}><OrdersPage /></Layout>} />
        <Route path="/clients" element={<Layout showSearch={false}><ClientsPage /></Layout>} />

      </Routes>
    </>
  );
};

// rendu dans le dom principal
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
)
