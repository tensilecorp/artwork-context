import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Simple file-based user storage (can be upgraded to database later)
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

interface User {
  id: string
  email: string
  credits: number
  createdAt: string
  expiresAt: string
  plan: 'free' | 'essential' | 'standard' | 'studio'
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load users from file
async function loadUsers(): Promise<User[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.log('No existing users file, starting fresh:', error)
    return []
  }
}

// Save users to file
async function saveUsers(users: User[]) {
  try {
    await ensureDataDir()
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    console.log('Users saved successfully')
  } catch (error) {
    console.error('Error saving users:', error)
    throw error
  }
}

// Generate simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const users = await loadUsers()
    
    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase())
    
    if (existingUser) {
      // Return existing user data
      return NextResponse.json({
        success: true,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          credits: existingUser.credits,
          plan: existingUser.plan
        },
        message: 'Welcome back! Your free credits are still available.'
      })
    }

    // Create new user with 3 free credits
    const newUser: User = {
      id: generateId(),
      email: email.toLowerCase(),
      credits: 3,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months
      plan: 'free'
    }

    users.push(newUser)
    await saveUsers(users)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        credits: newUser.credits,
        plan: newUser.plan
      },
      message: 'Account created! You have 3 free gallery mockups.'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
