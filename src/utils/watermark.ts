// Simple watermark utility for free tier users
export async function addWatermark(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width
        canvas.height = img.height
        
        // Draw the original image
        ctx.drawImage(img, 0, 0)
        
        // Add watermark
        const watermarkText = 'ArtView Pro'
        const fontSize = Math.max(16, Math.min(img.width / 30, img.height / 30))
        
        ctx.font = `${fontSize}px Arial, sans-serif`
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.lineWidth = 1
        
        // Position watermark in bottom right corner
        const textMetrics = ctx.measureText(watermarkText)
        const x = img.width - textMetrics.width - 20
        const y = img.height - 20
        
        // Add subtle shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 2
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        
        // Draw watermark
        ctx.strokeText(watermarkText, x, y)
        ctx.fillText(watermarkText, x, y)
        
        // Convert back to data URL
        const watermarkedDataUrl = canvas.toDataURL('image/png', 0.95)
        resolve(watermarkedDataUrl)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image for watermarking'))
      }
      
      img.src = imageDataUrl
      
    } catch (error) {
      reject(error)
    }
  })
}

// Check if user is on free plan and needs watermark
export function shouldAddWatermark(userPlan: string): boolean {
  return userPlan === 'free'
}

// Get user plan from localStorage
export function getUserPlan(): string {
  if (typeof window === 'undefined') return 'free'
  return localStorage.getItem('artview-user-plan') || 'free'
}

// Get user credits from localStorage
export function getUserCredits(): number {
  if (typeof window === 'undefined') return 0
  const credits = localStorage.getItem('artview-user-credits')
  return credits ? parseInt(credits, 10) : 0
}

// Update user credits in localStorage
export function updateUserCredits(newCredits: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('artview-user-credits', newCredits.toString())
}
