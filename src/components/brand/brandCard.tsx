'use client'

import { BrandHeader } from './brandHeader'
import { ProductCard } from '@/components/product/productCard'
import { Card } from '@/components/ui/card'

interface Product {
  id: number
  image: string
  brand: string
  likes: number
  isLiked: boolean
  isSaved: boolean
}

interface BrandCardProps {
  product: Product
}

export function BrandCard({ product }: BrandCardProps) {
  return (
    <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
      <BrandHeader brand={product.brand} />
      <ProductCard product={product} />
    </Card>
  )
}