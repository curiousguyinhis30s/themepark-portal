import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  ChevronDown,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Mail,
  Calendar,
  Ticket,
  Crown,
} from 'lucide-react';
import { users, type User } from '@themepark/shared';
import { Pagination, EmptyState } from '../components/ui/LoadingStates';
import { StatCard } from '../components/ui';

type SortKey = 'name' | 'email' | 'totalTickets' | 'lastVisit' | 'membershipTier';
type SortOrder = 'asc' | 'desc';

function getMembershipBadge(tier: string) {
  const styles: Record<string, string> = {
    platinum: 'bg-purple-100 text-purple-700',
    gold: 'bg-amber-100 text-amber-700',
    silver: 'bg-gray-100 text-gray-700',
    guest: 'bg-blue-100 text-blue-700',
  };
  return styles[tier] || 'bg-gray-100 text-gray-600';
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-600',
    suspended: 'bg-red-100 text-red-700',
    pending_verification: 'bg-amber-100 text-amber-700',
  };
  return styles[status] || 'bg-gray-100 text-gray-600';
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('lastVisit');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate stats
  const stats = useMemo(() => {
    const activeUsers = users.filter((u: User) => u.status === 'active').length;
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const recentUsers = users.filter((u: User) => new Date(u.registeredAt) > thisMonth).length;
    const avgVisits = users.reduce((sum: number, u: User) => sum + u.totalVisits, 0) / users.length;
    return {
      total: users.length,
      active: activeUsers,
      newThisWeek: recentUsers,
      avgVisits: avgVisits.toFixed(1),
    };
  }, []);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u: User) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.phone.includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((u: User) => u.status === statusFilter);
    }

    // Tier filter
    if (tierFilter !== 'all') {
      result = result.filter((u: User) => u.membershipTier === tierFilter);
    }

    // Sort
    result.sort((a: User, b: User) => {
      let comparison = 0;
      switch (sortKey) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'totalTickets':
          comparison = (a.tickets.active + a.tickets.used) - (b.tickets.active + b.tickets.used);
          break;
        case 'lastVisit':
          const aDate = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
          const bDate = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'membershipTier':
          const tierOrder = { platinum: 4, gold: 3, silver: 2, guest: 1 };
          comparison = (tierOrder[a.membershipTier as keyof typeof tierOrder] || 0) -
                      (tierOrder[b.membershipTier as keyof typeof tierOrder] || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, statusFilter, tierFilter, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage registered visitors and their accounts</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.total.toLocaleString()}
          label="Total Users"
        />
        <StatCard
          icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          value={stats.active}
          label="Active This Month"
          valueColor="text-emerald-600"
        />
        <StatCard
          icon={<UserPlus className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
          value={stats.newThisWeek}
          label="New This Week"
          valueColor="text-blue-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
          value={stats.avgVisits}
          label="Avg Visits/User"
        />
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="guest">Guest</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  >
                    User
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Contact
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('membershipTier')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Membership
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('totalTickets')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Tickets
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('lastVisit')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  >
                    Last Visit
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-semibold">
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.totalVisits} visits</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user.email}
                      </div>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getMembershipBadge(user.membershipTier)}`}>
                        {user.membershipTier}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{user.tickets.active + user.tickets.used}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(user.lastVisit)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View details">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More options">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <EmptyState
            icon={<Users className="w-8 h-8 text-gray-400" />}
            title="No users found"
            description="Try adjusting your search or filter criteria"
            action={{
              label: 'Clear filters',
              onClick: () => {
                setSearchTerm('');
                setStatusFilter('all');
                setTierFilter('all');
              },
            }}
          />
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            showingFrom={(currentPage - 1) * itemsPerPage + 1}
            showingTo={Math.min(currentPage * itemsPerPage, filteredUsers.length)}
          />
        )}
      </div>
    </div>
  );
}
