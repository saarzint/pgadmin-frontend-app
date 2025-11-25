import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Dashboard, AIChat, Scholarships, Universities, Profile, AdditionalResources, EssayCenter, VisaCenter, VisaAgent, VisaAlerts, ApplicationRequirements } from './pages';
import { Sidebar } from './components';

function App() {
  const location = useLocation();

  // Extract the active page from the current path
  const activePage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem={activePage} />

      {/* Main Content */}
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
