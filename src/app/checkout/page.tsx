'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postcode: '',
    country: ''
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Shipping details submitted:', shippingDetails);
    
    // Validate shipping details
    if (Object.values(shippingDetails).some(value => !value)) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('1. Payment submission started');

    if (!user?.id) {
      console.log('No user ID found:', user);
      toast.error('Please sign in to complete your purchase');
      return;
    }

    setIsProcessing(true);
    console.log('2. User ID found:', user.id);

    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        totalAmount: totalPrice + 4.99,
        shippingDetails
      };

      console.log('3. Order data prepared:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('4. Response received:', response.status);

      const data = await response.json();
      console.log('5. Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      console.log('6. Order created successfully');
      toast.success('Order placed successfully!');
      setCurrentStep('confirmation');
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'shipping':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    type="text"
                    value={shippingDetails.fullName}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      fullName: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={shippingDetails.email}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      email: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    type="text"
                    value={shippingDetails.address}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      address: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input
                    type="text"
                    value={shippingDetails.city}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      city: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postcode</label>
                  <Input
                    type="text"
                    value={shippingDetails.postcode}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      postcode: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <Input
                    type="text"
                    value={shippingDetails.country}
                    onChange={(e) => setShippingDetails({
                      ...shippingDetails,
                      country: e.target.value
                    })}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black"
              >
                Continue to Payment
              </Button>
            </form>
          </div>
        );

      case 'payment':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="border-t border-b py-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{item.name} (Size: {item.size})</span>
                    <span>£{item.price}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>£4.99</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>£{(totalPrice + 4.99).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <Input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <Input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black"
                disabled={isProcessing}
                onClick={() => console.log('Button clicked')}
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </Button>
            </form>
          </div>
        );

      case 'confirmation':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#B2D12E] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-gray-600">Thank you for your purchase.</p>
            </div>
            <Link href="/">
              <Button className="bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black">
                Continue Shopping
              </Button>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b w-full">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <Image
              src="/logo7.png"
              alt="Urban Kickz Logo"
              width={120}
              height={80}
              className="h-15 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </main>
    </div>
  );
}