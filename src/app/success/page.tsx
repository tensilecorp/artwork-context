'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveCredits, getSession, hasUploadedFile } from '../../utils/sessionStorage'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasExistingUpload, setHasExistingUpload] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('No session ID found')
      setIsLoading(false)
      return
    }

    // Store credits in both new session system and legacy format
    const credits = {
      count: 10,
      purchaseDate: new Date().toISOString(),
      sessionId: sessionId,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
    }

    // Save to new session storage system
    saveCredits(credits)
    
    // Also save to legacy format for backward compatibility
    localStorage.setItem('artworkCredits', JSON.stringify(credits))
    localStorage.setItem('isPaidUser', 'true')
    
    // Check if user has existing session data
    const session = getSession()
    const hasUpload = hasUploadedFile()
    
    setHasExistingUpload(hasUpload)
    setSessionInfo(session)
    
    console.log('Payment successful, credits saved:', credits)
    console.log('Session restored:', { hasUpload, sessionId: session?.sessionId })
    
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/upload"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">✅ Your Professional Mockup Is Ready</h1>
          <p className="text-gray-600 mb-4">
            You just saved hours of editing and hundreds in photography fees.
          </p>
          <p className="text-gray-800 font-medium mb-6">
            This is your artwork — presented clearly, professionally, and at scale.
          </p>

          {/* Session Info for returning users */}
          {hasExistingUpload && sessionInfo && (
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-sm font-medium text-green-800">Your session is restored!</span>
              </div>
              <div className="text-xs text-green-700">
                • Artwork: {sessionInfo.uploadedFile?.name || 'Uploaded'}
                <br />
                • Environment: {sessionInfo.selectedEnvironment?.replace('-', ' ') || 'Selected'}
                <br />
                • Ready to generate!
              </div>
            </div>
          )}

          {/* Credits Info */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Credits Available:</span>
              <span className="font-semibold text-indigo-600">10</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Expires:</span>
              <span className="font-semibold text-gray-900">48 hours</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link 
            href="/upload"
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block mb-4"
          >
            💾 {hasExistingUpload ? 'Download High-Res Mockup' : 'Start Creating →'}
          </Link>

          {/* Quality Info */}
          <p className="text-sm text-gray-600 mb-4">
            AI-enhanced resolution. Print-ready. Yours to use anywhere.
          </p>

          {/* Social Mention */}
          <p className="text-sm text-gray-600 mb-4">
            💬 Love the result? Tag @artviewpro — we'd love to feature it.
          </p>

          {/* Rating Section */}
          <div className="mb-4">
            <div className="flex justify-center items-center mb-2">
              <span className="text-2xl">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-sm text-gray-600">Rate your experience</p>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 mt-4">
            {hasExistingUpload ? (
              'Your artwork and preferences are saved. Continue where you left off!'
            ) : (
              'Your credits are stored locally and will expire in 48 hours. Make sure to use them!'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
