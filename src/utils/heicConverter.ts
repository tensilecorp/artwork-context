/**
 * HEIC to JPG converter utility
 * Automatically converts HEIC files to JPG to reduce file size and ensure compatibility
 */

/**
 * Check if a file is HEIC format
 */
export function isHEICFile(file: File): boolean {
  return file.type === 'image/heic' || 
         file.type === 'image/heif' || 
         file.name.toLowerCase().endsWith('.heic') || 
         file.name.toLowerCase().endsWith('.heif')
}

/**
 * Convert HEIC file to JPG format
 * This dramatically reduces file size while maintaining quality
 */
export function convertHEICToJPG(file: File, quality: number = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw image to canvas
      ctx.drawImage(img, 0, 0)

      // Convert to JPG with specified quality
      const jpgDataUrl = canvas.toDataURL('image/jpeg', quality)
      
      console.log(`HEIC converted to JPG: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB → ~${(jpgDataUrl.length * 0.75 / 1024 / 1024).toFixed(1)}MB)`)
      
      resolve(jpgDataUrl)
    }

    img.onerror = () => {
      reject(new Error('Failed to load HEIC image for conversion'))
    }

    // Create object URL from file to load in image
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl
  })
}

/**
 * Process any image file - convert HEIC to JPG, pass through others unchanged
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    if (isHEICFile(file)) {
      console.log('HEIC file detected, converting to JPG...')
      return await convertHEICToJPG(file)
    } else {
      // For non-HEIC files, just convert to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })
    }
  } catch (error) {
    console.error('Image processing failed:', error)
    throw error
  }
}

/**
 * Get estimated file size from base64 string
 */
export function getEstimatedSizeKB(base64String: string): number {
  return (base64String.length * 0.75) / 1024
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
