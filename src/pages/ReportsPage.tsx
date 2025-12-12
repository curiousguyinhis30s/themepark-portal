import { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  Loader2,
  Calendar,
  DollarSign,
  Settings,
  BarChart3,
  Users,
  Shield,
  MessageCircle,
  Clock,
  Plus,
  X,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  format: string[];
  status: 'ready' | 'generating' | 'scheduled';
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Daily Revenue Summary',
    description: 'Comprehensive breakdown of daily revenue by category, payment method, and time',
    category: 'Financial',
    lastGenerated: '2024-12-12 08:00',
    frequency: 'daily',
    format: ['PDF', 'Excel'],
    status: 'ready',
  },
  {
    id: '2',
    name: 'Visitor Analytics Report',
    description: 'Detailed visitor statistics including demographics, peak times, and behavior patterns',
    category: 'Operations',
    lastGenerated: '2024-12-12 06:00',
    frequency: 'daily',
    format: ['PDF', 'Excel', 'CSV'],
    status: 'ready',
  },
  {
    id: '3',
    name: 'Weekly Performance Dashboard',
    description: 'Week-over-week comparison of key performance metrics across all departments',
    category: 'Management',
    lastGenerated: '2024-12-09 09:00',
    frequency: 'weekly',
    format: ['PDF'],
    status: 'ready',
  },
  {
    id: '4',
    name: 'Attraction Utilization Report',
    description: 'Wait times, throughput, and utilization rates for all attractions',
    category: 'Operations',
    lastGenerated: '2024-12-12 07:00',
    frequency: 'daily',
    format: ['PDF', 'Excel'],
    status: 'ready',
  },
  {
    id: '5',
    name: 'Monthly Financial Statement',
    description: 'Complete financial overview including P&L, cash flow, and budget variance',
    category: 'Financial',
    lastGenerated: '2024-12-01 10:00',
    frequency: 'monthly',
    format: ['PDF', 'Excel'],
    status: 'ready',
  },
  {
    id: '6',
    name: 'Staff Performance Report',
    description: 'Employee attendance, productivity metrics, and customer feedback scores',
    category: 'HR',
    lastGenerated: '2024-12-09 08:00',
    frequency: 'weekly',
    format: ['PDF'],
    status: 'ready',
  },
  {
    id: '7',
    name: 'Safety & Incident Report',
    description: 'Summary of safety inspections, incidents, and compliance status',
    category: 'Safety',
    lastGenerated: '2024-12-11 18:00',
    frequency: 'daily',
    format: ['PDF'],
    status: 'ready',
  },
  {
    id: '8',
    name: 'Customer Satisfaction Analysis',
    description: 'NPS scores, feedback analysis, and customer sentiment trends',
    category: 'Customer',
    lastGenerated: '2024-12-09 09:00',
    frequency: 'weekly',
    format: ['PDF', 'Excel'],
    status: 'generating',
  },
];

const categories = ['All', 'Financial', 'Operations', 'Management', 'HR', 'Safety', 'Customer'];

function getCategoryStyle(category: string) {
  switch (category) {
    case 'Financial':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'text-emerald-600' };
    case 'Operations':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
    case 'Management':
      return { bg: 'bg-purple-100', text: 'text-purple-700', icon: 'text-purple-600' };
    case 'HR':
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-600' };
    case 'Safety':
      return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
    case 'Customer':
      return { bg: 'bg-pink-100', text: 'text-pink-700', icon: 'text-pink-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-600' };
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Financial':
      return <DollarSign className="w-5 h-5" />;
    case 'Operations':
      return <Settings className="w-5 h-5" />;
    case 'Management':
      return <BarChart3 className="w-5 h-5" />;
    case 'HR':
      return <Users className="w-5 h-5" />;
    case 'Safety':
      return <Shield className="w-5 h-5" />;
    case 'Customer':
      return <MessageCircle className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const stats = useMemo(() => {
    const availableCount = mockReports.length;
    const readyCount = mockReports.filter((r) => r.status === 'ready').length;
    const generatingCount = mockReports.filter((r) => r.status === 'generating').length;
    const dailyCount = mockReports.filter((r) => r.frequency === 'daily').length;

    return { availableCount, readyCount, generatingCount, dailyCount };
  }, []);

  const filteredReports = mockReports.filter((r) => selectedCategory === 'All' || r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Generate and download business reports</p>
        </div>
        <button
          onClick={() => setShowCustomReportModal(true)}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Custom Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.availableCount}</p>
              <p className="text-sm text-gray-500">Available Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.readyCount}</p>
              <p className="text-sm text-gray-500">Ready to Download</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.generatingCount}</p>
              <p className="text-sm text-gray-500">Generating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.dailyCount}</p>
              <p className="text-sm text-gray-500">Daily Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Date Range:</span>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
          Apply
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const style = getCategoryStyle(category);
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category !== 'All' && (
                <span className={selectedCategory === category ? 'text-white' : style.icon}>
                  {getCategoryIcon(category)}
                </span>
              )}
              {category}
            </button>
          );
        })}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => {
          const style = getCategoryStyle(report.category);

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center`}>
                      <span className={style.icon}>{getCategoryIcon(report.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${style.bg} ${style.text}`}>
                        {report.category}
                      </span>
                    </div>
                  </div>
                  {report.status === 'generating' && (
                    <span className="flex items-center gap-1.5 text-amber-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Generating...</span>
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{report.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {report.frequency}
                  </span>
                  <span>Last: {report.lastGenerated}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {report.format.map((fmt) => (
                      <span key={fmt} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded font-medium">
                        {fmt}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      disabled={report.status === 'generating'}
                      className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-1.5 ${
                        report.status === 'generating'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-teal-600 text-white hover:bg-teal-700 transition-colors'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Generate Custom Report</h2>
                <button
                  onClick={() => setShowCustomReportModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="My Custom Report"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data to Include</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Revenue', 'Visitors', 'Ticket Sales', 'Attractions', 'Staff', 'Feedback', 'Promotions', 'Inventory'].map(
                    (item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input type="checkbox" className="rounded text-teal-600" />
                        <span>{item}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      From Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      To Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                <div className="flex gap-4">
                  {['PDF', 'Excel', 'CSV'].map((format) => (
                    <label key={format} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-teal-600" />
                      <span>{format}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Day</option>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Zone</option>
                  <option>Category</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCustomReportModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReport.name}</h2>
                  <p className="text-gray-500">Generated: {selectedReport.lastGenerated}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                <div className="w-16 h-16 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-teal-600" />
                </div>
                <p className="text-gray-600 mb-4">Report preview would be displayed here</p>
                <p className="text-sm text-gray-500">{selectedReport.description}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
