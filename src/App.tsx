import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo } from 'react';
import DashboardPage from './pages/DashboardPage';
import InspectorsPage from './pages/InspectorsPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';

const ProtectedRoute = ({ children, requireAdmin }: { children: JSX.Element; requireAdmin?: boolean }) => {
  const { loading, session, profile } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="hero-font text-2xl">Loading Horizon Portal…</div>
      </div>
    );
  }

  if (!session || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const defaultDashboard = useMemo(
    () => (
      <ProtectedRoute>
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </ProtectedRoute>
    ),
    []
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inspectors"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InspectorsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ClientsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requireAdmin>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={defaultDashboard} />
    </Routes>
  );
}

export default App;
