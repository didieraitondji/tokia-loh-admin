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
import PublishPage from './pages/ProfilePage';
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
        <Route path="/products" element={<Layout showSearch={true}><ProductsPage /></Layout>} />
        <Route path="/cities" element={<Layout showSearch={true}><VillesPage /></Layout>} />
        <Route path="/notifications" element={<Layout showSearch={true}><NotificationsPage /></Layout>} />
        <Route path="/publish" element={<Layout showSearch={true}><PublishPage /></Layout>} />
        <Route path="/reports" element={<Layout showSearch={true}><ReportsPage /></Layout>} />
        <Route path="/settings" element={<Layout showSearch={true}><SettingsPage /></Layout>} />
        <Route path="/profile" element={<Layout showSearch={true}><ProfilePage /></Layout>} />
        <Route path="/categories" element={<Layout showSearch={true}><CategoriesPage /></Layout>} />
        <Route path="/orders" element={<Layout showSearch={true}><OrdersPage /></Layout>} />
        <Route path="/clients" element={<Layout showSearch={true}><ClientsPage /></Layout>} />

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
