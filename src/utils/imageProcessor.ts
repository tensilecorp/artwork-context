/**
 * Comprehensive image processor that handles all image formats properly
 * - HEIC files: Converts to JPG using heic2any library
 * - All images: Applies EXIF orientation correction
 * - Large images: Compresses to reasonable size
 * - Client-side only: Uses dynamic imports to avoid SSR issues
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
 * Convert HEIC file to JPG using proper HEIC library (client-side only)
 */
export async function convertHEICToJPG(file: File): Promise<File> {
  // Ensure we're in a browser environment
  if (typeof window === 'undefined') {
    throw new Error('HEIC conversion only available in browser environment')
  }

  try {
    console.log('Converting HEIC to JPG using heic2any...')
    
    // Dynamic import to avoid SSR issues
    const heic2any = (await import('heic2any')).default
    
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
 * Get EXIF orientation from image file (client-side only)
 */
function getImageOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof FileReader === 'undefined') {
      resolve(1) // Default orientation for SSR
      return
    }

    const reader = new FileReader()
    
    reader.onload = function(e) {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const dataView = new DataView(arrayBuffer)
        
        // Check minimum file size and JPEG signature
        if (arrayBuffer.byteLength < 4 || dataView.getUint16(0) !== 0xFFD8) {
          resolve(1) // Default orientation
          return
        }
        
        let offset = 2
        
        while (offset < dataView.byteLength - 1) {
          // Ensure we can read the marker
          if (offset + 1 >= dataView.byteLength) break
          
          const marker = dataView.getUint16(offset)
          
          if (marker === 0xFFE1) { // EXIF marker
            // Ensure we can read the segment length
            if (offset + 3 >= dataView.byteLength) break
            
            const segmentLength = dataView.getUint16(offset + 2)
            const exifOffset = offset + 4
            const tiffOffset = exifOffset + 6
            
            // Check bounds for TIFF header
            if (tiffOffset + 7 >= dataView.byteLength) break
            
            // Check for TIFF header
            const tiffHeader = dataView.getUint32(tiffOffset)
            if (tiffHeader === 0x4D4D002A || tiffHeader === 0x49492A00) {
              const littleEndian = tiffHeader === 0x49492A00
              
              // Check bounds for IFD offset
              if (tiffOffset + 7 >= dataView.byteLength) break
              
              const ifdOffset = dataView.getUint32(tiffOffset + 4, littleEndian) + tiffOffset
              
              // Check bounds for tag count
              if (ifdOffset + 1 >= dataView.byteLength) break
              
              const tagCount = dataView.getUint16(ifdOffset, littleEndian)
              
              // Reasonable limit on tag count to prevent infinite loops
              const maxTags = Math.min(tagCount, 100)
              
              for (let i = 0; i < maxTags; i++) {
                const tagOffset = ifdOffset + 2 + (i * 12)
                
                // Check bounds for tag data
                if (tagOffset + 11 >= dataView.byteLength) break
                
                const tag = dataView.getUint16(tagOffset, littleEndian)
                
                if (tag === 0x0112) { // Orientation tag
                  const orientation = dataView.getUint16(tagOffset + 8, littleEndian)
                  // Validate orientation value (should be 1-8)
                  if (orientation >= 1 && orientation <= 8) {
                    resolve(orientation)
                    return
                  }
                }
              }
            }
          }
          
          // Move to next segment
          if (offset + 3 >= dataView.byteLength) break
          
          const segmentLength = dataView.getUint16(offset + 2)
          offset += 2 + segmentLength
        }
        
        resolve(1) // Default orientation if not found
      } catch (error) {
        console.warn('EXIF reading failed:', error)
        resolve(1) // Default orientation on error
      }
    }
    
    reader.onerror = () => resolve(1)
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024)) // Read first 64KB for EXIF
  })
}

/**
 * Convert file to base64 with compression (no orientation correction)
 */
function convertToBase64WithCompression(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof FileReader === 'undefined') {
      reject(new Error('Image processing only available in browser environment'))
      return
    }

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
        
        // Set canvas dimensions (no orientation changes)
        canvas.width = width
        canvas.height = height
        
        // Draw the image without any transformations
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
        
        console.log(`Image processed: ${width}x${height}, quality: ${quality.toFixed(1)}, size: ~${formatFileSize(result.length * 0.75)}`)
        
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
 * Apply EXIF orientation correction to image (client-side only)
 */
export function correctImageOrientation(file: File, orientation: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof FileReader === 'undefined') {
      reject(new Error('Image processing only available in browser environment'))
      return
    }

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
 * Note: Removed EXIF orientation correction to prevent double-correction issues
 * Modern browsers handle EXIF display automatically, so we send images as-is
 */
export async function processImageFile(file: File): Promise<string> {
  try {
    let processFile = file
    
    // Step 1: Convert HEIC to JPG if needed
    if (isHEICFile(file)) {
      console.log('HEIC file detected, converting to JPG...')
      processFile = await convertHEICToJPG(file)
    }
    
    // Step 2: Convert to base64 with compression (no orientation correction)
    const result = await convertToBase64WithCompression(processFile)
    
    return result
    
  } catch (error) {
    console.error('Image processing failed:', error)
    
    // Fallback: simple base64 conversion (client-side only)
    console.log('Falling back to simple base64 conversion...')
    
    // Ensure we're in a browser environment for fallback
    if (typeof window === 'undefined' || typeof FileReader === 'undefined') {
      throw new Error('Image processing requires browser environment')
    }
    
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
