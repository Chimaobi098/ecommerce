'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

export async function initializeUserWallet(): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/login')
    }

    // Check if wallet already exists
    const { data: existingWallet } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!existingWallet) {
      // Create wallet for new user
      const { error } = await supabase
        .from('wallets')
        .insert({
          user_id: user.id,
          auction_balance: 0,
          game_balance: 0
        })

      if (error) {
        throw new Error('Failed to create wallet: ' + error.message)
      }

      return { success: true, message: 'Wallet initialized successfully' }
    }

    return { success: true, message: 'Wallet already exists' }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}