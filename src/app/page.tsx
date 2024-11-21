'use client'

import { Heart, ShoppingCart, User, Home, Zap, ArrowUpDown } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { toast } from 'react-hot-toast';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducts } from "@/context/ProductContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface WishlistProduct {
  id: string;
  name: string;
  price: number | string;
  images?: string[];
  image?: string;
  index?: number;
}

interface WishlistItem {
  productId: string;
}

export default function Component() {
  const { state, dispatch } = useProducts()
  const { user, logout } = useAuth();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const { totalItems } = useCart();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        console.log('Sample product ID:', data[0]?._id);
        dispatch({ type: 'SET_PRODUCTS', payload: data })
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    fetchProducts()
  }, [dispatch])

  // Add this useEffect to fetch wishlist items when component mounts
  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
  }, [user]);

  const fetchWishlistItems = useCallback(async () => {
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'user-id': user?.id,
        },
      });
      const data = await response.json();
      setWishlistItems(data.items.map((item: WishlistItem) => item.productId));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [user]);

  const handleWishlist = async (product: WishlistProduct) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    try {
      const isInWishlist = wishlistItems.includes(product.id);
      
      // Log the incoming product data
      console.log('Raw product data:', product);

      const productData = {
        userId: user.id,
        productId: product.id || `featured-${product.index}`, // Handle both regular and featured products
        name: product.name,
        price: typeof product.price === 'string' 
          ? parseFloat(product.price.replace('£', '')) 
          : product.price,
        image: product.images?.[0] || product.image,
      };

      // Log the processed data being sent to API
      console.log('Processed product data:', productData);

      // Validate data before sending
      if (!productData.userId || !productData.productId || !productData.name || 
          productData.price === undefined || !productData.image) {
        console.error('Missing data:', {
          hasUserId: !!productData.userId,
          hasProductId: !!productData.productId,
          hasName: !!productData.name,
          hasPrice: productData.price !== undefined,
          hasImage: !!productData.image
        });
        throw new Error('Missing required product information');
      }

      const response = await fetch('/api/wishlist', {
        method: isInWishlist ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to update wishlist');
      }

      if (isInWishlist) {
        setWishlistItems(wishlistItems.filter(id => id !== productData.productId));
        toast.success('Removed from wishlist');
      } else {
        setWishlistItems([...wishlistItems, productData.productId]);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };

  // Filter products based on selected filters
  const filteredProducts = state.products.filter(product => {
    const sizeMatch = state.filters.size === 'all' || product.sizes.includes(state.filters.size)
    const colorMatch = state.filters.color === 'all' || product.colors.includes(state.filters.color)
    const categoryMatch = state.filters.category === 'all' || product.category.toLowerCase() === state.filters.category
    
    if (state.filters.price === 'all') return sizeMatch && colorMatch && categoryMatch
    
    const [minPrice, maxPrice] = state.filters.price.split('-').map(Number)
    const priceMatch = maxPrice 
      ? product.price >= minPrice && product.price <= maxPrice
      : product.price >= minPrice

    return sizeMatch && colorMatch && categoryMatch && priceMatch
  })

  const featuredProducts = [
    {
      name: "Nike x Wu-Tang Clan",
      brand: "Nike",
      price: "£399",
      image: "/featuredshoe1.png",
    },
    {
      name: "Converse x Isabel Marant",
      brand: "Converse",
      price: "£145",
      image: "/featuredshoe2.png",
    },
    {
      name: "Nike x Jeff Staples",
      brand: "Nike",
      price: "£129",
      image: "/featureshoe3.png",
    },
    {
      name: "Jordans x Eminem",
      brand: "Jordans",
      price: "£520",
      image: "/featuredshoes4.png",
    },
  ]

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      payload: { [filterType]: value }
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Marquee Banner */}
      <div className="bg-[#B2D12E] py-2 text-white overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee">
            <span className="mx-4">Free Shipping on Orders Over £100</span>
            <span className="mx-4">New Releases Every Friday</span>
            <span className="mx-4">Student Discount Available</span>
            <span className="mx-4">Free Shipping on Orders Over /3100</span>
            <span className="mx-4">New Releases Every Friday</span>
            <span className="mx-4">Student Discount Available</span>
          </div>
          <div className="animate-marquee" aria-hidden="true">
            <span className="mx-4">Free Shipping on Orders Over £100</span>
            <span className="mx-4">New Releases Every Friday</span>
            <span className="mx-4">Student Discount Available</span>
            <span className="mx-4">Free Shipping on Orders Over £100</span>
            <span className="mx-4">New Releases Every Friday</span>
            <span className="mx-4">Student Discount Available</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="border-b w-full">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo7.png"
              alt="Urban Kickz Logo"
              width={120}
              height={80}
              className="h-12 w-auto md:h-15"
            />
          </Link>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B2D12E] text-black text-xs font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hover:bg-[#B2D12E]/10">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  {user && (
                    <span className="text-sm font-medium hidden md:inline-block">
                      {user.name}
                    </span>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      logout();
                      router.push('/');
                    }}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden min-h-[500px] animated-background">
            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center p-8 min-h-[500px]">
              {/* Animated Badge */}
              <div className="animate-bounce mb-6">
                <span className="bg-[#B2D12E] text-black px-6 py-2 rounded-full font-bold text-lg shadow-glow">
                  LIMITED TIME OFFER
                </span>
              </div>

              {/* Main Text with Animation */}
              <div className="space-y-4 animate-fadeIn">
                <h1 className="text-7xl font-bold mb-4 animate-slideDown">
                  £20 OFF £100
                </h1>
                <p className="text-3xl font-semibold mb-4 animate-slideUp">
                  PLUS GET FREE NEXT-DAY DELIVERY
                </p>
                
                {/* Promo Code Box with Glow Effect */}
                <div className="inline-block bg-black/30 backdrop-blur-sm px-8 py-4 rounded-xl border-2 border-[#B2D12E] shadow-glow">
                  <p className="text-xl">With code:</p>
                  <span className="text-3xl font-bold text-[#B2D12E]">2410</span>
                </div>

                {/* CTA Button with Hover Effect */}
                <div className="mt-8">
                  <Button 
                    className="bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black px-8 py-6 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-glow"
                  >
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#B2D12E] animate-spin-slow opacity-50"></div>
              <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#B2D12E] animate-spin-slow opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Kickz Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="mb-6 text-6xl font-bold text-black pl-4">
            Fresh Kickz
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg relative h-[400px] group">
                <div className="absolute top-4 left-4 z-20">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-transparent"
                    onClick={() => handleWishlist({
                      id: `featured-${index}`,
                      name: product.name,
                      price: parseFloat(product.price.replace('£', '')),
                      images: [product.image],
                    })}
                  >
                    {wishlistItems.includes(`featured-${index}`) ? (
                      <Heart className="h-6 w-6 text-[#B2D12E]" fill="currentColor" />
                    ) : (
                      <Heart className="h-6 w-6 text-white hover:text-[#B2D12E] transition-colors" />
                    )}
                  </Button>
                </div>

                {/* Full-size Image */}
                <div className="absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-xl">{product.price}</span>
                      <Button 
                        size="sm" 
                        className="bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black rounded-full px-4"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Club Banner */}
      <section className="w-full px-4 py-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-black rounded-xl p-6 relative hover-glow animated-bg">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(178,209,46,0.1)_50%,transparent_75%)] 
                              bg-[length:250%_250%] animate-shimmer"></div>
              
              {/* Animated Circles */}
              <div className="circle-animation circle-1"></div>
              <div className="circle-animation circle-2"></div>
              <div className="circle-animation circle-3"></div>
              
              {/* Animated Lines */}
              <div className="line-animation line-1"></div>
              <div className="line-animation line-2"></div>
              
              {/* Animated Dots */}
              <div className="dots-grid"></div>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              {/* Text Content */}
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight animate-slideRight">
                  Join the <span className="text-[#B2D12E]">Urban Kickz</span> Club
                </h3>
                <p className="text-zinc-200 animate-slideRight animation-delay-200">
                  Earn £5 off every £50 spend with our <span className="text-[#B2D12E] font-semibold">DOUBLE POINTS</span> welcome offer. 
                  <span className="text-zinc-400 text-sm ml-2">T&Cs apply.</span>
                </p>
              </div>

              {/* Email Input and Button */}
              <div className="flex gap-2 w-full md:w-auto animate-slideLeft">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-800/50 border-zinc-700 text-white rounded-full px-6 
                           focus:border-[#B2D12E] focus:ring-[#B2D12E] max-w-xs
                           transition-all duration-300 hover:border-[#B2D12E] backdrop-blur-sm"
                />
                <Button 
                  className="bg-[#B2D12E] hover:bg-white hover:text-black text-black 
                           px-6 py-2 font-bold rounded-full transition-all duration-300 
                           transform hover:scale-105 whitespace-nowrap"
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full flex-1 px-4 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            {/* Sidebar Categories */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('category', 'all')}
                  className="w-full h-12 justify-start gap-2 rounded-lg border-2 border-[#B2D12E] font-bold uppercase tracking-wide hover:bg-[#B2D12E] hover:text-black transition-colors"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFilterChange('category', 'new')}
                  className="w-full h-12 justify-start gap-2 rounded-lg border-2 border-[#B2D12E] font-bold uppercase tracking-wide hover:bg-[#B2D12E] hover:text-black transition-colors"
                >
                  <Zap className="h-5 w-5" />
                  New In
                </Button>
                {["men", "women", "kids"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    onClick={() => handleFilterChange('category', category)}
                    className={`w-full h-12 justify-start px-9 rounded-lg border-2 border-[#B2D12E] font-bold uppercase tracking-wide hover:bg-[#B2D12E] hover:text-black transition-colors ${
                      state.filters.category === category ? 'bg-[#B2D12E] text-black' : ''
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex justify-center gap-8">
                <Select 
                  value={state.filters.size} 
                  onValueChange={(value) => handleFilterChange('size', value)}
                >
                  <SelectTrigger className="w-[160px] rounded-lg border-2 border-[#B2D12E] focus:ring-[#B2D12E] focus:border-[#B2D12E]">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {Array.from(new Set(state.products.flatMap(p => p.sizes))).sort().map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={state.filters.color} 
                  onValueChange={(value) => handleFilterChange('color', value)}
                >
                  <SelectTrigger className="w-[160px] rounded-lg border-2 border-[#B2D12E] focus:ring-[#B2D12E] focus:border-[#B2D12E]">
                    <SelectValue placeholder="Color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colors</SelectItem>
                    {Array.from(new Set(state.products.flatMap(p => p.colors))).sort().map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={state.filters.price} 
                  onValueChange={(value) => handleFilterChange('price', value)}
                >
                  <SelectTrigger className="w-[160px] rounded-lg border-2 border-[#B2D12E] focus:ring-[#B2D12E] focus:border-[#B2D12E]">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <SelectValue placeholder="Sort By" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-100">£0 - £100</SelectItem>
                    <SelectItem value="100-200">£100 - £200</SelectItem>
                    <SelectItem value="200-500">£200 - £500</SelectItem>
                    <SelectItem value="500">£500+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Product Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {state.loading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="overflow-hidden border-0 shadow-lg animate-pulse">
                        <CardContent className="p-0 relative">
                          <div className="h-[300px] bg-gray-200 rounded-lg"></div>
                          <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg text-gray-500">No products found matching your filters.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <Link 
                      href={`/product/${product._id}`} 
                      key={product._id}
                      className="group block"
                    >
                      <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardContent className="p-0 relative">
                          {/* Wishlist button */}
                          <div className="absolute top-4 right-4 z-10">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
                              onClick={(e) => {
                                e.preventDefault();
                                handleWishlist({
                                  id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  images: product.images
                                });
                              }}
                            >
                              {wishlistItems.includes(product._id) ? (
                                <Heart className="h-5 w-5 text-[#B2D12E]" fill="currentColor" />
                              ) : (
                                <Heart className="h-5 w-5 text-gray-600 group-hover:text-[#B2D12E] transition-colors" />
                              )}
                            </Button>
                          </div>
                          
                          {/* Quick view button */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              className="bg-white/90 text-black hover:bg-[#B2D12E] backdrop-blur-sm transition-all duration-300 shadow-lg"
                              onClick={(e) => {
                                e.preventDefault();
                                // Add quick view functionality here
                              }}
                            >
                              Quick View
                            </Button>
                          </div>

                          {/* Image container */}
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* Product info */}
                          <div className="p-5 bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight group-hover:text-[#B2D12E] transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                              </div>
                              <span className="font-bold text-xl">£{product.price}</span>
                            </div>

                            {/* Available sizes */}
                            <div className="mt-3">
                              <p className="text-xs text-gray-500 mb-2">Available Sizes:</p>
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.slice(0, 4).map((size) => (
                                  <span 
                                    key={size}
                                    className="text-xs px-2 py-1 bg-gray-100 rounded-md"
                                  >
                                    {size}
                                  </span>
                                ))}
                                {product.sizes.length > 4 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-md">
                                    +{product.sizes.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Colors */}
                            <div className="mt-3 flex items-center gap-1">
                              {product.colors.slice(0, 3).map((color) => (
                                <span
                                  key={color}
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ 
                                    backgroundColor: color.toLowerCase(),
                                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                                  }}
                                />
                              ))}
                              {product.colors.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{product.colors.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t w-full">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center gap-4 px-4 py-6">
          <Image
            src="/logo7.png"
            alt="Urban Kickz Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            © 2024 Urban Kickz. All rights reserved.
            {" · "}
            <Link href="/dashboard-login" className="hover:text-[#B2D12E]">
              Admin
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}