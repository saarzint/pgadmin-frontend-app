import React from 'react';
import {
  BookOpen,
  Compass,
  Search,
  FileText,
  DollarSign,
  Plane,
  Sparkles,
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onNavigate }) => {
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BookOpen size={20} />,
      path: '/dashboard',
      isActive: activeItem === 'dashboard',
    },
    {
      id: 'discovery',
      label: 'Discovery & Exploration',
      icon: <Compass size={20} />,
      path: '/discovery',
      isActive: activeItem === 'discovery',
    },
    {
      id: 'research',
      label: 'Research & Shortlisting',
      icon: <Search size={20} />,
      path: '/research',
      isActive: activeItem === 'research',
    },
    {
      id: 'applications',
      label: 'Applications & Admissions',
      icon: <FileText size={20} />,
      path: '/applications',
      isActive: activeItem === 'applications',
    },
    {
      id: 'scholarships',
      label: 'Scholarships & Financial Aid',
      icon: <DollarSign size={20} />,
      path: '/scholarships',
      isActive: activeItem === 'scholarships',
    },
    {
      id: 'visa',
      label: 'Visa & Pre-Departure',
      icon: <Plane size={20} />,
      path: '/visa',
      isActive: activeItem === 'visa',
    },
  ];

  const handleItemClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <aside className="h-screen w-80 bg-primary-darkest text-white flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-primary-darkest font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold">PGadmit</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    item.isActive
                      ? 'bg-neutral-gray bg-opacity-40 text-white font-medium'
                      : 'text-gray-300 hover:bg-neutral-gray hover:bg-opacity-20 hover:text-white'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-left">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Counselor Section */}
      <div className="p-4">
        <div className="bg-opacity-50 rounded-xl p-4">
          {/* AI Counselor Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Sparkles size={18} className="text-primary-darkest" />
            </div>
            <h3 className="text-lg font-bold">AI Counselor</h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-4">
            Your personal study abroad guide
          </p>

          {/* CTA Button */}
          <button
            className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(90deg, #EF6B5C 0%, #E8506A 100%)',
            }}
          >
            <Sparkles size={18} />
            Ask AI Assistant
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
