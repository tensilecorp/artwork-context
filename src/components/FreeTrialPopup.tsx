'use client'

import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface FreeTrialPopupProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
}

export default function FreeTrialPopup({ isOpen, onClose, onSubmit }: FreeTrialPopupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(email)
      onClose()
    } catch (error) {
      console.error('Error submitting email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ArtView Pro</span>
            </div>
          </div>

          {/* Visual Examples */}
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              {/* Before */}
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/front-gallery-original-01.jpeg"
                    alt="Original artwork"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Raw
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center text-blue-600">
                <Sparkles className="w-6 h-6" />
                <div className="w-8 h-0.5 bg-blue-600 rounded-full mt-1"></div>
              </div>

              {/* After */}
              <div className="relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/front-gallery-result-01-gallery.jpeg"
                    alt="Gallery visualization"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Pro
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            CLAIM YOUR 3 FREE
          </h2>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            GALLERY MOCKUPS
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
                className="w-full px-6 py-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <p className="text-sm text-gray-500 px-2">
              By signing up, you agree to our Terms of Service and Privacy Policy. No commitment. Cancel anytime.
            </p>

            <button
              type="submit"
              disabled={!email || isSubmitting}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Claim My Free Trial'}
            </button>
          </form>

          {/* Benefits */}
          <div className="mt-6 text-sm text-gray-600 space-y-1">
            <p>✨ 3 free gallery-quality mockups</p>
            <p>🚀 30-second processing</p>
            <p>📧 No spam, unsubscribe anytime</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage popup state and timing
export function useFreeTrialPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('artview-popup-shown')
    const hasAccount = localStorage.getItem('artview-user-email')
    
    if (hasSeenPopup || hasAccount || hasShown) return

    let scrollTriggered = false

    // Time-based trigger (15 seconds)
    const timeBasedTrigger = () => {
      if (!scrollTriggered && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem('artview-popup-shown', 'true')
      }
    }

    // Scroll-based trigger (50% of page)
    const scrollBasedTrigger = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent >= 50 && !scrollTriggered && !hasShown) {
        scrollTriggered = true
        clearTimeout(timeoutId)
        setIsOpen(true)
        setHasShown(true)
        localStorage.setItem('artview-popup-shown', 'true')
      }
    }

    // Set up triggers
    const timeoutId = setTimeout(timeBasedTrigger, 15000) // 15 seconds
    window.addEventListener('scroll', scrollBasedTrigger)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', scrollBasedTrigger)
    }
  }, [hasShown])

  const closePopup = () => {
    setIsOpen(false)
  }

  const handleEmailSubmit = async (email: string) => {
    try {
      // Call the signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        // Store user data locally for quick access
        localStorage.setItem('artview-user-email', email)
        localStorage.setItem('artview-user-id', data.user.id)
        localStorage.setItem('artview-user-credits', data.user.credits.toString())
        localStorage.setItem('artview-user-plan', data.user.plan)
        
        console.log('Free trial signup successful:', data.message)
        
        // Redirect to upload page
        window.location.href = '/upload?trial=true'
      } else {
        console.error('Signup failed:', data.error)
        alert('Signup failed. Please try again.')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return {
    isOpen,
    closePopup,
    handleEmailSubmit
  }
}
