import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RealTimeIndicator from '../RealTimeIndicator';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/attractions', label: 'Attractions', icon: '🎢' },
  { path: '/zones', label: 'Zones', icon: '🗺️' },
  { path: '/tickets', label: 'Tickets', icon: '🎟️' },
  { path: '/queues', label: 'Queue Management', icon: '⏱️' },
  { path: '/events', label: 'Events & Shows', icon: '🎭' },
  { path: '/promotions', label: 'Promotions', icon: '🏷️' },
  { path: '/users', label: 'Users', icon: '👥' },
  { path: '/staff', label: 'Staff Management', icon: '👔' },
  { path: '/roles', label: 'Roles & Permissions', icon: '🔐' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/reports', label: 'Reports', icon: '📋' },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/feedback', label: 'Customer Feedback', icon: '💬' },
  { path: '/audit', label: 'Audit Trail', icon: '📜' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <span className="text-xl font-bold">🎢 Theme Park</span>
        </div>
        <RealTimeIndicator />
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo - hidden on mobile since we have header */}
        <div className="hidden lg:block p-6 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">🎢 Theme Park</h1>
              <p className="text-sm text-gray-400 mt-1">Admin Portal</p>
            </div>
            <RealTimeIndicator />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors text-sm ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
