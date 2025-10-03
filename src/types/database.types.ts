// types/database.types.ts
export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            email: string
            username: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            email: string
            username?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            email?: string
            username?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        wallets: {
          Row: {
            id: string
            user_id: string
            auction_balance: number
            game_balance: number
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            auction_balance?: number
            game_balance?: number
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            auction_balance?: number
            game_balance?: number
            created_at?: string
            updated_at?: string
          }
        }
        wallet_transactions: {
          Row: {
            id: string
            user_id: string
            wallet_type: 'auction' | 'game'
            transaction_type: 'credit' | 'debit'
            amount: number
            balance_after: number
            description: string | null
            reference_id: string | null
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            wallet_type: 'auction' | 'game'
            transaction_type: 'credit' | 'debit'
            amount: number
            balance_after: number
            description?: string | null
            reference_id?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            wallet_type?: 'auction' | 'game'
            transaction_type?: 'credit' | 'debit'
            amount?: number
            balance_after?: number
            description?: string | null
            reference_id?: string | null
            created_at?: string
          }
        }
        games: {
          Row: {
            id: string
            name: string
            type: string
            status: string
            config: any
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            type: string
            status?: string
            config?: any
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            type?: string
            status?: string
            config?: any
            created_at?: string
          }
        }
        game_reward_claims: {
          Row: {
            id: string
            user_id: string
            claim_date: string
            claim_count: number
            last_claimed_at: string | null
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            claim_date: string
            claim_count?: number
            last_claimed_at?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            claim_date?: string
            claim_count?: number
            last_claimed_at?: string | null
            created_at?: string
          }
        }
        word_search_sessions: {
          Row: {
            id: string
            user_id: string
            total_attempts: number
            cost_per_attempt: number
            total_cost: number
            selected_reward: number
            attempts_used: number
            attempts_won: number
            total_winnings: number
            status: string
            created_at: string
            completed_at: string | null
          }
          Insert: {
            id?: string
            user_id: string
            total_attempts: number
            cost_per_attempt: number
            total_cost: number
            selected_reward: number
            attempts_used?: number
            attempts_won?: number
            total_winnings?: number
            status?: string
            created_at?: string
            completed_at?: string | null
          }
          Update: {
            id?: string
            user_id?: string
            total_attempts?: number
            cost_per_attempt?: number
            total_cost?: number
            selected_reward?: number
            attempts_used?: number
            attempts_won?: number
            total_winnings?: number
            status?: string
            created_at?: string
            completed_at?: string | null
          }
        }
      }
      Functions: {
        get_progressive_reward: {
          Args: { user_uuid: string }
          Returns: number
        }
        credit_auction_wallet: {
          Args: {
            user_uuid: string
            amount: number
            description?: string
            reference_id?: string
          }
          Returns: boolean
        }
        debit_auction_wallet: {
          Args: {
            user_uuid: string
            amount: number
            description?: string
            reference_id?: string
          }
          Returns: boolean
        }
      }
    }
  }