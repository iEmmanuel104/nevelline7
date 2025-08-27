import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  Mail, 
  Phone, 
  Calendar, 
  ShoppingBag, 
  TrendingUp,
  User,
  Clock,
  DollarSign,
  X
} from 'lucide-react';

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string;
  firstOrderDate: string;
}

interface Customer {
  _id: string;
  email: string;
  name: string;
  phone: string;
  stats: CustomerStats;
  createdAt: string;
  lastSeen: string;
}

interface CustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerModal({ customer, isOpen, onClose }: CustomerModalProps) {
  if (!customer) return null;

  const getCustomerSegment = (stats: CustomerStats) => {
    if (stats.totalOrders >= 10) return { label: 'VIP', color: 'bg-purple-100 text-purple-700 border-purple-200' };
    if (stats.totalOrders >= 5) return { label: 'Loyal', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (stats.totalOrders >= 2) return { label: 'Regular', color: 'bg-green-100 text-green-700 border-green-200' };
    return { label: 'New', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const segment = getCustomerSegment(customer.stats);
  const daysSinceLastOrder = customer.stats.lastOrderDate 
    ? Math.floor((Date.now() - new Date(customer.stats.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {customer.name || 'Anonymous Customer'}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${segment.color}`}>
                  {segment.label}
                </span>
              </DialogTitle>
              <p className="text-gray-500 text-sm">
                Member since {new Date(customer.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Contact Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{customer.stats.totalOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦{customer.stats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₦{customer.stats.averageOrderValue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Since Last Order</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {daysSinceLastOrder !== null ? daysSinceLastOrder : 'Never'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>

          {/* Order History Timeline */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Order History
            </h3>
            <div className="space-y-3">
              {customer.stats.firstOrderDate && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-800">First Order</p>
                    <p className="text-sm text-green-600">
                      {new Date(customer.stats.firstOrderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-green-300 text-green-600">
                    {Math.floor((Date.now() - new Date(customer.stats.firstOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </span>
                </div>
              )}

              {customer.stats.lastOrderDate && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-800">Most Recent Order</p>
                    <p className="text-sm text-blue-600">
                      {new Date(customer.stats.lastOrderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-blue-300 text-blue-600">
                    {daysSinceLastOrder} days ago
                  </span>
                </div>
              )}

              {!customer.stats.firstOrderDate && !customer.stats.lastOrderDate && (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No order history available</p>
                  <p className="text-sm text-gray-400">This customer hasn't placed any orders yet</p>
                </div>
              )}
            </div>
          </Card>

          {/* Customer Insights */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Customer Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-800 mb-1">Customer Value Tier</p>
                <p className="text-indigo-600">
                  {customer.stats.totalSpent >= 50000 ? 'High Value Customer' :
                   customer.stats.totalSpent >= 20000 ? 'Medium Value Customer' :
                   customer.stats.totalSpent >= 5000 ? 'Regular Customer' : 'New Customer'}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-1">Loyalty Status</p>
                <p className="text-yellow-600">
                  {customer.stats.totalOrders >= 10 ? 'Highly Loyal' :
                   customer.stats.totalOrders >= 5 ? 'Loyal Customer' :
                   customer.stats.totalOrders >= 2 ? 'Repeat Customer' : 'One-time Customer'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}