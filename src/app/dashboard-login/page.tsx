'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DashboardLogin() {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.toLowerCase() === "urbankickz") {
      document.cookie = `dashboard_auth=true; path=/; max-age=${60 * 60 * 24}` // 24 hours
      router.push("/dashboard")
    } else {
      setError("Invalid access code")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8">
        <Image
          src="/logo7.png"
          alt="Urban Kickz Logo"
          width={150}
          height={100}
          className="h-auto"
        />
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Dashboard Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="border-2 border-[#B2D12E] focus:ring-[#B2D12E]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E]"
          >
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  )
}