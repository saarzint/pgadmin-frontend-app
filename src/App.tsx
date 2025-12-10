import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { Dashboard, AIChat, Scholarships, Universities, Profile, AdditionalResources, EssayCenter, VisaCenter, VisaAgent, VisaAlerts, ApplicationRequirements, AdmissionsCounselor, Login, Register, ForgotPassword, VerifyEmail } from './pages';
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #A9C7FF 0%, #8DF8E7 50%, #A9C7FF 100%)' }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: 'rgba(169, 199, 255, 0.4)' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" style={{ backgroundColor: 'rgba(141, 248, 231, 0.4)' }}></div>
        <div className="animate-spin w-10 h-10 border-4 border-[#030287] border-t-transparent rounded-full relative z-10"></div>
      </div>
    );
  }

  // Helper to determine redirect destination
  const getRedirectPath = () => {
    if (!user) return '/login';
    if (!user.emailVerified) return '/verify-email';
    return '/dashboard';
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        user ? (
          user.emailVerified ? <Navigate to="/dashboard" /> : <Navigate to="/verify-email" />
        ) : <Login />
      } />
      <Route path="/register" element={
        user ? (
          user.emailVerified ? <Navigate to="/dashboard" /> : <Navigate to="/verify-email" />
        ) : <Register />
      } />
      <Route path="/forgot-password" element={
        user ? <Navigate to={getRedirectPath()} /> : <ForgotPassword />
      } />
      
      {/* Email Verification Route - requires user but not verification */}
      <Route path="/verify-email" element={
        !user ? (
          <Navigate to="/login" />
        ) : user.emailVerified ? (
          <Navigate to="/dashboard" />
        ) : (
          <VerifyEmail />
        )
      } />
      
      {/* Protected Routes - requires user AND verified email */}
      <Route path="/*" element={
        !user ? (
          <Navigate to="/login" />
        ) : !user.emailVerified ? (
          <Navigate to="/verify-email" />
        ) : (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )
      } />
    </Routes>
  );
}

export default App;
