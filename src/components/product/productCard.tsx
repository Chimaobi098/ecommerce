'use client'

import { ProductImage } from './productImage'
import { ProductActions } from './productActions'

interface Product {
  id: number
  image: string
  brand: string
  likes: number
  isLiked: boolean
  isSaved: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative">
      <ProductImage image={product.image} alt={`${product.brand} product`} />
      <ProductActions 
        likes={product.likes}
        isLiked={product.isLiked}
        isSaved={product.isSaved}
      />
    </div>
  )
}