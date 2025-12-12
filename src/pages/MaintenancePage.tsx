import { useState, useMemo } from 'react';
import {
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Settings,
  Plus,
  X,
  User,
  CalendarDays,
  MapPin,
  Search,
  PauseCircle,
  Cog,
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  attractionId: string;
  attractionName: string;
  zone: string;
  type: 'scheduled' | 'emergency' | 'inspection' | 'repair';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  description: string;
  assignedTo: string;
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  notes: string;
  parts: string[];
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    attractionId: 'a1',
    attractionName: 'Dragon Coaster',
    zone: 'Adventure Valley',
    type: 'scheduled',
    priority: 'medium',
    status: 'pending',
    description: 'Monthly safety inspection and brake system check',
    assignedTo: 'Mike Johnson',
    scheduledDate: '2024-12-13',
    estimatedDuration: 4,
    notes: 'Standard monthly inspection procedure',
    parts: ['Brake pads', 'Lubricant'],
  },
  {
    id: '2',
    attractionId: 'a2',
    attractionName: 'Space Mountain',
    zone: 'Future World',
    type: 'emergency',
    priority: 'critical',
    status: 'in-progress',
    description: 'Lighting system malfunction in tunnel section B',
    assignedTo: 'Sarah Chen',
    scheduledDate: '2024-12-12',
    estimatedDuration: 2,
    notes: 'Guest reported flickering lights. Attraction closed for safety.',
    parts: ['LED strips', 'Control module'],
  },
  {
    id: '3',
    attractionId: 'a3',
    attractionName: 'Thunder Rapids',
    zone: 'Aqua Zone',
    type: 'repair',
    priority: 'high',
    status: 'pending',
    description: 'Water pump replacement - pump 3 showing reduced output',
    assignedTo: 'James Wilson',
    scheduledDate: '2024-12-14',
    estimatedDuration: 6,
    notes: 'Operating at 60% capacity. Order replacement pump urgently.',
    parts: ['Industrial water pump', 'Seals', 'Piping'],
  },
  {
    id: '4',
    attractionId: 'a4',
    attractionName: 'Enchanted Castle',
    zone: 'Fantasy Kingdom',
    type: 'inspection',
    priority: 'low',
    status: 'completed',
    description: 'Quarterly structural inspection',
    assignedTo: 'David Lee',
    scheduledDate: '2024-12-10',
    estimatedDuration: 3,
    actualDuration: 2.5,
    notes: 'All systems passed. Minor touch-up paint needed on exterior.',
    parts: [],
  },
  {
    id: '5',
    attractionId: 'a5',
    attractionName: 'Volcano Blast',
    zone: 'Adventure Valley',
    type: 'scheduled',
    priority: 'medium',
    status: 'on-hold',
    description: 'Pyrotechnics system calibration',
    assignedTo: 'Tom Anderson',
    scheduledDate: '2024-12-15',
    estimatedDuration: 5,
    notes: 'Waiting for safety officer availability',
    parts: ['Ignition controllers', 'Safety sensors'],
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'scheduled': return <Calendar className="w-5 h-5" />;
    case 'emergency': return <AlertCircle className="w-5 h-5" />;
    case 'inspection': return <Search className="w-5 h-5" />;
    case 'repair': return <Wrench className="w-5 h-5" />;
    default: return <Cog className="w-5 h-5" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'scheduled': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
    case 'emergency': return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
    case 'inspection': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' };
    case 'repair': return { bg: 'bg-orange-100', text: 'text-orange-700', icon: 'text-orange-600' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
  }
}

export default function MaintenancePage() {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-emerald-100 text-emerald-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'on-hold': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = useMemo(() => ({
    total: mockTasks.length,
    inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
    critical: mockTasks.filter(t => t.priority === 'critical').length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    onHold: mockTasks.filter(t => t.status === 'on-hold').length,
  }), []);

  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesStatus && matchesPriority;
    });
  }, [filterStatus, filterPriority]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-500 mt-1">Track and manage attraction maintenance tasks</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Tasks</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-sm text-gray-500">Critical</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <PauseCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{stats.onHold}</p>
              <p className="text-sm text-gray-500">On Hold</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const typeColors = getTypeColor(task.type);
          return (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-6 border hover:shadow-md transition-shadow cursor-pointer ${
                task.priority === 'critical' ? 'border-red-200' : 'border-gray-100'
              }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColors.bg}`}>
                    <span className={typeColors.icon}>{getTypeIcon(task.type)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.attractionName}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${typeColors.bg} ${typeColors.text}`}>
                        {task.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {task.zone}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {task.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {task.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.estimatedDuration}h
                      </span>
                    </div>
                  </div>
                </div>
                {task.priority === 'critical' && task.status !== 'completed' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Action Required
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
                <h2 className="text-xl font-bold text-gray-900">Create Maintenance Task</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Attraction</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Dragon Coaster - Adventure Valley</option>
                  <option>Space Mountain - Future World</option>
                  <option>Thunder Rapids - Aqua Zone</option>
                  <option>Enchanted Castle - Fantasy Kingdom</option>
                  <option>Volcano Blast - Adventure Valley</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="scheduled">Scheduled</option>
                    <option value="emergency">Emergency</option>
                    <option value="inspection">Inspection</option>
                    <option value="repair">Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe the maintenance task..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      Assigned To
                    </span>
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Mike Johnson</option>
                    <option>Sarah Chen</option>
                    <option>James Wilson</option>
                    <option>David Lee</option>
                    <option>Tom Anderson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      Scheduled Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Estimated Duration (hours)
                  </span>
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Parts</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter parts separated by commas"
                />
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
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(selectedTask.type).bg}`}>
                    <span className={getTypeColor(selectedTask.type).icon}>
                      {getTypeIcon(selectedTask.type)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTask.attractionName}</h2>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedTask.zone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm rounded-full capitalize ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority} priority
                </span>
                <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status.replace('-', ' ')}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Assigned To
                  </p>
                  <p className="font-semibold text-gray-900">{selectedTask.assignedTo}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    Scheduled
                  </p>
                  <p className="font-semibold text-gray-900">{selectedTask.scheduledDate}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Duration
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedTask.actualDuration
                    ? `${selectedTask.actualDuration}h (estimated: ${selectedTask.estimatedDuration}h)`
                    : `Estimated: ${selectedTask.estimatedDuration}h`
                  }
                </p>
              </div>
              {selectedTask.parts.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <Wrench className="w-4 h-4" />
                    Required Parts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.parts.map((part, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{selectedTask.notes}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
              {selectedTask.status !== 'completed' && (
                <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
