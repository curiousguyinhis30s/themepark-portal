import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  MapPin,
  Clock,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Wrench,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  CloudRain,
} from 'lucide-react';

// Types
interface Attraction {
  id: string;
  name: string;
  zone: string;
  type: string;
  status: 'open' | 'closed' | 'maintenance' | 'weather_closed';
  waitTime: number;
  capacity: number;
  thrillLevel: number;
  rating: number;
  reviewCount: number;
  dailyRiders: number;
}

// Mock data with realistic theme park attractions
const mockAttractions: Attraction[] = [
  { id: 'attr_001', name: 'Thunder Mountain Express', zone: 'Adventure Peak', type: 'Roller Coaster', status: 'open', waitTime: 45, capacity: 1800, thrillLevel: 5, rating: 4.8, reviewCount: 12847, dailyRiders: 4200 },
  { id: 'attr_002', name: 'Mystic River Rapids', zone: 'Tropical Paradise', type: 'Water Ride', status: 'open', waitTime: 30, capacity: 1200, thrillLevel: 3, rating: 4.6, reviewCount: 8934, dailyRiders: 2800 },
  { id: 'attr_003', name: 'Galaxy Voyager', zone: 'Future World', type: 'Dark Ride', status: 'open', waitTime: 25, capacity: 2400, thrillLevel: 2, rating: 4.9, reviewCount: 15623, dailyRiders: 5600 },
  { id: 'attr_004', name: "Dragon's Fury", zone: 'Adventure Peak', type: 'Roller Coaster', status: 'open', waitTime: 60, capacity: 1400, thrillLevel: 5, rating: 4.7, reviewCount: 9876, dailyRiders: 3500 },
  { id: 'attr_005', name: 'Enchanted Carousel', zone: 'Fantasy Kingdom', type: 'Family', status: 'open', waitTime: 10, capacity: 800, thrillLevel: 1, rating: 4.5, reviewCount: 6543, dailyRiders: 1800 },
  { id: 'attr_006', name: 'Jungle Explorer', zone: 'Tropical Paradise', type: 'Family', status: 'open', waitTime: 15, capacity: 1600, thrillLevel: 2, rating: 4.4, reviewCount: 7234, dailyRiders: 3200 },
  { id: 'attr_007', name: 'Skydive Tower', zone: 'Future World', type: 'Thrill', status: 'maintenance', waitTime: 0, capacity: 800, thrillLevel: 5, rating: 4.6, reviewCount: 5432, dailyRiders: 0 },
  { id: 'attr_008', name: 'Pirates Cove Adventure', zone: 'Heritage Harbor', type: 'Interactive', status: 'open', waitTime: 20, capacity: 2000, thrillLevel: 2, rating: 4.7, reviewCount: 11234, dailyRiders: 4800 },
  { id: 'attr_009', name: 'Twisted Typhoon', zone: 'Tropical Paradise', type: 'Water Ride', status: 'open', waitTime: 50, capacity: 1000, thrillLevel: 4, rating: 4.8, reviewCount: 6789, dailyRiders: 2400 },
  { id: 'attr_010', name: 'Starlight Theater', zone: 'Fantasy Kingdom', type: 'Show', status: 'open', waitTime: 0, capacity: 2000, thrillLevel: 1, rating: 4.9, reviewCount: 8765, dailyRiders: 6000 },
];

// API simulation
const fetchAttractions = async (): Promise<Attraction[]> => {
  await new Promise((r) => setTimeout(r, 800));
  return mockAttractions;
};

export default function AttractionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Attraction>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: attractions = [], isLoading, refetch } = useQuery({
    queryKey: ['attractions'],
    queryFn: fetchAttractions,
  });

  // Derived data
  const zones = useMemo(() => [...new Set(attractions.map((a) => a.zone))], [attractions]);

  const filteredAttractions = useMemo(() => {
    return attractions
      .filter((a) => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.zone.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
        const matchesZone = zoneFilter === 'all' || a.zone === zoneFilter;
        return matchesSearch && matchesStatus && matchesZone;
      })
      .sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const comparison = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [attractions, searchTerm, statusFilter, zoneFilter, sortField, sortDirection]);

  // Stats
  const stats = useMemo(() => {
    const openAttractions = attractions.filter((a) => a.status === 'open');
    return {
      total: attractions.length,
      open: openAttractions.length,
      maintenance: attractions.filter((a) => a.status === 'maintenance').length,
      avgWaitTime: openAttractions.length > 0
        ? Math.round(openAttractions.reduce((sum, a) => sum + a.waitTime, 0) / openAttractions.length)
        : 0,
      totalRiders: attractions.reduce((sum, a) => sum + a.dailyRiders, 0),
    };
  }, [attractions]);

  // Pagination
  const totalPages = Math.ceil(filteredAttractions.length / itemsPerPage);
  const paginatedAttractions = filteredAttractions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: keyof Attraction) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: JSX.Element }> = {
      open: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle className="w-3.5 h-3.5" /> },
      closed: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', icon: <XCircle className="w-3.5 h-3.5" /> },
      maintenance: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Wrench className="w-3.5 h-3.5" /> },
      weather_closed: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', icon: <CloudRain className="w-3.5 h-3.5" /> },
    };
    const { bg, text, icon } = config[status] || config.closed;
    const label = status.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${bg} ${text}`}>
        {icon}
        {label}
      </span>
    );
  };

  const getThrillBadge = (level: number) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${colors[level - 1]}`}>
        {'★'.repeat(level)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Skeleton Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="h-10 w-full bg-slate-200 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-5 flex-1 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Attractions</h1>
          <p className="text-slate-500 mt-1">Manage rides, shows, and experiences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Attraction
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total Attractions</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.open}</p>
              <p className="text-sm text-slate-500">Currently Open</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.avgWaitTime}<span className="text-lg font-normal text-slate-500"> min</span></p>
              <p className="text-sm text-slate-500">Avg Wait Time</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalRiders.toLocaleString()}</p>
              <p className="text-sm text-slate-500">Riders Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search attractions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              >
                <option value="all">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                  >
                    Attraction
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Zone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('waitTime')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                  >
                    Wait Time
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Thrill</th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('rating')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                  >
                    Rating
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('dailyRiders')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider hover:text-slate-900"
                  >
                    Today
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAttractions.map((attraction) => (
                <tr key={attraction.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{attraction.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{attraction.zone}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">
                      {attraction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(attraction.status)}
                  </td>
                  <td className="px-4 py-3">
                    {attraction.status === 'open' && attraction.waitTime > 0 ? (
                      <span className={`text-sm font-medium ${attraction.waitTime > 45 ? 'text-red-600' : attraction.waitTime > 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {attraction.waitTime} min
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {getThrillBadge(attraction.thrillLevel)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium text-slate-900">{attraction.rating}</span>
                      <span className="text-xs text-slate-400">({attraction.reviewCount.toLocaleString()})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-900">{attraction.dailyRiders.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No attractions found</h3>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); setZoneFilter('all'); }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredAttractions.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium text-slate-700">{Math.min(currentPage * itemsPerPage, filteredAttractions.length)}</span> of{' '}
              <span className="font-medium text-slate-700">{filteredAttractions.length}</span> results
            </p>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
