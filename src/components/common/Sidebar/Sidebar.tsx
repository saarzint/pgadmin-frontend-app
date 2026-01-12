import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
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
  GraduationCap,
  LogOut,
  Coins
} from 'lucide-react';
import { useAuth, useProfile } from '../../../services/supabase';
import logo from '../../../assets/icons/logo.svg';
import pgIcon from '../../../assets/icons/pg.svg';
import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/config';

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
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['visa']);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const { user, logout } = useAuth();
  const { profileId } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) return;

    const fetchTokenBalance = async () => {
      try {
        const response = await apiClient.get<{ user_profile_id: number; token_balance: number }>(
          API_ENDPOINTS.TOKENS.BALANCE(profileId)
        );
        if (typeof response?.token_balance === 'number') {
          setTokenBalance(response.token_balance);
        }
      } catch (error) {
        console.warn('Could not fetch token balance for sidebar:', error);
      }
    };

    fetchTokenBalance();

    // Refresh periodically so nav stays roughly live
    const intervalId = setInterval(fetchTokenBalance, 60_000); // 60s
    return () => clearInterval(intervalId);
  }, [profileId]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

      {/* Token Balance */}
      {typeof tokenBalance === 'number' && (
        <div className={`px-3 mt-2 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <div
              className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-md"
              title={`${tokenBalance} tokens available`}
            >
              <Coins className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {tokenBalance > 99 ? '99+' : tokenBalance}
              </span>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/60 p-3">
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-amber-700/80 uppercase tracking-wide">Token Balance</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">
                      {tokenBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    Available
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 min-h-0 p-3 overflow-y-auto">
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
                // Menu item with onClick handler
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

      {/* User Section with Logout */}
      <div className={`flex-shrink-0 p-3 border-t border-gray-200 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {isCollapsed ? (
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 transition-colors"
            title="Logout"
          >
            <LogOut size={18} className="text-red-600" />
          </button>
        ) : (
          <>
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-lightest flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <User size={20} className="text-primary-dark" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
