export interface Game {
    id: string;
    title: string;
    name: string;
    banner_image: string;
    url: string;
    status: 'active' | 'inactive';
    config: any;
  }
  
  export interface GameCardProps {
    game?: Game;
    isSpecial?: boolean;
    specialTitle?: string;
    specialUrl?: string;
  }

export interface WalletBalance {
  auction_balance: number
  game_balance: number
}

export interface GameRewardClaim {
  rewardAmount: number
  message: string
  success: boolean
}

export interface WordSearchSession {
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
}

// export interface Game {
//   id: string
//   name: string
//   type: 'crash' | 'word_search'
//   status: 'active' | 'inactive'
//   config: any
// }

export interface WalletTransaction {
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