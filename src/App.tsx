// QR Tracking route added
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import React, { Suspense } from 'react'

const DashboardOverview = React.lazy(() => import('./components/dashboard/DashboardOverview').then(m => ({ default: m.DashboardOverview })))
const MyGrievances = React.lazy(() => import('./components/dashboard/MyGrievances').then(m => ({ default: m.MyGrievances })))
const NewGrievance = React.lazy(() => import('./components/dashboard/NewGrievance').then(m => ({ default: m.NewGrievance })))
const SaarhtiiKeSath = React.lazy(() => import('@/components/dashboard/SaarhtiiKeSath').then(m => ({ default: m.SaarhtiiKeSath })))
const MyAppeals = React.lazy(() => import('./components/dashboard/MyAppeals').then(m => ({ default: m.MyAppeals })))
const ActivityLogs = React.lazy(() => import('./components/dashboard/ActivityLogs').then(m => ({ default: m.ActivityLogs })))
const EditProfile = React.lazy(() => import('./components/dashboard/EditProfile').then(m => ({ default: m.EditProfile })))
const ChangePassword = React.lazy(() => import('./components/dashboard/ChangePassword').then(m => ({ default: m.ChangePassword })))
const GrievanceDetail = React.lazy(() => import('./components/dashboard/GrievanceDetail').then(m => ({ default: m.GrievanceDetail })))
const FeedbackPage = React.lazy(() => import('./components/dashboard/FeedbackPage').then(m => ({ default: m.FeedbackPage })))
const GrievanceMap = React.lazy(() => import('./components/dashboard/GrievanceMap').then(m => ({ default: m.GrievanceMap })))
const GovDashboard = React.lazy(() => import('./pages/GovDashboard').then(m => ({ default: m.GovDashboard })))
const OfficerOverview = React.lazy(() => import('./components/dashboard/OfficerOverview').then(m => ({ default: m.OfficerOverview })))
const OfficerTasks = React.lazy(() => import('./components/dashboard/OfficerTasks').then(m => ({ default: m.OfficerTasks })))
const MinistryOverview = React.lazy(() => import('./components/dashboard/MinistryOverview').then(m => ({ default: m.MinistryOverview })))
const McOverview = React.lazy(() => import('./components/dashboard/McOverview').then(m => ({ default: m.McOverview })))
const MlaMPOverview = React.lazy(() => import('./components/dashboard/MlaMPOverview').then(m => ({ default: m.MlaMPOverview })))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const TrackGrievance = React.lazy(() => import('./pages/TrackGrievance').then(m => ({ default: m.TrackGrievance })))

function GovDashboardIndex() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<div className="p-8 text-center animate-pulse text-slate-400">Loading Dashboard...</div>}>
      {user?.role === 'ministry' && <MinistryOverview />}
      {user?.role === 'mp_mla' && <MlaMPOverview />}
      {user?.role === 'mc' && <McOverview />}
      {user?.role === 'officer' && <OfficerOverview />}
    </Suspense>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || 
                      location.pathname.startsWith('/gov-dashboard') ||
                      location.pathname.startsWith('/admin-dashboard');
  const isTrackingPage = location.pathname.startsWith('/track/');

  return (
    <div className="min-h-screen">
      {!isDashboard && !isTrackingPage && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/track/:id" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}><TrackGrievance /></Suspense>} />
          
          {/* Citizen Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['citizen']}><Dashboard /></ProtectedRoute>}>
            <Route index element={<Suspense fallback={<div>Loading...</div>}><DashboardOverview /></Suspense>} />
            <Route path="map" element={<Suspense fallback={<div>Loading map...</div>}><GrievanceMap /></Suspense>} />
            <Route path="my-grievances" element={<Suspense fallback={<div>Loading grievances...</div>}><MyGrievances /></Suspense>} />
            <Route path="grievances/:id" element={<Suspense fallback={<div>Loading...</div>}><GrievanceDetail /></Suspense>} />
            <Route path="new-grievance" element={<Suspense fallback={<div>Loading form...</div>}><NewGrievance /></Suspense>} />
            <Route path="saarhtii-ke-sath" element={<Suspense fallback={<div>Loading assistant...</div>}><SaarhtiiKeSath /></Suspense>} />
            <Route path="feedback" element={<Suspense fallback={<div>Loading feedback...</div>}><FeedbackPage /></Suspense>} />
            <Route path="my-appeals" element={<Suspense fallback={<div>Loading appeals...</div>}><MyAppeals /></Suspense>} />
            <Route path="activity-logs" element={<Suspense fallback={<div>Loading...</div>}><ActivityLogs /></Suspense>} />
            <Route path="edit-profile" element={<Suspense fallback={<div>Loading...</div>}><EditProfile /></Suspense>} />
            <Route path="change-password" element={<Suspense fallback={<div>Loading...</div>}><ChangePassword /></Suspense>} />
          </Route>

          {/* Government Dashboard Routes */}
          <Route path="/gov-dashboard" element={<ProtectedRoute allowedRoles={['officer', 'ministry', 'mp_mla', 'mc']}><Suspense fallback={<div>Loading Gov Dashboard...</div>}><GovDashboard /></Suspense></ProtectedRoute>}>
            <Route index element={<GovDashboardIndex />} />
            <Route path="analytics" element={<Suspense fallback={<div>Loading...</div>}><MinistryOverview /></Suspense>} />
            <Route path="heatmaps" element={<Suspense fallback={<div>Loading...</div>}><GrievanceMap /></Suspense>} />
            <Route path="sla" element={<Suspense fallback={<div>Loading...</div>}><OfficerTasks /></Suspense>} />
            <Route path="tasks/:id" element={<Suspense fallback={<div>Loading task...</div>}><GrievanceDetail /></Suspense>} />
            <Route path="logs" element={<Suspense fallback={<div>Loading logs...</div>}><ActivityLogs /></Suspense>} />
          </Route>
          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Suspense fallback={<div>Loading Admin Dashboard...</div>}><AdminDashboard /></Suspense></ProtectedRoute>} />
        </Routes>
      </main>
      {!isDashboard && !isTrackingPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
