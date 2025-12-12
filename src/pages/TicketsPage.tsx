import { useState, useMemo } from 'react';
import {
  Ticket,
  QrCode,
  CheckCircle2,
  XCircle,
  DollarSign,
  Users,
  Clock,
  Plus,
  Edit,
  Star,
  Sparkles,
  Crown,
  CalendarDays,
  Package,
  Percent,
} from 'lucide-react';
import { ticketTypes, type TicketType } from '@themepark/shared';
import { StatCard } from '../components/ui';

function getTicketIcon(category: TicketType['category']) {
  switch (category) {
    case 'admission': return <CalendarDays className="w-5 h-5 text-teal-600" />;
    case 'annual_pass': return <Crown className="w-5 h-5 text-amber-600" />;
    case 'vip': return <Sparkles className="w-5 h-5 text-purple-600" />;
    case 'group': return <Users className="w-5 h-5 text-blue-600" />;
    case 'special_event': return <Star className="w-5 h-5 text-pink-600" />;
    default: return <Ticket className="w-5 h-5 text-gray-600" />;
  }
}

function getCategoryBadge(category: TicketType['category']) {
  const styles: Record<string, string> = {
    admission: 'bg-teal-100 text-teal-700',
    annual_pass: 'bg-amber-100 text-amber-700',
    vip: 'bg-purple-100 text-purple-700',
    group: 'bg-blue-100 text-blue-700',
    special_event: 'bg-pink-100 text-pink-700',
  };
  return styles[category] || 'bg-gray-100 text-gray-600';
}

function getAvailabilityBadge(availability: TicketType['availability']) {
  switch (availability) {
    case 'available': return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Available' };
    case 'limited': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Limited' };
    case 'sold_out': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Sold Out' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unknown' };
  }
}

function formatCategoryLabel(category: string | undefined): string {
  if (!category) return 'General';
  return category.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export default function TicketsPage() {
  const [validateCode, setValidateCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    ticket?: { visitorName: string; ticketTypeName: string; validFrom: string; validUntil: string };
    error?: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Use shared data directly - no API needed
  const displayTicketTypes = ticketTypes;

  // Calculate stats from ticket types
  const stats = useMemo(() => {
    const availableTypes = displayTicketTypes.filter((t: TicketType) => t.availability !== 'sold_out');
    const totalTodaySales = displayTicketTypes.reduce((sum: number, t: TicketType) => sum + (t.sales?.today ?? 0), 0);
    const totalTodayRevenue = displayTicketTypes.reduce((sum: number, t: TicketType) => sum + ((t.sales?.today ?? 0) * t.price), 0);
    return {
      totalTypes: displayTicketTypes.length,
      availableTypes: availableTypes.length,
      todaySales: totalTodaySales,
      todayRevenue: totalTodayRevenue,
    };
  }, [displayTicketTypes]);

  const handleValidate = async () => {
    if (!validateCode) return;
    setIsValidating(true);

    // Mock validation - simulate API call
    setTimeout(() => {
      if (validateCode.startsWith('TK')) {
        setValidationResult({
          valid: true,
          ticket: {
            visitorName: 'John Smith',
            ticketTypeName: 'Day Pass',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date().toISOString().split('T')[0],
          },
        });
      } else {
        setValidationResult({ valid: false, error: 'Invalid ticket code' });
      }
      setIsValidating(false);
    }, 500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        <p className="text-gray-500 mt-1">Manage ticket types and validate entries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Ticket className="w-6 h-6 text-teal-600" />}
          iconBg="bg-teal-50"
          value={stats.todaySales.toLocaleString()}
          label="Tickets Sold Today"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-emerald-600" />}
          iconBg="bg-emerald-50"
          value={formatPrice(stats.todayRevenue)}
          label="Revenue Today"
          valueColor="text-emerald-600"
        />
        <StatCard
          icon={<Package className="w-6 h-6 text-blue-600" />}
          iconBg="bg-blue-50"
          value={stats.totalTypes}
          label="Ticket Types"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          iconBg="bg-amber-50"
          value={stats.availableTypes}
          label="Available Types"
        />
      </div>

      {/* Ticket Validator */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <QrCode className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Validate Ticket</h2>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            value={validateCode}
            onChange={(e) => setValidateCode(e.target.value)}
            placeholder="Enter ticket code or scan QR..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
          />
          <button
            onClick={handleValidate}
            disabled={isValidating || !validateCode}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Validate
              </>
            )}
          </button>
        </div>

        {validationResult && (
          <div
            className={`mt-4 p-4 rounded-xl ${
              validationResult.valid
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {validationResult.valid ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-700 mb-1">Valid Ticket</p>
                  <p className="text-emerald-600">
                    {validationResult.ticket?.visitorName} - {validationResult.ticket?.ticketTypeName}
                  </p>
                  <p className="text-emerald-600 text-sm mt-1">
                    Valid: {validationResult.ticket?.validFrom} to {validationResult.ticket?.validUntil}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-700 mb-1">Invalid Ticket</p>
                  <p className="text-red-600">{validationResult.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Types */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ticket Types</h2>
              <p className="text-sm text-gray-500">{stats.availableTypes} available types</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4" />
            Add Type
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTicketTypes.map((type: TicketType) => {
            const availabilityBadge = getAvailabilityBadge(type.availability);
            const hasDiscount = type.originalPrice && type.originalPrice > type.price;
            const discountPercent = hasDiscount
              ? Math.round(((type.originalPrice! - type.price) / type.originalPrice!) * 100)
              : 0;

            return (
              <div
                key={type.id}
                className={`border rounded-xl p-5 hover:shadow-md transition-all ${
                  type.availability !== 'sold_out' ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getTicketIcon(type.category || (type as any).type)}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryBadge(type.category || (type as any).type)}`}>
                      {formatCategoryLabel(type.category || (type as any).type)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${availabilityBadge.bg} ${availabilityBadge.text}`}>
                    {availabilityBadge.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{type.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{type.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(type.price)}</span>
                    {hasDiscount && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(type.originalPrice!)}</span>
                        <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          <Percent className="w-3 h-3" />
                          {discountPercent}% off
                        </span>
                      </>
                    )}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {type.includes && type.includes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {type.includes.slice(0, 3).map((include: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {include}
                        </span>
                      ))}
                      {type.includes.length > 3 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{type.includes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {/* Sales info */}
                {type.sales && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                    <div className="text-gray-500">
                      Today: <span className="font-medium text-gray-900">{type.sales.today ?? 0}</span>
                    </div>
                    <div className="text-gray-500">
                      This month: <span className="font-medium text-gray-900">{(type.sales.thisMonth ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
