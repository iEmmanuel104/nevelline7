import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { 
  Search, 
  Eye,
  Package,
  RefreshCw,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ShoppingCart,
  Link,
  User,
  Calendar,
  TrendingUp,
  DollarSign,
  X,
  Download,
  Filter,
  Clock
} from 'lucide-react';
import api from '../../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

interface Order {
  _id: string;
  orderNumber: string;
  orderType?: 'store' | 'payment_link'; // New field to distinguish order source
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentReference?: string;
  createdAt: string;
}

const orderService = {
  async getOrders(params?: any) {
    const { data } = await api.get('/orders', { params });
    return data.data;
  },

  async updateOrderStatus(id: string, status: string) {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  async verifyPayment(reference: string) {
    const { data } = await api.get(`/payments/verify/${reference}`);
    return data;
  },

  async checkPaymentStatus(transactionId: string) {
    const { data } = await api.get(`/payments/transaction/${transactionId}`);
    return data;
  }
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};


export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', { page, search, status: statusFilter, orderType: orderTypeFilter }],
    queryFn: () => orderService.getOrders({ 
      page, 
      limit: 15, 
      search: search || undefined,
      status: statusFilter || undefined,
      orderType: orderTypeFilter || undefined
    }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (reference: string) => orderService.verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ id: orderId, status: newStatus });
  };

  const handleVerifyPayment = async (reference: string) => {
    try {
      const result = await verifyPaymentMutation.mutateAsync(reference);
      if (result.success) {
        alert(`Payment verified: ${result.data.status}`);
      } else {
        alert(`Payment verification failed: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to verify payment');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
                Orders Management
              </h1>
              <p className="text-gray-600 mt-1">Track and manage all store and payment link orders</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {data.pagination?.totalItems || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">All time orders</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {data.orders?.filter((o: Order) => o.status === 'completed').length || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Fulfilled orders</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Processing</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">
                    {data.orders?.filter((o: Order) => o.status === 'processing').length || 0}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Active orders</p>
                </div>
                <div className="p-3 bg-yellow-500 rounded-full">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Payment Links</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {data.orders?.filter((o: Order) => o.orderType === 'payment_link').length || 0}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Link orders</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Link className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Enhanced Search and Filters */}
        <Card className="p-6 mb-8 shadow-sm">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by order number, customer name, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="lg:w-52">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="processing">🔄 Processing</option>
                  <option value="completed">✅ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
              
              <div className="lg:w-52">
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <select
                  className="w-full h-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm"
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="store">🛒 Store Orders</option>
                  <option value="payment_link">🔗 Payment Links</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <Card className="p-12 text-center bg-white shadow-sm">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-blue-600">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading orders...
            </div>
            <h3 className="text-lg font-medium text-gray-900 mt-2">Fetching Order Data</h3>
            <p className="text-gray-500 mt-1">Please wait while we retrieve your orders...</p>
          </Card>
        ) : !data?.orders?.length ? (
          <Card className="p-12 text-center bg-white shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {statusFilter || orderTypeFilter || search ? 
                'No orders match your current filters. Try adjusting your search criteria or clearing filters.' :
                'No orders have been placed yet. Orders will appear here once customers make purchases through your store or payment links.'
              }
            </p>
            {(statusFilter || orderTypeFilter || search) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setOrderTypeFilter('');
                }}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <Card className="bg-white shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data?.orders?.map((order: Order) => {
                  return (
                    <tr key={order._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                            #{order.orderNumber.slice(-3)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {order.orderNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              Order ID: {order._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          order.orderType === 'payment_link' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {order.orderType === 'payment_link' ? (
                            <>
                              <Link className="h-3 w-3 mr-1" />
                              Payment Link
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Store Order
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                            {order.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">{order.items.length}</span>
                          <span className="text-gray-500 ml-1">
                            item{order.items.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-lg font-bold text-green-600">
                            ₦{order.total?.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`text-xs font-semibold px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${statusColors[order.status]}`}
                          disabled={updateStatusMutation.isPending}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="processing">🔄 Processing</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {order.paymentStatus === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {order.paymentStatus === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {order.paymentStatus === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {order.paymentStatus === 'paid' ? 'Paid' : 
                             order.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                          </span>
                          {order.paymentReference && order.paymentStatus !== 'paid' && (
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerifyPayment(order.paymentReference!)}
                                disabled={verifyPaymentMutation.isPending}
                                className="text-xs py-1 h-7 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                              >
                                {verifyPaymentMutation.isPending ? (
                                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                )}
                                Verify
                              </Button>
                            </div>
                          )}
                          {order.paymentReference && (
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              Ref: {order.paymentReference.slice(-8)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all shadow-sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Enhanced Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 gap-4">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Showing <span className="font-bold text-blue-600">{((data.pagination.currentPage - 1) * 15) + 1}</span> to <span className="font-bold text-blue-600">{Math.min(data.pagination.currentPage * 15, data.pagination.totalItems)}</span> of <span className="font-bold">{data.pagination.totalItems}</span> orders
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Page {data.pagination.currentPage} of {data.pagination.totalPages}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={!data.pagination.hasPrev}
                    className="bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!data.pagination.hasNext}
                    className="bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
          </Card>
        )}

        {/* Enhanced Order Detail Modal */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={(status) => {
              handleStatusUpdate(selectedOrder._id, status);
              setSelectedOrder(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Enhanced Order Detail Modal Component
function OrderDetailModal({ 
  order, 
  isOpen,
  onClose,
  onStatusUpdate
}: { 
  order: Order; 
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              #{order.orderNumber.slice(-3)}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                Order #{order.orderNumber}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </DialogTitle>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
          {/* Customer Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {order.customerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                  <p className="font-medium text-gray-900">{order.customerEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone Number</p>
                  <p className="font-medium text-gray-900">{order.customerPhone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Order Type</span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                  order.orderType === 'payment_link' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.orderType === 'payment_link' ? 'Payment Link' : 'Store Order'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Total Amount</span>
                </div>
                <span className="text-xl font-bold text-green-600">₦{order.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Payment Status</span>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
              {order.paymentReference && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Payment Reference</span>
                  <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{order.paymentReference}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Order Items ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Unit Price: ₦{item.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <span className="text-xl font-bold text-gray-900">Order Total:</span>
              <span className="text-2xl font-bold text-blue-600">₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Status Management */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-600" />
            Order Management
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Update Status:</label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                defaultValue={order.status}
                onChange={(e) => onStatusUpdate(e.target.value)}
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="completed">✅ Completed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}