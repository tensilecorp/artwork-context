/**
 * Utility functions for persisting user session data across payment flow
 */

export interface UserSessionData {
  // File data
  uploadedFile?: {
    name: string
    type: string
    size: number
    base64: string
  }
  previewUrl?: string
  
  // User preferences
  selectedEnvironment?: string
  customPrompt?: string
  artworkDimensions?: {
    width: string
    height: string
    depth: string
    unit: string
  }
  includePedestal?: boolean
  viewingAngle?: string
  selectedLighting?: string
  artworkType?: string
  aspectRatio?: string
  
  // User info
  email?: string
  
  // Timestamp for expiration
  savedAt?: string
}

const SESSION_STORAGE_KEY = 'artworkContextSession'
const SESSION_EXPIRY_HOURS = 24

/**
 * Save user session data to localStorage
 */
export function saveUserSession(data: Partial<UserSessionData>): void {
  try {
    const existingData = getUserSession()
    const sessionData: UserSessionData = {
      ...existingData,
      ...data,
      savedAt: new Date().toISOString()
    }
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
    console.log('User session saved successfully')
  } catch (error) {
    console.error('Failed to save user session:', error)
  }
}

/**
 * Retrieve user session data from localStorage
 */
export function getUserSession(): Partial<UserSessionData> {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return {}
    
    const data: UserSessionData = JSON.parse(stored)
    
    // Check if session has expired
    if (data.savedAt) {
      const savedAt = new Date(data.savedAt)
      const now = new Date()
      const hoursDiff = (now.getTime() - savedAt.getTime()) / (1000 * 60 * 60)
      
      if (hoursDiff > SESSION_EXPIRY_HOURS) {
        console.log('User session expired, clearing data')
        clearUserSession()
        return {}
      }
    }
    
    return data
  } catch (error) {
    console.error('Failed to retrieve user session:', error)
    return {}
  }
}

/**
 * Clear user session data
 */
export function clearUserSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    console.log('User session cleared')
  } catch (error) {
    console.error('Failed to clear user session:', error)
  }
}

/**
 * Check if user has a valid saved session
 */
export function hasValidSession(): boolean {
  const session = getUserSession()
  return !!(session.uploadedFile && session.email)
}

/**
 * Convert File to base64 for storage
 */
export function fileToStorageData(file: File, base64: string) {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    base64: base64
  }
}

/**
 * Create a File object from stored data (for restoration)
 */
export function storageDataToFile(data: UserSessionData['uploadedFile']): File | null {
  if (!data) return null
  
  try {
    // Convert base64 back to blob
    const byteCharacters = atob(data.base64.split(',')[1])
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: data.type })
    
    // Create File from blob
    return new File([blob], data.name, { type: data.type })
  } catch (error) {
    console.error('Failed to convert storage data to file:', error)
    return null
  }
}
