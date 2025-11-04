import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { Dashboard, AIChat, Scholarships } from './pages';
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
          <Route path="/ai-chat" element={<AIChat />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
