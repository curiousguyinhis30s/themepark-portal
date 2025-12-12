import { useState, useMemo } from 'react';
import {
  MessageCircle,
  Lightbulb,
  Smile,
  HelpCircle,
  FileText,
  Clock,
  Star,
  BarChart3,
  AlertTriangle,
  Search,
  X,
  Send,
  User,
  Mail,
  Download,
} from 'lucide-react';

interface Feedback {
  id: string;
  guestName: string;
  guestEmail: string;
  type: 'complaint' | 'suggestion' | 'compliment' | 'inquiry';
  category: string;
  subject: string;
  message: string;
  rating: number;
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string | null;
  createdAt: string;
  resolvedAt: string | null;
  response: string | null;
}

const mockFeedback: Feedback[] = [
  {
    id: '1',
    guestName: 'Ahmad Hassan',
    guestEmail: 'ahmad@email.com',
    type: 'complaint',
    category: 'Wait Times',
    subject: 'Long wait at Dragon Coaster',
    message: 'We waited over 90 minutes for Dragon Coaster even though the posted wait time was 45 minutes. Very disappointed with the inaccurate information.',
    rating: 2,
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Sarah Chen',
    createdAt: '2024-12-12 14:30',
    resolvedAt: null,
    response: null,
  },
  {
    id: '2',
    guestName: 'Michelle Tan',
    guestEmail: 'michelle@email.com',
    type: 'compliment',
    category: 'Staff',
    subject: 'Excellent service from staff',
    message: 'I want to commend the staff at Fantasy Kingdom, especially James who helped my daughter when she got separated from us. Outstanding service!',
    rating: 5,
    status: 'resolved',
    priority: 'low',
    assignedTo: null,
    createdAt: '2024-12-12 12:15',
    resolvedAt: '2024-12-12 13:00',
    response: 'Thank you for your kind words! We have passed your compliment to James and his team.',
  },
  {
    id: '3',
    guestName: 'David Wong',
    guestEmail: 'david.wong@email.com',
    type: 'suggestion',
    category: 'Facilities',
    subject: 'More shaded rest areas needed',
    message: 'It would be great to have more shaded rest areas, especially near Adventure Valley. The sun can be quite intense during midday.',
    rating: 3,
    status: 'new',
    priority: 'medium',
    assignedTo: null,
    createdAt: '2024-12-12 11:45',
    resolvedAt: null,
    response: null,
  },
  {
    id: '4',
    guestName: 'Priya Sharma',
    guestEmail: 'priya@email.com',
    type: 'complaint',
    category: 'Food & Beverage',
    subject: 'Cold food and long queue',
    message: 'Food at the Galaxy Cafe was served cold and we had to wait 25 minutes. For the price we paid, the quality should be much better.',
    rating: 2,
    status: 'new',
    priority: 'high',
    assignedTo: null,
    createdAt: '2024-12-12 10:30',
    resolvedAt: null,
    response: null,
  },
  {
    id: '5',
    guestName: 'James Lee',
    guestEmail: 'james.lee@email.com',
    type: 'inquiry',
    category: 'Tickets',
    subject: 'Season pass benefits',
    message: 'Can you clarify what benefits are included with the season pass? Specifically interested in parking and express queue access.',
    rating: 4,
    status: 'resolved',
    priority: 'low',
    assignedTo: 'Emily Wong',
    createdAt: '2024-12-11 16:00',
    resolvedAt: '2024-12-11 17:30',
    response: 'Season pass includes free parking on weekdays, 20% F&B discount, and 2 express queue passes per month. Full details at our website.',
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'complaint': return <AlertTriangle className="w-5 h-5" />;
    case 'suggestion': return <Lightbulb className="w-5 h-5" />;
    case 'compliment': return <Smile className="w-5 h-5" />;
    case 'inquiry': return <HelpCircle className="w-5 h-5" />;
    default: return <FileText className="w-5 h-5" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'complaint': return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
    case 'suggestion': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
    case 'compliment': return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' };
    case 'inquiry': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'new': return 'bg-amber-100 text-amber-700';
    case 'in-progress': return 'bg-blue-100 text-blue-700';
    case 'resolved': return 'bg-emerald-100 text-emerald-700';
    case 'closed': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-amber-600';
    case 'low': return 'text-emerald-600';
    default: return 'text-gray-600';
  }
}

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeedback = useMemo(() => {
    return mockFeedback.filter(f => {
      const matchesType = filterType === 'all' || f.type === filterType;
      const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
      const matchesSearch = f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            f.guestName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [filterType, filterStatus, searchTerm]);

  const stats = useMemo(() => {
    const avgRating = mockFeedback.reduce((sum, f) => sum + f.rating, 0) / mockFeedback.length;
    const npsScore = Math.round((mockFeedback.filter(f => f.rating >= 4).length / mockFeedback.length) * 100 -
                                (mockFeedback.filter(f => f.rating <= 2).length / mockFeedback.length) * 100);
    return {
      total: mockFeedback.length,
      pending: mockFeedback.filter(f => f.status === 'new').length,
      avgRating,
      npsScore,
      openComplaints: mockFeedback.filter(f => f.type === 'complaint' && f.status !== 'resolved').length,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
          <p className="text-gray-500 mt-1">Monitor and respond to guest feedback</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Feedback</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Avg. Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${stats.npsScore >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {stats.npsScore > 0 ? '+' : ''}{stats.npsScore}
              </p>
              <p className="text-sm text-gray-500">NPS Score</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.openComplaints}</p>
              <p className="text-sm text-gray-500">Open Complaints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Feedback by Type</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { type: 'complaint', label: 'Complaints', icon: AlertTriangle, color: 'bg-red-500' },
            { type: 'suggestion', label: 'Suggestions', icon: Lightbulb, color: 'bg-blue-500' },
            { type: 'compliment', label: 'Compliments', icon: Smile, color: 'bg-emerald-500' },
            { type: 'inquiry', label: 'Inquiries', icon: HelpCircle, color: 'bg-purple-500' },
          ].map((item) => {
            const count = mockFeedback.filter(f => f.type === item.type).length;
            const percentage = (count / mockFeedback.length) * 100;
            const Icon = item.icon;
            return (
              <div key={item.type} className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${getTypeColor(item.type).icon}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Types</option>
          <option value="complaint">Complaints</option>
          <option value="suggestion">Suggestions</option>
          <option value="compliment">Compliments</option>
          <option value="inquiry">Inquiries</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback) => {
          const typeColors = getTypeColor(feedback.type);
          return (
            <div
              key={feedback.id}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFeedback(feedback)}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColors.bg}`}>
                    <span className={typeColors.icon}>{getTypeIcon(feedback.type)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{feedback.subject}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${typeColors.bg} ${typeColors.text}`}>
                        {feedback.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                      <span className={`text-xs font-medium ${getPriorityColor(feedback.priority)}`}>
                        {feedback.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{feedback.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {feedback.guestName}
                      </span>
                      <span>{feedback.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {feedback.createdAt}
                      </span>
                      {feedback.assignedTo && <span>Assigned: {feedback.assignedTo}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(selectedFeedback.type).bg}`}>
                    <span className={getTypeColor(selectedFeedback.type).icon}>
                      {getTypeIcon(selectedFeedback.type)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedFeedback.subject}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(selectedFeedback.type).bg} ${getTypeColor(selectedFeedback.type).text}`}>
                        {selectedFeedback.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedFeedback.status)}`}>
                        {selectedFeedback.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-600">
                  {selectedFeedback.guestName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedFeedback.guestName}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {selectedFeedback.guestEmail}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= selectedFeedback.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Category: {selectedFeedback.category}</p>
                <p className="text-gray-700">{selectedFeedback.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-semibold text-gray-900">{selectedFeedback.createdAt}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className={`font-semibold capitalize ${getPriorityColor(selectedFeedback.priority)}`}>
                    {selectedFeedback.priority}
                  </p>
                </div>
              </div>

              {selectedFeedback.response && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-600 font-medium mb-1">Response:</p>
                  <p className="text-gray-700">{selectedFeedback.response}</p>
                  <p className="text-xs text-gray-500 mt-2">Resolved: {selectedFeedback.resolvedAt}</p>
                </div>
              )}

              {selectedFeedback.status !== 'resolved' && selectedFeedback.status !== 'closed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Write Response</label>
                  <textarea
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={4}
                    placeholder="Type your response..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedFeedback.assignedTo || ''}
                  >
                    <option value="">Unassigned</option>
                    <option>Sarah Chen</option>
                    <option>Emily Wong</option>
                    <option>Mike Johnson</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    defaultValue={selectedFeedback.status}
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                <Send className="w-4 h-4" />
                {selectedFeedback.status === 'resolved' ? 'Update' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
