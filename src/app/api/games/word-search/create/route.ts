import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { gameService } from '@/services/gameService'

interface CreateWordSearchRequest {
  attempts: number
  reward: number
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: CreateWordSearchRequest = await request.json()
    const { attempts, reward } = body

    // Validate input
    if (!attempts || !reward || attempts < 1 || attempts > 10 || reward < 1000) {
      return NextResponse.json({ 
        error: 'Invalid input parameters' 
      }, { status: 400 })
    }
    
    const session = await gameService.createWordSearchSession(
      user.id, 
      attempts, 
      reward
    )
    
    return NextResponse.json({ 
      success: true, 
      session
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}