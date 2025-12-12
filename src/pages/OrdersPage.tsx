import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ShoppingBag, CheckCircle, XCircle, ChefHat, AlertCircle, X } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  time: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Guest #4521',
    items: [
      { name: 'Thunder Burger', quantity: 2, price: 18.0 },
      { name: 'Fries Large', quantity: 2, price: 4.5 },
    ],
    total: 45.0,
    status: 'pending',
    time: '2 mins ago',
    notes: 'No onions please',
  },
  {
    id: 'ORD-002',
    customer: 'Guest #4520',
    items: [{ name: 'Mega Combo', quantity: 1, price: 32.5 }],
    total: 32.5,
    status: 'preparing',
    time: '8 mins ago',
  },
  {
    id: 'ORD-003',
    customer: 'Guest #4519',
    items: [{ name: 'Soft Drink Large', quantity: 3, price: 6.0 }],
    total: 18.0,
    status: 'ready',
    time: '15 mins ago',
  },
  {
    id: 'ORD-004',
    customer: 'Guest #4518',
    items: [{ name: 'Kids Meal', quantity: 2, price: 12.0 }],
    total: 24.0,
    status: 'completed',
    time: '45 mins ago',
  },
  {
    id: 'ORD-005',
    customer: 'Guest #4517',
    items: [{ name: 'Ice Cream Sundae', quantity: 1, price: 8.0 }],
    total: 8.0,
    status: 'cancelled',
    time: '1 hour ago',
  },
];

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType }
> = {
  pending: { label: 'Pending', variant: 'outline', icon: Clock },
  preparing: { label: 'Preparing', variant: 'default', icon: ChefHat },
  ready: { label: 'Ready', variant: 'secondary', icon: CheckCircle },
  completed: { label: 'Completed', variant: 'secondary', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'destructive', icon: XCircle },
};

const statusActions: Record<string, string> = {
  pending: 'Start Preparing',
  preparing: 'Mark Ready',
  ready: 'Complete Order',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nextStatus: Record<string, 'preparing' | 'ready' | 'completed'> = {
            pending: 'preparing',
            preparing: 'ready',
            ready: 'completed',
          };
          return { ...order, status: nextStatus[order.status] || order.status };
        }
        return order;
      })
    );
  };

  const stats = [
    {
      label: 'Pending',
      count: orders.filter((o) => o.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Preparing',
      count: orders.filter((o) => o.status === 'preparing').length,
      icon: ChefHat,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Ready',
      count: orders.filter((o) => o.status === 'ready').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Completed',
      count: orders.filter((o) => o.status === 'completed').length,
      icon: ShoppingBag,
      color: 'text-muted-foreground bg-muted',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage incoming orders from customers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;

          return (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <Badge variant={status.variant}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customer} • {order.time}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>

                {order.notes && (
                  <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg mb-3 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span className="text-amber-700">{order.notes}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-bold">RM {order.total.toFixed(2)}</span>
                  {statusActions[order.status] && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(order.id);
                      }}
                    >
                      {statusActions[order.status]}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders found with selected filter</p>
          </CardContent>
        </Card>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedOrder.id}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>RM {(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>RM {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Special Notes</p>
                  <p className="text-amber-700">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant={statusConfig[selectedOrder.status].variant}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
