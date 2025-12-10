import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  GraduationCap,
  LogOut,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../../services/firebase';
import logo from '../../../assets/icons/logo.svg';
import pgIcon from '../../../assets/icons/pg.svg';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const { user, logout, deleteAccount, isGoogleUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    const isGoogle = isGoogleUser();
    
    if (!isGoogle && !deletePassword) {
      setDeleteError('Please enter your password');
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount(isGoogle ? undefined : deletePassword);
      navigate('/login');
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
    setDeletePassword('');
    setShowDeletePassword(false);
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
    <>
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

        {/* User Section with Logout & Delete */}
        <div className={`flex-shrink-0 p-3 border-t border-gray-200 ${isCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
          {isCollapsed ? (
            <>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="text-red-600" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Delete Account"
              >
                <Trash2 size={18} className="text-gray-400 hover:text-red-600" />
              </button>
            </>
          ) : (
            <>
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-lightest flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
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

              {/* Delete Account Button */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Account?
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              This action is <strong>permanent</strong> and cannot be undone. All your data will be permanently deleted.
            </p>

            {/* Password Input for Email users OR Google info */}
            {isGoogleUser() ? (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Google Account</p>
                    <p className="text-xs text-blue-600">You'll be asked to verify with Google</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showDeletePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {deleteError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || (!isGoogleUser() && !deletePassword)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isGoogleUser() ? (
                  <>
                    <Trash2 size={18} />
                    Verify & Delete
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
