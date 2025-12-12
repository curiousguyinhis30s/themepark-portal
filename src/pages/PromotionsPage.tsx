import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Ticket,
  TrendingDown,
  Calendar,
  Percent,
  DollarSign,
  Gift,
  Package,
  Tag,
  Plus,
  X,
  Clock,
} from 'lucide-react';

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'bundle';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  applicableTo: string[];
  description: string;
}

const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Holiday Special',
    code: 'HOLIDAY25',
    type: 'percentage',
    value: 25,
    minPurchase: 100,
    maxDiscount: 50,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    usageLimit: 1000,
    usedCount: 423,
    status: 'active',
    applicableTo: ['Day Pass', 'Express Pass'],
    description: 'Get 25% off on all day passes during the holiday season',
  },
  {
    id: '2',
    name: 'Family Bundle',
    code: 'FAMILY4',
    type: 'bundle',
    value: 299,
    minPurchase: 0,
    maxDiscount: 0,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    usageLimit: 500,
    usedCount: 189,
    status: 'active',
    applicableTo: ['Day Pass'],
    description: 'Family pack: 4 day passes for RM 299 (save RM 97)',
  },
  {
    id: '3',
    name: 'Early Bird',
    code: 'EARLY2025',
    type: 'percentage',
    value: 30,
    minPurchase: 50,
    maxDiscount: 60,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    usageLimit: 2000,
    usedCount: 0,
    status: 'scheduled',
    applicableTo: ['Day Pass', 'Season Pass'],
    description: 'Early bird discount for January visits',
  },
  {
    id: '4',
    name: 'Flash Sale',
    code: 'FLASH50',
    type: 'fixed',
    value: 50,
    minPurchase: 150,
    maxDiscount: 50,
    startDate: '2024-12-10',
    endDate: '2024-12-10',
    usageLimit: 100,
    usedCount: 100,
    status: 'expired',
    applicableTo: ['VIP Pass'],
    description: 'RM 50 off VIP passes - limited time only',
  },
  {
    id: '5',
    name: 'Student Discount',
    code: 'STUDENT20',
    type: 'percentage',
    value: 20,
    minPurchase: 0,
    maxDiscount: 30,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: 5000,
    usedCount: 2341,
    status: 'active',
    applicableTo: ['Day Pass'],
    description: '20% off for students with valid ID',
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case 'active':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'scheduled':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'expired':
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
    case 'paused':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'percentage':
      return <Percent className="w-6 h-6" />;
    case 'fixed':
      return <DollarSign className="w-6 h-6" />;
    case 'bogo':
      return <Gift className="w-6 h-6" />;
    case 'bundle':
      return <Package className="w-6 h-6" />;
    default:
      return <Tag className="w-6 h-6" />;
  }
}

function formatValue(promo: Promotion) {
  switch (promo.type) {
    case 'percentage':
      return `${promo.value}% OFF`;
    case 'fixed':
      return `RM ${promo.value} OFF`;
    case 'bogo':
      return 'Buy 1 Get 1';
    case 'bundle':
      return `RM ${promo.value}`;
    default:
      return String(promo.value);
  }
}

export default function PromotionsPage() {
  const [_selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = useMemo(() => {
    const activeCount = mockPromotions.filter((p) => p.status === 'active').length;
    const totalRedemptions = mockPromotions.reduce((sum, p) => sum + p.usedCount, 0);
    const totalSavings = mockPromotions.reduce((sum, p) => {
      if (p.type === 'percentage') return sum + p.usedCount * p.maxDiscount;
      if (p.type === 'fixed') return sum + p.usedCount * p.value;
      return sum;
    }, 0);
    const scheduledCount = mockPromotions.filter((p) => p.status === 'scheduled').length;

    return { activeCount, totalRedemptions, totalSavings, scheduledCount };
  }, []);

  const filteredPromotions = mockPromotions.filter((p) => filterStatus === 'all' || p.status === filterStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500 mt-1">Manage discount codes and special offers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Promotion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCount}</p>
              <p className="text-sm text-gray-500">Active Promos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRedemptions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Redemptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">RM {stats.totalSavings.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Customer Savings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledCount}</p>
              <p className="text-sm text-gray-500">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        {['all', 'active', 'scheduled', 'expired', 'paused'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg capitalize font-medium transition-colors ${
              filterStatus === status
                ? 'bg-teal-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPromotions.map((promo) => {
          const statusStyle = getStatusStyle(promo.status);

          return (
            <div
              key={promo.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPromo(promo)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{promo.name}</h3>
                    <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {promo.code}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    {promo.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    {getTypeIcon(promo.type)}
                  </div>
                  <span className="text-2xl font-bold text-teal-600">{formatValue(promo)}</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{promo.description}</p>

                {/* Usage Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Usage</span>
                    <span className="font-medium text-gray-900">
                      {promo.usedCount} / {promo.usageLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${(promo.usedCount / promo.usageLimit) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{promo.startDate}</span>
                  <span className="text-gray-300">→</span>
                  <span>{promo.endDate}</span>
                </div>

                {/* Applicable Products */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {promo.applicableTo.map((item, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-between">
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Edit</button>
                {promo.status === 'active' ? (
                  <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">Pause</button>
                ) : promo.status === 'paused' ? (
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Resume</button>
                ) : null}
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
                <h2 className="text-xl font-bold text-gray-900">Create Promotion</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="SUMMER25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount Off</option>
                    <option value="bogo">Buy One Get One</option>
                    <option value="bundle">Bundle Price</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase (RM)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (RM)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Start Date
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
                      End Date
                    </span>
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={2}
                  placeholder="Describe this promotion..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable To</label>
                <div className="flex flex-wrap gap-2">
                  {['Day Pass', 'Express Pass', 'Season Pass', 'VIP Pass', 'Food & Beverage', 'Merchandise'].map(
                    (item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input type="checkbox" className="rounded text-teal-600" />
                        <span className="text-sm">{item}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                Create Promotion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
