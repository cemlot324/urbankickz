'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './ui/button'

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    
    // Check if it's already been dismissed
    const isDismissed = localStorage.getItem('pwaPromptDismissed')
    
    if (isInstalled || isDismissed) {
      return
    }

    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom prompt
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // Clear the deferredPrompt variable
    setDeferredPrompt(null)
    setShowPrompt(false)

    // Optionally log the outcome
    console.log(`User response to install prompt: ${outcome}`)
  }

  const handleDismiss = () => {
    localStorage.setItem('pwaPromptDismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 z-50 border-2 border-[#B2D12E]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install Urban Kickz</h3>
          <p className="text-sm text-gray-600 mb-3">
            Add our app to your home screen for quick and easy access!
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="bg-[#B2D12E] hover:bg-black hover:text-[#B2D12E] text-black"
            >
              Install
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="border-[#B2D12E] text-black hover:bg-[#B2D12E]"
            >
              Maybe Later
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}