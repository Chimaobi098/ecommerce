'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface BrandHeaderProps {
  brand: string
}

export function BrandHeader({ brand }: BrandHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-black">
          <AvatarFallback className="bg-black text-white font-bold">
            {brand.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-gray-900">{brand}</span>
      </div>
      
      <Button variant="ghost" size="icon" className="text-gray-500">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  )
}