// hooks/useWallet.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { walletService } from '@/services/walletService'
import { getSupabaseClient } from '@/lib/supabase/supabase-utils'
import { WalletBalance } from '@/types/game.types'
import { User } from '@supabase/supabase-js'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseWalletReturn {
  balance: WalletBalance | null
  loading: boolean
  user: User | null
  error: string | null
  refetch: () => Promise<void>
  claimGameReward: () => Promise<{ success: boolean; message: string; rewardAmount?: number }>
  isInitialized: boolean
}

export function useWallet(): UseWalletReturn {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const fetchWalletData = useCallback(async (userId: string) => {
    try {
      const walletData = await walletService.getWalletBalance(userId)
      setBalance(walletData)
      setError(null)
      setIsInitialized(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet balance'
      setError(errorMessage)
      console.error('Wallet fetch error:', error)
    }
  }, [])

  const refetch = useCallback(async () => {
    if (user) {
      setLoading(true)
      await fetchWalletData(user.id)
      setLoading(false)
    }
  }, [user, fetchWalletData])

  const claimGameReward = useCallback(async () => {
    if (!user) {
      return { success: false, message: 'User not authenticated' }
    }

    try {
      const response = await fetch('/api/games/claim-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to claim reward')
      }

      const result = await response.json()
      
      // Refetch wallet balance to get updated amount
      await refetch()
      
      return {
        success: true,
        message: result.message,
        rewardAmount: result.rewardAmount
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim reward'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    }
  }, [user, refetch])

  useEffect(() => {
    const supabase = getSupabaseClient()
    let channel: RealtimeChannel | null = null

    // Get initial user and balance
    const initializeWallet = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
        if (currentUser) {
          await fetchWalletData(currentUser.id)
          
          // Set up real-time subscription for wallet changes
          channel = supabase
            .channel(`wallet-changes-${currentUser.id}`)
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'wallets',
                filter: `user_id=eq.${currentUser.id}`,
              },
              (payload) => {
                console.log('Real-time wallet update:', payload)
                setBalance({
                  auction_balance: payload.new.auction_balance,
                  game_balance: payload.new.game_balance
                })
              }
            )
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'wallet_transactions',
                filter: `user_id=eq.${currentUser.id}`,
              },
              (payload) => {
                console.log('New transaction:', payload)
                // Update balance with the new balance_after from the transaction
                setBalance(prevBalance => {
                  if (!prevBalance) return prevBalance
                  
                  const walletType = payload.new.wallet_type as 'auction' | 'game'
                  return {
                    ...prevBalance,
                    [`${walletType}_balance`]: payload.new.balance_after
                  }
                })
              }
            )
            .subscribe((status) => {
              console.log('Wallet subscription status:', status)
            })
        } else {
          setIsInitialized(true)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize wallet'
        setError(errorMessage)
        console.error('Wallet initialization error:', error)
        setIsInitialized(true)
      } finally {
        setLoading(false)
      }
    }

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          setLoading(true)
          await fetchWalletData(session.user.id)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setBalance(null)
          setError(null)
          setIsInitialized(false)
          
          // Clean up existing channel
          if (channel) {
            await supabase.removeChannel(channel)
            channel = null
          }
        }
      }
    )

    initializeWallet()

    // Cleanup function
    return () => {
      subscription.unsubscribe()
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchWalletData])

  // Auto-refetch on window focus (optional)
  useEffect(() => {
    const handleFocus = () => {
      if (user && document.visibilityState === 'visible') {
        refetch()
      }
    }

    document.addEventListener('visibilitychange', handleFocus)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('focus', handleFocus)
    }
  }, [user, refetch])

  return {
    balance,
    loading,
    user,
    error,
    refetch,
    claimGameReward,
    isInitialized
  }
}

// Additional utility hook for wallet operations
export function useWalletOperations() {
  const { user, refetch } = useWallet()

  const debitWallet = useCallback(async (
    amount: number, 
    description?: string, 
    referenceId?: string
  ) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const success = await walletService.debitAuctionWallet(
        user.id, 
        amount, 
        description, 
        referenceId
      )
      
      if (success) {
        await refetch() // Refresh balance after operation
      }
      
      return success
    } catch (error) {
      console.error('Wallet debit error:', error)
      throw error
    }
  }, [user, refetch])

  const creditWallet = useCallback(async (
    amount: number, 
    description?: string, 
    referenceId?: string
  ) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const success = await walletService.creditAuctionWallet(
        user.id, 
        amount, 
        description, 
        referenceId
      )
      
      if (success) {
        await refetch() // Refresh balance after operation
      }
      
      return success
    } catch (error) {
      console.error('Wallet credit error:', error)
      throw error
    }
  }, [user, refetch])

  const getTransactionHistory = useCallback(async () => {
    if (!user) throw new Error('User not authenticated')
    
    return await walletService.getTransactionHistory(user.id)
  }, [user])

  const getProgressiveReward = useCallback(async () => {
    if (!user) throw new Error('User not authenticated')
    
    return await walletService.getProgressiveReward(user.id)
  }, [user])

  return {
    debitWallet,
    creditWallet,
    getTransactionHistory,
    getProgressiveReward
  }
}