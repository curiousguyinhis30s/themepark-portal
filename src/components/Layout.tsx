import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import RealTimeIndicator from './RealTimeIndicator';
import {
  LayoutDashboard,
  Ticket,
  FerrisWheel,
  Map,
  Clock,
  CalendarDays,
  Tags,
  Users,
  UserCog,
  Shield,
  BarChart3,
  FileText,
  Wrench,
  Bell,
  MessageSquare,
  ScrollText,
  Settings,
  ShoppingCart,
  Package,
  Store,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
}

// Navigation items with role-based access
const navItems: NavItem[] = [
  // Shared routes
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'merchant', 'staff'] },

  // Merchant-only routes
  { path: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['merchant'] },
  { path: '/products', label: 'Products', icon: Package, roles: ['merchant'] },
  { path: '/store-settings', label: 'Store Settings', icon: Store, roles: ['merchant'] },

  // Admin-only routes
  { path: '/attractions', label: 'Attractions', icon: FerrisWheel, roles: ['admin'] },
  { path: '/zones', label: 'Zones', icon: Map, roles: ['admin'] },
  { path: '/tickets', label: 'Tickets', icon: Ticket, roles: ['admin'] },
  { path: '/queues', label: 'Queue Management', icon: Clock, roles: ['admin', 'staff'] },
  { path: '/events', label: 'Events & Shows', icon: CalendarDays, roles: ['admin'] },
  { path: '/promotions', label: 'Promotions', icon: Tags, roles: ['admin', 'merchant'] },
  { path: '/users', label: 'Users', icon: Users, roles: ['admin'] },
  { path: '/staff', label: 'Staff Management', icon: UserCog, roles: ['admin'] },
  { path: '/roles', label: 'Roles & Permissions', icon: Shield, roles: ['admin'] },

  // Shared analytics/reports
  { path: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'merchant'] },
  { path: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'merchant'] },

  // Admin-only system routes
  { path: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['admin'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'merchant', 'staff'] },
  { path: '/feedback', label: 'Customer Feedback', icon: MessageSquare, roles: ['admin', 'staff'] },
  { path: '/audit', label: 'Audit Trail', icon: ScrollText, roles: ['admin'] },

  // Settings for all
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'merchant', 'staff'] },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user && item.roles.includes(user.role)
  );

  const getRoleBadge = () => {
    if (!user) return null;
    const roleLabels: Record<UserRole, { label: string; color: string }> = {
      admin: { label: 'Admin', color: 'bg-primary text-primary-foreground' },
      merchant: { label: 'Merchant', color: 'bg-amber-500 text-white' },
      staff: { label: 'Staff', color: 'bg-blue-500 text-white' },
    };
    const { label, color } = roleLabels[user.role];
    return (
      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', color)}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FerrisWheel className="w-5 h-5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-semibold text-foreground">Theme Park</h1>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Real-time indicator */}
        {sidebarOpen && (
          <div className="px-4 py-2 border-b border-border">
            <RealTimeIndicator />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground">{user?.name}</p>
                <div className="flex items-center gap-2">
                  {getRoleBadge()}
                </div>
              </div>
            )}
          </div>

          {sidebarOpen && user?.businessName && (
            <div className="mt-3 p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Business</p>
              <p className="text-sm font-medium truncate">{user.businessName}</p>
              {user.location && (
                <p className="text-xs text-muted-foreground truncate">{user.location}</p>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            className={cn(
              'w-full mt-3 text-destructive hover:text-destructive hover:bg-destructive/10',
              !sidebarOpen && 'px-0'
            )}
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <FerrisWheel className="w-5 h-5 text-primary" />
            <span className="font-semibold">Theme Park</span>
          </div>
          <div className="w-9" /> {/* Spacer for alignment */}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 lg:px-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
