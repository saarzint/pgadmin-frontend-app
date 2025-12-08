import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { Dashboard, AIChat, Scholarships, Universities, Profile, AdditionalResources, EssayCenter, VisaCenter, VisaAgent, VisaAlerts, ApplicationRequirements, AdmissionsCounselor, Login, Register } from './pages';
import { Sidebar, ProtectedRoute } from './components';
import { useAuth } from './services/firebase';

function AppLayout() {
  const location = useLocation();
  const activePage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeItem={activePage} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resources" element={<AdditionalResources />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/essay-center" element={<EssayCenter />} />
          <Route path="/visa-agent" element={<VisaAgent />} />
          <Route path="/visa-center" element={<VisaCenter />} />
          <Route path="/visa-alerts" element={<VisaAlerts />} />
          <Route path="/application-requirements" element={<ApplicationRequirements />} />
          <Route path="/admissions-counselor" element={<AdmissionsCounselor />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-darkest via-primary-dark to-primary">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected Routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
