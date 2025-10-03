import { getSupabaseClient } from '@/lib/supabase/supabase-utils'
import { walletService } from './walletService'
import { Game, WordSearchSession, GameRewardClaim } from '@/types/game.types'

export const gameService = {
  async getAvailableGames(): Promise<Game[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('status', 'active')
    
    if (error) throw new Error(error.message)
    return data
  },

  async claimGameReward(userId: string): Promise<GameRewardClaim> {
    const supabase = getSupabaseClient()
    
    try {
      // Get progressive reward amount
      const rewardAmount = await walletService.getProgressiveReward(userId)
      
      // Credit wallet
      await walletService.creditAuctionWallet(
        userId, 
        rewardAmount, 
        'Game access reward',
        `game_reward_${Date.now()}`
      )

      // Update claim count
      const today = new Date().toISOString().split('T')[0]
      const { error } = await supabase
        .from('game_reward_claims')
        .upsert({
          user_id: userId,
          claim_date: today,
          claim_count: 1,
          last_claimed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,claim_date',
          ignoreDuplicates: false
        })

      if (error) throw new Error(error.message)
      
      return {
        success: true,
        rewardAmount,
        message: `${rewardAmount.toLocaleString()} BC added to your wallet!`
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to claim reward')
    }
  },

  async createWordSearchSession(
    userId: string, 
    attempts: number, 
    reward: number
  ): Promise<WordSearchSession> {
    const supabase = getSupabaseClient()
    const costPerAttempt = 1000 // Fixed cost
    const totalCost = attempts * costPerAttempt

    try {
      // First debit the wallet
      await walletService.debitAuctionWallet(
        userId,
        totalCost,
        'Word search game cost'
      )

      // Create session
      const { data, error } = await supabase
        .from('word_search_sessions')
        .insert({
          user_id: userId,
          total_attempts: attempts,
          cost_per_attempt: costPerAttempt,
          total_cost: totalCost,
          selected_reward: reward
        })
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create game session')
    }
  },

  async recordWordSearchWin(
    sessionId: string, 
    userId: string, 
    reward: number
  ): Promise<void> {
    const supabase = getSupabaseClient()
    
    try {
      // Credit wallet with reward
      await walletService.creditAuctionWallet(
        userId,
        reward,
        'Word search game win',
        `word_search_${sessionId}`
      )
  
      // Get current values
      const { data: session, error: fetchError } = await supabase
        .from('word_search_sessions')
        .select('attempts_won, total_winnings')
        .eq('id', sessionId)
        .single()
  
      if (fetchError) throw new Error(fetchError.message)
  
      // Update with new values
      const { error } = await supabase
        .from('word_search_sessions')
        .update({
          attempts_won: (session.attempts_won || 0) + 1,
          total_winnings: (session.total_winnings || 0) + reward
        })
        .eq('id', sessionId)
  
      if (error) throw new Error(error.message)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to record win')
    }
  },

  async getWordSearchSession(sessionId: string): Promise<WordSearchSession> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('word_search_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}