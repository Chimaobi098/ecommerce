'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductActionsProps {
  likes: number
  isLiked: boolean
  isSaved: boolean
}

export function ProductActions({ likes: initialLikes, isLiked: initialIsLiked, isSaved: initialIsSaved }: ProductActionsProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isSaved, setIsSaved] = useState(initialIsSaved)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className="text-gray-700 hover:text-red-500 p-0 h-auto"
          >
            <Heart 
              className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-700 hover:text-gray-900 p-0 h-auto"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-700 hover:text-gray-900 p-0 h-auto"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          className="text-gray-700 hover:text-gray-900 p-0 h-auto"
        >
          <Bookmark 
            className={`h-6 w-6 ${isSaved ? 'fill-current' : ''}`} 
          />
        </Button>
      </div>
      
      {likes > 0 && (
        <p className="text-sm font-medium text-gray-900 mt-2">
          {likes} like{likes !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}