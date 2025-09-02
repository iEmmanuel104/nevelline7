import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { Logo } from '../ui/Logo';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Folder,
  Link2
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout, isLoading } = useAdmin();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Folder },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Payment Links', href: '/admin/payment-links', icon: Link2 },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo size="sm" variant="dark" showIcon={true} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-gray-50 rounded-md"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out z-40`}>
        <div className="p-6 border-b border-gray-100">
          <Logo size="lg" variant="dark" showIcon={true} />
          <p className="text-sm text-gray-600 mt-2">Admin Dashboard</p>
        </div>

        <nav className="px-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="border-t pt-4">
            <div className="px-4 mb-3">
              <p className="text-sm font-medium text-gray-900">{admin.name}</p>
              <p className="text-xs text-gray-600">{admin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="min-h-screen pt-16 lg:pt-0">
          <Outlet />
        </div>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}