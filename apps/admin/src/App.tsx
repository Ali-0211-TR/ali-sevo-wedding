import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/login/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import GuestsPage from './pages/guests/GuestsPage';
import InvitationsPage from './pages/invitations/InvitationsPage';
import EventsPage from './pages/events/EventsPage';
import PagesListPage from './pages/pages/PagesListPage';
import PageEditorPage from './pages/pages/PageEditorPage';
import BlogPage from './pages/blog/BlogPage';
import MediaPage from './pages/media/MediaPage';
import SettingsPage from './pages/settings/SettingsPage';
import UsersPage from './pages/users/UsersPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/guests" element={<GuestsPage />} />
                <Route path="/invitations" element={<InvitationsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/pages" element={<PagesListPage />} />
                <Route path="/pages/:id" element={<PageEditorPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/media" element={<MediaPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
