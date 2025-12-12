import { useState, useMemo } from 'react';
import {
  DollarSign,
  Users,
  Ticket,
  Clock,
  TrendingUp,
  Download,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { attractions } from '../data/attractions';
import { zones } from '../data/zones';
import { ticketTypes } from '../data/tickets';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

function StatCard({ title, value, icon, iconBg = 'bg-gray-100', change, changeType = 'neutral', subtitle }: StatCardProps) {
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
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('today');

  // Calculate stats from real data
  const stats = useMemo(() => {
    const openAttractions = attractions.filter((a) => a.status === 'open');
    const avgWaitTime = openAttractions.length > 0
      ? Math.round(openAttractions.reduce((sum, a) => sum + a.waitTime, 0) / openAttractions.length)
      : 0;

    const totalRides = attractions.reduce((sum, a) => sum + (a.stats?.dailyRiders || 0), 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.currentVisitors, 0);

    // Calculate ticket revenue
    const ticketRevenue = ticketTypes.reduce((sum, t) => sum + (t.sales.today * t.price), 0);
    const ticketsSold = ticketTypes.reduce((sum, t) => sum + t.sales.today, 0);

    return {
      avgWaitTime,
      totalRides,
      totalCapacity,
      ticketRevenue,
      ticketsSold,
      openAttractions: openAttractions.length,
    };
  }, []);

  const hourlyVisitors = [
    { hour: '9AM', count: 234 },
    { hour: '10AM', count: 567 },
    { hour: '11AM', count: 891 },
    { hour: '12PM', count: 1234 },
    { hour: '1PM', count: 1456 },
    { hour: '2PM', count: 1678 },
    { hour: '3PM', count: 1543 },
    { hour: '4PM', count: 1321 },
    { hour: '5PM', count: 987 },
    { hour: '6PM', count: 654 },
    { hour: '7PM', count: 432 },
    { hour: '8PM', count: 234 },
  ];

  const weeklyTrend = [
    { day: 'Mon', revenue: 22450, visitors: 2134 },
    { day: 'Tue', revenue: 24680, visitors: 2456 },
    { day: 'Wed', revenue: 26890, visitors: 2789 },
    { day: 'Thu', revenue: 25430, visitors: 2567 },
    { day: 'Fri', revenue: 31250, visitors: 3245 },
    { day: 'Sat', revenue: 42890, visitors: 4521 },
    { day: 'Sun', revenue: 38760, visitors: 3987 },
  ];

  const revenueByCategory = [
    { name: 'Tickets', amount: stats.ticketRevenue, color: 'bg-teal-500' },
    { name: 'Food & Beverage', amount: 5670, color: 'bg-emerald-500' },
    { name: 'Merchandise', amount: 2890, color: 'bg-purple-500' },
    { name: 'Games', amount: 1440, color: 'bg-amber-500' },
  ];

  const formatCurrency = (amount: number) => `RM ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive park performance insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          title="Total Revenue"
          value={formatCurrency(stats.ticketRevenue + 5670 + 2890 + 1440)}
          change="+13.2%"
          changeType="positive"
          subtitle="vs yesterday"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
          title="Total Visitors"
          value={stats.totalCapacity.toLocaleString()}
          change="+12.3%"
          changeType="positive"
          subtitle="vs yesterday"
        />
        <StatCard
          icon={<Ticket className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-50"
          title="Tickets Sold"
          value={stats.ticketsSold.toLocaleString()}
          subtitle={`${ticketTypes.filter(t => t.category === 'admission').length} admission passes`}
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
          title="Avg. Wait Time"
          value={`${stats.avgWaitTime} min`}
          change="-5 min"
          changeType="positive"
          subtitle="across all attractions"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Visitors Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Visitor Traffic by Hour</h3>
          </div>
          <div className="h-64 flex items-end gap-2">
            {hourlyVisitors.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-teal-500 rounded-t-sm hover:bg-teal-600 transition-colors"
                  style={{ height: `${(item.count / 1700) * 100}%` }}
                  title={`${item.count} visitors`}
                />
                <span className="text-xs text-gray-500 mt-2 -rotate-45">{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Revenue Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Weekly Revenue Trend</h3>
          </div>
          <div className="h-64 flex items-end gap-4">
            {weeklyTrend.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center">
                <div className="w-full space-y-1">
                  <div
                    className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-colors"
                    style={{ height: `${(item.revenue / 45000) * 200}px` }}
                    title={`RM ${item.revenue.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.day}</span>
                <span className="text-xs font-semibold text-gray-700">
                  {(item.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Distribution & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Visitor Distribution by Zone</h3>
          </div>
          <div className="space-y-4">
            {zones.map((zone) => {
              const percentage = Math.round((zone.currentVisitors / stats.totalCapacity) * 100);
              return (
                <div key={zone.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{zone.name}</span>
                    <span className="text-gray-500">{zone.currentVisitors} ({percentage}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Revenue by Category</h3>
          </div>
          <div className="space-y-4">
            {revenueByCategory.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${cat.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{cat.name}</span>
                    <span className="font-semibold">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: `${(cat.amount / 20000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-xl">
                {formatCurrency(revenueByCategory.reduce((a, b) => a + b.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Most Popular Attraction</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {attractions.sort((a, b) => (b.stats?.dailyRiders || 0) - (a.stats?.dailyRiders || 0))[0]?.name || 'N/A'}
          </p>
          <p className="text-gray-500 mt-1">{stats.totalRides.toLocaleString()} total rides today</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600">68.4%</p>
          <p className="text-gray-500 mt-1">Tickets to actual visits</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Avg. Spend per Visitor</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">RM 87.60</p>
          <div className="flex items-center gap-1 mt-1 text-emerald-600">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">+12% from last week</span>
          </div>
        </div>
      </div>
    </div>
  );
}
