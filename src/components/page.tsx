'use client'

import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

export function BlockPage() {
  const [selectedSize, setSelectedSize] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedPrice, setSelectedPrice] = useState("all")

  const featuredProducts = [
    {
      name: "Sacai x LDWaffle",
      brand: "Nike",
      price: "$399",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Travis Scott x AJ 1",
      brand: "Nike",
      price: "$975",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Dior x AJ 1",
      brand: "Nike",
      price: "$25,000",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "OFF-WHITE x Dunk Low",
      brand: "Nike",
      price: "$440",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Marquee Banner */}
      <div className="bg-yellow-500 py-2 text-white">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-4">Free Shipping on Orders Over $100</span>
          <span className="mx-4">New Releases Every Friday</span>
          <span className="mx-4">Student Discount Available</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3570-YSbF4d9uQ6zJhh7tQvhtWzaGENcshl.png"
              alt="Urban Kickz Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex-1 px-12">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for sneakers..."
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-8">
        <div className="rounded-3xl bg-neutral-100 p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold">Fresh Drops Daily</h1>
              <p className="text-lg text-muted-foreground">
                Get the latest and most exclusive sneakers
              </p>
              <Button className="w-fit bg-yellow-500 hover:bg-yellow-600">
                Shop Now
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Featured Sneaker"
                width={400}
                height={400}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Kickz Section */}
      <section className="container px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Fresh Kickz</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <div className="mt-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold">{product.price}</span>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="container flex-1 px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full justify-start rounded-full"
              >
                Home
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-full"
              >
                New In
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-full"
              >
                Men
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-full"
              >
                Women
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start rounded-full"
              >
                Kids
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="us7">US 7</SelectItem>
                  <SelectItem value="us8">US 8</SelectItem>
                  <SelectItem value="us9">US 9</SelectItem>
                  <SelectItem value="us10">US 10</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-500">$200 - $500</SelectItem>
                  <SelectItem value="500+">$500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Example Product Cards */}
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <CardContent className="p-4">
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Product"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                    <div className="mt-4">
                      <h3 className="font-semibold">Nike Air Max</h3>
                      <p className="text-sm text-muted-foreground">Nike</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-bold">$199</span>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex items-center justify-between px-4 py-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_3570-YSbF4d9uQ6zJhh7tQvhtWzaGENcshl.png"
            alt="Urban Kickz Logo"
            width={100}
            height={40}
            className="h-8 w-auto"
          />
          <p className="text-sm text-muted-foreground">
            © 2024 Urban Kickz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}