import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotesPage } from './pages/NotesPage';
import { CreateNotePage } from './pages/CreateNotePage';
import { NoteViewPage } from './pages/NoteViewPage';
import { EditNotePage } from './pages/EditNotePage';
import { SetupPage } from './pages/SetupPage';
import { isSupabaseConfigured } from './lib/supabase';

function App() {
  // Show setup page if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SetupPage />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <CreateNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/edit"
            element={
              <ProtectedRoute>
                <EditNotePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
