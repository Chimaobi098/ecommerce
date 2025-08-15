'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const categories = ['All', 'Tops', 'Bags', 'Skirts', 'Shoes']

export function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap ${
              activeCategory === category
                ? 'bg-black text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}