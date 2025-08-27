import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { 
  Plus, 
  Link2, 
  Copy, 
  ExternalLink,
  Package,
  User,
  Check,
  AlertCircle,
  Clock,
  Eye,
  Download,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
  Timer,
  Search,
  AlertTriangle
} from 'lucide-react';
import api from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface PaymentLink {
  _id: string;
  reference: string;
  amount: number;
  productId?: string;
  productName?: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  quantity: number;
  
  // Paystack URLs
  authorization_url: string;
  access_code: string;
  checkout_url: string;
  
  // QR and short URL
  qrCode: string;
  shortUrl: string;
  
  // Status and timing
  status: 'pending' | 'completed' | 'failed' | 'expired';
  paidAt?: string;
  verifiedAt?: string;
  expiresAt?: string;
  sessionTimeoutMinutes?: number;
  
  // Analytics
  viewCount: number;
  lastViewedAt?: string;
  
  // Computed fields
  isExpired?: boolean;
  timeRemaining?: number;
  timeRemainingFormatted?: string;
  
  createdAt: string;
  updatedAt: string;
}

export default function AdminPaymentLinksPage() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    customAmount: '',
    description: '',
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    quantity: '1',
    sessionTimeoutMinutes: '1440' // 24 hours default
  });

  // Fetch products for dropdown
  const { data: products = [] } = useQuery({
    queryKey: ['admin-products-select'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=100&isActive=true');
      return data.data.products;
    }
  });

  // Generate payment link mutation
  const generateLinkMutation = useMutation({
    mutationFn: async (linkData: any) => {
      const { data } = await api.post('/payments/generate-link', linkData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
      setShowCreateForm(false);
      resetForm();
    }
  });

  // Update payment link status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ reference, status }: { reference: string; status: string }) => {
      const { data } = await api.patch(`/payments/links/${reference}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });

  // Delete payment link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: async (reference: string) => {
      await api.delete(`/payments/links/${reference}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-links'] });
    }
  });

  // Fetch payment links
  const { data: paymentLinksData, isLoading, refetch } = useQuery({
    queryKey: ['payment-links', statusFilter, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const { data } = await api.get(`/payments/links?${params.toString()}`);
      return data.data;
    },
    refetchInterval: refreshInterval || false,
  });

  const paymentLinks = paymentLinksData?.paymentLinks || [];
  // const pagination = paymentLinksData?.pagination; // TODO: Implement pagination UI

  const resetForm = () => {
    setFormData({
      productId: '',
      customAmount: '',
      description: '',
      customerEmail: '',
      customerName: '',
      customerPhone: '',
      quantity: '1',
      sessionTimeoutMinutes: '1440'
    });
  };

  // Auto-refresh for real-time status updates
  useEffect(() => {
    if (paymentLinks.some((link: PaymentLink) => link.status === 'pending')) {
      setRefreshInterval(30000); // Refresh every 30 seconds if there are pending links
    } else {
      setRefreshInterval(null);
    }

    return () => setRefreshInterval(null);
  }, [paymentLinks]);


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'expired': return <Timer className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-calculate amount if product selected
    if (name === 'productId' && value) {
      const selectedProduct = products.find((p: Product) => p._id === value);
      if (selectedProduct) {
        const amount = selectedProduct.price * parseInt(formData.quantity || '1');
        setFormData(prev => ({ 
          ...prev, 
          customAmount: amount.toString(),
          description: `Payment for ${selectedProduct.name}`
        }));
      }
    }

    if (name === 'quantity' && formData.productId) {
      const selectedProduct = products.find((p: Product) => p._id === formData.productId);
      if (selectedProduct) {
        const amount = selectedProduct.price * parseInt(value || '1');
        setFormData(prev => ({ ...prev, customAmount: amount.toString() }));
      }
    }
  };

  // Check payment status from Paystack
  const checkPaymentStatus = async (reference: string) => {
    try {
      // Show loading state
      console.log('Checking payment status for:', reference);
      
      // Make API call to backend
      const response = await api.get(`/payments/verify/${reference}`);
      const { data } = response;
      
      console.log('Payment verification response:', data);
      
      if (data.success) {
        // Show status in an alert or toast
        const status = data.data.status;
        const amount = data.data.amount / 100;
        
        if (status === 'success') {
          alert(`✅ Payment Successful!\n\nAmount: ₦${amount.toLocaleString()}\nReference: ${reference}\n\nThe payment link status has been updated.`);
        } else if (status === 'failed') {
          alert(`❌ Payment Failed\n\nReference: ${reference}\nStatus: ${status}`);
        } else {
          alert(`⏳ Payment Pending\n\nReference: ${reference}\nStatus: ${status}\n\nThe payment has not been completed yet.`);
        }
        
        // Refresh the payment links list to show updated status
        await refetch();
      } else {
        alert(`Unable to verify payment: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error checking payment status:', error);
      
      // Check if it's a network error or API error
      if (error.response) {
        // Server responded with error
        alert(`Payment verification failed: ${error.response.data?.error || error.response.statusText}`);
      } else if (error.request) {
        // Request was made but no response
        alert('Unable to reach server. Please check your connection.');
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleStatusUpdate = (reference: string, status: string) => {
    updateStatusMutation.mutate({ reference, status });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customAmount || parseFloat(formData.customAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    generateLinkMutation.mutate({
      productId: formData.productId || undefined,
      customAmount: parseFloat(formData.customAmount),
      description: formData.description,
      customerEmail: formData.customerEmail || undefined,
      customerName: formData.customerName || undefined,
      customerPhone: formData.customerPhone || undefined,
      quantity: parseInt(formData.quantity),
      sessionTimeoutMinutes: parseInt(formData.sessionTimeoutMinutes)
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(`${type}-${text}`);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const downloadQR = async (qrUrl: string, reference: string, productName?: string) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `nevellines-payment-qr-${productName || reference}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `payment-qr-${reference}.png`;
      link.click();
    }
  };

  const handleDeleteLink = async (reference: string) => {
    if (window.confirm('Are you sure you want to delete this payment link?')) {
      deleteLinkMutation.mutate(reference);
    }
  };

  const getTimeoutOptions = () => [
    { value: '60', label: '1 Hour' },
    { value: '360', label: '6 Hours' },
    { value: '720', label: '12 Hours' },
    { value: '1440', label: '24 Hours (Default)' },
    { value: '2880', label: '2 Days' },
    { value: '4320', label: '3 Days' },
    { value: '10080', label: '7 Days' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Links</h1>
              <p className="text-gray-600">Generate, manage, and track your payment links in one place</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => refetch()}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="border-gray-300 hover:border-gray-400"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate New Link
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <Card className="p-6 mb-6 bg-white shadow-sm border">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Payment Links</label>
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by reference, customer, product name, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                  <option value="failed">❌ Failed</option>
                  <option value="expired">⏰ Expired</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Analytics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-blue-800">
                  {paymentLinks.filter((l: PaymentLink) => l.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {paymentLinks.filter((l: PaymentLink) => l.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold text-red-800">
                  {paymentLinks.filter((l: PaymentLink) => l.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expired</p>
                <p className="text-2xl font-bold text-gray-800">
                  {paymentLinks.filter((l: PaymentLink) => l.status === 'expired').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-600" />
            </div>
          </Card>
        </div>

        {/* Create Link Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Generate Payment Link</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Product (Optional)
                  </label>
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Custom Amount</option>
                    {products.map((product: Product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₦{product.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount (₦) *
                </label>
                <Input
                  type="number"
                  name="customAmount"
                  value={formData.customAmount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Payment description"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Name (Optional)
                  </label>
                  <Input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Customer name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Customer Email (Optional)
                  </label>
                  <Input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="customer@email.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="+234..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Expiry
                  </label>
                  <select
                    name="sessionTimeoutMinutes"
                    value={formData.sessionTimeoutMinutes}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {getTimeoutOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={generateLinkMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {generateLinkMutation.isPending ? 'Generating...' : 'Generate Payment Link'}
                </Button>
              </div>
            </form>

            {/* Success Display */}
            {generateLinkMutation.isSuccess && generateLinkMutation.data && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-3">
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">Payment Link Generated Successfully!</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Amount</div>
                    <div className="font-semibold text-lg">₦{generateLinkMutation.data.amount?.toLocaleString()}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Expires</div>
                    <div className="font-semibold text-lg">{generateLinkMutation.data.timeRemainingFormatted || 'No expiry'}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Payment URL</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generateLinkMutation.data.paymentUrl}
                        readOnly
                        className="flex-1 text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(generateLinkMutation.data.paymentUrl, 'url')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {copiedUrl === `url-${generateLinkMutation.data.paymentUrl}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">Short URL</label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generateLinkMutation.data.shortUrl}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(generateLinkMutation.data.shortUrl, 'short')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {copiedUrl === `short-${generateLinkMutation.data.shortUrl}` ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* QR Code Preview */}
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-1">QR Code Preview</label>
                    <div className="bg-white p-4 rounded-lg border text-center">
                      <img 
                        src={generateLinkMutation.data.qrCode} 
                        alt="Payment QR Code" 
                        className="mx-auto mb-3"
                        style={{ maxWidth: '200px' }}
                      />
                      <p className="text-xs text-gray-600 mb-3">Branded QR code for Nevellines</p>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => downloadQR(
                            generateLinkMutation.data.qrCode, 
                            generateLinkMutation.data.reference,
                            generateLinkMutation.data.productName
                          )}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download QR
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(generateLinkMutation.data.paymentUrl, '_blank')}
                          variant="outline"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Test Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {generateLinkMutation.isError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-red-700">Failed to generate payment link. Please try again.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Payment Links List */}
        <div className="space-y-6">
        {isLoading ? (
          <Card className="p-12 text-center bg-white">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Payment Links</h3>
            <p className="text-gray-500">Please wait while we fetch your payment links...</p>
          </Card>
        ) : paymentLinks.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Link2 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Links Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {statusFilter !== 'all' ? 
                `No ${statusFilter} payment links found. Try changing the filter or search criteria.` :
                'Generate your first payment link to start accepting payments from customers.'
              }
            </p>
            {statusFilter === 'all' && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Your First Link
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {paymentLinks.map((link: PaymentLink) => (
              <Card key={link._id} className={`overflow-hidden hover:shadow-xl transition-all duration-200 ${
                link.status === 'completed' ? 'border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-white' : 
                link.status === 'failed' ? 'border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-white' :
                link.status === 'expired' ? 'border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50/50 to-white' : 
                'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-white'
              }`}>
                {/* Compact Header with Status and Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Status Badge - Compact */}
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        link.status === 'completed' ? 'bg-green-100 text-green-800' :
                        link.status === 'failed' ? 'bg-red-100 text-red-800' :
                        link.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {getStatusIcon(link.status)}
                        <span className="uppercase">
                          {link.status === 'completed' ? 'PAID' :
                           link.status === 'failed' ? 'FAILED' :
                           link.status === 'expired' ? 'EXPIRED' :
                           'PENDING'}
                        </span>
                      </div>

                      {/* Product/Service Info - Inline */}
                      <Package className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 truncate">
                        {link.productName || 'Custom Payment'}
                      </h3>
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                        ₦{link.amount.toLocaleString()}
                      </div>
                    </div>

                    {/* Quick Actions - Only show for pending status */}
                    <div className="flex gap-1">
                      {/* Status Change Actions */}
                      {link.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              checkPaymentStatus(link.reference);
                            }}
                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 px-2 text-xs"
                            title="Check Payment Status"
                            type="button"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStatusUpdate(link.reference, 'completed');
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 text-xs"
                            title="Mark as Paid"
                            type="button"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStatusUpdate(link.reference, 'failed');
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 text-xs"
                            title="Mark as Failed"
                            type="button"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      
                      {/* Allow status resets for non-pending payments */}
                      {link.status !== 'pending' && (
                        <div className="flex items-center gap-1">
                          <select
                            value={link.status}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStatusUpdate(link.reference, e.target.value);
                            }}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {link.description && (
                    <p className="text-gray-600 text-sm mb-2 bg-gray-50 p-2 rounded">{link.description}</p>
                  )}

                  {/* Compact Details Grid */}
                  <div className="grid grid-cols-4 gap-3 text-xs mb-3 bg-gray-50/80 p-2 rounded">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="truncate" title={link.customerEmail || link.customerName || 'Anonymous'}>
                        {link.customerEmail || link.customerName || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3 text-gray-500" />
                      <span className={link.isExpired ? 'text-red-600 font-medium' : ''}>
                        {link.timeRemainingFormatted || 'No expiry'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span>{link.viewCount} views</span>
                    </div>
                  </div>

                  {/* Compact Action Buttons */}
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(link.shortUrl, `card-${link.reference}`)}
                      className="border-gray-300 hover:bg-gray-50 text-xs px-2 py-1"
                    >
                      {copiedUrl === `card-${link.reference}-${link.shortUrl}` ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadQR(link.qrCode, link.reference, link.productName)}
                      className="border-gray-300 hover:bg-gray-50 text-xs px-2 py-1"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      QR
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(link.authorization_url, '_blank')}
                      className="border-gray-300 hover:bg-gray-50 text-xs px-2 py-1"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteLink(link.reference)}
                      className="text-red-600 border-red-200 hover:bg-red-50 text-xs px-2 py-1 ml-auto"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}