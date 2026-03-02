import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

// importation du contexte d'authentification
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// importation du Layout qui englobe toutes les pages privées
import Layout from './components/layout/Layout';

// importation de mes composants de pages
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
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
import NotFoundPage from './pages/NotFoundPage';

// création du composant app
const App = () => {
  useTheme();
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Pages publiques */}
        <Route path="/login" element={<LoginPage />} />

        {/* Pages privées - Protégées */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <Layout showSearch={false}>
              <ProductDetailPage /></Layout>
          </ProtectedRoute>}
        />
        <Route
          path="/cities"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <VillesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/publish"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <PublishPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <CategoriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <OrdersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <ClientsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout showSearch={false}>
                <NotFoundPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
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