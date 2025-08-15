export interface User {
    id: number
    email: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
    bio?: string
    location?: string
    website?: string
    verified: boolean
    following: number
    followers: number
    totalLikes: number
    preferences: UserPreferences
    createdAt: Date
    updatedAt: Date
  }
  
  export interface UserPreferences {
    categories: string[]
    brands: string[]
    priceRange: {
      min: number
      max: number
    }
    sizes: string[]
    colors: string[]
    notifications: {
      newProducts: boolean
      priceDrops: boolean
      restocked: boolean
      following: boolean
    }
  }
  
  export interface UserProfile {
    user: User
    likedProducts: number[]
    savedProducts: number[]
    followingBrands: number[]
    followingUsers: number[]
    recentlyViewed: number[]
  }
  
  export interface AuthUser {
    id: number
    email: string
    username: string
    avatar?: string
    isAuthenticated: boolean
  }