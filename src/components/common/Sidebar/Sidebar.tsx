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
  User,
  LayoutGrid,
  BookOpenText,
  Globe,
  Bell,
  ChevronDown,
  ChevronUp,
  GraduationCap
} from 'lucide-react';
import logo from '../../../assets/icons/logo.svg';
import pgIcon from '../../../assets/icons/pg.svg';
import aiAssistantIcon from '../../../assets/icons/ai-assistant.svg';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  isActive?: boolean;
  subItems?: SubMenuItem[];
  onClick?: () => void;
}

interface SidebarProps {
  activeItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['visa']); // 'visa' expanded by default

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BookOpen size={18} />,
      path: '/dashboard',
      isActive: activeItem === 'dashboard',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User size={18} />,
      path: '/profile',
      isActive: activeItem === 'profile',
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
      id: 'application-requirements',
      label: 'Applications Requirements',
      icon: <FileText size={18} />,
      path: '/application-requirements',
      isActive: activeItem === 'application-requirements',
    },
    {
      id: 'admissions-counselor',
      label: 'Admissions Counselor',
      icon: <GraduationCap size={18} />,
      path: '/admissions-counselor',
      isActive: activeItem === 'admissions-counselor',
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
      label: 'Visa',
      icon: <Plane size={18} />,
      isActive: ['visa-agent', 'visa-center', 'visa-alerts'].includes(activeItem),
      subItems: [
        {
          id: 'visa-agent',
          label: 'Visa Agent',
          icon: <Globe size={16} />,
          path: '/visa-agent',
          isActive: activeItem === 'visa-agent',
        },
        {
          id: 'visa-center',
          label: 'Visa Center',
          icon: <FileText size={16} />,
          path: '/visa-center',
          isActive: activeItem === 'visa-center',
        },
        {
          id: 'visa-alerts',
          label: 'Visa Alerts',
          icon: <Bell size={16} />,
          path: '/visa-alerts',
          isActive: activeItem === 'visa-alerts',
        },
      ],
    },
    {
      id: 'resources',
      label: 'Additional Resources',
      icon: <LayoutGrid size={18} />,
      path: '/resources',
      isActive: activeItem === 'resources',
    },
    {
      id: 'essay',
      label: 'Essay Center',
      icon: <BookOpenText size={18} />,
      path: '/essay-center',
      isActive: activeItem === 'essay-center',
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
              {item.subItems ? (
                // Menu item with submenu
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`
                      w-full flex items-center rounded-lg text-sm
                      transition-all duration-200
                      ${isCollapsed ? 'justify-center px-2 py-2' : 'gap-2.5 px-3 py-2 justify-between'}
                      ${item.isActive
                        ? 'bg-primary-lightest text-primary-dark font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && <span className="text-left">{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <span className="flex-shrink-0">
                        {expandedMenus.includes(item.id) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Submenu items */}
                  {!isCollapsed && expandedMenus.includes(item.id) && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            to={subItem.path}
                            className={`
                              w-full flex items-center rounded-lg text-sm
                              transition-all duration-200 gap-2.5 px-3 py-2
                              ${subItem.isActive
                                ? 'bg-primary-lightest text-primary-dark font-semibold'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              }
                            `}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span className="text-left">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : item.onClick ? (
                // Menu item with onClick handler (e.g., AI Chat)
                <button
                  onClick={item.onClick}
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
                </button>
              ) : (
                // Regular menu item with path
                <Link
                  to={item.path!}
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
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Counselor Section - Commented out */}
      {/*
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
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <img src={aiAssistantIcon} alt="AI Assistant" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-primary-darkest">AI Counselor</h3>
            </div>
            <p className="text-xs text-gray-600 mb-2.5">
              Your personal study abroad guide
            </p>
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
      */}
    </aside>
  );
};

export default Sidebar;
