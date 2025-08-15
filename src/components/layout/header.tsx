'use client'

import { Gavel, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
      <h1 className="text-2xl font-bold text-black">Seidou</h1>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-black">
          <Gavel className="h-5 w-5" style={{transform: 'scaleX(-1)'}}/>
        </Button>
        <Button variant="ghost" size="icon" className="text-black">
          <ShoppingBag className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}