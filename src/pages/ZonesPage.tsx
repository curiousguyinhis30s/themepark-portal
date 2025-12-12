import { useState, useMemo } from 'react';
import {
  MapPin,
  Users,
  BarChart3,
  Zap,
  UtensilsCrossed,
  Store,
  Plus,
  Edit,
  X,
  Clock,
  Mountain,
  Waves,
  Rocket,
  Castle,
  Ship,
  ChevronDown,
} from 'lucide-react';
import { zones, type Zone, getTotalVisitors, getTotalCapacity } from '../data/zones';
import { StatCard } from '../components/ui';

function getZoneIcon(theme: string) {
  switch (theme) {
    case 'Mountain Adventure': return <Mountain className="w-5 h-5 text-teal-600" />;
    case 'Tropical Rainforest': return <Waves className="w-5 h-5 text-emerald-600" />;
    case 'Science Fiction': return <Rocket className="w-5 h-5 text-blue-600" />;
    case 'Fairy Tale': return <Castle className="w-5 h-5 text-purple-600" />;
    case 'Malaysian Heritage': return <Ship className="w-5 h-5 text-amber-600" />;
    default: return <MapPin className="w-5 h-5 text-gray-600" />;
  }
}

function getZoneColorClasses(color: string) {
  // Convert hex color to Tailwind-like classes
  const colorMap: Record<string, { bg: string; bgLight: string; text: string; border: string }> = {
    '#0f766e': { bg: 'bg-teal-600', bgLight: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    '#15803d': { bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    '#1d4ed8': { bg: 'bg-blue-600', bgLight: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    '#a21caf': { bg: 'bg-purple-600', bgLight: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    '#b45309': { bg: 'bg-amber-600', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  };
  return colorMap[color] || { bg: 'bg-gray-600', bgLight: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
}

function getOccupancyLevel(current: number, capacity: number) {
  const rate = (current / capacity) * 100;
  if (rate < 50) return { label: 'Low', bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' };
  if (rate < 75) return { label: 'Moderate', bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' };
  if (rate < 90) return { label: 'High', bg: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' };
  return { label: 'Full', bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' };
}

export default function ZonesPage() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterTheme, setFilterTheme] = useState('all');

  // Calculate stats
  const stats = useMemo(() => {
    const totalVisitors = getTotalVisitors();
    const totalCapacity = getTotalCapacity();
    const totalAttractions = zones.reduce((sum, z) => sum + z.attractionCount, 0);
    const occupancyRate = Math.round((totalVisitors / totalCapacity) * 100);
    return {
      totalZones: zones.length,
      totalVisitors,
      totalCapacity,
      totalAttractions,
      occupancyRate,
    };
  }, []);

  const themes = ['all', ...new Set(zones.map((z) => z.theme))];

  const filteredZones = useMemo(() => {
    if (filterTheme === 'all') return zones;
    return zones.filter((z) => z.theme === filterTheme);
  }, [filterTheme]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zone Management</h1>
          <p className="text-gray-500 mt-1">Manage park zones, capacity, and operations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Zone
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<MapPin className="w-5 h-5 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.totalZones}
          label="Total Zones"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          value={stats.totalVisitors.toLocaleString()}
          label="Current Visitors"
          valueColor="text-blue-600"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
          value={`${stats.occupancyRate}%`}
          label="Park Occupancy"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          value={stats.totalAttractions}
          label="Total Attractions"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
        <span className="text-sm text-gray-500">Filter by theme:</span>
        <div className="relative">
          <select
            value={filterTheme}
            onChange={(e) => setFilterTheme(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme === 'all' ? 'All Themes' : theme}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Zone Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const colorClasses = getZoneColorClasses(zone.color);
          const occupancy = getOccupancyLevel(zone.currentVisitors, zone.capacity);
          const occupancyPercent = Math.round((zone.currentVisitors / zone.capacity) * 100);

          return (
            <div
              key={zone.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedZone(zone)}
            >
              {/* Zone Header */}
              <div className={`h-28 ${colorClasses.bg} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        {getZoneIcon(zone.theme)}
                      </div>
                      <h3 className="text-lg font-bold text-white">{zone.name}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${occupancy.bg} ${occupancy.text}`}>
                      {occupancy.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{zone.description}</p>

                {/* Capacity Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Capacity</span>
                    <span className="font-medium text-gray-900">
                      {zone.currentVisitors.toLocaleString()} / {zone.capacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${occupancy.bar}`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className={`p-3 rounded-lg ${colorClasses.bgLight}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className={`w-4 h-4 ${colorClasses.text}`} />
                      <span className="text-lg font-bold text-gray-900">{zone.attractionCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Attractions</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses.bgLight}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <UtensilsCrossed className={`w-4 h-4 ${colorClasses.text}`} />
                      <span className="text-lg font-bold text-gray-900">{zone.diningCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Dining</p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses.bgLight}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Store className={`w-4 h-4 ${colorClasses.text}`} />
                      <span className="text-lg font-bold text-gray-900">{zone.shopCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Shops</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Hours</span>
                  </div>
                  <span className="font-medium text-gray-900">{zone.openingTime} - {zone.closingTime}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZone(zone);
                      setShowEditModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Zone
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    View Map
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Park Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Live Park Overview</h3>
            <p className="text-sm text-gray-500">Real-time zone occupancy</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {zones.map((zone) => {
            const colorClasses = getZoneColorClasses(zone.color);
            const occupancy = getOccupancyLevel(zone.currentVisitors, zone.capacity);
            const occupancyPercent = Math.round((zone.currentVisitors / zone.capacity) * 100);

            return (
              <div
                key={zone.id}
                className={`p-4 rounded-xl border ${colorClasses.border} ${colorClasses.bgLight}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getZoneIcon(zone.theme)}
                  <h4 className="font-medium text-gray-900 text-sm truncate">{zone.name}</h4>
                </div>
                <p className={`text-3xl font-bold ${colorClasses.text}`}>{occupancyPercent}%</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">occupancy</p>
                  <span className={`px-1.5 py-0.5 text-xs rounded font-medium ${occupancy.bg} ${occupancy.text}`}>
                    {occupancy.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add New Zone</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Safari Land"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe this zone..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Mountain Adventure</option>
                    <option>Tropical Rainforest</option>
                    <option>Science Fiction</option>
                    <option>Fairy Tale</option>
                    <option>Malaysian Heritage</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue="10:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue="22:00"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Create Zone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedZone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Edit Zone</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  defaultValue={selectedZone.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  defaultValue={selectedZone.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedZone.capacity}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedZone.theme}
                  >
                    <option>Mountain Adventure</option>
                    <option>Tropical Rainforest</option>
                    <option>Science Fiction</option>
                    <option>Fairy Tale</option>
                    <option>Malaysian Heritage</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedZone.openingTime}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedZone.closingTime}
                  />
                </div>
              </div>
              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.amenities.map((amenity, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button className="px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium">
                Delete Zone
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zone Detail Modal */}
      {selectedZone && !showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className={`h-32 ${getZoneColorClasses(selectedZone.color).bg} relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <button
                onClick={() => setSelectedZone(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute bottom-4 left-4">
                <h2 className="text-2xl font-bold text-white">{selectedZone.name}</h2>
                <p className="text-white/80 text-sm">{selectedZone.theme}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-600">{selectedZone.description}</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedZone.attractionCount}</p>
                  <p className="text-xs text-gray-500">Attractions</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedZone.diningCount}</p>
                  <p className="text-xs text-gray-500">Dining</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedZone.shopCount}</p>
                  <p className="text-xs text-gray-500">Shops</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Current Visitors</span>
                  <span className="font-semibold text-gray-900">
                    {selectedZone.currentVisitors.toLocaleString()} / {selectedZone.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getOccupancyLevel(selectedZone.currentVisitors, selectedZone.capacity).bar}`}
                    style={{ width: `${(selectedZone.currentVisitors / selectedZone.capacity) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Operating Hours</span>
                </div>
                <span className="font-semibold text-gray-900">{selectedZone.openingTime} - {selectedZone.closingTime}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.amenities.map((amenity, i) => (
                    <span key={i} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(true);
                }}
                className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Edit Zone
              </button>
              <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Attractions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
