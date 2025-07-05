import EXIF from 'exif-js'

/**
 * Corrects image orientation based on EXIF data
 * This fixes the common issue where iPhone photos (.heic) appear rotated
 */
export function correctImageOrientation(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // First, read EXIF data to get orientation
    EXIF.getData(file as any, function(this: any) {
      const orientation = EXIF.getTag(this, 'Orientation') || 1
      
      // Create FileReader to read the image
      const reader = new FileReader()
      
      reader.onload = function(e) {
        const img = new Image()
        
        img.onload = function() {
          // Create canvas for orientation correction
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }
          
          // Calculate canvas dimensions based on orientation
          const { width, height } = img
          
          // For orientations 5, 6, 7, 8 we need to swap width/height
          if (orientation >= 5 && orientation <= 8) {
            canvas.width = height
            canvas.height = width
          } else {
            canvas.width = width
            canvas.height = height
          }
          
          // Apply transformation based on EXIF orientation
          // Reset any previous transformations
          ctx.setTransform(1, 0, 0, 1, 0, 0)
          
          switch (orientation) {
            case 1:
              // Normal - no transformation needed
              ctx.drawImage(img, 0, 0)
              break
            case 2:
              // Horizontal flip
              ctx.scale(-1, 1)
              ctx.drawImage(img, -width, 0)
              break
            case 3:
              // 180° rotation
              ctx.rotate(Math.PI)
              ctx.drawImage(img, -width, -height)
              break
            case 4:
              // Vertical flip
              ctx.scale(1, -1)
              ctx.drawImage(img, 0, -height)
              break
            case 5:
              // 90° CW + horizontal flip
              ctx.rotate(Math.PI / 2)
              ctx.scale(-1, 1)
              ctx.drawImage(img, -height, 0)
              break
            case 6:
              // 90° CW rotation (most common mobile issue)
              ctx.rotate(Math.PI / 2)
              ctx.drawImage(img, 0, -height)
              break
            case 7:
              // 90° CCW + horizontal flip
              ctx.rotate(-Math.PI / 2)
              ctx.scale(-1, 1)
              ctx.drawImage(img, -width, 0)
              break
            case 8:
              // 90° CCW rotation
              ctx.rotate(-Math.PI / 2)
              ctx.drawImage(img, -width, 0)
              break
            default:
              // Unknown orientation, treat as normal
              ctx.drawImage(img, 0, 0)
              break
          }
          
          // Convert canvas to base64
          const correctedBase64 = canvas.toDataURL('image/jpeg', 0.9)
          resolve(correctedBase64)
        }
        
        img.onerror = function() {
          reject(new Error('Failed to load image'))
        }
        
        img.src = e.target?.result as string
      }
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  })
}

/**
 * Fallback function for when EXIF data is not available
 * Simply converts file to base64 without orientation correction
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

/**
 * Smart image processing that attempts EXIF correction first,
 * falls back to simple base64 conversion if EXIF processing fails
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    // Try EXIF orientation correction first
    return await correctImageOrientation(file)
  } catch (error) {
    console.warn('EXIF orientation correction failed, using fallback:', error)
    // Fallback to simple base64 conversion
    return await fileToBase64(file)
  }
}
