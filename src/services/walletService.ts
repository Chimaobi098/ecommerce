import { getSupabaseClient } from '@/lib/supabase/supabase-utils'
import { WalletBalance, WalletTransaction } from '@/types/game.types'

export const walletService = {
  async getWalletBalance(userId: string): Promise<WalletBalance> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('wallets')
      .select('auction_balance, game_balance')
      .eq('user_id', userId)
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async getProgressiveReward(userId: string): Promise<number> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .rpc('get_progressive_reward', { user_uuid: userId })
    
    if (error) throw new Error(error.message)
    return data
  },

  async creditAuctionWallet(
    userId: string, 
    amount: number, 
    description?: string, 
    referenceId?: string
  ): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .rpc('credit_auction_wallet', {
        user_uuid: userId,
        amount,
        description,
        reference_id: referenceId
      })
    
    if (error) throw new Error(error.message)
    return data
  },

  async debitAuctionWallet(
    userId: string, 
    amount: number, 
    description?: string, 
    referenceId?: string
  ): Promise<boolean> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .rpc('debit_auction_wallet', {
        user_uuid: userId,
        amount,
        description,
        reference_id: referenceId
      })
    
    if (error) throw new Error(error.message)
    return data
  },

  async getTransactionHistory(userId: string): Promise<WalletTransaction[]> {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) throw new Error(error.message)
    return data
  }
}