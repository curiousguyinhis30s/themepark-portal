import { useState, useCallback } from 'react';
import { useWebSocketEvent, RealTimeUpdate } from '../context/WebSocketContext';

// Hook for real-time attraction wait times
export function useRealTimeWaitTimes() {
  const [waitTimes, setWaitTimes] = useState<Map<string, { waitTime: number; standbyWait: number }>>(new Map());

  const handleUpdate = useCallback((payload: RealTimeUpdate['attraction_wait_update']) => {
    setWaitTimes((prev) => {
      const newMap = new Map(prev);
      newMap.set(payload.attractionId, {
        waitTime: payload.waitTime,
        standbyWait: payload.standbyWait,
      });
      return newMap;
    });
  }, []);

  useWebSocketEvent('attraction_wait_update', handleUpdate);

  return waitTimes;
}

// Hook for real-time visitor counts
export function useRealTimeVisitorCounts() {
  const [visitorCounts, setVisitorCounts] = useState<Map<string, number>>(new Map());

  const handleUpdate = useCallback((payload: RealTimeUpdate['visitor_count_update']) => {
    setVisitorCounts((prev) => {
      const newMap = new Map(prev);
      newMap.set(payload.zoneId, payload.currentVisitors);
      return newMap;
    });
  }, []);

  useWebSocketEvent('visitor_count_update', handleUpdate);

  return visitorCounts;
}

// Hook for real-time queue updates
export function useRealTimeQueues() {
  const [queues, setQueues] = useState<Map<string, { currentGroup: number; nextGroup: number }>>(new Map());

  const handleUpdate = useCallback((payload: RealTimeUpdate['queue_update']) => {
    setQueues((prev) => {
      const newMap = new Map(prev);
      newMap.set(payload.attractionId, {
        currentGroup: payload.currentGroup,
        nextGroup: payload.nextGroup,
      });
      return newMap;
    });
  }, []);

  useWebSocketEvent('queue_update', handleUpdate);

  return queues;
}

// Hook for real-time ticket sales
export function useRealTimeTicketSales() {
  const [sales, setSales] = useState<Array<RealTimeUpdate['ticket_sale'] & { timestamp: Date }>>([]);

  const handleUpdate = useCallback((payload: RealTimeUpdate['ticket_sale']) => {
    setSales((prev) => {
      const newSales = [...prev, { ...payload, timestamp: new Date() }];
      // Keep only last 100 sales
      return newSales.slice(-100);
    });
  }, []);

  useWebSocketEvent('ticket_sale', handleUpdate);

  return sales;
}

// Hook for maintenance alerts
export function useMaintenanceAlerts() {
  const [alerts, setAlerts] = useState<Array<RealTimeUpdate['maintenance_alert'] & { timestamp: Date }>>([]);

  const handleUpdate = useCallback((payload: RealTimeUpdate['maintenance_alert']) => {
    setAlerts((prev) => {
      const newAlerts = [...prev, { ...payload, timestamp: new Date() }];
      // Keep only last 50 alerts
      return newAlerts.slice(-50);
    });
  }, []);

  useWebSocketEvent('maintenance_alert', handleUpdate);

  const dismissAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { alerts, dismissAlert };
}

// Hook for attraction status changes
export function useRealTimeAttractionStatus() {
  const [statuses, setStatuses] = useState<Map<string, 'open' | 'closed' | 'maintenance'>>(new Map());

  const handleUpdate = useCallback((payload: RealTimeUpdate['attraction_status_change']) => {
    setStatuses((prev) => {
      const newMap = new Map(prev);
      newMap.set(payload.attractionId, payload.status);
      return newMap;
    });
  }, []);

  useWebSocketEvent('attraction_status_change', handleUpdate);

  return statuses;
}

// Combined dashboard hook for real-time data
export function useDashboardRealTime() {
  const waitTimes = useRealTimeWaitTimes();
  const visitorCounts = useRealTimeVisitorCounts();
  const queues = useRealTimeQueues();
  const ticketSales = useRealTimeTicketSales();
  const { alerts: maintenanceAlerts, dismissAlert } = useMaintenanceAlerts();
  const attractionStatuses = useRealTimeAttractionStatus();

  // Calculate totals
  const totalVisitors = Array.from(visitorCounts.values()).reduce((sum, count) => sum + count, 0);
  const totalSalesToday = ticketSales.reduce((sum, sale) => sum + sale.amount, 0);
  const criticalAlerts = maintenanceAlerts.filter((a) => a.priority === 'critical').length;

  return {
    waitTimes,
    visitorCounts,
    queues,
    ticketSales,
    maintenanceAlerts,
    dismissAlert,
    attractionStatuses,
    totals: {
      totalVisitors,
      totalSalesToday,
      criticalAlerts,
    },
  };
}
