import { trackEvent, trackPurchase } from '@/components/GoogleAnalytics'

// Declare PostHog for TypeScript
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void
      identify: (userId: string, properties?: Record<string, any>) => void
      reset: () => void
    }
  }
}

// Unified analytics tracking functions
export const analytics = {
  // Track page views
  trackPageView: (pageName: string, additionalData?: Record<string, any>) => {
    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('$pageview', {
        page: pageName,
        ...additionalData,
      })
    }
    
    // Google Analytics (automatically tracked by gtag config)
    // Additional custom event for GA if needed
    trackEvent('page_view', 'engagement', pageName)
  },

  // Track artwork upload
  trackArtworkUpload: (fileType: string, fileSize: number) => {
    const eventData = {
      file_type: fileType,
      file_size: fileSize,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('artwork_uploaded', eventData)
    }

    // Google Analytics
    trackEvent('upload', 'artwork', fileType, fileSize)
  },

  // Track AI analysis start
  trackAnalysisStart: (artworkType: string, selectedScene: string) => {
    const eventData = {
      artwork_type: artworkType,
      selected_scene: selectedScene,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('analysis_started', eventData)
    }

    // Google Analytics
    trackEvent('analysis_start', 'ai_processing', `${artworkType}_${selectedScene}`)
  },

  // Track AI analysis completion
  trackAnalysisComplete: (processingTime: number, success: boolean) => {
    const eventData = {
      processing_time: processingTime,
      success: success,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('analysis_completed', eventData)
    }

    // Google Analytics
    trackEvent(
      success ? 'analysis_success' : 'analysis_failure',
      'ai_processing',
      'completion',
      processingTime
    )
  },

  // Track payment initiation
  trackPaymentStart: (amount: number, currency: string = 'USD') => {
    const eventData = {
      amount: amount,
      currency: currency,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('payment_started', eventData)
    }

    // Google Analytics
    trackEvent('begin_checkout', 'ecommerce', 'payment_flow', amount)
  },

  // Track successful payment
  trackPaymentSuccess: (transactionId: string, amount: number, currency: string = 'USD') => {
    const eventData = {
      transaction_id: transactionId,
      amount: amount,
      currency: currency,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('payment_completed', eventData)
    }

    // Google Analytics - Enhanced Ecommerce
    trackPurchase(transactionId, amount, currency)
  },

  // Track download
  trackDownload: (imageType: string, resolution: string) => {
    const eventData = {
      image_type: imageType,
      resolution: resolution,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('image_downloaded', eventData)
    }

    // Google Analytics
    trackEvent('download', 'engagement', `${imageType}_${resolution}`)
  },

  // Track user engagement
  trackEngagement: (action: string, element: string, value?: number) => {
    const eventData = {
      action: action,
      element: element,
      value: value,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('user_engagement', eventData)
    }

    // Google Analytics
    trackEvent(action, 'engagement', element, value)
  },

  // Track errors
  trackError: (errorType: string, errorMessage: string, context?: string) => {
    const eventData = {
      error_type: errorType,
      error_message: errorMessage,
      context: context,
      timestamp: new Date().toISOString(),
    }

    // PostHog
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('error_occurred', eventData)
    }

    // Google Analytics
    trackEvent('exception', 'error', `${errorType}: ${errorMessage}`)
  },

  // Identify user (for PostHog)
  identifyUser: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.identify(userId, properties)
    }
  },

  // Reset user session
  resetUser: () => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.reset()
    }
  },
}
