interface ArtworkSession {
  // User info
  email: string;
  sessionId: string;
  timestamp: number;
  
  // Uploaded file data
  uploadedFile?: {
    name: string;
    size: number;
    type: string;
    base64: string;
  };
  
  // User preferences
  selectedEnvironment: string;
  customPrompt: string;
  artworkDimensions: {
    width: string;
    height: string;
    depth: string;
    unit: string;
  };
  includePedestal: boolean;
  viewingAngle: string;
  selectedLighting: string;
  artworkType: string;
  aspectRatio: string;
  
  // Payment status
  isPaidUser: boolean;
  credits?: {
    count: number;
    purchaseDate: string;
    sessionId: string;
    expiresAt: string;
  };
}

const SESSION_KEY = 'artworkSession';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export class SessionManager {
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static saveSession(data: Partial<ArtworkSession>): void {
    try {
      const existingSession = this.getSession();
      const sessionId = existingSession?.sessionId || this.generateSessionId();
      
      const session: ArtworkSession = {
        sessionId,
        timestamp: Date.now(),
        email: '',
        selectedEnvironment: 'living-room',
        customPrompt: '',
        artworkDimensions: {
          width: '',
          height: '',
          depth: '',
          unit: 'cm'
        },
        includePedestal: true,
        viewingAngle: 'front',
        selectedLighting: 'well-lit',
        artworkType: 'painting',
        aspectRatio: '4:3',
        isPaidUser: false,
        ...existingSession,
        ...data
      };

      // Update timestamp after merging
      session.timestamp = Date.now();

      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      console.log('Session saved:', { sessionId: session.sessionId, email: session.email });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  static getSession(): ArtworkSession | null {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const session: ArtworkSession = JSON.parse(sessionData);
      
      // Check if session has expired
      if (Date.now() - session.timestamp > SESSION_EXPIRY) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  static updateSession(updates: Partial<ArtworkSession>): void {
    const existingSession = this.getSession();
    if (existingSession) {
      this.saveSession({ ...existingSession, ...updates });
    } else {
      this.saveSession(updates);
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
      console.log('Session cleared');
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  static async saveUploadedFile(file: File): Promise<void> {
    try {
      // Convert file to base64 for storage
      const base64 = await this.fileToBase64(file);
      
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64
      };

      this.updateSession({ uploadedFile: fileData });
      console.log('File saved to session:', file.name);
    } catch (error) {
      console.error('Failed to save file to session:', error);
      throw error;
    }
  }

  static getUploadedFile(): File | null {
    try {
      const session = this.getSession();
      if (!session?.uploadedFile) return null;

      // Convert base64 back to File
      const { name, type, base64 } = session.uploadedFile;
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], name, { type });
    } catch (error) {
      console.error('Failed to restore file from session:', error);
      return null;
    }
  }

  static savePreferences(preferences: Partial<ArtworkSession>): void {
    this.updateSession(preferences);
  }

  static getPreferences(): Partial<ArtworkSession> {
    const session = this.getSession();
    if (!session) return {};

    return {
      selectedEnvironment: session.selectedEnvironment,
      customPrompt: session.customPrompt,
      artworkDimensions: session.artworkDimensions,
      includePedestal: session.includePedestal,
      viewingAngle: session.viewingAngle,
      selectedLighting: session.selectedLighting,
      artworkType: session.artworkType,
      aspectRatio: session.aspectRatio
    };
  }

  static saveCredits(credits: ArtworkSession['credits']): void {
    this.updateSession({ 
      credits,
      isPaidUser: true 
    });
    
    // Also save to the legacy format for backward compatibility
    if (credits) {
      localStorage.setItem('artworkCredits', JSON.stringify(credits));
      localStorage.setItem('isPaidUser', 'true');
    }
  }

  static getCredits(): ArtworkSession['credits'] | null {
    const session = this.getSession();
    if (session?.credits) return session.credits;

    // Fallback to legacy format
    try {
      const legacyCredits = localStorage.getItem('artworkCredits');
      if (legacyCredits) {
        const credits = JSON.parse(legacyCredits);
        // Migrate to new format
        this.saveCredits(credits);
        return credits;
      }
    } catch (error) {
      console.error('Failed to get legacy credits:', error);
    }

    return null;
  }

  static isSessionValid(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  static getSessionId(): string | null {
    const session = this.getSession();
    return session?.sessionId || null;
  }

  static hasUploadedFile(): boolean {
    const session = this.getSession();
    return !!session?.uploadedFile;
  }

  static isPaidUser(): boolean {
    const session = this.getSession();
    if (session?.isPaidUser) return true;

    // Fallback to legacy check
    return localStorage.getItem('isPaidUser') === 'true';
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Debug methods
  static debugSession(): void {
    const session = this.getSession();
    console.log('Current session:', session);
  }

  static getSessionSize(): string {
    const session = this.getSession();
    if (!session) return '0 KB';
    
    const size = new Blob([JSON.stringify(session)]).size;
    return `${(size / 1024).toFixed(2)} KB`;
  }
}

// Export convenience functions
export const saveSession = SessionManager.saveSession.bind(SessionManager);
export const getSession = SessionManager.getSession.bind(SessionManager);
export const updateSession = SessionManager.updateSession.bind(SessionManager);
export const clearSession = SessionManager.clearSession.bind(SessionManager);
export const saveUploadedFile = SessionManager.saveUploadedFile.bind(SessionManager);
export const getUploadedFile = SessionManager.getUploadedFile.bind(SessionManager);
export const savePreferences = SessionManager.savePreferences.bind(SessionManager);
export const getPreferences = SessionManager.getPreferences.bind(SessionManager);
export const saveCredits = SessionManager.saveCredits.bind(SessionManager);
export const getCredits = SessionManager.getCredits.bind(SessionManager);
export const isSessionValid = SessionManager.isSessionValid.bind(SessionManager);
export const isPaidUser = SessionManager.isPaidUser.bind(SessionManager);
export const hasUploadedFile = SessionManager.hasUploadedFile.bind(SessionManager);
