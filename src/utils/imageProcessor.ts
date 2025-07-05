/**
 * Comprehensive image processor that handles all image formats properly
 * - HEIC files: Converts to JPG using heic2any library
 * - All images: Applies EXIF orientation correction
 * - Large images: Compresses to reasonable size
 */

import heic2any from 'heic2any'

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
 * Convert HEIC file to JPG using proper HEIC library
 */
export async function convertHEICToJPG(file: File): Promise<File> {
  try {
    console.log('Converting HEIC to JPG using heic2any...')
    
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8
    }) as Blob
    
    // Create a new File from the converted blob
    const convertedFile = new File(
      [convertedBlob], 
      file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
      { type: 'image/jpeg' }
    )
    
    console.log(`HEIC converted: ${file.name} (${formatFileSize(file.size)} → ${formatFileSize(convertedFile.size)})`)
    
    return convertedFile
  } catch (error) {
    console.error('HEIC conversion failed:', error)
    throw new Error('Failed to convert HEIC file. Please try converting to JPG first.')
  }
}

/**
 * Get EXIF orientation from image file
 */
function getImageOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = function(e) {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const dataView = new DataView(arrayBuffer)
      
      // Check for JPEG signature
      if (dataView.getUint16(0) !== 0xFFD8) {
        resolve(1) // Default orientation
        return
      }
      
      let offset = 2
      let marker = dataView.getUint16(offset)
      
      while (offset < dataView.byteLength) {
        if (marker === 0xFFE1) { // EXIF marker
          const exifOffset = offset + 4
          const tiffOffset = exifOffset + 6
          
          // Check for TIFF header
          if (dataView.getUint32(tiffOffset) === 0x4D4D002A || dataView.getUint32(tiffOffset) === 0x49492A00) {
            const littleEndian = dataView.getUint32(tiffOffset) === 0x49492A00
            const ifdOffset = dataView.getUint32(tiffOffset + 4, littleEndian) + tiffOffset
            const tagCount = dataView.getUint16(ifdOffset, littleEndian)
            
            for (let i = 0; i < tagCount; i++) {
              const tagOffset = ifdOffset + 2 + (i * 12)
              const tag = dataView.getUint16(tagOffset, littleEndian)
              
              if (tag === 0x0112) { // Orientation tag
                const orientation = dataView.getUint16(tagOffset + 8, littleEndian)
                resolve(orientation)
                return
              }
            }
          }
        }
        
        offset += 2 + dataView.getUint16(offset + 2)
        marker = dataView.getUint16(offset)
      }
      
      resolve(1) // Default orientation if not found
    }
    
    reader.onerror = () => resolve(1)
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024)) // Read first 64KB for EXIF
  })
}

/**
 * Apply EXIF orientation correction to image
 */
export function correctImageOrientation(file: File, orientation: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = function(e) {
      const img = new Image()
      
      img.onload = function() {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        const { width, height } = img
        
        // Set canvas dimensions based on orientation
        if (orientation >= 5 && orientation <= 8) {
          canvas.width = height
          canvas.height = width
        } else {
          canvas.width = width
          canvas.height = height
        }
        
        // Apply transformation based on EXIF orientation
        switch (orientation) {
          case 1:
            // Normal - no transformation
            break
          case 2:
            // Horizontal flip
            ctx.transform(-1, 0, 0, 1, width, 0)
            break
          case 3:
            // 180° rotation
            ctx.transform(-1, 0, 0, -1, width, height)
            break
          case 4:
            // Vertical flip
            ctx.transform(1, 0, 0, -1, 0, height)
            break
          case 5:
            // 90° CW + horizontal flip
            ctx.transform(0, 1, 1, 0, 0, 0)
            break
          case 6:
            // 90° CW rotation
            ctx.transform(0, 1, -1, 0, height, 0)
            break
          case 7:
            // 90° CCW + horizontal flip
            ctx.transform(0, -1, -1, 0, height, width)
            break
          case 8:
            // 90° CCW rotation
            ctx.transform(0, -1, 1, 0, 0, width)
            break
        }
        
        // Draw the image with applied transformation
        ctx.drawImage(img, 0, 0)
        
        // Check if we need to compress for size
        let quality = 0.9
        let result = canvas.toDataURL('image/jpeg', quality)
        
        // If result is too large (>2MB base64), reduce quality
        const maxSizeBytes = 2 * 1024 * 1024 // 2MB
        while (result.length > maxSizeBytes && quality > 0.3) {
          quality -= 0.1
          result = canvas.toDataURL('image/jpeg', quality)
        }
        
        console.log(`Image processed: ${width}x${height}, orientation: ${orientation}, quality: ${quality.toFixed(1)}, size: ~${formatFileSize(result.length * 0.75)}`)
        
        resolve(result)
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Main image processing function - handles all image types
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    let processFile = file
    
    // Step 1: Convert HEIC to JPG if needed
    if (isHEICFile(file)) {
      console.log('HEIC file detected, converting to JPG...')
      processFile = await convertHEICToJPG(file)
    }
    
    // Step 2: Get EXIF orientation
    const orientation = await getImageOrientation(processFile)
    
    // Step 3: Apply orientation correction and compression
    const result = await correctImageOrientation(processFile, orientation)
    
    return result
    
  } catch (error) {
    console.error('Image processing failed:', error)
    
    // Fallback: simple base64 conversion
    console.log('Falling back to simple base64 conversion...')
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }
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

/**
 * Validate image file before processing
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif']
  
  const hasValidType = validTypes.includes(file.type) || 
                      validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  
  if (!hasValidType) {
    return { valid: false, error: 'Please upload a valid image file (JPG, PNG, WebP, or HEIC)' }
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(maxSize)}` 
    }
  }

  return { valid: true }
}
