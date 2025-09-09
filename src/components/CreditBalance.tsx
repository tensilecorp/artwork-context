'use client'

import { useState, useEffect } from 'react'
import { Sparkles, CreditCard } from 'lucide-react'

interface CreditBalanceProps {
  onUpgrade?: () => void
}

export default function CreditBalance({ onUpgrade }: CreditBalanceProps) {
  const [credits, setCredits] = useState(0)
  const [userPlan, setUserPlan] = useState('free')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkCredits()
  }, [])

  const checkCredits = async () => {
    try {
      const email = localStorage.getItem('artview-user-email')
      if (!email) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/credits?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.success) {
        setCredits(data.credits)
        setUserPlan(data.plan || 'free')
        
        // Update localStorage
        localStorage.setItem('artview-user-credits', data.credits.toString())
        localStorage.setItem('artview-user-plan', data.plan || 'free')
      }
    } catch (error) {
      console.error('Error checking credits:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg animate-pulse">
        <div className="w-5 h-5 bg-gray-300 rounded mr-2"></div>
        <div className="w-20 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  if (credits <= 0) {
    return (
      <button
        onClick={onUpgrade}
        className="flex items-center bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-200"
      >
        <CreditCard className="w-5 h-5 text-red-600 mr-2" />
        <span className="text-sm font-medium text-red-700">
          No credits - Upgrade
        </span>
      </button>
    )
  }

  const getBackgroundColor = () => {
    if (credits <= 1) return 'bg-orange-50 border-orange-200'
    if (credits <= 3) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const getTextColor = () => {
    if (credits <= 1) return 'text-orange-700'
    if (credits <= 3) return 'text-yellow-700'
    return 'text-green-700'
  }

  return (
    <div className={`flex items-center px-4 py-2 rounded-lg border ${getBackgroundColor()}`}>
      <Sparkles className={`w-5 h-5 mr-2 ${getTextColor()}`} />
      <span className={`text-sm font-medium ${getTextColor()}`}>
        {credits} credit{credits !== 1 ? 's' : ''} remaining
      </span>
      {userPlan === 'free' && (
        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          FREE
        </span>
      )}
    </div>
  )
}
