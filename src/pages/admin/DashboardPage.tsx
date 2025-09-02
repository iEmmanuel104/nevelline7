import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { Card } from '../../components/ui/card';
import { Logo } from '../../components/ui/Logo';
import { Package, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ['productStats'],
    queryFn: productService.getProductStats,
  });
const stats = statsResponse?.stats;
  console.log(stats);

  if (isLoading) {
    return <div className="p-6">Loading statistics...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Logo size="md" variant="dark" showIcon={false} />
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
        <div className="text-sm text-gray-500">
          Welcome back to NEVELLINE Admin
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold">{stats?.activeProducts || 0}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold">{stats?.lowStockProducts || 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">₦0</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Viewed Products</h2>
          <div className="space-y-3">
            {stats?.topViewedProducts?.length > 0 ? (
              stats.topViewedProducts.map((product: any) => (
                <div key={product._id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm text-gray-600">{product.views} views</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No products viewed yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Purchased Products</h2>
          <div className="space-y-3">
            {stats?.topPurchasedProducts?.length > 0 ? (
              stats.topPurchasedProducts.map((product: any) => (
                <div key={product._id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm text-gray-600">{product.purchases} sales</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No purchases yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}