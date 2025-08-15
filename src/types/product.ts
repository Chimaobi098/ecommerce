export interface Product {
    id: number
    title: string
    description?: string
    image: string
    images?: string[]
    price: number
    originalPrice?: number
    brand: string
    category: string
    tags: string[]
    colors?: string[]
    sizes?: string[]
    likes: number
    isLiked: boolean
    isSaved: boolean
    rating?: number
    reviews?: number
    inStock: boolean
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Brand {
    id: number
    name: string
    logo?: string
    description?: string
    verified: boolean
    followers: number
    products: Product[]
  }
  
  export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    image?: string
    parentId?: number
    children?: Category[]
  }
  
  export interface ProductFilter {
    category?: string
    brand?: string
    priceMin?: number
    priceMax?: number
    colors?: string[]
    sizes?: string[]
    tags?: string[]
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular' | 'rating'
  }
  
  export interface ProductInteraction {
    userId: number
    productId: number
    type: 'like' | 'save' | 'share' | 'view'
    timestamp: Date
  }