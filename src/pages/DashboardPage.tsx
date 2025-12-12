import { useMemo } from 'react';
import {
  Ticket,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Megaphone,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Radio,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { attractions } from '@themepark/shared';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  iconBg?: string;
}

function StatCard({ title, value, icon, change, changeType = 'neutral', iconBg = 'bg-gray-100' }: StatCardProps) {
  const changeStyles = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  const ChangeIcon = changeType === 'positive' ? ArrowUpRight : changeType === 'negative' ? ArrowDownRight : null;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${changeStyles[changeType]}`}>
            {ChangeIcon && <ChangeIcon className="w-4 h-4" />}
            {change}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-gray-500 mt-1 text-sm">{title}</p>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left w-full group"
    >
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
        {icon}
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );
}

function ActivityItem({ time, text, icon }: { time: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-700 text-sm truncate">{text}</p>
        <p className="text-gray-400 text-xs">{time}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Mock park status - no API needed
  const parkStatus = {
    status: {
      openAttractions: 16,
      totalAttractions: 18,
      averageWaitTime: 24,
      crowdLevel: 'moderate',
      closeTime: '23:00',
    }
  };
  const isLoading = false;

  const status = parkStatus?.status;

  // Calculate stats from attractions data
  const stats = useMemo(() => {
    const openAttractions = attractions.filter((a) => a.status === 'open');
    const avgWaitTime = openAttractions.length > 0
      ? Math.round(openAttractions.reduce((sum, a) => sum + a.waitTime, 0) / openAttractions.length)
      : 0;
    return {
      openAttractions: openAttractions.length,
      totalAttractions: attractions.length,
      avgWaitTime,
    };
  }, []);

  const recentActivity = [
    { time: '2 min ago', text: 'Ticket #TK2847 validated at Gate A', type: 'ticket' },
    { time: '5 min ago', text: 'Dragon Coaster wait time updated to 25 min', type: 'wait' },
    { time: '12 min ago', text: 'New user registration: john@example.com', type: 'user' },
    { time: '18 min ago', text: 'Virtual queue booking for Space Launch', type: 'queue' },
    { time: '25 min ago', text: 'Family Pack ticket purchased (RM 350)', type: 'purchase' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <Ticket className="w-4 h-4 text-teal-600" />;
      case 'wait': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'user': return <Users className="w-4 h-4 text-blue-600" />;
      case 'queue': return <Zap className="w-4 h-4 text-purple-600" />;
      case 'purchase': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default: return <CheckCircle2 className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-100 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="h-12 w-12 bg-gray-100 rounded-xl mb-4" />
              <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Zap className="w-6 h-6 text-teal-600" />}
          iconBg="bg-teal-50"
          title="Open Attractions"
          value={status?.openAttractions || stats.openAttractions}
          change={`of ${status?.totalAttractions || stats.totalAttractions}`}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
          title="Avg Wait Time"
          value={`${status?.averageWaitTime || stats.avgWaitTime} min`}
          change="-5 min"
          changeType="positive"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Crowd Level"
          value={status?.crowdLevel || 'Moderate'}
        />
        <StatCard
          icon={<Ticket className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          title="Tickets Sold Today"
          value="247"
          change="+12%"
          changeType="positive"
        />
      </div>

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon={<Clock className="w-5 h-5 text-teal-600" />}
              label="Update Wait Times"
            />
            <QuickActionButton
              icon={<Megaphone className="w-5 h-5 text-amber-600" />}
              label="Send Announcement"
            />
            <QuickActionButton
              icon={<Ticket className="w-5 h-5 text-blue-600" />}
              label="Validate Ticket"
            />
            <QuickActionButton
              icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
              label="Report Issue"
            />
          </div>
        </div>

        {/* Park Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Park Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-medium text-emerald-700">Park is Open</span>
              </div>
              <span className="text-emerald-600 text-sm">Until {status?.closeTime || '8:00 PM'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-gray-600">Weather</span>
              </div>
              <span className="font-medium text-gray-900">28°C Sunny</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-teal-500" />
                <span className="text-gray-600">Virtual Queue</span>
              </div>
              <span className="font-medium text-emerald-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        <div className="space-y-1">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              time={activity.time}
              text={activity.text}
              icon={getActivityIcon(activity.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
