import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  Upload,
  FileDown,
  ThumbsUp,
  ThumbsDown,
  Database,
  ChevronDown,
  Calendar,
  User,
  Globe,
} from 'lucide-react';
import { auditLogs, type AuditLog } from '@themepark/shared';
import { Pagination, EmptyState } from '../components/ui/LoadingStates';
import { StatCard } from '../components/ui';

type FilterStatus = 'all' | 'success' | 'failed' | 'warning';
type FilterCategory = 'all' | AuditLog['category'];
type FilterAction = 'all' | AuditLog['action'];

function getActionIcon(action: AuditLog['action']) {
  const iconProps = { className: 'w-4 h-4' };
  switch (action) {
    case 'CREATE': return <Plus {...iconProps} className="w-4 h-4 text-emerald-600" />;
    case 'UPDATE': return <Edit {...iconProps} className="w-4 h-4 text-blue-600" />;
    case 'DELETE': return <Trash2 {...iconProps} className="w-4 h-4 text-red-600" />;
    case 'LOGIN': return <LogIn {...iconProps} className="w-4 h-4 text-teal-600" />;
    case 'LOGOUT': return <LogOut {...iconProps} className="w-4 h-4 text-gray-600" />;
    case 'LOGIN_FAILED': return <XCircle {...iconProps} className="w-4 h-4 text-red-600" />;
    case 'EXPORT': return <FileDown {...iconProps} className="w-4 h-4 text-purple-600" />;
    case 'IMPORT': return <Upload {...iconProps} className="w-4 h-4 text-indigo-600" />;
    case 'APPROVE': return <ThumbsUp {...iconProps} className="w-4 h-4 text-emerald-600" />;
    case 'REJECT': return <ThumbsDown {...iconProps} className="w-4 h-4 text-red-600" />;
    default: return <Database {...iconProps} className="w-4 h-4 text-gray-600" />;
  }
}

function getStatusBadge(status: AuditLog['status']) {
  switch (status) {
    case 'success':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3 h-3" /> };
    case 'failed':
      return { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-3 h-3" /> };
    case 'warning':
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <AlertTriangle className="w-3 h-3" /> };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
  }
}

function getCategoryColor(category: AuditLog['category']) {
  const colors: Record<AuditLog['category'], string> = {
    Authentication: 'bg-teal-100 text-teal-700',
    Users: 'bg-blue-100 text-blue-700',
    Attractions: 'bg-purple-100 text-purple-700',
    Tickets: 'bg-amber-100 text-amber-700',
    Queues: 'bg-indigo-100 text-indigo-700',
    Staff: 'bg-cyan-100 text-cyan-700',
    Settings: 'bg-gray-100 text-gray-700',
    Reports: 'bg-emerald-100 text-emerald-700',
    System: 'bg-slate-100 text-slate-700',
    Promotions: 'bg-pink-100 text-pink-700',
    Zones: 'bg-orange-100 text-orange-700',
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
}

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterAction, setFilterAction] = useState<FilterAction>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories: FilterCategory[] = ['all', 'Authentication', 'Users', 'Attractions', 'Tickets', 'Queues', 'Staff', 'Settings', 'Reports', 'System', 'Promotions', 'Zones'];
  const actions: FilterAction[] = ['all', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT'];
  const statuses: FilterStatus[] = ['all', 'success', 'failed', 'warning'];

  // Calculate stats
  const stats = useMemo(() => {
    const successCount = auditLogs.filter((l) => l.status === 'success').length;
    const failedCount = auditLogs.filter((l) => l.status === 'failed').length;
    const warningCount = auditLogs.filter((l) => l.status === 'warning').length;
    return {
      total: auditLogs.length,
      success: successCount,
      failed: failedCount,
      warning: warningCount,
    };
  }, []);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

      return matchesSearch && matchesCategory && matchesAction && matchesStatus;
    });
  }, [searchTerm, filterCategory, filterAction, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-MY', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-500 mt-1">Track all system activities and user actions</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Refresh</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.total.toLocaleString()}
          label="Total Events (24h)"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
          value={stats.success.toLocaleString()}
          label="Successful"
          valueColor="text-emerald-600"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5 text-red-600" />}
          iconBg="bg-red-50"
          value={stats.failed}
          label="Failed"
          valueColor="text-red-600"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-50"
          value={stats.warning}
          label="Warnings"
          valueColor="text-amber-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs by user, resource, or details..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value as FilterCategory);
                setCurrentPage(1);
              }}
              className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value as FilterAction);
                setCurrentPage(1);
              }}
              className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {actions.map((action) => (
                <option key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action.replace('_', ' ')}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as FilterStatus);
                setCurrentPage(1);
              }}
              className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Timestamp</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Resource</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden xl:table-cell">Details</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">IP Address</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLogs.map((log) => {
                const statusStyle = getStatusBadge(log.status);
                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="whitespace-nowrap">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{log.userName}</p>
                          <p className="text-xs text-gray-500 truncate">{log.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded flex items-center justify-center bg-gray-50">
                          {getActionIcon(log.action)}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{log.action.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 truncate block max-w-[150px]" title={log.resource}>
                        {log.resource}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="text-sm text-gray-600 truncate block max-w-[200px]" title={log.details}>
                        {log.details}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.icon}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <EmptyState
            icon={<BarChart3 className="w-8 h-8 text-gray-400" />}
            title="No logs found"
            description="Try adjusting your search or filter criteria"
            action={{
              label: 'Clear filters',
              onClick: () => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterAction('all');
                setFilterStatus('all');
              },
            }}
          />
        )}

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
            showingFrom={(currentPage - 1) * itemsPerPage + 1}
            showingTo={Math.min(currentPage * itemsPerPage, filteredLogs.length)}
          />
        )}
      </div>
    </div>
  );
}
