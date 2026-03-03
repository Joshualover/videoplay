import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { VideoPage } from '@/pages/VideoPage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { UploadPage } from '@/pages/admin/UploadPage';
import { VideosPage } from '@/pages/admin/VideosPage';
import { TagsPage } from '@/pages/admin/TagsPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UploadPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
