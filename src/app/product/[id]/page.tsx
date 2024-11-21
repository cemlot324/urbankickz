'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  style: string;
  colors: string[];
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching product with ID:', id);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }

        setProduct(data);
      } catch (error: unknown) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#B2D12E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="text-[#B2D12E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/" className="text-[#B2D12E] hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image: string) => (
                  <div
                    key={image}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{product.brand}</p>
              <p className="text-2xl font-bold">£{product.price}</p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-lg border ${
                      selectedSize === size
                        ? 'border-[#B2D12E] bg-[#B2D12E]/10 text-black'
                        : 'border-gray-200 hover:border-[#B2D12E]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black h-14 text-lg"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>Brand: {product.brand}</li>
                  <li>Style: {product.style}</li>
                  <li>Color: {product.colors.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}