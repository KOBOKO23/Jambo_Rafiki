import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const HomePage = lazy(() => import('./pages/Home').then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('./pages/About').then((module) => ({ default: module.AboutPage })));
const ProgramsPage = lazy(() => import('./pages/Programs').then((module) => ({ default: module.ProgramsPage })));
const GalleryPage = lazy(() => import('./pages/Gallery').then((module) => ({ default: module.GalleryPage })));
const GetInvolvedPage = lazy(() => import('./pages/GetInvolved').then((module) => ({ default: module.GetInvolvedPage })));
const ContactPage = lazy(() => import('./pages/Contact').then((module) => ({ default: module.ContactPage })));
const DonationPage = lazy(() => import('./pages/Donations').then((module) => ({ default: module.DonationPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLogin').then((module) => ({ default: module.AdminLoginPage })));
const AdminForbiddenPage = lazy(() => import('./pages/AdminForbidden').then((module) => ({ default: module.AdminForbiddenPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.DashboardPage })));

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donations" element={<DonationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense
            fallback={
              <main className="min-h-screen flex items-center justify-center px-4 py-24 text-gray-500">
                Loading page...
              </main>
            }
          >
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/forbidden" element={<AdminForbiddenPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<PublicLayout />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}
