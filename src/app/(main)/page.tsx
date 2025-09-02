import { Header } from '@/components/layout/header'
import { CategoryFilter } from '@/components/layout/categoryFilter'
import { BrandCard } from '@/components/brand/brandCard'

const mockProducts = [
  {
    id: 1,
    image: '/images/Dress.webp',
    brand: 'Shein',
    likes: 0,
    isLiked: false,
    isSaved: false
  },
  {
    id: 2,
    image: '/images/skirt.jpg',
    brand: 'Shein',
    likes: 12,
    isLiked: true,
    isSaved: false
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryFilter />
      
      <div className="px-4 space-y-6">
        {mockProducts.map((product) => (
          <BrandCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}