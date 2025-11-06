import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Search,
  FileText,
  DollarSign,
  Plane,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Building2,
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
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BookOpen size={18} />,
      path: '/dashboard',
      isActive: activeItem === 'dashboard',
    },
    {
      id: 'discovery',
      label: 'Discovery & Exploration',
      icon: <Compass size={18} />,
      path: '/discovery',
      isActive: activeItem === 'discovery',
    },
    {
      id: 'research',
      label: 'Research & Shortlisting',
      icon: <Search size={18} />,
      path: '/research',
      isActive: activeItem === 'research',
    },
    {
      id: 'universities',
      label: 'Universities & Programs',
      icon: <Building2 size={18} />,
      path: '/universities',
      isActive: activeItem === 'universities',
    },
    {
      id: 'applications',
      label: 'Applications & Admissions',
      icon: <FileText size={18} />,
      path: '/applications',
      isActive: activeItem === 'applications',
    },
    {
      id: 'scholarships',
      label: 'Scholarships & Financial Aid',
      icon: <DollarSign size={18} />,
      path: '/scholarships',
      isActive: activeItem === 'scholarships',
    },
    {
      id: 'visa',
      label: 'Visa & Pre-Departure',
      icon: <Plane size={18} />,
      path: '/visa',
      isActive: activeItem === 'visa',
    },
    {
      id: 'ai-chat',
      label: 'AI Chat',
      icon: <MessageSquare size={18} />,
      path: '/ai-chat',
      isActive: activeItem === 'ai-chat',
    },
  ];

  return (
    <aside
      className={`h-screen bg-white flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.15)] relative z-10 transition-all duration-300 ${isCollapsed ? 'w-18' : 'w-72'
        }`}
    >
      {/* Header */}
      <div className={`p-4 ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          {isCollapsed ? (
            <img src={pgIcon} alt="PG Logo" className="w-8 h-8" />
          ) : (
            <img src={logo} alt="PGadmit Logo" className="h-8" />
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <div className={`px-3 ${isCollapsed ? 'flex justify-center' : 'flex justify-end'}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-gray-600" />
          ) : (
            <ChevronLeft size={18} className="text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`
                  w-full flex items-center rounded-lg text-sm
                  transition-all duration-200
                  ${isCollapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2'}
                  ${item.isActive
                    ? 'bg-primary-lightest text-primary-dark font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="text-left">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Counselor Section */}
      <div className={`p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        {isCollapsed ? (
          <Link
            to="/ai-chat"
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-[1.05] transition-all duration-200"
            style={{
              background: 'linear-gradient(90deg, #EF6B5C 0%, #E8506A 100%)',
            }}
            title="Ask AI Assistant"
          >
            <img src={aiAssistantIcon} alt="AI Assistant" className="w-4 h-4" />
          </Link>
        ) : (
          <>
            {/* AI Counselor Header */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <img src={aiAssistantIcon} alt="AI Assistant" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-primary-darkest">AI Counselor</h3>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 mb-2.5">
              Your personal study abroad guide
            </p>

            {/* CTA Button */}
            <Link
              to="/ai-chat"
              className="w-full text-white font-semibold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl hover:scale-[1.02] text-sm"
              style={{
                background: 'linear-gradient(90deg, #EF6B5C 0%, #E8506A 100%)',
              }}
            >
              <img src={aiAssistantIcon} alt="AI Assistant" className="w-4 h-4" />
              Ask AI Assistant
            </Link>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
