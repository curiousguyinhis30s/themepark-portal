import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import { AuthProvider, useAuth, UserRole } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { PageLoader } from './components/ui/LoadingStates';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttractionsPage from './pages/AttractionsPage';
import TicketsPage from './pages/TicketsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import RolesPage from './pages/RolesPage';
import QueuesPage from './pages/QueuesPage';
import ZonesPage from './pages/ZonesPage';
import EventsPage from './pages/EventsPage';
import MaintenancePage from './pages/MaintenancePage';
import PromotionsPage from './pages/PromotionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ReportsPage from './pages/ReportsPage';
import StaffPage from './pages/StaffPage';
import FeedbackPage from './pages/FeedbackPage';
import Layout from './components/Layout';

// Merchant pages
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import StoreSettingsPage from './pages/StoreSettingsPage';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles specified
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                {/* Shared routes - all roles */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Merchant-only routes */}
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['merchant']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute allowedRoles={['merchant']}>
                      <ProductsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store-settings"
                  element={
                    <ProtectedRoute allowedRoles={['merchant']}>
                      <StoreSettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin-only routes */}
                <Route
                  path="/attractions"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AttractionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/zones"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ZonesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <StaffPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <RolesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <EventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/maintenance"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <MaintenancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audit"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AuditTrailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin + Staff routes */}
                <Route
                  path="/queues"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                      <QueuesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                      <FeedbackPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin + Merchant routes */}
                <Route
                  path="/promotions"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'merchant']}>
                      <PromotionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'merchant']}>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'merchant']}>
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <WebSocketProvider>
              <App />
            </WebSocketProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
