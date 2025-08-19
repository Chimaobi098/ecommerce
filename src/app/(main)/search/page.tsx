'use client'

import { useState } from 'react'
import { Search, Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CategoryGrid } from '@/components/search/categoryGrid'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-3 text-base border-gray-200 rounded-full"
          />
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
          >
            <Camera className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </div>
      
      {/* Category Grid */}
      <div className="p-4">
        {searchQuery ? (
          <div className="text-center text-gray-500 py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Searching for "{searchQuery}"...</p>
          </div>
        ) : (
          <CategoryGrid />
        )}
      </div>
    </div>
  )
}