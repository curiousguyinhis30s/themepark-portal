import React from 'react';
import { useWebSocket } from '../context/WebSocketContext';

export default function RealTimeIndicator() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span className="text-xs text-gray-500">
        {isConnected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}

// Animated value component for real-time updates
interface AnimatedValueProps {
  value: number | string;
  className?: string;
  format?: (value: number | string) => string;
}

export function AnimatedValue({ value, className = '', format }: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formattedValue = format ? format(displayValue) : displayValue;

  return (
    <span
      className={`transition-all duration-300 ${
        isAnimating ? 'text-primary-600 scale-110' : ''
      } ${className}`}
    >
      {formattedValue}
    </span>
  );
}

// Real-time alert banner
interface AlertBannerProps {
  alerts: Array<{
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
  onDismiss: (index: number) => void;
}

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  const criticalAlerts = alerts.filter((a) => a.priority === 'critical');

  if (criticalAlerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="animate-pulse">🚨</span>
          <span className="font-medium">{criticalAlerts[0].message}</span>
        </div>
        <button
          onClick={() => onDismiss(alerts.indexOf(criticalAlerts[0]))}
          className="text-white/80 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Live data card component
interface LiveDataCardProps {
  title: string;
  value: number | string;
  icon: string;
  change?: number;
  format?: (value: number | string) => string;
  isLive?: boolean;
}

export function LiveDataCard({ title, value, icon, change, format, isLive = true }: LiveDataCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {isLive && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-800">
        <AnimatedValue value={value} format={format} />
      </p>
      <p className="text-sm text-gray-500">{title}</p>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}% from yesterday
        </p>
      )}
    </div>
  );
}
