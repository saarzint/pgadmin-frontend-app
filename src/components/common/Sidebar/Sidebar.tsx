import React, { useState } from 'react';
import {
  BookOpen,
  Compass,
  Search,
  FileText,
  DollarSign,
  Plane,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import logo from '../../../assets/icons/logo.svg';
import pgIcon from '../../../assets/icons/pg.svg';
import aiAssistantIcon from '../../../assets/icons/ai-assistant.svg';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <aside
      className={`h-screen bg-white flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative z-10 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className={`p-6 ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          {isCollapsed ? (
            <img src={pgIcon} alt="PG Logo" className="w-10 h-10" />
          ) : (
            <img src={logo} alt="PGadmit Logo" className="h-10" />
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className={`px-4 ${isCollapsed ? 'flex justify-center' : 'flex justify-end'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-gray-600" />
          ) : (
            <ChevronLeft size={20} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item.path)}
                className={`
                  w-full flex items-center rounded-lg
                  transition-all duration-200
                  ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3'}
                  ${
                    item.isActive
                      ? 'bg-primary-lightest text-primary-dark font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="text-left">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Counselor Section */}
      <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <button
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-200"
            style={{
              background: 'linear-gradient(90deg, #EF6B5C 0%, #E8506A 100%)',
            }}
            title="Ask AI Assistant"
          >
            <img src={aiAssistantIcon} alt="AI Assistant" className="w-5 h-5" />
          </button>
        ) : (
          <>
            {/* AI Counselor Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                <img src={aiAssistantIcon} alt="AI Assistant" className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-primary-darkest">AI Counselor</h3>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              Your personal study abroad guide
            </p>

            {/* CTA Button */}
            <button
              className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(90deg, #EF6B5C 0%, #E8506A 100%)',
              }}
            >
              <img src={aiAssistantIcon} alt="AI Assistant" className="w-5 h-5" />
              Ask AI Assistant
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
