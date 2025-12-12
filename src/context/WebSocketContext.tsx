import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

interface WebSocketMessage {
  type: string;
  payload: unknown;
  timestamp: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (message: WebSocketMessage) => void;
  subscribe: (eventType: string, callback: (payload: unknown) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws';

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [subscribers, setSubscribers] = useState<Map<string, Set<(payload: unknown) => void>>>(new Map());

  // Connect to WebSocket
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Send authentication token if available
      const token = localStorage.getItem('token');
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', payload: { token } }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);

        // Notify subscribers
        const typeSubscribers = subscribers.get(message.type);
        if (typeSubscribers) {
          typeSubscribers.forEach((callback) => callback(message.payload));
        }

        // Also notify wildcard subscribers
        const wildcardSubscribers = subscribers.get('*');
        if (wildcardSubscribers) {
          wildcardSubscribers.forEach((callback) => callback(message));
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        setSocket(null);
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // Send message
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }, [socket]);

  // Subscribe to specific event types
  const subscribe = useCallback((eventType: string, callback: (payload: unknown) => void) => {
    setSubscribers((prev) => {
      const newSubscribers = new Map(prev);
      if (!newSubscribers.has(eventType)) {
        newSubscribers.set(eventType, new Set());
      }
      newSubscribers.get(eventType)!.add(callback);
      return newSubscribers;
    });

    // Return unsubscribe function
    return () => {
      setSubscribers((prev) => {
        const newSubscribers = new Map(prev);
        const typeSubscribers = newSubscribers.get(eventType);
        if (typeSubscribers) {
          typeSubscribers.delete(callback);
          if (typeSubscribers.size === 0) {
            newSubscribers.delete(eventType);
          }
        }
        return newSubscribers;
      });
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

// Hook for subscribing to specific event types
export function useWebSocketEvent<T = unknown>(eventType: string, callback: (payload: T) => void) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(eventType, callback as (payload: unknown) => void);
    return unsubscribe;
  }, [eventType, callback, subscribe]);
}

// Real-time data types
export interface RealTimeUpdate {
  attraction_wait_update: {
    attractionId: string;
    waitTime: number;
    standbyWait: number;
  };
  queue_update: {
    attractionId: string;
    currentGroup: number;
    nextGroup: number;
  };
  visitor_count_update: {
    zoneId: string;
    currentVisitors: number;
  };
  ticket_sale: {
    ticketType: string;
    quantity: number;
    amount: number;
  };
  attraction_status_change: {
    attractionId: string;
    status: 'open' | 'closed' | 'maintenance';
  };
  event_update: {
    eventId: string;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  };
  maintenance_alert: {
    attractionId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  };
  notification_sent: {
    notificationId: string;
    type: string;
    recipients: number;
  };
}
