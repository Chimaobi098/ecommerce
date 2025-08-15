'use client'

import { useState } from 'react'
import { Home, Gamepad2, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('Home')

  return (
    <nav className="fixed mx-auto w-full max-w-md bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={label} href={href}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(label)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                activeTab === label
                  ? 'text-black'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}