'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Sparkles, Download, ArrowLeft, CheckCircle, Home, Building, Palette, RefreshCw, RotateCcw, Sun, Lightbulb, Zap, Image, Box, RectangleHorizontal, RectangleVertical, CreditCard, Mail } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import { processImageFile } from '../../utils/imageOrientation'

interface PlacementResult {
  success: boolean
  image_url: string
  environment: string
  prompt_used: string
}

interface Credits {
  count: number
  purchaseDate: string
  sessionId: string
  expiresAt: string
}

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState('living-room')
  const [customPrompt, setCustomPrompt] = useState('')
  const [artworkDimensions, setArtworkDimensions] = useState({
    width: '',
    height: '',
    depth: '', // for sculptures
    unit: 'cm' // cm or inches
  })
  const [includePedestal, setIncludePedestal] = useState(true)
  const [viewingAngle, setViewingAngle] = useState('front')
  const [selectedLighting, setSelectedLighting] = useState('well-lit')
  const [artworkType, setArtworkType] = useState('painting')
  const [aspectRatio, setAspectRatio] = useState('4:3')
  const [isUpscaling, setIsUpscaling] = useState(false)
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [userFeedback, setUserFeedback] = useState('')
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  // Payment and credits state
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)

  // Check for existing credits on component mount
  useEffect(() => {
    const storedCredits = localStorage.getItem('artworkCredits')
    
    if (storedCredits) {
      const parsedCredits = JSON.parse(storedCredits)
      const now = new Date()
      const expiresAt = new Date(parsedCredits.expiresAt)
      
      if (now < expiresAt && parsedCredits.count > 0) {
        setCredits(parsedCredits)
        setIsPaidUser(true)
        setEmailSubmitted(true)
      } else {
        // Credits expired or used up
        localStorage.removeItem('artworkCredits')
        localStorage.removeItem('isPaidUser')
      }
    }
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic', '.heif']
    },
    maxFiles: 1
  })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setEmailSubmitted(true)
    }
  }

  const handlePayment = async () => {
    if (!email.trim()) return
    
    setIsCheckingOut(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const placeArtwork = async () => {
    if (!uploadedFile) return

    // Check if user has credits
    if (!isPaidUser || !credits || credits.count <= 0) {
      setShowPaymentPrompt(true)
      return
    }

    setIsProcessing(true)
    
    try {
      // Convert file to base64 with EXIF orientation correction
      const base64 = await processImageFile(uploadedFile)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          environment: selectedEnvironment,
          customPrompt: selectedEnvironment === 'custom' ? customPrompt : undefined,
          artworkDimensions: artworkDimensions,
          includePedestal: includePedestal,
          viewingAngle: viewingAngle,
          lighting: selectedLighting,
          artworkType: artworkType,
          aspectRatio: aspectRatio
        }),
      })

      if (!response.ok) {
        throw new Error('Placement failed')
      }

      const result = await response.json()
      setPlacementResult(result)

      // Deduct one credit
      const updatedCredits = {
        ...credits,
        count: credits.count - 1
      }
      setCredits(updatedCredits)
      localStorage.setItem('artworkCredits', JSON.stringify(updatedCredits))

    } catch (error) {
      console.error('Placement error:', error)
      alert('Generation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }


  const generateHighResPreview = async () => {
    if (!placementResult?.image_url) return

    // Check if user has credits for upscaling
    if (!isPaidUser || !credits || credits.count <= 0) {
      setShowPaymentPrompt(true)
      return
    }

    setIsUpscaling(true)
    
    try {
      const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: placementResult.image_url
        }),
      })

      if (!response.ok) {
        throw new Error('Upscaling failed')
      }

      const result = await response.json()
      setUpscaledImageUrl(result.upscaled_image_url)

      // Deduct one credit for upscaling
      const updatedCredits = {
        ...credits,
        count: credits.count - 1
      }
      setCredits(updatedCredits)
      localStorage.setItem('artworkCredits', JSON.stringify(updatedCredits))

      // Show the preview modal instead of auto-downloading
      setShowPreviewModal(true)

    } catch (error) {
      console.error('Upscaling error:', error)
      
      // Try to get more detailed error information
      let errorMessage = 'Upscaling failed. Please try again.'
      if (error instanceof Error) {
        errorMessage = `Upscaling failed: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setIsUpscaling(false)
    }
  }

  const handleStarRating = (rating: number) => {
    setUserRating(rating)
    
    // Show feedback form for ratings 4 and above
    if (rating >= 4) {
      setShowFeedbackForm(true)
    } else {
      // For lower ratings, just collect the rating
      setShowFeedbackForm(false)
    }
  }

  const downloadHighRes = async () => {
    if (!upscaledImageUrl || !placementResult) return
    
    try {
      // Fetch the image as a blob to force download
      const response = await fetch(upscaledImageUrl)
      const blob = await response.blob()
      
      // Create a blob URL and download
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `artwork-in-${placementResult.environment}-upscaled.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback to direct link
      const link = document.createElement('a')
      link.href = upscaledImageUrl
      link.download = `artwork-in-${placementResult.environment}-upscaled.png`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const submitReview = async () => {
    if (!userRating) return

    try {
      // Here you would typically send the review to your backend
      const reviewData = {
        rating: userRating,
        feedback: userFeedback,
        environment: placementResult?.environment,
        artworkType: artworkType,
        timestamp: new Date().toISOString(),
        email: email // You already have this from the payment flow
      }

      // For now, just log it (you can implement the API later)
      console.log('Review submitted:', reviewData)

      // If rating is 4 or 5, suggest Trustpilot
      if (userRating >= 4) {
        // You can implement Trustpilot redirect here later
        alert('Thank you for your feedback! Your review helps us improve ArtContext.')
      } else {
        alert('Thank you for your feedback! We&apos;ll use this to improve our service.')
      }

      // Reset review state
      setUserRating(null)
      setUserFeedback('')
      setShowFeedbackForm(false)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }


  const environments = [
    { id: 'living-room', name: 'Living Room', icon: Home, description: 'Modern, elegant living space' },
    { id: 'office', name: 'Office', icon: Building, description: 'Professional workspace' },
    { id: 'gallery', name: 'Gallery', icon: Palette, description: 'Contemporary art gallery' },
    { id: 'concrete-gallery', name: 'Concrete Gallery', icon: Box, description: 'Industrial concrete space' },
    { id: 'bedroom', name: 'Bedroom', icon: Home, description: 'Stylish bedroom setting' },
    { id: 'restaurant', name: 'Restaurant', icon: Building, description: 'Upscale dining space' },
    { id: 'hotel-lobby', name: 'Hotel Lobby', icon: Building, description: 'Luxury hotel entrance' },
    { id: 'custom', name: 'Custom', icon: Sparkles, description: 'Your own description' }
  ]

  // Show email collection first
  if (!emailSubmitted && !isPaidUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ArtContext</h1>
            <p className="text-gray-600">
              Transform your artwork with AI-powered environment placement
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Continue →
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            We'll use your email for purchase confirmation and updates
          </p>
        </div>
      </div>
    )
  }

  // Show payment prompt if user tries to generate without credits
  if (showPaymentPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ready to Generate?</h1>
            <p className="text-gray-600">
              Get 10 high-quality artwork placements for just $5
            </p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">10 Generations</span>
              <span className="font-semibold text-indigo-600">$5.00</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Valid for</span>
              <span className="font-semibold text-gray-900">48 hours</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Per generation</span>
              <span className="font-semibold text-green-600">$0.50</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isCheckingOut}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isCheckingOut ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay $5 - Get 10 Generations
                </>
              )}
            </button>

            <button
              onClick={() => setShowPaymentPrompt(false)}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Upload
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payment powered by Stripe. No subscription required.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">ArtContext</h1>
            </div>
            
            {/* Credits Display */}
            {isPaidUser && credits && (
              <div className="flex items-center bg-indigo-50 px-4 py-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-indigo-700">
                  {credits.count} credits remaining
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!placementResult ? (
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Artwork</h2>
              
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Drop your artwork here' : 'Upload artwork photo'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your image, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPG, PNG, WebP, HEIC up to 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={previewUrl!}
                      alt="Uploaded artwork"
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => {
                        setUploadedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Artwork Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Artwork Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: 'painting', name: 'Painting', description: 'Flat artwork for walls', icon: Image },
                        { id: 'sculpture', name: 'Sculpture', description: '3D artwork for spaces', icon: Box }
                      ].map((type) => {
                        const IconComponent = type.icon
                        return (
                          <button
                            key={type.id}
                            onClick={() => setArtworkType(type.id)}
                            className={`p-4 rounded-lg border text-center transition-colors ${
                              artworkType === type.id
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <IconComponent className="w-6 h-6 text-gray-600" />
                            </div>
                            <h4 className="font-semibold">{type.name}</h4>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Environment Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Environment
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {environments.map((env) => {
                        const IconComponent = env.icon
                        return (
                          <button
                            key={env.id}
                            onClick={() => setSelectedEnvironment(env.id)}
                            className={`p-4 rounded-lg border text-left transition-colors ${
                              selectedEnvironment === env.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <IconComponent className="w-5 h-5 mr-2 text-gray-600" />
                              <h4 className="font-semibold">{env.name}</h4>
                            </div>
                            <p className="text-sm text-gray-600">{env.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Artwork Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Artwork Dimensions (for accurate scaling)
                    </label>
                    <div className="space-y-4">
                      {/* Unit Selection */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setArtworkDimensions(prev => ({ ...prev, unit: 'cm' }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            artworkDimensions.unit === 'cm'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Centimeters
                        </button>
                        <button
                          onClick={() => setArtworkDimensions(prev => ({ ...prev, unit: 'inches' }))}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            artworkDimensions.unit === 'inches'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Inches
                        </button>
                      </div>
                      
                      {/* Dimension Inputs */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Width ({artworkDimensions.unit})
                          </label>
                          <input
                            type="number"
                            value={artworkDimensions.width}
                            onChange={(e) => setArtworkDimensions(prev => ({ ...prev, width: e.target.value }))}
                            placeholder="e.g. 50"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Height ({artworkDimensions.unit})
                          </label>
                          <input
                            type="number"
                            value={artworkDimensions.height}
                            onChange={(e) => setArtworkDimensions(prev => ({ ...prev, height: e.target.value }))}
                            placeholder="e.g. 70"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {artworkType === 'sculpture' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Depth ({artworkDimensions.unit})
                            </label>
                            <input
                              type="number"
                              value={artworkDimensions.depth}
                              onChange={(e) => setArtworkDimensions(prev => ({ ...prev, depth: e.target.value }))}
                              placeholder="e.g. 25"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Accurate dimensions help create realistic scale in the environment. 
                        {artworkType === 'sculpture' ? ' For sculptures, include depth for 3D placement.' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Pedestal Option for Sculptures */}
                  {artworkType === 'sculpture' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Placement Options
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIncludePedestal(true)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            includePedestal
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          On Pedestal
                        </button>
                        <button
                          onClick={() => setIncludePedestal(false)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            !includePedestal
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Direct Placement
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {includePedestal 
                          ? 'Sculpture will be placed on a 50cm pedestal for better viewing'
                          : 'Sculpture will be placed directly on surfaces like tables, floors, or shelves'
                        }
                      </p>
                    </div>
                  )}

                  {/* Viewing Angle Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Viewing Angle
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { 
                          id: 'front', 
                          name: 'Front View', 
                          description: 'Straight-on perspective'
                        },
                        { 
                          id: 'angle', 
                          name: 'Angled View', 
                          description: 'Slight side angle'
                        },
                        { 
                          id: 'side', 
                          name: 'Side View', 
                          description: 'Profile perspective'
                        }
                      ].map((angle) => (
                        <button
                          key={angle.id}
                          onClick={() => setViewingAngle(angle.id)}
                          className={`p-3 rounded-lg border text-center transition-colors ${
                            viewingAngle === angle.id
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-semibold text-sm">{angle.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{angle.description}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Choose the viewing angle to control how visitors will see your artwork in the environment
                    </p>
                  </div>

                  {/* Lighting Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Lighting Style
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: 'well-lit', name: 'Well Lit', description: 'Bright, even lighting', icon: Sun },
                        { id: 'soft-ambient', name: 'Soft Ambient', description: 'Warm, cozy atmosphere', icon: Lightbulb },
                        { id: 'dramatic-spotlight', name: 'Dramatic Spotlight', description: 'Focused dramatic lighting', icon: Zap }
                      ].map((lighting) => {
                        const IconComponent = lighting.icon
                        return (
                          <button
                            key={lighting.id}
                            onClick={() => setSelectedLighting(lighting.id)}
                            className={`p-3 rounded-lg border text-center transition-colors ${
                              selectedLighting === lighting.id
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <IconComponent className="w-5 h-5 text-gray-600" />
                            </div>
                            <h4 className="font-semibold text-sm">{lighting.name}</h4>
                            <p className="text-xs text-gray-600">{lighting.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Aspect Ratio Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Output Aspect Ratio
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { id: '4:3', name: '4:3', description: 'Standard landscape for rooms and galleries', icon: RectangleHorizontal },
                        { id: '3:4', name: '3:4', description: 'Portrait orientation for tall artworks', icon: RectangleVertical }
                      ].map((ratio) => {
                        const IconComponent = ratio.icon
                        return (
                          <button
                            key={ratio.id}
                            onClick={() => setAspectRatio(ratio.id)}
                            className={`p-4 rounded-lg border text-center transition-colors ${
                              aspectRatio === ratio.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-2">
                              <IconComponent className="w-6 h-6 text-gray-600" />
                            </div>
                            <h4 className="font-semibold text-sm">{ratio.name}</h4>
                            <p className="text-xs text-gray-600">{ratio.description}</p>
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Choose the aspect ratio that best showcases your artwork while providing meaningful environmental context
                    </p>
                  </div>

                  {/* Custom Prompt Input */}
                  {selectedEnvironment === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Environment Description
                      </label>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Describe the environment where you want to place your artwork..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  )}

                  <button
                    onClick={placeArtwork}
                    disabled={isProcessing || (selectedEnvironment === 'custom' && !customPrompt.trim())}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Placing artwork...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Artwork Placement
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI is placing your artwork...
                  </h3>
                  <p className="text-gray-600">
                    This usually takes 20-30 seconds. We're creating a realistic visualization of your artwork in the selected environment.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Placement Complete</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={placeArtwork}
                    disabled={isProcessing}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                    Retry
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Artwork</h3>
                  <img
                    src={previewUrl!}
                    alt="Original artwork"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Placed in {environments.find(e => e.id === placementResult.environment)?.name}
                  </h3>
                  <img
                    src={placementResult.image_url}
                    alt="Artwork placed in environment"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">✨ Your Artwork Configuration:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600">• Type:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">{artworkType}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">• Environment:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {environments.find(e => e.id === selectedEnvironment)?.name || selectedEnvironment}
                    </span>
                  </div>
                  {(artworkDimensions.width && artworkDimensions.height) && (
                    <div className="flex items-center">
                      <span className="text-gray-600">• Dimensions:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {artworkDimensions.width} × {artworkDimensions.height}
                        {artworkType === 'sculpture' && artworkDimensions.depth && ` × ${artworkDimensions.depth}`}
                        {artworkDimensions.unit}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-gray-600">• Lighting:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">{selectedLighting.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">• Viewing Angle:</span>
                    <span className="ml-2 font-medium text-gray-900 capitalize">{viewingAngle.replace('-', ' ')} View</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">• Aspect Ratio:</span>
                    <span className="ml-2 font-medium text-gray-900">{aspectRatio} {aspectRatio === '4:3' ? 'Landscape' : 'Portrait'}</span>
                  </div>
                  {artworkType === 'sculpture' && (
                    <div className="flex items-center">
                      <span className="text-gray-600">• Placement:</span>
                      <span className="ml-2 font-medium text-gray-900">{includePedestal ? 'On Pedestal' : 'Direct Placement'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      setPlacementResult(null)
                    }}
                    className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-lg font-semibold hover:bg-orange-200 flex items-center justify-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Place in Other Context
                  </button>
                  <button
                    onClick={() => {
                      setUploadedFile(null)
                      setPreviewUrl(null)
                      setPlacementResult(null)
                      setSelectedEnvironment('living-room')
                      setCustomPrompt('')
                      setArtworkDimensions({ width: '', height: '', depth: '', unit: 'cm' })
                      setIncludePedestal(true)
                      setViewingAngle('front')
                      setSelectedLighting('well-lit')
                      setArtworkType('painting')
                      setAspectRatio('4:3')
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
                  >
                    Place Another Artwork
                  </button>
                  <button
                    onClick={generateHighResPreview}
                    disabled={isUpscaling}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isUpscaling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Preview...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate High-Res Preview (+1 credit)
                      </>
                    )}
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High-Res Preview Modal - Simple & Focused */}
      {showPreviewModal && upscaledImageUrl && placementResult && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center">
                <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">High-Resolution Result</h2>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false)
                  setUserRating(null)
                  setUserFeedback('')
                  setShowFeedbackForm(false)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Main Image Display */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
              <img
                src={upscaledImageUrl}
                alt="High resolution artwork"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Bottom Controls - Compact */}
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
              {/* Quality Info */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">2x Enhanced Resolution</span> • Perfect for printing and professional use
                </p>
              </div>

              {/* Review & Download Row */}
              <div className="flex items-center justify-between">
                {/* Review Collection */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Rate this:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarRating(star)}
                        className={`text-lg transition-colors ${
                          userRating && star <= userRating
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  {userRating && (
                    <button
                      onClick={submitReview}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadHighRes}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>

              {/* Feedback Form for High Ratings */}
              {showFeedbackForm && userRating && userRating >= 4 && (
                <div className="mt-3 bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-900">🎉 Share what you loved:</span>
                    <input
                      type="text"
                      value={userFeedback}
                      onChange={(e) => setUserFeedback(e.target.value)}
                      placeholder="Great for my gallery exhibition!"
                      className="flex-1 p-2 border border-green-200 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
