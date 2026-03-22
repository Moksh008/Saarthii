import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { MyGrievances } from './components/dashboard/MyGrievances';
import { NewGrievance } from './components/dashboard/NewGrievance';
import { MyAppeals } from './components/dashboard/MyAppeals';
import { ActivityLogs } from './components/dashboard/ActivityLogs';
import { EditProfile } from './components/dashboard/EditProfile';
import { ChangePassword } from './components/dashboard/ChangePassword';
import { GrievanceDetail } from './components/dashboard/GrievanceDetail';
import { GrievanceMap } from './components/dashboard/GrievanceMap';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen">
      {!isDashboard && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="map" element={<GrievanceMap />} />
            <Route path="my-grievances" element={<MyGrievances />} />
            <Route path="grievances/:id" element={<GrievanceDetail />} />
            <Route path="new-grievance" element={<NewGrievance />} />
            <Route path="my-appeals" element={<MyAppeals />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
