import { useState } from 'react';
import './App.css';
import { Dashboard } from './pages';
import { Sidebar } from './components';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const handleNavigation = (path: string) => {
    // Extract page name from path
    const page = path.replace('/', '');
    setActivePage(page);
    console.log('Navigating to:', page);
    // TODO: Implement routing logic here
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeItem={activePage} onNavigate={handleNavigation} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
