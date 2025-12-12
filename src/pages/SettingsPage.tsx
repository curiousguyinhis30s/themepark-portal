import { useState } from 'react';
import {
  Building2,
  Clock,
  Mail,
  Phone,
  Zap,
  Users,
  Bell,
  Shield,
  Server,
  Plus,
  AlertTriangle,
  Save,
} from 'lucide-react';

function SettingToggle({ label, description, defaultChecked = false }: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
      </label>
    </div>
  );
}

function StatusIndicator({ status, label }: { status: 'online' | 'offline' | 'degraded'; label: string }) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-red-500',
    degraded: 'bg-amber-500',
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 ${statusColors[status]} rounded-full`} />
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

export default function SettingsPage() {
  const [parkName, setParkName] = useState('Adventure World Malaysia');
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('22:00');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage park settings and configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Park Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Park Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Park Name</label>
                <input
                  type="text"
                  value={parkName}
                  onChange={(e) => setParkName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Opening Time
                    </span>
                  </label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Closing Time
                    </span>
                  </label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Contact Email
                  </span>
                </label>
                <input
                  type="email"
                  defaultValue="help@adventureworld.my"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Contact Phone
                  </span>
                </label>
                <input
                  type="tel"
                  defaultValue="+60 3-8787 8787"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <button className="mt-6 flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          {/* Virtual Queue Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Virtual Queue Settings</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Enable Virtual Queue"
                description="Allow visitors to book queue slots"
                defaultChecked={true}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    Max Party Size
                  </span>
                </label>
                <input
                  type="number"
                  defaultValue={6}
                  min={1}
                  max={10}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Slot Duration (minutes)
                  </span>
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-3">
              <SettingToggle label="New ticket purchases" defaultChecked={true} />
              <SettingToggle label="Virtual queue bookings" defaultChecked={true} />
              <SettingToggle label="User registrations" defaultChecked={false} />
              <SettingToggle label="Low capacity alerts" defaultChecked={true} />
              <SettingToggle label="Daily summary email" defaultChecked={true} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-3">
              <StatusIndicator status="online" label="API Server" />
              <StatusIndicator status="online" label="Database" />
              <StatusIndicator status="online" label="Mobile App" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last checked</span>
                <span className="text-gray-900 font-medium">Just now</span>
              </div>
            </div>
          </div>

          {/* Admin Users */}
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Admin Users</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-semibold">
                  A
                </div>
                <div>
                  <p className="font-medium text-gray-900">Park Admin</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  O
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ops Manager</p>
                  <p className="text-sm text-gray-500">Operations</p>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors py-2 border border-teal-200 rounded-lg hover:bg-teal-50">
              <Plus className="w-4 h-4" />
              Add Admin User
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600 mb-4">
              These actions can affect park operations significantly.
            </p>
            <button className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors">
              Close Park Temporarily
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
