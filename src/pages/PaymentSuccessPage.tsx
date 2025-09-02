import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check, Package, Home, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import api from '../lib/api';

interface PaymentVerification {
  success: boolean;
  data: {
    status: string;
    reference: string;
    amount: number;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    metadata: {
      productId?: string;
      quantity?: string;
      custom_fields?: Array<{
        display_name: string;
        variable_name: string;
        value: string;
      }>;
    };
  };
  message: string;
}

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref'); // Paystack callback parameter

  // Use the reference from either parameter
  const paymentReference = reference || trxref;

  // Verify payment when component loads
  const { data: verification, isLoading, error } = useQuery({
    queryKey: ['payment-verification', paymentReference],
    queryFn: async (): Promise<PaymentVerification> => {
      if (!paymentReference) {
        throw new Error('Payment reference not found');
      }
      
      // Track payment link view first (optional)
      try {
        await api.post(`/payments/link/track/${paymentReference}`);
      } catch (trackError) {
        console.log('Failed to track payment link view:', trackError);
      }
      
      const { data } = await api.get(`/payments/verify/${paymentReference}`);
      return data;
    },
    enabled: !!paymentReference,
    retry: 1,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (!paymentReference) {
      // Redirect if no payment reference found
      setTimeout(() => navigate('/'), 3000);
    }
  }, [paymentReference, navigate]);

  useEffect(() => {
    // Stop processing animation after verification completes
    if (verification || error) {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  }, [verification, error]);

  const isSuccess = verification?.success && verification.data?.status === 'success';
  const customerName = verification?.data?.customer 
    ? `${verification.data.customer.first_name} ${verification.data.customer.last_name}`.trim()
    : '';
  
  const amount = verification?.data?.amount ? verification.data.amount / 100 : 0; // Convert from kobo to naira

  if (!paymentReference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid Payment Link</h1>
          <p className="text-gray-600 mb-6">
            No payment reference found. You will be redirected to the homepage shortly.
          </p>
          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading || isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h1>
          <p className="text-gray-600">
            Please wait while we verify your payment...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !verification?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">
            {error?.message || verification?.message || 'Unable to verify your payment. Please contact support.'}
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/collections')} className="w-full">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
          {paymentReference && (
            <p className="text-xs text-gray-500 mt-4">
              Reference: {paymentReference}
            </p>
          )}
        </Card>
      </div>
    );
  }

  if (!isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Payment Status: {verification.data?.status}</h1>
          <p className="text-gray-600 mb-6">
            Your payment was not successful. Please try again or contact support.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/checkout')} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/collections')} 
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Animation */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 py-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-25"></div>
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-white border-opacity-30 animate-ping"></div>
              <div className="absolute inset-2 w-16 h-16 mx-auto rounded-full border-2 border-white border-opacity-50 animate-ping animation-delay-200"></div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-green-100 mb-2">
            Thank you for your purchase{customerName ? `, ${customerName}` : ''}!
          </p>
          <p className="text-green-100">
            Your order has been processed successfully.
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <Card className="p-6 shadow-xl">
          <div className="text-center mb-6">
            <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Confirmed</h2>
            <p className="text-gray-600">
              A confirmation email has been sent to {verification.data.customer.email}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Reference</h3>
                <p className="text-sm text-gray-600 font-mono">{verification.data.reference}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Amount Paid</h3>
                <p className="text-sm text-gray-600 font-semibold">₦{amount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Customer Email</h3>
                <p className="text-sm text-gray-600">{verification.data.customer.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Customer Name</h3>
                <p className="text-sm text-gray-600">{customerName || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Status</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  Paid
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Payment Date</h3>
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Show product/service details if available */}
            {verification.data.metadata && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verification.data.metadata.productId && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Product ID</h4>
                      <p className="text-xs text-gray-600">{verification.data.metadata.productId}</p>
                    </div>
                  )}
                  {verification.data.metadata.quantity && (
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Quantity</h4>
                      <p className="text-xs text-gray-600">{verification.data.metadata.quantity}</p>
                    </div>
                  )}
                  {verification.data.metadata.custom_fields && verification.data.metadata.custom_fields.map((field, index) => (
                    <div key={index}>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">{field.display_name}</h4>
                      <p className="text-xs text-gray-600">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-800">
                ✅ Customer record saved successfully! Your order is being processed and you'll receive updates via email.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/collections')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Homepage
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@nevelline.com" className="text-blue-600 hover:underline">
            support@nevelline.com
          </a>
        </p>
      </div>
    </div>
  );
}