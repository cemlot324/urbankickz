'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut,
  Clock,
  MapPin,
  Trash2,
  Package
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      redirect('/signin');
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'user-id': user?.id,
        },
      });
      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          productId,
        }),
      });

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.productId !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    logout();
    redirect('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
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

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your account and view your orders</p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-[#B2D12E] mr-2" />
                <h2 className="text-lg font-semibold">Account Details</h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">Name: {user?.name}</p>
                <p className="text-gray-600">Email: {user?.email}</p>
                <button 
                  className="text-[#B2D12E] hover:underline text-sm font-semibold"
                  onClick={() => {/* Add edit functionality */}}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-5 h-5 text-[#B2D12E] mr-2" />
                <h2 className="text-lg font-semibold">Recent Orders</h2>
              </div>
              <div className="space-y-3">
                {/* Replace with actual orders data */}
                <p className="text-gray-600">No recent orders</p>
                <Link 
                  href="/orders" 
                  className="text-[#B2D12E] hover:underline text-sm font-semibold"
                >
                  View All Orders
                </Link>
              </div>
            </div>

            {/* Wishlist */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Heart className="w-5 h-5 text-[#B2D12E] mr-2" />
                <h2 className="text-lg font-semibold">Wishlist</h2>
              </div>
              <div className="space-y-3">
                {wishlistItems.length === 0 ? (
                  <p className="text-gray-600">No items in wishlist</p>
                ) : (
                  <div className="space-y-4">
                    {wishlistItems.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">£{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.productId)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Link 
                  href="/wishlist" 
                  className="text-[#B2D12E] hover:underline text-sm font-semibold block mt-4"
                >
                  View All Items
                </Link>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-[#B2D12E] mr-2" />
                <h2 className="text-lg font-semibold">Shipping Address</h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-600">No address saved</p>
                <button 
                  className="text-[#B2D12E] hover:underline text-sm font-semibold"
                  onClick={() => {/* Add address functionality */}}
                >
                  Add Address
                </button>
              </div>
            </div>

            {/* Order History */}
            <Link href="/orders">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Package className="w-5 h-5 text-[#B2D12E] mr-2" />
                  <h2 className="text-lg font-semibold">Order History</h2>
                </div>
                <p className="text-gray-600">View your past orders</p>
              </div>
            </Link>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 text-[#B2D12E] mr-2" />
                <h2 className="text-lg font-semibold">Account Settings</h2>
              </div>
              <div className="space-y-3">
                <button 
                  className="text-[#B2D12E] hover:underline text-sm font-semibold block"
                  onClick={() => {/* Add settings functionality */}}
                >
                  Change Password
                </button>
                <button 
                  className="text-red-600 hover:underline text-sm font-semibold block"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}