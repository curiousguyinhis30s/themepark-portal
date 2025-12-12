import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  valueColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Shared StatCard component for consistent statistics display across all admin pages.
 *
 * @example
 * <StatCard
 *   icon={<Users className="w-6 h-6 text-teal-600" />}
 *   iconBg="bg-teal-50"
 *   value={1234}
 *   label="Total Users"
 *   valueColor="text-teal-600"
 * />
 */
export function StatCard({
  icon,
  iconBg,
  value,
  label,
  valueColor = 'text-gray-900',
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${valueColor} truncate`}>{value}</p>
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm truncate">{label}</p>
          {subtitle && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
