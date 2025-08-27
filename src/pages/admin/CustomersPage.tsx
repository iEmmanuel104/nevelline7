import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CustomerModal from '../../components/CustomerModal';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { 
  Search, 
  Users, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';
import api from '../../lib/api';

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

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  totalStats: {
    totalCustomers: number;
    newCustomersThisMonth: number;
    returningCustomers: number;
    averageLifetimeValue: number;
  };
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch customers with analytics
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search, sortBy, sortOrder],
    queryFn: async (): Promise<CustomersResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        sortOrder,
        ...(search && { search })
      });

      const { data } = await api.get(`/customers?${params}`);
      return data.data;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const exportCustomers = async () => {
    try {
      const response = await api.get('/customers/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export customers');
    }
  };

  const getCustomerSegment = (stats: CustomerStats) => {
    if (stats.totalOrders >= 10) return { label: 'VIP', color: 'bg-purple-100 text-purple-700' };
    if (stats.totalOrders >= 5) return { label: 'Loyal', color: 'bg-blue-100 text-blue-700' };
    if (stats.totalOrders >= 2) return { label: 'Regular', color: 'bg-green-100 text-green-700' };
    return { label: 'New', color: 'bg-gray-100 text-gray-700' };
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Customers
              </h1>
              <p className="text-gray-600 mt-1">Manage and analyze customer relationships</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={exportCustomers}
                className="bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Customer Stats Overview */}
        {customersData?.totalStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Customers</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">
                    {customersData.totalStats.totalCustomers.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Active customer base</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">New This Month</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    +{customersData.totalStats.newCustomersThisMonth.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Monthly growth</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Returning Customers</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {customersData.totalStats.returningCustomers.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Loyal customers</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Avg. Lifetime Value</p>
                  <p className="text-3xl font-bold text-orange-900 mt-1">
                    ₦{customersData.totalStats.averageLifetimeValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Per customer</p>
                </div>
                <div className="p-3 bg-orange-500 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <form onSubmit={handleSearch} className="flex-1 flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search customers by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <Button type="submit" className="h-12 px-6 bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>

            <div className="flex gap-3">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm min-w-48"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="stats.totalSpent-desc">Highest Spender</option>
                <option value="stats.totalSpent-asc">Lowest Spender</option>
                <option value="stats.totalOrders-desc">Most Orders</option>
                <option value="stats.totalOrders-asc">Least Orders</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Customers List */}
        <Card className="overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm text-blue-600">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading customers...
              </div>
            </div>
          ) : !customersData?.customers?.length ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                {search ? 'Try adjusting your search terms or filters to find customers' : 'Customer records will appear here once orders are placed and processed'}
              </p>
            </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order Summary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Segment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Order
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {customersData.customers.map((customer) => {
                    const segment = getCustomerSegment(customer.stats);
                    return (
                      <tr key={customer._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                              {customer.name ? customer.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {customer.name || 'Anonymous Customer'}
                              </div>
                              <div className="text-xs text-gray-500">
                                Member since {new Date(customer.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Mail className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{customer.email}</span>
                            </div>
                            {customer.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-green-500" />
                                <span>{customer.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900">
                              {customer.stats.totalOrders} {customer.stats.totalOrders === 1 ? 'order' : 'orders'}
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Avg: ₦{customer.stats.averageOrderValue.toLocaleString()}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="text-lg font-bold text-green-600">
                            ₦{customer.stats.totalSpent.toLocaleString()}
                          </div>
                        </td>

                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${segment.color} shadow-sm`}>
                            {segment.label}
                          </span>
                        </td>

                        <td className="px-6 py-6 whitespace-nowrap">
                          {customer.stats.lastOrderDate ? (
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">
                                {new Date(customer.stats.lastOrderDate).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                                {Math.floor((Date.now() - new Date(customer.stats.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Never ordered</span>
                          )}
                        </td>

                        <td className="px-6 py-6 whitespace-nowrap text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
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
            </div>

            {/* Pagination */}
            {customersData.pagination.totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 gap-4">
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Showing page <span className="font-bold text-blue-600">{customersData.pagination.currentPage}</span> of <span className="font-bold">{customersData.pagination.totalPages}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total: {customersData.pagination.totalItems.toLocaleString()} customers
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!customersData.pagination.hasPrev}
                    className="bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!customersData.pagination.hasNext}
                    className="bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        </Card>

        {/* Customer Detail Modal */}
        <CustomerModal 
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      </div>
    </div>
  );
}