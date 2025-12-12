import { useState, useMemo } from 'react';
import {
  Theater,
  Flag,
  Users,
  Sparkles,
  Star,
  Calendar,
  Plus,
  Clock,
  MapPin,
  X,
  RefreshCw,
  Radio,
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  type: 'show' | 'parade' | 'meet-greet' | 'fireworks' | 'special';
  location: string;
  zone: string;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  registered: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recurring: boolean;
  description: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Dragon Fire Show',
    type: 'show',
    location: 'Main Stage',
    zone: 'Adventure Valley',
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    capacity: 500,
    registered: 423,
    status: 'scheduled',
    recurring: true,
    description: 'Spectacular fire-breathing dragon show with pyrotechnics',
  },
  {
    id: '2',
    name: 'Character Parade',
    type: 'parade',
    location: 'Main Street',
    zone: 'Fantasy Kingdom',
    startTime: '16:00',
    endTime: '16:45',
    duration: 45,
    capacity: 2000,
    registered: 1567,
    status: 'scheduled',
    recurring: true,
    description: 'Daily parade featuring all park characters and floats',
  },
  {
    id: '3',
    name: 'Space Ranger Meet & Greet',
    type: 'meet-greet',
    location: 'Space Station',
    zone: 'Future World',
    startTime: '11:00',
    endTime: '13:00',
    duration: 120,
    capacity: 100,
    registered: 98,
    status: 'live',
    recurring: true,
    description: 'Meet the Space Rangers for photos and autographs',
  },
  {
    id: '4',
    name: 'Nightly Fireworks',
    type: 'fireworks',
    location: 'Castle Plaza',
    zone: 'Fantasy Kingdom',
    startTime: '21:00',
    endTime: '21:20',
    duration: 20,
    capacity: 5000,
    registered: 3245,
    status: 'scheduled',
    recurring: true,
    description: 'Grand finale fireworks spectacular over the castle',
  },
  {
    id: '5',
    name: 'Holiday Special: Winter Wonderland',
    type: 'special',
    location: 'Park Wide',
    zone: 'All Zones',
    startTime: '10:00',
    endTime: '22:00',
    duration: 720,
    capacity: 10000,
    registered: 4521,
    status: 'scheduled',
    recurring: false,
    description: 'Special holiday event with snow machines and festive activities',
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'show': return <Theater className="w-5 h-5" />;
    case 'parade': return <Flag className="w-5 h-5" />;
    case 'meet-greet': return <Users className="w-5 h-5" />;
    case 'fireworks': return <Sparkles className="w-5 h-5" />;
    case 'special': return <Star className="w-5 h-5" />;
    default: return <Calendar className="w-5 h-5" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'show': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' };
    case 'parade': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600' };
    case 'meet-greet': return { bg: 'bg-pink-100', text: 'text-pink-700', icon: 'text-pink-600' };
    case 'fireworks': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' };
    case 'special': return { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'text-indigo-600' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-700';
    case 'live': return 'bg-emerald-100 text-emerald-700';
    case 'completed': return 'bg-gray-100 text-gray-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(e => filterType === 'all' || e.type === filterType);
  }, [filterType]);

  const stats = useMemo(() => ({
    todayEvents: mockEvents.filter(e => e.status === 'scheduled' || e.status === 'live').length,
    liveNow: mockEvents.filter(e => e.status === 'live').length,
    totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registered, 0),
    recurringEvents: mockEvents.filter(e => e.recurring).length,
  }), []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events & Shows</h1>
          <p className="text-gray-500 mt-1">Manage park entertainment and special events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Theater className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.todayEvents}</p>
              <p className="text-sm text-gray-500">Today's Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.liveNow}</p>
              <p className="text-sm text-gray-500">Live Now</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Registrations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.recurringEvents}</p>
              <p className="text-sm text-gray-500">Recurring Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-4 border-b">
          {(['today', 'upcoming', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize ${
                activeTab === tab
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'today' ? "Today's Schedule" : tab === 'upcoming' ? 'Upcoming' : 'All Events'}
            </button>
          ))}
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Types</option>
          <option value="show">Shows</option>
          <option value="parade">Parades</option>
          <option value="meet-greet">Meet & Greet</option>
          <option value="fireworks">Fireworks</option>
          <option value="special">Special Events</option>
        </select>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-6">
            {filteredEvents.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((event) => {
              const typeColors = getTypeColor(event.type);
              return (
                <div key={event.id} className="relative flex gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                    event.status === 'live' ? 'bg-emerald-500 animate-pulse' : typeColors.bg
                  }`}>
                    <span className={event.status === 'live' ? 'text-white' : typeColors.icon}>
                      {getTypeIcon(event.type)}
                    </span>
                  </div>
                  <div
                    className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{event.name}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          {event.recurring && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              Daily
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location} • {event.zone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{event.startTime} - {event.endTime}</p>
                        <p className="text-sm text-gray-500">{event.duration} min</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${typeColors.bg} ${typeColors.text}`}>
                        {event.type.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">
                        {event.registered}/{event.capacity} registered
                      </span>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Magic Show"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="show">Show</option>
                    <option value="parade">Parade</option>
                    <option value="meet-greet">Meet & Greet</option>
                    <option value="fireworks">Fireworks</option>
                    <option value="special">Special Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Adventure Valley</option>
                    <option>Fantasy Kingdom</option>
                    <option>Future World</option>
                    <option>Aqua Zone</option>
                    <option>Kids Paradise</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Main Stage"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Start Time
                    </span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      End Time
                    </span>
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      Capacity
                    </span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe this event..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="recurring" className="rounded text-teal-600 focus:ring-teal-500" />
                <label htmlFor="recurring" className="text-sm text-gray-700">This is a recurring daily event</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(selectedEvent.type).bg}`}>
                    <span className={getTypeColor(selectedEvent.type).icon}>
                      {getTypeIcon(selectedEvent.type)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedEvent.name}</h2>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full ${getTypeColor(selectedEvent.type).bg} ${getTypeColor(selectedEvent.type).text}`}>
                  {selectedEvent.type.replace('-', ' ')}
                </span>
                {selectedEvent.recurring && (
                  <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Daily
                  </span>
                )}
              </div>
              <p className="text-gray-600">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Time
                  </p>
                  <p className="font-semibold text-gray-900">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.duration} minutes</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">Registrations</p>
                  <p className="font-semibold text-gray-900">{selectedEvent.registered} / {selectedEvent.capacity}</p>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${(selectedEvent.registered / selectedEvent.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between">
              <button className="px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                Cancel Event
              </button>
              <div className="flex gap-3">
                <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                  Manage Registrations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
