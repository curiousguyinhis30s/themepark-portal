import { useState, useMemo } from 'react';
import {
  Clock,
  Users,
  Ticket,
  Zap,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  XCircle,
  CheckCircle2,
  Timer,
  BarChart3,
  ChevronDown,
  X,
  Settings2,
  AlertTriangle,
} from 'lucide-react';
import { attractions, type Attraction } from '../data/attractions';
import { zones } from '../data/zones';
import { StatCard } from '../components/ui';

function getStatusBadge(status: Attraction['status']) {
  switch (status) {
    case 'open': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
    case 'closed': return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> };
    case 'maintenance': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Settings2 className="w-3.5 h-3.5" /> };
    case 'weather_closed': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
  }
}

function getWaitTimeColor(wait: number) {
  if (wait === 0) return 'text-gray-400';
  if (wait <= 15) return 'text-emerald-600';
  if (wait <= 30) return 'text-teal-600';
  if (wait <= 45) return 'text-amber-600';
  return 'text-red-600';
}

function getWaitTimeBg(wait: number) {
  if (wait === 0) return 'bg-gray-50';
  if (wait <= 15) return 'bg-emerald-50';
  if (wait <= 30) return 'bg-teal-50';
  if (wait <= 45) return 'bg-amber-50';
  return 'bg-red-50';
}

function getZoneName(zoneId: string) {
  const zone = zones.find((z) => z.id === zoneId);
  return zone?.name || 'Unknown';
}

export default function QueuesPage() {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [filterZone, setFilterZone] = useState('all');
  const [filterVQ, setFilterVQ] = useState('all');

  // Get attractions with queues (not shows)
  const queueAttractions = useMemo(() => {
    return attractions.filter((a) => a.type !== 'show');
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const openAttractions = queueAttractions.filter((a) => a.status === 'open');
    const vqEnabled = queueAttractions.filter((a) => a.virtualQueueEnabled);
    const avgWaitTime = openAttractions.length > 0
      ? Math.round(openAttractions.reduce((sum, a) => sum + a.waitTime, 0) / openAttractions.length)
      : 0;
    const totalDailyRiders = queueAttractions.reduce((sum, a) => sum + a.stats.dailyRiders, 0);

    return {
      totalAttractions: queueAttractions.length,
      openCount: openAttractions.length,
      vqCount: vqEnabled.length,
      avgWaitTime,
      totalDailyRiders,
    };
  }, [queueAttractions]);

  // Filter attractions
  const filteredAttractions = useMemo(() => {
    return queueAttractions.filter((a) => {
      const matchesZone = filterZone === 'all' || a.zoneId === filterZone;
      const matchesVQ = filterVQ === 'all' ||
        (filterVQ === 'enabled' && a.virtualQueueEnabled) ||
        (filterVQ === 'disabled' && !a.virtualQueueEnabled);
      return matchesZone && matchesVQ;
    });
  }, [queueAttractions, filterZone, filterVQ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage virtual queues across the park</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            Refresh All
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            <PauseCircle className="w-4 h-4" />
            Pause All VQ
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Ticket className="w-5 h-5 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.totalDailyRiders.toLocaleString()}
          label="Riders Today"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          value={`${stats.avgWaitTime} min`}
          label="Avg. Wait Time"
          valueColor="text-amber-600"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          value={stats.vqCount}
          label="VQ Enabled"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          value={stats.openCount}
          label="Open Attractions"
          valueColor="text-blue-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-sm text-gray-500">Filter:</span>
          <div className="relative">
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Zones</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterVQ}
              onChange={(e) => setFilterVQ(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Queues</option>
              <option value="enabled">VQ Enabled</option>
              <option value="disabled">VQ Disabled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredAttractions.length} of {queueAttractions.length} attractions
        </div>
      </div>

      {/* Queue Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAttractions.map((attraction) => {
          const statusBadge = getStatusBadge(attraction.status);
          const waitColor = getWaitTimeColor(attraction.waitTime);
          const waitBg = getWaitTimeBg(attraction.waitTime);

          return (
            <div
              key={attraction.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{attraction.name}</h3>
                    <p className="text-sm text-gray-500">{getZoneName(attraction.zoneId)}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                    {statusBadge.icon}
                    {attraction.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Wait Times */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`text-center p-3 rounded-xl ${waitBg}`}>
                    <p className={`text-3xl font-bold ${waitColor}`}>
                      {attraction.status === 'open' ? attraction.waitTime : '-'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Current Wait (min)</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-3xl font-bold text-gray-600">
                      {attraction.status === 'open' ? attraction.standbyWait : '-'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Standby Wait (min)</p>
                  </div>
                </div>

                {/* Virtual Queue Info */}
                {attraction.virtualQueueEnabled ? (
                  <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-teal-600" />
                        <span className="text-sm font-medium text-teal-700">Virtual Queue</span>
                      </div>
                      <span className="text-xs text-teal-600 font-medium">
                        {attraction.stats.dailyRiders.toLocaleString()} riders today
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-teal-700">{attraction.capacity}</p>
                        <p className="text-xs text-teal-600">Hourly Cap</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-teal-700">{attraction.duration}m</p>
                        <p className="text-xs text-teal-600">Duration</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-teal-700">{attraction.stats.satisfactionScore}%</p>
                        <p className="text-xs text-teal-600">Satisfaction</p>
                      </div>
                    </div>
                    {/* Capacity bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-teal-600 mb-1">
                        <span>Daily Capacity</span>
                        <span>{Math.round((attraction.stats.dailyRiders / (attraction.capacity * 12)) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-teal-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (attraction.stats.dailyRiders / (attraction.capacity * 12)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <XCircle className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Virtual Queue not enabled</p>
                    <button className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium">
                      Enable Virtual Queue
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAttraction(attraction);
                      setShowAdjustModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    <Timer className="w-4 h-4" />
                    Adjust Times
                  </button>
                  <button className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    {attraction.status === 'open' ? (
                      <PauseCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Throughput Footer */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <span>Throughput: {attraction.capacity}/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{attraction.stats.breakdowns} breakdowns (30d)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAttractions.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No attractions found</h3>
          <p className="text-gray-500">Try adjusting your filter criteria</p>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedAttraction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Adjust Wait Times</h2>
                  <p className="text-gray-500 mt-1">{selectedAttraction.name}</p>
                </div>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Wait (minutes)</label>
                <input
                  type="number"
                  defaultValue={selectedAttraction.waitTime}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standby Wait (minutes)</label>
                <input
                  type="number"
                  defaultValue={selectedAttraction.standbyWait}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  defaultValue={selectedAttraction.status}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="weather_closed">Weather Closed</option>
                </select>
              </div>
              {selectedAttraction.virtualQueueEnabled && (
                <div className="p-4 bg-teal-50 rounded-lg">
                  <label className="block text-sm font-medium text-teal-700 mb-2">Virtual Queue Controls</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
                      <PlayCircle className="w-4 h-4" />
                      Call Next Group
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-teal-300 text-teal-700 rounded-lg hover:bg-teal-100 text-sm font-medium">
                      <PauseCircle className="w-4 h-4" />
                      Pause VQ
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Capacity Override</label>
                <input
                  type="number"
                  defaultValue={selectedAttraction.capacity}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Default: {selectedAttraction.capacity}/hr</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
