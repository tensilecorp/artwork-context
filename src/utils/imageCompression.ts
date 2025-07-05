/**
 * Image compression utilities to reduce file size before API calls
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

/**
 * Compress an image file to reduce its size
 */
export function compressImage(
  file: File, 
  options: CompressionOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.8,
      maxSizeKB = 500
    } = options

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      
      // Scale down if image is too large
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.floor(width * ratio)
        height = Math.floor(height * ratio)
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      // Try different quality levels to meet size requirement
      let currentQuality = quality
      let result = canvas.toDataURL('image/jpeg', currentQuality)
      
      // Estimate size in KB (base64 is ~33% larger than binary)
      let estimatedSizeKB = (result.length * 0.75) / 1024
      
      // Reduce quality if still too large
      while (estimatedSizeKB > maxSizeKB && currentQuality > 0.1) {
        currentQuality -= 0.1
        result = canvas.toDataURL('image/jpeg', currentQuality)
        estimatedSizeKB = (result.length * 0.75) / 1024
      }

      console.log(`Image compressed: ${img.width}x${img.height} -> ${width}x${height}, Quality: ${currentQuality.toFixed(1)}, Size: ~${estimatedSizeKB.toFixed(0)}KB`)
      
      resolve(result)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'))
    }

    // Create object URL from file
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
  })
}

/**
 * Check if a file is too large and needs compression
 */
export function needsCompression(file: File, maxSizeMB: number = 5): boolean {
  return file.size > maxSizeMB * 1024 * 1024
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Validate file before processing
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' }
  }

  // Check file size (max 20MB before compression)
  const maxSize = 20 * 1024 * 1024 // 20MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(maxSize)}` 
    }
  }

  return { valid: true }
}
