'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Sparkles, Download, ArrowLeft, CheckCircle, Home, Building, Palette, RefreshCw, RotateCcw, Sun, Lightbulb, Zap, Image as ImageIcon, Box, RectangleHorizontal, RectangleVertical, CreditCard, Mail, ArrowRight, Plus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Link from 'next/link'
import Image from 'next/image'
import { processImageFile, isHEICFile, formatFileSize, validateImageFile } from '../../utils/imageProcessor'
import { 
  saveSession, 
  getSession, 
  updateSession, 
  saveUploadedFile, 
  getUploadedFile, 
  savePreferences, 
  getPreferences, 
  saveCredits, 
  getCredits, 
  isPaidUser as isSessionPaidUser,
  hasUploadedFile 
} from '../../utils/sessionStorage'

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

// Progress Dots Component
const ProgressDots = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full transition-colors ${
                isCompleted || isCurrent
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
            {stepNumber < totalSteps && (
              <div
                className={`w-8 h-0.5 mx-1 transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function UploadPage() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  // Existing state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [placementResult, setPlacementResult] = useState<PlacementResult | null>(null)
  const [selectedEnvironment, setSelectedEnvironment] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [artworkDimensions, setArtworkDimensions] = useState({
    width: '',
    height: '',
    depth: '',
    unit: 'cm'
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
  const [isConvertingHEIC, setIsConvertingHEIC] = useState(false)

  // Environment options with scene images
  const environments = [
    { 
      id: 'living-room', 
      name: 'Living Room', 
      description: 'Modern, elegant living space',
      image: '/scenes/artwork-in-living-room-upscaled-2 Medium.jpeg'
    },
    { 
      id: 'office', 
      name: 'Office', 
      description: 'Professional workspace',
      image: '/scenes/artwork-in-office-upscaled Medium.jpeg'
    },
    { 
      id: 'hotel-lobby', 
      name: 'Hotel Lobby', 
      description: 'Luxury hotel entrance',
      image: '/scenes/artwork-in-hotel-lobby Medium.jpeg'
    },
    { 
      id: 'gallery', 
      name: 'Gallery', 
      description: 'Contemporary art gallery',
      image: '/scenes/replicate-prediction-epewxcww89rmc0cqv6qre5r5rr Medium.jpeg'
    }
  ]

  // Initialize session and restore data on component mount
  useEffect(() => {
    // Check for free trial user first (new system)
    const freeTrialEmail = localStorage.getItem('artview-user-email')
    const freeTrialCredits = localStorage.getItem('artview-user-credits')
    const freeTrialExpires = localStorage.getItem('artview-user-expires')
    
    if (freeTrialEmail && freeTrialCredits && freeTrialExpires) {
      const now = new Date()
      const expiresAt = new Date(freeTrialExpires)
      const creditsCount = parseInt(freeTrialCredits)
      
      if (now < expiresAt && creditsCount > 0) {
        console.log('Free trial user detected:', freeTrialEmail, 'Credits:', creditsCount)
        setEmail(freeTrialEmail)
        setEmailSubmitted(true)
        setCredits({
          count: creditsCount,
          purchaseDate: new Date().toISOString(),
          sessionId: 'free-trial',
          expiresAt: freeTrialExpires
        })
        setIsPaidUser(true)
      }
    }
    
    // Fallback to old session system
    const session = getSession()
    if (session && !freeTrialEmail) {
      console.log('Restoring session data:', session.sessionId)
      
      if (session.email) {
        setEmail(session.email)
        setEmailSubmitted(true)
      }
      
      const sessionCredits = getCredits()
      if (sessionCredits) {
        const now = new Date()
        const expiresAt = new Date(sessionCredits.expiresAt)
        
        if (now < expiresAt && sessionCredits.count > 0) {
          setCredits(sessionCredits)
          setIsPaidUser(true)
          setEmailSubmitted(true)
        }
      }
      
      console.log('Session data restored successfully')
    } else if (!freeTrialEmail) {
      // Check old localStorage credits system
      const storedCredits = localStorage.getItem('artworkCredits')
      
      if (storedCredits) {
        const parsedCredits = JSON.parse(storedCredits)
        const now = new Date()
        const expiresAt = new Date(parsedCredits.expiresAt)
        
        if (now < expiresAt && parsedCredits.count > 0) {
          setCredits(parsedCredits)
          setIsPaidUser(true)
          setEmailSubmitted(true)
          saveCredits(parsedCredits)
        } else {
          localStorage.removeItem('artworkCredits')
          localStorage.removeItem('isPaidUser')
        }
      }
    }
    
    // Restore file and preferences regardless of credit system
    const savedFile = getUploadedFile()
    if (savedFile) {
      setUploadedFile(savedFile)
      const url = URL.createObjectURL(savedFile)
      setPreviewUrl(url)
      console.log('Restored uploaded file:', savedFile.name)
    }
    
    const preferences = getPreferences()
    if (preferences.selectedEnvironment) setSelectedEnvironment(preferences.selectedEnvironment)
    if (preferences.customPrompt) setCustomPrompt(preferences.customPrompt)
    if (preferences.artworkDimensions) setArtworkDimensions(preferences.artworkDimensions)
    if (preferences.includePedestal !== undefined) setIncludePedestal(preferences.includePedestal)
    if (preferences.viewingAngle) setViewingAngle(preferences.viewingAngle)
    if (preferences.selectedLighting) setSelectedLighting(preferences.selectedLighting)
    if (preferences.artworkType) setArtworkType(preferences.artworkType)
    if (preferences.aspectRatio) setAspectRatio(preferences.aspectRatio)
  }, [])

  // Save session data whenever key state changes
  useEffect(() => {
    if (email) {
      updateSession({ email })
    }
  }, [email])

  useEffect(() => {
    if (emailSubmitted) {
      updateSession({ email })
    }
  }, [emailSubmitted])

  useEffect(() => {
    const preferences = {
      selectedEnvironment,
      customPrompt,
      artworkDimensions,
      includePedestal,
      viewingAngle,
      selectedLighting,
      artworkType,
      aspectRatio
    }
    savePreferences(preferences)
  }, [selectedEnvironment, customPrompt, artworkDimensions, includePedestal, viewingAngle, selectedLighting, artworkType, aspectRatio])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }

      console.log(`File uploaded: ${file.name} (${formatFileSize(file.size)})`)
      
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Track file upload
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('file_uploaded', {
          file_size: file.size,
          file_type: file.type,
          file_name: file.name
        })
      }
      
      try {
        await saveUploadedFile(file)
        console.log('File saved to session storage')
      } catch (error) {
        console.error('Failed to save file to session:', error)
      }
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
      // Track email submission
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture('email_submitted', {
          email: email,
          step: 'onboarding'
        })
      }
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

    if (!isPaidUser || !credits || credits.count <= 0) {
      setShowPaymentPrompt(true)
      return
    }

    setIsProcessing(true)
    
    try {
      if (isHEICFile(uploadedFile)) {
        setIsConvertingHEIC(true)
      }

      const base64 = await processImageFile(uploadedFile)
      setIsConvertingHEIC(false)
      
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
      setCurrentStep(3) // Move to results step

      // Update credits in both new and old systems
      const updatedCredits = {
        ...credits,
        count: credits.count - 1
      }
      setCredits(updatedCredits)
      
      // Update new localStorage system if it exists
      const freeTrialCredits = localStorage.getItem('artview-user-credits')
      if (freeTrialCredits) {
        const newCount = Math.max(0, parseInt(freeTrialCredits) - 1)
        localStorage.setItem('artview-user-credits', newCount.toString())
      }
      
      // Update old system for backward compatibility
      localStorage.setItem('artworkCredits', JSON.stringify(updatedCredits))

    } catch (error) {
      console.error('Placement error:', error)
      alert('Generation failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setIsConvertingHEIC(false)
    }
  }

  const generateHighResPreview = async () => {
    if (!placementResult?.image_url) return

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

      const updatedCredits = {
        ...credits,
        count: credits.count - 1
      }
      setCredits(updatedCredits)
      localStorage.setItem('artworkCredits', JSON.stringify(updatedCredits))

      setShowPreviewModal(true)

    } catch (error) {
      console.error('Upscaling error:', error)
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
    if (rating >= 4) {
      setShowFeedbackForm(true)
    } else {
      setShowFeedbackForm(false)
    }
  }

  const downloadHighRes = async () => {
    if (!upscaledImageUrl || !placementResult) return
    
    try {
      const response = await fetch(upscaledImageUrl)
      const blob = await response.blob()
      
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `artwork-in-${placementResult.environment}-upscaled.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
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
      const reviewData = {
        rating: userRating,
        feedback: userFeedback,
        environment: placementResult?.environment,
        artworkType: artworkType,
        timestamp: new Date().toISOString(),
        email: email
      }

      console.log('Review submitted:', reviewData)

      if (userRating >= 4) {
        alert('Thank you for your feedback! Your review helps us improve ArtContext.')
      } else {
        alert('Thank you for your feedback! We\'ll use this to improve our service.')
      }

      setUserRating(null)
      setUserFeedback('')
      setShowFeedbackForm(false)
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const canProceedToStep2 = uploadedFile && artworkType && artworkDimensions.width && artworkDimensions.height
  const canProceedToStep3 = selectedEnvironment

  // Show email collection first
  if (!emailSubmitted && !isPaidUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ArtView Pro</h1>
            <p className="text-gray-900">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-900"
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
              <Image src="/logo.svg" alt="ArtView Pro" width={120} height={40} className="h-8 w-auto" />
            </div>
            
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
        {/* Progress Dots */}
        <ProgressDots currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step 1: Upload & Configure */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Your Artwork</h2>
              <p className="text-lg text-gray-600">
                Let's start by uploading your artwork and telling us a bit about it
              </p>
            </div>
            
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-8 ${
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
                <div className="relative max-w-md mx-auto">
                  <img
                    src={previewUrl!}
                    alt="Uploaded artwork"
                    className="w-full rounded-lg shadow-md"
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
                    What type of artwork is this?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'painting', name: 'Painting', description: 'Flat artwork for walls', icon: ImageIcon },
                      { id: 'sculpture', name: 'Sculpture', description: '3D artwork for spaces', icon: Box }
                    ].map((type) => {
                      const IconComponent = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setArtworkType(type.id)}
                          className={`p-4 rounded-lg border text-center transition-colors ${
                            artworkType === type.id
                              ? 'border-green-500 bg-green-50'
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

                {/* Artwork Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Artwork Dimensions (for accurate scaling)
                  </label>
                  <div className="space-y-4">
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
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedToStep2}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Continue to Environment Selection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Choose Environment - HeadshotPro Style */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Environment</h2>
              <p className="text-lg text-gray-600">
                Choose which environment you want for your artwork visualization
              </p>
              <div className="mt-4 inline-flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Selected environments</span>
                <span className="ml-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                  {selectedEnvironment ? '1' : '0'}/1
                </span>
              </div>
            </div>

            {/* Environment Grid - HeadshotPro Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {environments.map((env) => (
                <div key={env.id} className="relative group">
                  <div
                    className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                      selectedEnvironment === env.id
                        ? 'border-green-500 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedEnvironment(env.id)}
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={env.image}
                        alt={env.name}
                        fill
                        className="object-cover"
                      />
                      {selectedEnvironment === env.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900">{env.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{env.description}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedEnvironment(env.id)}
                    className={`absolute bottom-4 right-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedEnvironment === env.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {selectedEnvironment === env.id ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selected
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="w-4 h-4 mr-1" />
                        Select
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Settings */}
            {selectedEnvironment && (
              <div className="space-y-6 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Fine-tune your visualization</h3>
                
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

                {/* Viewing Angle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Viewing Angle
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'front', name: 'From the Front', description: 'Straight-on view, classic presentation', icon: ImageIcon },
                      { id: 'angle', name: 'From an Angle', description: 'Dynamic angled perspective', icon: RotateCcw }
                    ].map((angle) => {
                      const IconComponent = angle.icon
                      return (
                        <button
                          key={angle.id}
                          onClick={() => setViewingAngle(angle.id)}
                          className={`p-4 rounded-lg border text-center transition-colors ${
                            viewingAngle === angle.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <IconComponent className="w-6 h-6 text-gray-600" />
                          </div>
                          <h4 className="font-semibold text-sm">{angle.name}</h4>
                          <p className="text-xs text-gray-600">{angle.description}</p>
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
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={placeArtwork}
                disabled={!canProceedToStep3 || isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    {isConvertingHEIC ? 'Converting HEIC...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Artwork Placement
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && placementResult && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Placement Complete!</h2>
              </div>
              <p className="text-lg text-gray-600">
                Your artwork has been successfully placed in the {environments.find(e => e.id === selectedEnvironment)?.name}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
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
                  <span className="text-gray-600">• Aspect Ratio:</span>
                  <span className="ml-2 font-medium text-gray-900">{aspectRatio} {aspectRatio === '4:3' ? 'Landscape' : 'Portrait'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => {
                  setCurrentStep(2)
                  setPlacementResult(null)
                }}
                className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-lg font-semibold hover:bg-orange-200 flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Different Environment
              </button>
              <button
                onClick={() => {
                  setUploadedFile(null)
                  setPreviewUrl(null)
                  setPlacementResult(null)
                  setSelectedEnvironment('')
                  setCurrentStep(1)
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
                    High-Res Preview (+1 credit)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed High-Res Preview Modal */}
      {showPreviewModal && upscaledImageUrl && placementResult && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">✅ Your Professional Mockup Is Ready</h2>
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

            {/* Value Message */}
            <div className="px-6 py-4 bg-green-50 border-b border-green-100">
              <p className="text-gray-700 mb-2">
                You just saved hours of editing and hundreds in photography fees.
              </p>
              <p className="text-gray-800 font-medium">
                This is your artwork — presented clearly, professionally, and at scale.
              </p>
            </div>

            {/* Main Image Display */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-auto">
              <img
                src={upscaledImageUrl}
                alt="High resolution artwork"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
              {/* Download Button */}
              <div className="text-center mb-4">
                <button
                  onClick={downloadHighRes}
                  className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 flex items-center mx-auto mb-3"
                >
                  💾 <Download className="w-4 h-4 mx-2" />
                  Download High-Res Mockup
                </button>
                <p className="text-sm text-gray-600 mb-4">
                  AI-enhanced resolution. Print-ready. Yours to use anywhere.
                </p>
              </div>

              {/* Social Mention */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  💬 Love the result? Tag @artviewpro — we'd love to feature it.
                </p>
              </div>

              {/* Rating Section */}
              <div className="text-center">
                <div className="flex justify-center items-center mb-2">
                  <span className="text-2xl">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">Rate your experience</p>
                
                <div className="flex justify-center items-center space-x-3">
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
              </div>

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
