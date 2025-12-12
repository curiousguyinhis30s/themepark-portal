import { useState, useMemo } from 'react';
import {
  Bell,
  Send,
  Megaphone,
  AlertTriangle,
  Tag,
  Settings,
  AlertCircle,
  Calendar,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  Clock,
  Eye,
  MousePointer,
  Plus,
  X,
  FileText,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'promotion' | 'system' | 'emergency';
  channel: string[];
  targetAudience: string;
  scheduledAt: string | null;
  sentAt: string | null;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  opened: number;
  clicked: number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Park Closing Early Today',
    message: 'Due to weather conditions, the park will close at 6 PM today. All guests are advised to plan accordingly.',
    type: 'alert',
    channel: ['push', 'email', 'sms'],
    targetAudience: 'All Visitors Today',
    scheduledAt: null,
    sentAt: '2024-12-12 14:30',
    status: 'sent',
    recipients: 3247,
    opened: 2891,
    clicked: 1234,
  },
  {
    id: '2',
    title: 'Flash Sale: 30% Off Express Passes',
    message: 'Limited time offer! Get 30% off Express Passes for the next 2 hours. Use code FLASH30 at checkout.',
    type: 'promotion',
    channel: ['push', 'email'],
    targetAudience: 'App Users',
    scheduledAt: null,
    sentAt: '2024-12-12 12:00',
    status: 'sent',
    recipients: 15420,
    opened: 8934,
    clicked: 2341,
  },
  {
    id: '3',
    title: 'New Year Special Events',
    message: 'Ring in 2025 at Theme Park! Special fireworks, live music, and exclusive treats. Book your tickets now!',
    type: 'announcement',
    channel: ['push', 'email'],
    targetAudience: 'All Subscribers',
    scheduledAt: '2024-12-25 09:00',
    sentAt: null,
    status: 'scheduled',
    recipients: 45000,
    opened: 0,
    clicked: 0,
  },
  {
    id: '4',
    title: 'Dragon Coaster Reopening',
    message: 'Great news! Dragon Coaster is back online after maintenance. Come enjoy the ride!',
    type: 'announcement',
    channel: ['push'],
    targetAudience: 'Current Visitors',
    scheduledAt: null,
    sentAt: '2024-12-12 11:15',
    status: 'sent',
    recipients: 2145,
    opened: 1876,
    clicked: 567,
  },
  {
    id: '5',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance on booking system from 2 AM - 4 AM tomorrow. Online bookings will be unavailable.',
    type: 'system',
    channel: ['email'],
    targetAudience: 'All Users',
    scheduledAt: '2024-12-12 20:00',
    sentAt: null,
    status: 'scheduled',
    recipients: 50000,
    opened: 0,
    clicked: 0,
  },
];

const templates = [
  { id: '1', name: 'Park Closure', type: 'alert', message: 'The park will close at {time} today due to {reason}.' },
  { id: '2', name: 'Attraction Update', type: 'announcement', message: '{attraction} is now {status}.' },
  { id: '3', name: 'Flash Sale', type: 'promotion', message: 'Limited time: {discount}% off {product}! Use code {code}.' },
  { id: '4', name: 'Event Reminder', type: 'announcement', message: "Don't miss {event} starting at {time} at {location}!" },
];

function getTypeStyle(type: string) {
  switch (type) {
    case 'announcement':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
    case 'alert':
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' };
    case 'promotion':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' };
    case 'system':
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
    case 'emergency':
      return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'announcement':
      return <Megaphone className="w-5 h-5" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5" />;
    case 'promotion':
      return <Tag className="w-5 h-5" />;
    case 'system':
      return <Settings className="w-5 h-5" />;
    case 'emergency':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'sent':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'scheduled':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'draft':
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
    case 'failed':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'scheduled' | 'drafts'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const stats = useMemo(() => {
    const sentNotifications = mockNotifications.filter((n) => n.status === 'sent');
    const totalSent = sentNotifications.reduce((sum, n) => sum + n.recipients, 0);
    const totalOpened = sentNotifications.reduce((sum, n) => sum + n.opened, 0);
    const totalClicked = sentNotifications.reduce((sum, n) => sum + n.clicked, 0);
    const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
    const avgClickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    const scheduledCount = mockNotifications.filter((n) => n.status === 'scheduled').length;

    return { totalSent, avgOpenRate, avgClickRate, scheduledCount };
  }, []);

  const filteredNotifications = mockNotifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'sent') return n.status === 'sent';
    if (activeTab === 'scheduled') return n.status === 'scheduled';
    if (activeTab === 'drafts') return n.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Center</h1>
          <p className="text-gray-500 mt-1">Send and manage communications to guests and staff</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Sent (30d)</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.avgOpenRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Avg. Open Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledCount}</p>
              <p className="text-sm text-gray-500">Scheduled</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <MousePointer className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgClickRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Click-through Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Templates</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {templates.map((template) => {
            const style = getTypeStyle(template.type);
            return (
              <button
                key={template.id}
                onClick={() => setShowCreateModal(true)}
                className="flex-shrink-0 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={style.icon}>{getTypeIcon(template.type)}</span>
                  <span className="font-medium text-gray-900">{template.name}</span>
                </div>
                <p className="text-xs text-gray-500 max-w-xs truncate">{template.message}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {(['all', 'sent', 'scheduled', 'drafts'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}{' '}
            {tab !== 'all' &&
              `(${
                mockNotifications.filter((n) =>
                  tab === 'sent'
                    ? n.status === 'sent'
                    : tab === 'scheduled'
                      ? n.status === 'scheduled'
                      : n.status === 'draft'
                ).length
              })`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const typeStyle = getTypeStyle(notification.type);
          const statusStyle = getStatusStyle(notification.status);

          return (
            <div
              key={notification.id}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedNotification(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${typeStyle.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className={typeStyle.icon}>{getTypeIcon(notification.type)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                        {notification.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {notification.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4" />
                        {notification.channel.join(', ')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {notification.targetAudience}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {notification.sentAt
                          ? `Sent: ${notification.sentAt}`
                          : notification.scheduledAt
                            ? `Scheduled: ${notification.scheduledAt}`
                            : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                {notification.status === 'sent' && (
                  <div className="text-right flex-shrink-0">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{notification.recipients.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Sent</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-600">
                          {((notification.opened / notification.recipients) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">Opened</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          {((notification.clicked / notification.recipients) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">Clicked</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create Notification</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Write your message..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="announcement">Announcement</option>
                    <option value="alert">Alert</option>
                    <option value="promotion">Promotion</option>
                    <option value="system">System</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>All Users</option>
                    <option>Current Visitors</option>
                    <option>App Users</option>
                    <option>Season Pass Holders</option>
                    <option>Staff Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                <div className="flex gap-4">
                  {[
                    { name: 'Push Notification', icon: <Bell className="w-4 h-4" /> },
                    { name: 'Email', icon: <Mail className="w-4 h-4" /> },
                    { name: 'SMS', icon: <Smartphone className="w-4 h-4" /> },
                    { name: 'In-App', icon: <MessageSquare className="w-4 h-4" /> },
                  ].map((channel) => (
                    <label
                      key={channel.name}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input type="checkbox" className="rounded text-teal-600" />
                      <span className="text-gray-500">{channel.icon}</span>
                      <span className="text-sm">{channel.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Schedule (optional)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Save as Draft
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
