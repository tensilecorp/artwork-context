import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

interface User {
  id: string
  email: string
  credits: number
  createdAt: string
  expiresAt: string
  plan: 'free' | 'essential' | 'standard' | 'studio'
}

// Load users from file
async function loadUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Save users to file
async function saveUsers(users: User[]) {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

// GET - Check user credits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const users = await loadUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if credits have expired
    const now = new Date()
    const expiresAt = new Date(user.expiresAt)
    
    if (now > expiresAt && user.plan === 'free') {
      return NextResponse.json({
        success: true,
        credits: 0,
        expired: true,
        message: 'Your free credits have expired. Upgrade to continue creating!'
      })
    }

    return NextResponse.json({
      success: true,
      credits: user.credits,
      plan: user.plan,
      expiresAt: user.expiresAt
    })

  } catch (error) {
    console.error('Credits check error:', error)
    return NextResponse.json(
      { error: 'Failed to check credits' },
      { status: 500 }
    )
  }
}

// POST - Use/deduct credits
export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const users = await loadUsers()
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const user = users[userIndex]

    // Check if credits have expired
    const now = new Date()
    const expiresAt = new Date(user.expiresAt)
    
    if (now > expiresAt && user.plan === 'free') {
      return NextResponse.json({
        success: false,
        error: 'Credits have expired',
        credits: 0,
        expired: true
      }, { status: 403 })
    }

    if (action === 'deduct') {
      // Check if user has credits
      if (user.credits <= 0) {
        return NextResponse.json({
          success: false,
          error: 'No credits remaining',
          credits: 0,
          needsUpgrade: true
        }, { status: 403 })
      }

      // Deduct one credit
      users[userIndex].credits -= 1
      await saveUsers(users)

      return NextResponse.json({
        success: true,
        credits: users[userIndex].credits,
        message: `Credit used! You have ${users[userIndex].credits} credits remaining.`
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Credits action error:', error)
    return NextResponse.json(
      { error: 'Failed to process credits' },
      { status: 500 }
    )
  }
}
