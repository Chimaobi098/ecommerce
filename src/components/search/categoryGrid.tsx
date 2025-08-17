'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'

const categories = [
  {
    id: 'health-beauty',
    title: 'Health and Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
    href: '/search/health-beauty'
  },
  {
    id: 'mens-fashion',
    title: "Men's Fashion", 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    href: '/search/mens-fashion'
  },
  {
    id: 'food',
    title: 'Food',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
    href: '/search/food'
  },
  {
    id: 'womens-fashion',
    title: "Women's Fashion",
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop',
    href: '/search/womens-fashion'
  }
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={category.href}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative ">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg drop-shadow-md">
                  {category.title}
                </h3>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}