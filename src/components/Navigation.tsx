'use client'

import { Heart, Search, ShoppingCart, User } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Navigation() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  return (
    <header className="border-b w-full">
      <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-center gap-8 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo7.png"
            alt="Urban Kickz Logo"
            width={120}
            height={80}
            className="h-15 w-auto"
          />
        </Link>
        <div className="flex-1 max-w-xl px-12">
          <div className="relative">
            <Search className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for sneakers..."
              className="pl-10 rounded-full border-2 border-[#B2D12E] focus:ring-[#B2D12E] focus:border-[#B2D12E]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-[#B2D12E]/10">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          <div className="relative group">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {!loading && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                {session ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {session.user?.name}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}