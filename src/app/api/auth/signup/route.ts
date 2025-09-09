import { NextRequest, NextResponse } from 'next/server'

interface User {
  id: string
  email: string
  credits: number
  createdAt: string
  expiresAt: string
  plan: 'free' | 'essential' | 'standard' | 'studio'
}

// Generate simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log('Signup request received for email:', email)

    if (!email || !email.includes('@')) {
      console.log('Invalid email provided:', email)
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // For now, we'll just create the user data and return it
    // The client will store it in localStorage
    // Later we can upgrade to a proper database
    
    const newUser: User = {
      id: generateId(),
      email: email.toLowerCase(),
      credits: 3,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months
      plan: 'free'
    }

    console.log('Created new user:', newUser)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        credits: newUser.credits,
        plan: newUser.plan,
        expiresAt: newUser.expiresAt
      },
      message: 'Account created! You have 3 free gallery mockups.'
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
